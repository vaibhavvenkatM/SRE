import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

// Import assets
import logo from "../assets/swords.jpg";
import rulesBg from "../assets/rulesbg.jpg";
import scrollBg from "../assets/scroll.png";

const Rules: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Reset sidebar state when location changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Component lifecycle logging
  useEffect(() => {
    console.log("Rules Mounted");
    return () => console.log("Rules Unmounted");
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={containerStyles}>
      {/* Overlay for sidebar */}
      {isSidebarOpen && <div style={overlayStyles} onClick={() => setSidebarOpen(false)}></div>}

      {/* Header Navbar */}
      <header style={navbarStyles}>
        <button onClick={toggleSidebar} style={menuButtonStyles}>☰</button>
        <img src={logo} alt="Logo" style={logoStyles} />
        <h1 style={navbarTitleStyles}>QUIZENA</h1>
      </header>

      {/* Sidebar */}
      <div style={{ ...sidebarStyles, transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)" }}>
        <div style={sidebarHeaderStyles}>
          <img src={logo} alt="Profile" style={profileImgStyles} />
          <h3>John Doe</h3>
        </div>
        <nav>
          <ul style={navListStyles}>
            <li>
              <Link to="/" style={{ ...navLinkStyles, ...(location.pathname === "/" ? sidebarActiveStyles : {}) }}>
                <span style={iconStyles}>🏠</span> Home
              </Link>
            </li>
            <li>
              <Link to="/dashboard" style={{ ...navLinkStyles, ...(location.pathname === "/dashboard" ? sidebarActiveStyles : {}) }}>
                <span style={iconStyles}>⚔️</span> Enter Arena
              </Link>
            </li>
            <li>
              <Link to="/profile" style={{ ...navLinkStyles, ...(location.pathname === "/profile" ? sidebarActiveStyles : {}) }}>
                <span style={iconStyles}>👤</span> Profile
              </Link>
            </li>
            <li>
              <Link to="/leaderboard" style={{ ...navLinkStyles, ...(location.pathname === "/leaderboard" ? sidebarActiveStyles : {}) }}>
                <span style={iconStyles}>🏆</span> Leaderboard
              </Link>
            </li>
            <li>
              <Link to="/rules" style={{ ...navLinkStyles, ...(location.pathname === "/rules" ? sidebarActiveStyles : {}) }}>
                <span style={iconStyles}>📜</span> Rules
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content - Rules */}
      <Box
        sx={{
          ...mainContentStyles,
          backgroundImage: `url(${rulesBg})`,
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Scroll Image with Text Overlay & Animations */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Box
              sx={{
                backgroundImage: `url(${scrollBg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                width: "80%",
                maxWidth: "600px",
                height: "90vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px",
                textAlign: "center",
                position: "relative",
                margin: "0 auto", // Center the scroll
              }}
            >
              {/* Title */}
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  fontSize: "2rem",
                  color: "white",
                  position: "absolute",
                  top: "15%",
                }}
              >
                RULES
              </Typography>

              {/* Rule List with Staggered Animations */}
              <Box
                sx={{
                  width: "70%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  marginTop: "70px",
                  paddingLeft: "30px",
                }}
              >
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
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: "14px",
                        color: "white",
                        fontWeight: "bold",
                        textAlign: "left",
                        pl: 2,
                      }}
                    >
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

/* Styles - Reused from Dashboard */
const containerStyles: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  width: "100vw",
  overflow: "hidden",
};

const overlayStyles: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 9,
};

const navbarStyles: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  background: "linear-gradient(to right, #2C3E50, #4CA1AF)",
  color: "white",
  padding: "15px",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  gap: "15px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  zIndex: 10,
};

const sidebarStyles: React.CSSProperties = {
  position: "fixed",
  top: "70px",
  left: 0,
  width: "260px",
  height: "calc(100% - 70px)",
  background: "#2C3E50",
  color: "white",
  display: "flex",
  flexDirection: "column",
  padding: "20px",
  transition: "transform 0.3s ease-in-out",
  boxShadow: "3px 0 15px rgba(0, 0, 0, 0.2)",
  zIndex: 11,
  borderTopRightRadius: "0px",
  borderBottomRightRadius: "10px",
  transform: "translateX(-100%)",
};

const sidebarHeaderStyles: React.CSSProperties = {
  textAlign: "center",
  marginBottom: "20px",
  paddingBottom: "10px",
  borderBottom: "2px solid rgba(255, 255, 255, 0.3)",
};

const profileImgStyles: React.CSSProperties = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  border: "2px solid white",
  marginBottom: "10px",
};

const navListStyles: React.CSSProperties = {
  listStyleType: "none",
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const navLinkStyles: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  padding: "12px",
  borderRadius: "5px",
  transition: "background 0.3s, transform 0.2s",
  fontSize: "18px",
  fontWeight: "bold",
  cursor: "pointer",
};

const logoutLinkStyles: React.CSSProperties = {
  ...navLinkStyles,
  background: "#E74C3C",
  textAlign: "center",
  marginTop: "20px",
};

const iconStyles: React.CSSProperties = {
  marginRight: "10px",
  fontSize: "20px",
};

const sidebarActiveStyles = {
  backgroundColor: "#4CA1AF",
  transform: "scale(1.05)",
};

const navbarTitleStyles: React.CSSProperties = {
  margin: 0,
  fontSize: "1.8em",
  fontWeight: "bold",
};

const menuButtonStyles: React.CSSProperties = {
  fontSize: "24px",
  background: "transparent",
  color: "white",
  border: "none",
  cursor: "pointer",
  marginLeft: "10px",
};

const logoStyles: React.CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
};

const mainContentStyles: React.CSSProperties = {
  position: "absolute",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  display: "flex",
  flexDirection: "column",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundAttachment: "fixed",
  width: "100vw",
  height: "100vh",
  filter: "brightness(1)",
  transition: "0.3s ease-in-out",
  marginTop: "70px", // Offset for the header
  zIndex: 1,
};

export default Rules;