import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { sql } from "../config/db";
import { io } from "../server";
import {getQuestionsByTopicId , getTopicByTopicId} from "../controllers/question";

interface AuthRequest extends Request {
    user?: { id: number; username: string };
}

// In-memory game queues
let waitingQueue: string[] = [];
let activePlayers: string[] = [];
let gameInProgress = false;
let blockNewGame = false;
const userSocketMap: Record<string, number> = {}; //Socket ID to User ID
const userIdToSocketMap: Record<number, string> = {}; // User ID to Socket ID

// Game results tracking
interface GameScore {
    userId: number;
    score: number;
    submitted: boolean;
}

// Track scores for active games
const gameScores: Record<string, {
    player1: GameScore;
    player2: GameScore;
    endTime: number; // Timestamp when game should end
    gameId: string;
}> = {};

// Helper function to get user ID from socket ID
const getUserFromSocket = (socketId: string): number | -1 => {
    return userSocketMap[socketId] || -1;
};

// Helper function to check if user is already in queue or active game
const isUserInQueue = (userId: number): boolean => {
    return userIdToSocketMap.hasOwnProperty(userId);
};

// Find game ID by player's socket ID
const findGameBySocketId = (socketId: string): string | null => {
    const userId = getUserFromSocket(socketId);
    if (userId === -1) return null;

    for (const gameId in gameScores) {
        if (gameScores[gameId].player1.userId === userId || 
            gameScores[gameId].player2.userId === userId) {
            return gameId;
        }
    }
    return null;
};

const getTopicDetails = async (topicId: string) => {
    try {
        const questions = await getQuestionsByTopicId(topicId);
        const topic = await getTopicByTopicId(topicId);
        return [questions, topic]
    } catch (error) {
        console.error("Error fetching questions:", error);
        return [];
    }
};

// Function to save details to db with winner
const save_session = async (gameId: string, player1: number, player2: number, player1Score: number, player2Score: number) => {
    if (player1 === -1 || player2 === -1) { // Validating user IDs before saving
        console.error("Invalid player IDs, session not saved.");
        return;
    }
    
    // Determine winner (0 for tie, 1 if player1 wins, 2 if player2 wins)
    let result = 0; // Default to tie
    if (player1Score > player2Score) {
        result = 1; // Player 1 wins
    } else if (player2Score > player1Score) {
        result = 2; // Player 2 wins
    }
    
    try {
        const result_db = await sql`
            INSERT INTO sessionspec (game_id, user1id, user2id, result) 
            VALUES (${gameId}, ${player1}, ${player2}, ${result}) 
            RETURNING *;
        `;
        console.log("Game session saved to DB:", { gameId, player1, player2, result });
        return result_db[0];
    } catch (error) {
        console.error("Error saving session:", error);
        return { error: "Database error" };
    }
};

// Socket event handler for game_end (receiving scores)
export const setupGameEndHandler = (socket: any) => {
    socket.on("game_end", (data: { gameId: string; score: number; completionTime: number }) => {
        try {
            const userId = getUserFromSocket(socket.id);
            if (userId === -1) {
                console.error(`User not found for socket ${socket.id}`);
                return;
            }
            
            const { gameId, score } = data;
            
            if (!gameScores[gameId]) {
                console.error(`Game ${gameId} not found in active games`);
                return;
            }
            
            // Determine if this is player 1 or player 2
            if (gameScores[gameId].player1.userId === userId) {
                gameScores[gameId].player1.score = score;
                gameScores[gameId].player1.submitted = true;
                console.log(`Player 1 (${userId}) submitted score: ${score}`);
            } else if (gameScores[gameId].player2.userId === userId) {
                gameScores[gameId].player2.score = score;
                gameScores[gameId].player2.submitted = true;
                console.log(`Player 2 (${userId}) submitted score: ${score}`);
            } else {
                console.error(`User ${userId} not part of game ${gameId}`);
                return;
            }
            
            // Check if both players have submitted OR if the game has timed out
            const currentTime = Date.now();
            const bothSubmitted = gameScores[gameId].player1.submitted && gameScores[gameId].player2.submitted;
            const isGameExpired = currentTime >= gameScores[gameId].endTime;
            
            if (bothSubmitted || isGameExpired) {
                finishGame(gameId);
            }
        } catch (error) {
            console.error("Error in game_end handler:", error);
        }
    });
    
    socket.on("disconnect", () => {
        try {
            const userId = getUserFromSocket(socket.id);
            if (userId === -1) return;

            console.log(`User ${userId} disconnected, cleaning up...`);
            
            // Check if user was in an active game
            const gameId = findGameBySocketId(socket.id);
            if (gameId) {
                console.log(`User ${userId} was in active game ${gameId}, forcing game end`);
                finishGame(gameId);
            }
            
            // Remove from queue if present
            const index = waitingQueue.indexOf(socket.id);
            if (index !== -1) {
                waitingQueue.splice(index, 1);
                console.log(`Removed disconnected user ${userId} from waiting queue`);
            }
            
            // Clean up mappings
            delete userIdToSocketMap[userId];
            delete userSocketMap[socket.id];
        } catch (error) {
            console.error("Error handling socket disconnect:", error);
        }
    });
};

// Function to finish game and save results
const finishGame = (gameId: string) => {
    if (!gameScores[gameId]) {
        console.error(`Game ${gameId} not found for finishing`);
        return;
    }
    
    const { player1, player2 } = gameScores[gameId];
    
    console.log(`Game ${gameId} finished with scores: Player1=${player1.score}, Player2=${player2.score}`);
    
    // Save results to database
    save_session(gameId, player1.userId, player2.userId, player1.score, player2.score);
    
    // Clean up game data
    delete gameScores[gameId];

    // Reset game state
    activePlayers = [];
    gameInProgress = false;
    blockNewGame = true;
    
    // Block new game for 3s
    setTimeout(() => {
        blockNewGame = false;
        console.log("Game queue open for new players.");
        startGame();
    }, 3000);
};

// Function to start a new game
const startGame = async() => {
    try {
        if (waitingQueue.length < 2 || gameInProgress || blockNewGame) {
            return;
        }
        
        // Set game in progress to prevent race conditions
        gameInProgress = true;
        
        activePlayers = [waitingQueue.shift()!, waitingQueue.shift()!];

        const gameId = uuidv4(); // Generate unique game ID
        const topicId = Math.floor(Math.random() * 5) + 1; // Random topic ID (1-5)

        // Get questions for this game
        const data = await getTopicDetails(topicId.toString());
        if (!data || !data[0] || !data[1]) {
            console.error("Failed to fetch topic details, aborting game start");
            gameInProgress = false;
            // Return players to queue
            if (activePlayers.length === 2) {
                waitingQueue.unshift(activePlayers[1]);
                waitingQueue.unshift(activePlayers[0]);
                activePlayers = [];
            }
            return;
        }

        console.log(`Game started: GameID=${gameId}, Players=${activePlayers}`);

        // Get player IDs
        const player1Id = getUserFromSocket(activePlayers[0]);
        const player2Id = getUserFromSocket(activePlayers[1]);
        
        if (player1Id === -1 || player2Id === -1) {
            console.error("Invalid player IDs, aborting game start");
            gameInProgress = false;
            // Return valid players to queue
            activePlayers.forEach(socketId => {
                if (getUserFromSocket(socketId) !== -1) {
                    waitingQueue.unshift(socketId);
                }
            });
            activePlayers = [];
            return;
        }
        
        // Initialize game scores
        gameScores[gameId] = {
            player1: { userId: player1Id, score: 0, submitted: false },
            player2: { userId: player2Id, score: 0, submitted: false },
            endTime: Date.now() + 135000, // 2m 15s from now (135 seconds)
            gameId: gameId
        };

        activePlayers.forEach(socketId => {
            io.to(socketId).emit("game_start", { 
                gameId: gameId,
                message: "Game started!", 
                questions: data[0],
                topic: data[1]
            });
        });
    } catch (error) {
        console.error("Error in startGame:", error);
        gameInProgress = false;
        
        // Return players to queue
        if (activePlayers.length === 2) {
            waitingQueue.unshift(activePlayers[1]);
            waitingQueue.unshift(activePlayers[0]);
            activePlayers = [];
        }
    }
};


export const joinQueue = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const socketId = req.query.socketId as string;      //frontend should pass socket id

        if (!socketId) {
            res.status(400).json({ error: "Missing socket ID" });
            return;
        }

        if (!req.user) {
            res.status(403).json({ error: "Unauthorized" });
            return;
        }
        
        const userId = req.user.id;
    
        // Check if user is already in queue or active game
        if (isUserInQueue(userId)) {
            const existingSocketId = userIdToSocketMap[userId];
            
            // Check if user is in active game
            if (activePlayers.includes(existingSocketId)) {
                res.status(400).json({ 
                    error: "Already in a match", 
                    message: "You are already in an active match from another window/device."
                });
                return;
            }
            // User is in waiting queue, remove old entry
            const index = waitingQueue.indexOf(existingSocketId);
            if (index !== -1) {
                waitingQueue.splice(index, 1);
                console.log(`Removed user ${req.user.username} with old socketID=${existingSocketId} from waiting queue`);
                
                // Clean up old socket mapping
                delete userSocketMap[existingSocketId];
                delete userIdToSocketMap[userId];
            }
        }             

        // Map socketId to userId and vice versa
        userSocketMap[socketId] = userId;
        userIdToSocketMap[userId] = socketId;
        
        // Add to waiting queue with new socket ID
        waitingQueue.push(socketId);
        console.log(`User ${req.user.username} joined queue. SocketID=${socketId}`);

        io.to(socketId).emit("queued", { message: "You're in the queue. Please wait for another player." });

        if (waitingQueue.length >= 2 && !gameInProgress && !blockNewGame) {
            startGame();
        }

        res.json({ message: "Added to queue", socketId });
    } catch (error) {
        console.error("Error in joinQueue:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export const leaveQueue = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const socketId = req.query.socketId as string;

        if (!socketId) {
            res.status(400).json({ error: "Missing socket ID" });
            return;
        }

        if (!req.user) {
            res.status(403).json({ error: "Unauthorized" });
            return;
        }

        const userId = req.user.id;
        
        // Check if user is in waiting queue (not in active game)
        const index = waitingQueue.indexOf(socketId);
        if (index !== -1) {
            // Remove from waiting queue
            waitingQueue.splice(index, 1);
            console.log(`User ${req.user.username} left queue. SocketID=${socketId}`);
            
            // Remove mappings
            delete userSocketMap[socketId];
            delete userIdToSocketMap[userId];
            
            res.json({ message: "Removed from queue", success: true });
        } else if (activePlayers.includes(socketId)) {
            // User is in active game, can't leave
            res.json({ 
                message: "Cannot leave active game", 
                inActiveGame: true,
                success: false 
            });
        } else {
            // User not found in queue
            res.json({ 
                message: "Not found in queue", 
                success: true 
            });
        }
    } catch (error) {
        console.error("Error in leaveQueue:", error);
        res.status(500).json({ error: "Server error" });
    }
};