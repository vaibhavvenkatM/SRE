// Leaderboard.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/swords.jpg";
import backgroundImg from "../assets/dashboard.jpg";
// import "./Leaderboard.css"; // Import the CSS file
import "../styles/Leaderboard.css";

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

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:5000/data/leaderboard");
        const data: LeaderboardResponse = await response.json();

        if (data && data.message && data.message.leaderboard) {
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

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    console.log("Leaderboard Mounted");
    return () => console.log("Leaderboard Unmounted");
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
            <li>
              <Link to="/logout" className="logout-link">
                <span className="icon">🚪</span> Logout
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="main-content">
        <div className="content">
          <div className="leaderboard-container">
            <h1 className="leaderboard-title">🏆 GLOBAL LEADERBOARD 🏆</h1>

            {isLoading ? (
              <div className="loading">Loading leaderboard data...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th className="table-header">Rank</th>
                      <th className="table-header">Username</th>
                      <th className="table-header">Points</th>
                      <th className="table-header">W</th>
                      <th className="table-header">L</th>
                      <th className="table-header">D</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((player, index) => (
                      <tr key={player.userid} className="table-row" style={{
                          background: index === 0 ? 'rgba(255, 215, 0, 0.2)' : // Gold for 1st
                                      index === 1 ? 'rgba(192, 192, 192, 0.2)' : // Silver for 2nd
                                      index === 2 ? 'rgba(205, 127, 50, 0.2)' : // Bronze for 3rd
                                      'rgba(44, 62, 80, 0.2)' // Regular styling
                      }}>
                        <td className="table-cell">
                          {index === 0 ? '🥇' :
                            index === 1 ? '🥈' :
                            index === 2 ? '🥉' : (index + 1)}
                        </td>
                        <td className="table-cell username">
                          {player.username}
                        </td>
                        <td className="table-cell">
                          <span className="points">{player.points}</span>
                        </td>
                        <td className="table-cell">
                          <span className="wins">{player.win}</span>
                        </td>
                        <td className="table-cell">
                          <span className="losses">{player.loss}</span>
                        </td>
                        <td className="table-cell">
                          <span className="draws">{player.draw}</span>
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

export default Leaderboard;