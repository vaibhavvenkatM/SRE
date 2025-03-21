// Queue.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSocket } from "../config/socket_config";
import queueImage from "../assets/background_queue.jpeg";
// import "./Queue.css";
import "../styles/Queue.css";

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
}

interface GameData {
  gameId: string;
  questions: Question[];
  topic: any;
}

const Queue: React.FC = () => {
  const [status, setStatus] = useState<string>("Initializing...");
  const [inQueue, setInQueue] = useState<boolean>(false);
  const [matchStarted, setMatchStarted] = useState<boolean>(false);
  const [gameId, setGameId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { socket, isConnected, connect, disconnect } = useSocket();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (!isConnected) {
      connect();
      setStatus("Connecting to server...");
    } else {
      setStatus("Connected to server. Ready to join queue.");
    }

    const existingGameId = localStorage.getItem("gameId");
    if (existingGameId) {
      setGameId(existingGameId);
      setMatchStarted(true);
      setStatus("Returning to active game...");
      
      if (localStorage.getItem("questions") && localStorage.getItem("topic")) {
        navigate('/quiz');
      } else {
        cleanupGameData();
      }
    }
  }, [navigate, isConnected, connect]);

  useEffect(() => {
    if (!socket) return;

    const gameStartHandler = (data: any) => {
      console.log("Game start received:", data);
      setMatchStarted(true);
      setStatus("Match found! Game starting...");
      setGameId(data.gameId);
      
      localStorage.setItem("questions", JSON.stringify(data.questions));
      localStorage.setItem("topic", JSON.stringify(data.topic));
      localStorage.setItem("gameId", data.gameId);
      
      navigate('/quiz');
    };

    const queuedHandler = (data: any) => {
      setStatus(`In queue: ${data.message || "Waiting for opponent"}`);
      setInQueue(true);
    };
  
    const gameEndHandler = (data: any) => {
      console.log("Game end event received:", data);
      setStatus(`Game ended: ${data.message || "Game has ended"}`);
      setMatchStarted(false);
      setGameId(null);
      
      cleanupGameData();
      
      const currentPath = window.location.pathname;
      if (currentPath === '/quiz') {
        navigate('/dashboard');
      }
    };

    socket.on("game_start", gameStartHandler);
    socket.on("queued", queuedHandler);
    socket.on("game_end", gameEndHandler);

    if (isConnected && !gameId) {
      setStatus("Connected to server. Ready to join queue.");
      
      const autoJoinQueue = async () => {
        if (!inQueue && !matchStarted) {
          await joinQueue();
        }
      };
      
      autoJoinQueue();
    } else if (isConnected && gameId) {
      setStatus("Connected to server. Game in progress.");
    } else {
      setStatus("Connecting to server...");
    }

    return () => {
      socket.off("game_start", gameStartHandler);
      socket.off("queued", queuedHandler);
      socket.off("game_end", gameEndHandler);
    };
  }, [socket, isConnected, navigate, inQueue, matchStarted, gameId]);

  const cleanupGameData = () => {
    localStorage.removeItem("questions");
    localStorage.removeItem("topic");
    localStorage.removeItem("gameId");
  };

  const joinQueue = async () => {
    if (!socket || !isConnected) {
      setStatus("Not connected to server. Please wait or refresh the page.");
      connect();
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setStatus("Joining queue...");

    try {
      const response = await fetch(`http://localhost:5000/queue/join?socketId=${socket.id}`, {
        method: "GET",
        headers: { Authorization: `${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setStatus(data.message || "Joined queue successfully!");
        setInQueue(true);
      } else {
        if (data.inActiveGame) {
          setStatus("You are already in an active game!");
          setMatchStarted(true);
          if (data.gameId) {
            setGameId(data.gameId);
            localStorage.setItem("gameId", data.gameId);
          }
        } else {
          setStatus(`Error: ${data.error || "Failed to join queue"}`);
        }
      }
    } catch (error) {
      console.error("Error joining queue:", error);
      setStatus("Failed to join queue. Please try again.");
    }
  };

  const leaveQueue = async () => {
    if (!socket || !isConnected) {
      setStatus("Not connected to server.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/queue/leave?socketId=${socket.id}`, {
        method: "GET",
        headers: { Authorization: `${token}` },
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        if (data.inActiveGame) {
          setStatus("Cannot leave an active game. The game will continue.");
        } else {
          setStatus("Left queue. Ready to join again.");
          setInQueue(false);
          if (!matchStarted) {
            cleanupGameData();
          }
        }
      } else {
        setStatus(`Error: ${data.error || "Failed to leave queue"}`);
      }
    } catch (error) {
      console.error("Error leaving queue:", error);
      setStatus("Failed to leave queue. Please try again.");
    }
  };

  const exitQueue = () => {
    if (inQueue && !matchStarted) {
      leaveQueue();
    }
    
    navigate("/dashboard");
  };

  return (
    <div className="main-content-styles">
      <div className="content-styles">
        <h1 className="title-styles">THE ARENA AWAITS ..</h1>

        <p className="status-styles">{status}</p>

        {inQueue && !matchStarted && <div className="spinner"></div>}

        {inQueue && !matchStarted && (
          <p className="message-styles">You are in queue, please wait....</p>
        )}

        {matchStarted && (
          <p className="match-active-styles">Match is active! Return to game</p>
        )}

        <div className="button-container">
          {matchStarted && (
            <button 
              className="return-to-game-button"
              onClick={() => navigate('/quiz')}
            >
              Return to Game
            </button>
          )}
          
          <button className="exit-queue-button" onClick={exitQueue}>
            {matchStarted ? "Back to Dashboard" : "Exit Queue"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Queue;