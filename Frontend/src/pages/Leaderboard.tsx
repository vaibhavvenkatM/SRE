import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/swords.jpg";
import backgroundImg from "../assets/dashboard.jpg";

// Define the interface for leaderboard data
interface LeaderboardEntry {
  userid: string;
  username: string;
  points: string;
  win: number;
  loss: number;
  draw: number;
}

interface LeaderboardResponse {
  message: {
    leaderboard: LeaderboardEntry[];
  };
}

const Leaderboard: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  
  // Fetch leaderboard data from API
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/data/leaderboard");
        const data: LeaderboardResponse = await response.json();
        
        if (data && data.message && data.message.leaderboard) {
          // Sort leaderboard by points (descending)
          const sortedData = [...data.message.leaderboard].sort(
            (a, b) => parseInt(b.points) - parseInt(a.points)
          );
          setLeaderboardData(sortedData);
        } else {
          setError("Invalid data format received from server");
        }
      } catch (err) {
        setError("Failed to fetch leaderboard data");
        console.error("Error fetching leaderboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);
  
  // Reset sidebar state when location changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Component lifecycle logging
  useEffect(() => {
    console.log("Leaderboard Mounted");
    return () => console.log("Leaderboard Unmounted");
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div style={containerStyles}>
      {/* Use React conditional rendering for overlay instead of DOM manipulation */}
      {isSidebarOpen && <div style={overlayStyles} onClick={() => setSidebarOpen(false)}></div>}

      <header style={navbarStyles}>
        <button onClick={toggleSidebar} style={menuButtonStyles}>☰</button>
        <img src={logo} alt="Logo" style={logoStyles} />
        <h1 style={navbarTitleStyles}>QUIZENA</h1>
      </header>

      {/* Sidebar - use React state to control visibility */}
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
            <li>
              <Link to="/logout" style={logoutLinkStyles}>
                <span style={iconStyles}>🚪</span> Logout
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content - Leaderboard Table */}
      <div style={mainContentStyles}>
        <div style={contentStyles}>
          <div style={leaderboardContainerStyles}>
            <h1 style={leaderboardTitleStyles}>🏆 GLOBAL LEADERBOARD 🏆</h1>
            
            {isLoading ? (
              <div style={loadingStyles}>Loading leaderboard data...</div>
            ) : error ? (
              <div style={errorStyles}>{error}</div>
            ) : (
              <div style={tableContainerStyles}>
                <table style={tableStyles}>
                  <thead>
                    <tr>
                      <th style={tableHeaderStyles}>Rank</th>
                      <th style={tableHeaderStyles}>Username</th>
                      <th style={tableHeaderStyles}>Points</th>
                      <th style={tableHeaderStyles}>W</th>
                      <th style={tableHeaderStyles}>L</th>
                      <th style={tableHeaderStyles}>D</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((player, index) => (
                      <tr key={player.userid} style={{
                        ...tableRowStyles,
                        background: index === 0 ? 'rgba(255, 215, 0, 0.2)' : // Gold for 1st
                                   index === 1 ? 'rgba(192, 192, 192, 0.2)' : // Silver for 2nd
                                   index === 2 ? 'rgba(205, 127, 50, 0.2)' : // Bronze for 3rd
                                   'rgba(44, 62, 80, 0.2)' // Regular styling
                      }}>
                        <td style={tableCellStyles}>
                          {index === 0 ? '🥇' : 
                           index === 1 ? '🥈' : 
                           index === 2 ? '🥉' : (index + 1)}
                        </td>
                        <td style={{...tableCellStyles, fontWeight: 'bold'}}>
                          {player.username}
                        </td>
                        <td style={tableCellStyles}>
                          <span style={pointsStyles}>{player.points}</span>
                        </td>
                        <td style={tableCellStyles}>
                          <span style={winsStyles}>{player.win}</span>
                        </td>
                        <td style={tableCellStyles}>
                          <span style={lossesStyles}>{player.loss}</span>
                        </td>
                        <td style={tableCellStyles}>
                          <span style={drawsStyles}>{player.draw}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reuse the styles from Dashboard component
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
  backgroundColor: "rgba(0, 0, 0, 0.6)",
  transition: "0.3s ease-in-out",
  padding: "20px",
};

// Leaderboard styles
const leaderboardContainerStyles: React.CSSProperties = {
  backgroundColor: "rgba(44, 62, 80, 0.8)",
  borderRadius: "15px",
  padding: "30px",
  width: "80%",
  maxWidth: "1000px",
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
  backdropFilter: "blur(5px)",
  border: "2px solid rgba(76, 161, 175, 0.5)",
};

const leaderboardTitleStyles: React.CSSProperties = {
  fontSize: "36px",
  fontWeight: "bold",
  color: "white",
  marginBottom: "30px",
  textShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
  letterSpacing: "2px",
};

const tableContainerStyles: React.CSSProperties = {
  overflowY: "auto",
  maxHeight: "70vh",
  borderRadius: "10px",
  boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.3)",
};

const tableStyles: React.CSSProperties = {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: "0 4px",
  textAlign: "left",
};

const tableHeaderStyles: React.CSSProperties = {
  padding: "15px",
  color: "white",
  fontWeight: "bold",
  backgroundColor: "rgba(76, 161, 175, 0.8)",
  position: "sticky",
  top: 0,
  fontSize: "16px",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const tableRowStyles: React.CSSProperties = {
  transition: "all 0.2s",
  cursor: "pointer",
};

const tableCellStyles: React.CSSProperties = {
  padding: "15px",
  color: "white",
  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
  fontSize: "16px",
};

const pointsStyles: React.CSSProperties = {
  fontWeight: "bold",
  color: "#4CA1AF",
  fontSize: "18px",
};

const winsStyles: React.CSSProperties = {
  color: "#2ecc71",
  fontWeight: "bold",
};

const lossesStyles: React.CSSProperties = {
  color: "#e74c3c",
  fontWeight: "bold",
};

const drawsStyles: React.CSSProperties = {
  color: "#f39c12", // Orange color for draws
  fontWeight: "bold",
};

// Loading and error states
const loadingStyles: React.CSSProperties = {
  color: "white",
  fontSize: "20px",
  padding: "30px",
  textAlign: "center",
};

const errorStyles: React.CSSProperties = {
  color: "#e74c3c",
  fontSize: "18px",
  padding: "30px",
  textAlign: "center",
  background: "rgba(0, 0, 0, 0.2)",
  borderRadius: "10px",
};

export default Leaderboard;