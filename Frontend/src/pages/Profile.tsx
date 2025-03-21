import React, { useState, useEffect } from "react";
import { IconButton, Slide } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";

// Import assets
import logo from "../assets/swords.jpg";
import profileBg from "../assets/profil.jpg";

const Profile = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  // Reset sidebar state when location changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Component lifecycle logging and chart animation
  useEffect(() => {
    console.log("Profile Mounted");
    const timer = setTimeout(() => setShowCharts(true), 300);
    return () => {
      console.log("Profile Unmounted");
      clearTimeout(timer);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const userDetails = {
    username: "Player123",
    points: "100",
    matchesPlayed: 50,
  };

  const pieData = [
    { name: "Wins", value: 10 },
    { name: "Losses", value: 5 },
    { name: "Ties", value: 3 },
  ];

  const barData = [
    { category: "Easy", frequency: 12 },
    { category: "Medium", frequency: 18 },
    { category: "Hard", frequency: 7 },
  ];

  const COLORS = ["#4caf50", "#f44336", "#ff9800"];

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
          <h3>{userDetails.username}</h3>
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
            <li>
              <Link to="/logout" style={logoutLinkStyles}>
                <span style={iconStyles}>🚪</span> Logout
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content - Profile */}
      <div style={mainContentStyles}>
        <div style={contentOverlayStyles}>
          {/* User Info Card */}
          <div style={userInfoCardStyles}>
            <div style={userAvatarContainerStyles}>
              <img src={logo} alt="User Avatar" style={userAvatarStyles} />
            </div>
            <h2 style={userNameStyles}>{userDetails.username}</h2>
            <div style={userDetailsContainerStyles}>
              <div style={userDetailItemStyles}>
                <span style={userDetailLabelStyles}>Points:</span>
                <span style={userDetailValueStyles}>{userDetails.points}</span>
              </div>
              <div style={userDetailItemStyles}>
                <span style={userDetailLabelStyles}>Matches:</span>
                <span style={userDetailValueStyles}>{userDetails.matchesPlayed}</span>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <Slide direction="up" in={showCharts} timeout={1000}>
            <div style={statsSectionStyles}>
              <h2 style={sectionTitleStyles}>Game Statistics</h2>
              
              {/* Flex container for charts */}
              <div style={chartsContainerStyles}>
                {/* Pie Chart Card */}
                <div style={chartCardStyles}>
                  <h3 style={chartTitleStyles}>Match Results</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} games`, null]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Bar Chart Card */}
                <div style={chartCardStyles}>
                  <h3 style={chartTitleStyles}>Question Difficulty</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                      <XAxis dataKey="category" stroke="white" />
                      <YAxis stroke="white" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(20, 20, 20, 0.9)', border: 'none', borderRadius: '5px' }}
                        labelStyle={{ color: 'white' }}
                      />
                      <Legend wrapperStyle={{ color: 'white' }} />
                      <Bar dataKey="frequency" name="Questions Answered" fill="#ff9800" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </Slide>
        </div>
      </div>
    </div>
  );
};

// Styles from Dashboard
const containerStyles : React.CSSProperties= {
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  width: "100vw",
  position: "relative",
  overflow: "hidden", // Prevent scrolling
};

const overlayStyles : React.CSSProperties= {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  zIndex: 9,
};

const navbarStyles : React.CSSProperties= {
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

const sidebarStyles : React.CSSProperties= {
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

const sidebarHeaderStyles : React.CSSProperties= {
  textAlign: "center",
  marginBottom: "20px",
  paddingBottom: "10px",
  borderBottom: "2px solid rgba(255, 255, 255, 0.3)",
};

const profileImgStyles : React.CSSProperties= {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  border: "2px solid white",
  marginBottom: "10px",
};

const navListStyles : React.CSSProperties= {
  listStyleType: "none",
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const navLinkStyles : React.CSSProperties= {
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

const logoutLinkStyles : React.CSSProperties= {
  ...navLinkStyles,
  background: "#E74C3C",
  textAlign: "center",
  marginTop: "20px",
};

const iconStyles : React.CSSProperties= {
  marginRight: "10px",
  fontSize: "20px",
};

const sidebarActiveStyles : React.CSSProperties= {
  backgroundColor: "#4CA1AF",
  transform: "scale(1.05)",
};

const navbarTitleStyles : React.CSSProperties= {
  margin: 0,
  fontSize: "1.8em",
  fontWeight: "bold",
};

const menuButtonStyles : React.CSSProperties= {
  fontSize: "24px",
  background: "transparent",
  color: "white",
  border: "none",
  cursor: "pointer",
  marginLeft: "10px",
};

const logoStyles : React.CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
};

// Modified main content styles to allow scrolling
const mainContentStyles : React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundImage: `url(${profileBg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  zIndex: 1,
  paddingTop: "70px", // For navbar space
  overflowY: "auto", // Allow vertical scrolling
};

// Modified content overlay styles
const contentOverlayStyles : React.CSSProperties = {
  width: "100%",
  minHeight: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start", // Changed from center to flex-start
  padding: "20px 20px 60px 20px", // Added bottom padding
  boxSizing: "border-box",
};

const userInfoCardStyles : React.CSSProperties = {
  backgroundColor: "rgba(20, 20, 20, 0.8)",
  borderRadius: "10px",
  padding: "20px",
  width: "90%",
  maxWidth: "400px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: "20px", // Added top margin
  marginBottom: "30px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

const userAvatarContainerStyles : React.CSSProperties = {
  width: "100px", // Reduced size
  height: "100px", // Reduced size
  borderRadius: "50%",
  overflow: "hidden",
  border: "3px solid rgba(76, 161, 175, 0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: "15px",
  background: "#2C3E50",
  boxShadow: "0 0 20px rgba(76, 161, 175, 0.5)",
};

const userAvatarStyles : React.CSSProperties = {
  width: "90px", // Reduced size
  height: "90px", // Reduced size
  borderRadius: "50%",
  objectFit: "cover",
};

const userNameStyles : React.CSSProperties = {
  color: "white",
  fontSize: "24px", // Reduced font size
  margin: "0 0 15px 0",
  textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
};

const userDetailsContainerStyles : React.CSSProperties = {
  width: "100%",
  display: "flex",
  justifyContent: "space-around",
  marginTop: "5px",
};

const userDetailItemStyles : React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const userDetailLabelStyles : React.CSSProperties = {
  color: "rgba(255, 255, 255, 0.7)",
  fontSize: "14px",
  marginBottom: "5px",
};

const userDetailValueStyles : React.CSSProperties = {
  color: "white",
  fontSize: "20px",
  fontWeight: "bold",
};

const statsSectionStyles : React.CSSProperties = {
  width: "90%",
  maxWidth: "1000px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "20px",
};

const sectionTitleStyles : React.CSSProperties = {
  color: "white",
  fontSize: "24px", // Reduced font size
  margin: "0 0 10px 0",
  textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
};

const chartsContainerStyles : React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "stretch",
  flexWrap: "wrap",
  gap: "20px",
  width: "100%",
  marginBottom: "20px",
  marginTop: "30px",
};

const chartCardStyles : React.CSSProperties = {
  backgroundColor: "rgba(20, 20, 20, 0.8)",
  borderRadius: "10px",
  padding: "15px",
  flex: "1 1 300px", // Reduced min-width
  minHeight: "280px", // Reduced height
  display: "flex",
  flexDirection: "column",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
};

const chartTitleStyles : React.CSSProperties = {
  color: "rgba(255, 255, 255, 0.9)",
  fontSize: "18px", // Reduced font size
  marginBottom: "10px",
  textAlign: "center",
};

export default Profile;