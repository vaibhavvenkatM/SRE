// Dashboard.tsx
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/swords.jpg";
import backgroundImg from "../assets/dashboard.jpg";
// import "./Dashboard.css"; // Import the CSS file
import "../styles/Dashboard.css";

const Dashboard: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    console.log("Dashboard Mounted");
    return () => console.log("Dashboard Unmounted");
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const joinQueue = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You need to log in first!");
      navigate("/login");
      return;
    }
    navigate("/queue");
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
          <h3>CONTROLS</h3>
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
          <h1 className="title">WELCOME TO THE BATTLES OF THE QUIZ LORDS</h1>
          <button className="button" onClick={joinQueue}>Start Game</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;