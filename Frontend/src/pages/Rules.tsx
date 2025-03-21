// rules.tsx
import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Rules.css"; // Import the CSS file

// Import assets
import logo from "../assets/swords.jpg";
import rulesBg from "../assets/rulesbg.jpg";
import scrollBg from "../assets/scroll.png";

const Rules: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    console.log("Rules Mounted");
    return () => console.log("Rules Unmounted");
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="container">
      {isSidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}

      <header className="navbar">
        <button onClick={toggleSidebar} className="menu-button">☰</button>
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="navbar-title">QUIZENA</h1>
      </header>

      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} alt="Profile" className="profile-img" />
          <h3>John Doe</h3>
        </div>
        <nav>
          <ul className="nav-list">
            <li>
              <Link to="/" className={`nav-link ${location.pathname === "/" ? "active" : ""}`}>
                <span className="icon">🏠</span> Home
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}>
                <span className="icon">⚔️</span> Enter Arena
              </Link>
            </li>
            <li>
              <Link to="/profile" className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`}>
                <span className="icon">👤</span> Profile
              </Link>
            </li>
            <li>
              <Link to="/leaderboard" className={`nav-link ${location.pathname === "/leaderboard" ? "active" : ""}`}>
                <span className="icon">🏆</span> Leaderboard
              </Link>
            </li>
            <li>
              <Link to="/rules" className={`nav-link ${location.pathname === "/rules" ? "active" : ""}`}>
                <span className="icon">📜</span> Rules
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <Box
        sx={{
          backgroundImage: `url(${rulesBg})`,
        }}
        className="main-content"
      >
        <Box className="content-overlay">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Box
              sx={{
                backgroundImage: `url(${scrollBg})`,
              }}
              className="scroll-box"
            >
              <Typography variant="h3" className="scroll-title">
                RULES
              </Typography>

              <Box className="rule-list">
                {[
                  "Players join a queue and wait for their turn.",
                  "The first two players in the queue play against each other.",
                  "Each game consists of X questions (e.g., 5-10).",
                  "Players take turns answering questions, with 30 seconds to answer each.",
                  "1 point for each correct answer, 0 points for incorrect answers.",
                  "The player with the most points wins.",
                  "To participate, players must stay in the queue, canceling removes them.",
                  "No cheating, and good sportsmanship is required.",
                ].map((rule, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 * index }}
                  >
                    <Typography variant="body1" className="rule-item">
                      {index + 1}. {rule}
                    </Typography>
                  </motion.div>
                ))}
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Box>
    </div>
  );
};

export default Rules;