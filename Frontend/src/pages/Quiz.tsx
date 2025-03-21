import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSocket } from "../config/socket_config";
import quizImage from "../assets/quiz.jpeg";

const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(50);
  const [timeUp, setTimeUp] = useState(false);
  const [questionData, setQuestionData] = useState<any>(null);
  const [topicData, setTopicData] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(new Array(5).fill(null));
  const [showingTopic, setShowingTopic] = useState(true);
  const [topicCountdown, setTopicCountdown] = useState(10);
  const [answersSubmitted, setAnswersSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const { socket, isConnected } = useSocket();

  // Topic timer countdown
  useEffect(() => {
    if (!showingTopic) return;
    
    if (topicCountdown <= 0) {
      setShowingTopic(false);
      return;
    }
    
    const topicTimer = setInterval(() => {
      setTopicCountdown((prev) => prev - 1);
    }, 1000);
    
    return () => clearInterval(topicTimer);
  }, [topicCountdown, showingTopic]);

  // Quiz timer countdown - only start after topic is done showing
  useEffect(() => {
    if (showingTopic) return;
    
    if (timeLeft <= 0) {
      handleQuizEnd();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, showingTopic]);

  useEffect(() => {
    // Load questions from localStorage
    const questionsData = localStorage.getItem("questions");
    if (questionsData) {
      try {
        const parsedData = JSON.parse(questionsData);
        setQuestionData(Array.isArray(parsedData) ? parsedData[0] : parsedData);
      } catch (error) {
        console.error("Error parsing questions data:", error);
      }
    }
    
    // Load topic from localStorage
    const topic = localStorage.getItem("topic");
    if (topic) {
      try {
        const parsedData = JSON.parse(topic);
        setTopicData(Array.isArray(parsedData) ? parsedData[0] : parsedData);
      } catch (error) {
        console.error("Error parsing topic data:", error);
      }
    }
  }, []);

  // Calculate score based on answers
  const calculateScore = () => {
    if (!questionData) return 0;
    
    let totalScore = 0;
    
    // Loop through each question and check if the selected answer is correct
    for (let i = 0; i < 5; i++) {
      const questionKey = `q${i + 1}`;
      const answerKey = `q${i + 1}ans`;
      
      // If the user selected an answer and it matches the correct answer
      if (selectedAnswers[i] && selectedAnswers[i] === questionData[answerKey]) {
        totalScore += 1;
      }
    }
    
    return totalScore;
  };

  // Handle quiz completion - submit score and show results
  const handleQuizEnd = () => {
    setTimeUp(true);
    const finalScore = calculateScore();
    setScore(finalScore);
    submitScore(finalScore);
  };

  // Submit score to backend via socket
  const submitScore = (finalScore: number) => {
    if (answersSubmitted || !socket || !isConnected) return;

    // Get gameId from localStorage
    const gameId = localStorage.getItem("gameId");
    
    if (!gameId) {
      console.error("No game ID found");
      return;
    }

    // Create score payload
    const payload = {
      gameId: gameId,
      score: finalScore,
      completionTime: 50 - timeLeft // Time taken to complete in seconds
    };

    // Emit the game_end event with score
    socket.emit("game_end", payload);
    console.log("Submitting score:", payload);
    
    setAnswersSubmitted(true);
  };

  const handleFinishQuiz = () => {
    handleQuizEnd();
  };

  const handleReturnToDashboard = () => {
    // Clean up localStorage before returning to dashboard
    localStorage.removeItem("questions");
    localStorage.removeItem("topic");
    localStorage.removeItem("gameId");
    
    navigate("/dashboard");
  };

  if (!questionData || !topicData) return <p>Loading...</p>;

  // Topic view component
  if (showingTopic) {
    return (
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          <div style={styles.overlay}></div>
          <div style={styles.card}>
            <h2 style={styles.heading}>{topicData.topic_name}</h2>
            <p style={styles.description}>{topicData.topic_description}</p>

            {/* Circular Timer */}
            <div style={styles.timerContainer}>
              <svg width="140" height="140">
                {/* Background Circle */}
                <circle cx="70" cy="70" r="60" stroke="#555" strokeWidth="10" fill="none" />
                {/* Progress Circle */}
                <circle
                  cx="70"
                  cy="70"
                  r="60"
                  stroke="limegreen"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray="377"
                  strokeDashoffset={(1 - topicCountdown / 10) * 377}
                  strokeLinecap="round"
                  transform="rotate(-90 70 70)"
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
                {/* Timer Text */}
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="24px" fill="white">
                  {topicCountdown}s
                </text>
              </svg>
            </div>

            <p style={styles.timerText}>Quiz starts in {topicCountdown} seconds...</p>
          </div>
        </div>
      </div>
    );
  }

  // Quiz content - original quiz implementation
  const questionKey = `q${currentQuestionIndex + 1}`;
  const options = [
    questionData[`${questionKey}o1`],
    questionData[`${questionKey}o2`],
    questionData[`${questionKey}o3`],
    questionData[`${questionKey}o4`],
  ];

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        <div style={styles.overlay}></div>

        {timeUp ? (
          <div style={styles.modal}>
            <h2 style={{ color: answersSubmitted ? "#28a745" : "red", fontSize: "24px", marginBottom: "20px" }}>
              {answersSubmitted ? "Quiz Complete!" : "Quiz Completed"}
            </h2>
            <p>You answered {selectedAnswers.filter(answer => answer !== null).length} out of 5 questions</p>
            <p>Your score: {score} / 5</p>
            <p>Time remaining: {timeLeft} seconds</p>
            
            <button 
              style={styles.backButton} 
              onClick={handleReturnToDashboard}
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div style={styles.quizCard}>
            <h2 style={styles.heading}>Quiz Time!</h2>
            
            {/* Circular Timer */}
            <div style={styles.timerContainer}>
              <svg width="100" height="100">
                {/* Background Circle */}
                <circle cx="50" cy="50" r="40" stroke="#555" strokeWidth="8" fill="none" />
                {/* Progress Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={timeLeft < 15 ? "red" : "limegreen"}
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="251.2"
                  strokeDashoffset={(1 - timeLeft / 50) * 251.2}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
                {/* Timer Text */}
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="18px" fill="white">
                  {timeLeft}s
                </text>
              </svg>
            </div>
            
            <div style={styles.progressBar}>
              <div style={{...styles.progressIndicator, width: `${((currentQuestionIndex + 1) / 5) * 100}%`}}></div>
              <span style={styles.progressText}>Question {currentQuestionIndex + 1} of 5</span>
            </div>
            
            <div style={styles.questionContainer}>
              <p style={styles.question}>{questionData[questionKey]}</p>
              <div style={styles.optionsContainer}>
                {options.map((option, index) => (
                  <button
                    key={index}
                    style={{
                      ...styles.option,
                      background: selectedAnswers[currentQuestionIndex] === option ? "#ff416c" : "#6a11cb",
                    }}
                    onClick={() => {
                      const updatedAnswers = [...selectedAnswers];
                      updatedAnswers[currentQuestionIndex] = option;
                      setSelectedAnswers(updatedAnswers);
                    }}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <div style={styles.navButtons}>
              <button
                style={{ ...styles.navButton, visibility: currentQuestionIndex === 0 ? "hidden" : "visible" }}
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              >
                Prev
              </button>
              <button
                style={{ ...styles.navButton, visibility: currentQuestionIndex === 4 ? "hidden" : "visible" }}
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              >
                Next
              </button>
            </div>
            {currentQuestionIndex === 4 && (
              <div style={{ marginTop: "20px" }}>
                <button
                  style={styles.finishButton}
                  onClick={handleFinishQuiz}
                >
                  Finish Quiz
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  // New wrapper to handle full page styling
  pageWrapper: {
    margin: 0,
    padding: 0,
    width: "100%",
    height: "100vh",
    overflow: "hidden",
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
  },
  container: {
    display: "flex",
    flexDirection: "column" as "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    backgroundImage: `url(${quizImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative" as "relative",
    overflow: "hidden",
    margin: 0,
    padding: 0,
  },
  overlay: {
    position: "absolute" as "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    margin: 0,
    padding: 0,
  },
  // Topic card styles (from topic.tsx)
  card: {
    position: "relative" as "relative",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    padding: "30px",
    borderRadius: "16px",
    textAlign: "center" as "center",
    width: "400px",
    color: "#f0f0f0",
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
    zIndex: 1,
  },
  description: { 
    fontSize: "18px", 
    marginBottom: "20px", 
    lineHeight: "1.5" 
  },
  timerText: { 
    fontSize: "18px", 
    fontWeight: "bold" as "bold", 
    color: "#ffcc00" 
  },
  // Original quiz card styles
  quizCard: {
    position: "relative" as "relative",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center" as "center",
    width: "500px",
    maxWidth: "90%",
    color: "#f0f0f0",
    zIndex: 1,
    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)",
  },
  heading: { 
    fontSize: "26px", 
    marginBottom: "15px" 
  },
  timerContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "15px",
  },
  progressBar: {
    width: "100%",
    height: "10px",
    backgroundColor: "#444",
    borderRadius: "5px",
    marginBottom: "15px",
    position: "relative" as "relative",
  },
  progressIndicator: {
    height: "100%",
    backgroundColor: "#4caf50",
    borderRadius: "5px",
    transition: "width 0.3s",
  },
  progressText: {
    position: "absolute" as "absolute",
    top: "15px", 
    right: "0",
    fontSize: "14px",
    color: "#ccc",
  },
  questionContainer: { 
    marginBottom: "15px", 
    marginTop: "35px" 
  },
  question: { 
    fontSize: "18px", 
    fontWeight: "bold" as "bold" 
  },
  optionsContainer: { 
    display: "grid", 
    gridTemplateColumns: "1fr 1fr", 
    gap: "10px" 
  },
  option: {
    padding: "12px",
    fontSize: "16px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  navButtons: { 
    display: "flex", 
    justifyContent: "space-between", 
    marginTop: "20px" 
  },
  navButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#0f7bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  finishButton: {
    padding: "12px 20px",
    fontSize: "18px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  modal: {
    position: "relative" as "relative",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center" as "center",
    width: "500px",
    maxWidth: "90%",
    color: "#f0f0f0",
    zIndex: 1,
  },
  backButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#0f7bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "20px",
  },
};

export default Quiz;