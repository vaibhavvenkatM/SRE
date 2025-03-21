import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../config/socket_config";
// import "./Quiz.css"; // Import the CSS file
import "../styles/Quiz.css";
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
      completionTime: 50 - timeLeft, // Time taken to complete in seconds
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
      <div className="pageWrapper">
        <div className="container">
          <div className="overlay"></div>
          <div className="card">
            <h2 className="heading">{topicData.topic_name}</h2>
            <p className="description">{topicData.topic_description}</p>

            {/* Circular Timer */}
            <div className="timerContainer">
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

            <p className="timerText">Quiz starts in {topicCountdown} seconds...</p>
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
    <div className="pageWrapper">
      <div className="container">
        <div className="overlay"></div>

        {timeUp ? (
          <div className="modal">
            <h2 style={{ color: answersSubmitted ? "#28a745" : "red", fontSize: "24px", marginBottom: "20px" }}>
              {answersSubmitted ? "Quiz Complete!" : "Quiz Completed"}
            </h2>
            <p>You answered {selectedAnswers.filter((answer) => answer !== null).length} out of 5 questions</p>
            <p>Your score: {score} / 5</p>
            <p>Time remaining: {timeLeft} seconds</p>

            <button className="backButton" onClick={handleReturnToDashboard}>
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="quizCard">
            <h2 className="heading">Quiz Time!</h2>

            {/* Circular Timer */}
            <div className="timerContainer">
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
                  style={{ transition: "stroke-dash-dashoffset 1s linear" }}
                />
                {/* Timer Text */}
                <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="18px" fill="white">
                  {timeLeft}s
                </text>
              </svg>
            </div>

            <div className="progressBar">
              <div className="progressIndicator" style={{ width: `${((currentQuestionIndex + 1) / 5) * 100}%` }}></div>
              <span className="progressText">Question {currentQuestionIndex + 1} of 5</span>
            </div>

            <div className="questionContainer">
              <p className="question">{questionData[questionKey]}</p>
              <div className="optionsContainer">
                {options.map((option, index) => (
                  <button
                    key={index}
                    className="option"
                    style={{
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
            <div className="navButtons">
              <button
                className="navButton"
                style={{ visibility: currentQuestionIndex === 0 ? "hidden" : "visible" }}
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              >
                Prev
              </button>
              <button
                className="navButton"
                style={{ visibility: currentQuestionIndex === 4 ? "hidden" : "visible" }}
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              >
                Next
              </button>
            </div>
            {currentQuestionIndex === 4 && (
              <div style={{ marginTop: "20px" }}>
                <button className="finishButton" onClick={handleFinishQuiz}>
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

export default Quiz;