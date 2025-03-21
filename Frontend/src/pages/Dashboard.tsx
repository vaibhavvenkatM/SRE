import React, { useState, useEffect } from "react";
import { Link, useLocation , useNavigate} from "react-router-dom";
import logo from "../assets/swords.jpg";
import backgroundImg from "../assets/dashboard.jpg";

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  // const location = useLocation();
  const navigate = useNavigate();
  
  // Reset sidebar state when location changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Component lifecycle logging
  useEffect(() => {
    console.log("Dashboard Mounted");
    return () => console.log("Dashboard Unmounted");
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const joinQueue = () => {
    // Check if token exists before navigating to queue
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in first!");
      navigate("/login");
      return;
    }
    
    // Navigate to queue page if authenticated
    navigate("/queue");
  };

  return (
    <div style={containerStyles}>
      {isSidebarOpen && <div style={overlayStyles} onClick={() => setSidebarOpen(false)}></div>}

      <header style={navbarStyles}>
        <button onClick={toggleSidebar} style={menuButtonStyles}>☰</button>
        <img src={logo} alt="Logo" style={logoStyles} />
        <h1 style={navbarTitleStyles}>QUIZENA</h1>
      </header>

      {/* Sidebar */}
      <div style={{ ...sidebarStyles, transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)" }}>
        <div style={sidebarHeaderStyles}>
          <img src={logo} alt="Profile" style={profileImgStyles} />
          <h3>CONTROLS</h3>
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

      {/* Main Content */}
      <div style={mainContentStyles}>
        <div style={contentStyles}>
          <h1 style={titleStyles}>WELCOME TO THE BATTLES OF THE QUIZ LORDS</h1>
            <button style={buttonStyles} onClick={joinQueue}>Start Game</button>
        </div>
      </div>
    </div>
  );
};

/* Styles */
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
  backgroundImage: `url(${backgroundImg})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundAttachment: "fixed",
  width: "100vw",
  height: "100vh",
  filter: "brightness(1)",
  transition: "0.3s ease-in-out",
};

const contentStyles: React.CSSProperties = {
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
};

const titleStyles: React.CSSProperties = {
  fontSize: "40px",
  fontWeight: "bolder",
  color: "white",
  marginBottom: "20px",
};

const buttonStyles: React.CSSProperties = {
  padding: "12px 24px",
  fontSize: "18px",
  fontWeight: "bold",
  cursor: "pointer",
  backgroundColor: "#41647a",
  color: "white",
  border: "none",
  borderRadius: "5px",
  transition: "0.3s",
};

export default Dashboard;