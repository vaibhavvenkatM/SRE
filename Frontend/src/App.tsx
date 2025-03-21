import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Slide } from "@mui/material";
import swordsLogo from "./assets/swords.jpg";
import loginImage from "./assets/Login.jpg";
import AppRoutes from "./pages/routes/AppRoutes";

const App: React.FC = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [showTitle, setShowTitle] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Animation effects for homepage
  useEffect(() => {
    if (isHomePage) {
      setTimeout(() => setShowTitle(true), 500);
      setTimeout(() => setShowButtons(true), 1200);
    }
  }, [isHomePage]);
  
  // Close sidebar when location changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);
  
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  
  // Handle overflow only when component mounts and unmounts
  useEffect(() => {
    // Save original settings
    const originalOverflowX = document.documentElement.style.overflowX;
    const originalOverflowY = document.documentElement.style.overflowY;
    
    // Apply new settings
    document.documentElement.style.overflowX = "hidden";
    document.documentElement.style.overflowY = "hidden";
    
    // Restore original settings on cleanup
    return () => {
      document.documentElement.style.overflowX = originalOverflowX;
      document.documentElement.style.overflowY = originalOverflowY;
    };
  }, []);
  
  return (
    <div style={containerStyle}>
      {/* Only render the sidebar/overlay/header on homepage */}
      {isHomePage && (
        <>
          {isSidebarOpen && <div style={overlayStyles} onClick={() => setSidebarOpen(false)}></div>}
          <header style={headerStyle}>
            <button onClick={toggleSidebar} style={menuButtonStyles}>☰</button>
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={swordsLogo} alt="Swords Logo" style={logoStyles} />
              <div style={titleLogoStyle}>QUIZENA</div>
            </div>
            <nav style={navStyle}>
              <Link to="/registration" style={linkStyle}>Sign Up</Link>
            </nav>
          </header>
          
          {/* Sidebar */}
          <div style={{ ...sidebarStyles, transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)" }}>
            <div style={sidebarHeaderStyles}>
              <img src={swordsLogo} alt="Profile" style={profileImgStyles} />
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
                  <Link to="/dashboard" style={navLinkStyles}>
                    <span style={iconStyles}>⚔️</span> Enter Arena
                  </Link>
                </li>
                <li>
                  <Link to="/profile" style={navLinkStyles}>
                    <span style={iconStyles}>👤</span> Profile
                  </Link>
                </li>
                <li>
                  <Link to="/leaderboard" style={navLinkStyles}>
                    <span style={iconStyles}>🏆</span> Leaderboard
                  </Link>
                </li>
                <li>
                  <Link to="/rules" style={navLinkStyles}>
                    <span style={iconStyles}>📜</span> Rules
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Background Section */}
          <div style={backgroundStyle}>
            <Slide direction="up" in={showTitle} mountOnEnter unmountOnExit>
              <div style={titleStyle}>WELCOME TO THE BATTLES OF THE QUIZ LORDS</div>
            </Slide>

            <Slide direction="up" in={showButtons} timeout={1000}>
              <div style={buttonContainerStyle}>
                <HoverButton to="/dashboard">ENTER THE ARENA</HoverButton>
                <HoverButton to="/leaderboard">LEADERBOARD</HoverButton>
              </div>
            </Slide>
          </div>
        </>
      )}

      {/* Always render AppRoutes */}
      <AppRoutes />
    </div>
  );
};

/* Styles */
const containerStyle: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  overflow: "hidden",
  margin: 0,
  padding: 0,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  padding: "15px",
  color: "white",
  position: "fixed",
  gap: "15px",
  top: 0,
  left: 0,
  width: "100%",
  background: "linear-gradient(to right, #2C3E50, #4CA1AF)",
  zIndex: 10,
  boxSizing: "border-box",
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

const navStyle: React.CSSProperties = {
  display: "flex",
  gap: "20px",
  marginLeft: "auto",
};

const linkStyle: React.CSSProperties = {
  color: "white",
  textDecoration: "none",
  fontSize: 26,
  fontWeight: "bold",
  zIndex: 100,
};

const backgroundStyle: React.CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundImage: `url(${loginImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  textAlign: "center",
};

const titleStyle: React.CSSProperties = {
  fontSize: "2.5em",
  fontWeight: "bold",
  textShadow: "2px 2px 4px rgba(0,0,0,0.7)",
  zIndex: 10,
};

const buttonContainerStyle: React.CSSProperties = {
  marginTop: "30px",
  display: "flex",
  gap: "20px",
  zIndex: 10,
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

const profileImgStyles: React.CSSProperties = {
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  border: "2px solid white",
  marginBottom: "10px",
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

/* Button Components */
const buttonStyle: React.CSSProperties = {
  background: "linear-gradient(to right, #ffffff, #A1C4FD)",
  color: "#000",
  fontSize: "1.3em",
  fontWeight: "bold",
  padding: "12px 24px",
  borderRadius: "8px",
  textDecoration: "none",
  transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  boxShadow: "0px 4px 8px rgba(161, 196, 253, 0.7)",
  border: "2px solid transparent",
  textAlign: "center",
  display: "inline-block",
};

const buttonHoverStyle: React.CSSProperties = {
  transform: "scale(1.1)",
  boxShadow: "0px 6px 12px rgba(161, 196, 253, 1)",
};

const HoverButton: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const [hover, setHover] = useState(false);

  return (
    <Link
      to={to}
      style={hover ? { ...buttonStyle, ...buttonHoverStyle } : buttonStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {children}
    </Link>
  );
};

const titleLogoStyle: React.CSSProperties = {
  marginLeft: "20px",
  fontSize: "2em",
  fontWeight: "bold",
};

export default App;