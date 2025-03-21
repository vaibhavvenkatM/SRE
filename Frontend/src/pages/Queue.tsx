import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSocket } from "../config/socket_config";
import queueImage from "../assets/background_queue.jpeg";

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

    // Check if there was a previous game in progress
    const existingGameId = localStorage.getItem("gameId");
    if (existingGameId) {
      setGameId(existingGameId);
      setMatchStarted(true);
      setStatus("Returning to active game...");
      
      // Navigate to quiz if game data exists
      if (localStorage.getItem("questions") && localStorage.getItem("topic")) {
        navigate('/quiz');
      } else {
        // Clean up if data is inconsistent
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
      
      // Store game data in localStorage
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
      
      // Clean up game data from localStorage
      cleanupGameData();
      
      // If we're on the quiz page, navigate back to dashboard
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
          // If we have a gameId in the response, use it
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
          // Only clean up if not in active game
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
    
    // Redirect to dashboard but don't clean up if in active game
    navigate("/dashboard");
  };

  return (
    <div style={styles.mainContentStyles}>
      <div style={styles.contentStyles}>
        <h1 style={styles.titleStyles}>THE ARENA AWAITS ..</h1>

        <p style={styles.statusStyles}>{status}</p>

        {inQueue && !matchStarted && <div style={styles.spinner}></div>}

        {inQueue && !matchStarted && (
          <p style={styles.messageStyles}>You are in queue, please wait....</p>
        )}

        {matchStarted && (
          <p style={styles.matchActiveStyles}>Match is active! Return to game</p>
        )}

        <div style={styles.buttonContainer}>
          {matchStarted && (
            <button 
              style={{...styles.buttonStyles, backgroundColor: "#28a745"}} 
              onClick={() => navigate('/quiz')}
            >
              Return to Game
            </button>
          )}
          
          <button style={styles.buttonStyles} onClick={exitQueue}>
            {matchStarted ? "Back to Dashboard" : "Exit Queue"}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  mainContentStyles:{
    position: "absolute",
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    display: "flex",
    flexDirection: "column",
    backgroundImage: `url(${queueImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    width: "100vw",
    height: "100vh",
    filter: "brightness(1)",
    transition: "0.3s ease-in-out",
  },
  contentStyles: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    transition: "0.3s ease-in-out",
  },
  titleStyles: {
    fontSize: "40px",
    fontWeight: "bolder",
    color: "white",
    marginBottom: "20px",
  },
  statusStyles: {
    fontSize: "20px",
    color: "white",
    marginBottom: "20px",
  },
  spinner: {
    width: "50px",
    height: "50px",
    border: "5px solid rgba(255, 255, 255, 0.3)",
    borderTop: "5px solid white",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginBottom: "20px",
  },
  messageStyles: {
    fontSize: "20px",
    color: "white",
    marginBottom: "20px",
  },
  matchActiveStyles: {
    fontSize: "24px",
    color: "#28a745",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    gap: "15px",
  },
  buttonStyles: {
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "bold",
    backgroundColor: "#0f7bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  }
};

/* Add global CSS animation */
const globalStyles = document.createElement("style");
globalStyles.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(globalStyles);

export default Queue;