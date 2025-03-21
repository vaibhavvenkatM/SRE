// Profile.tsx
import React, { useState, useEffect } from "react";
import { Slide } from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";

// Import assets
import logo from "../assets/swords.jpg";
import profileBg from "../assets/profil.jpg";

// Import styles
// import "./Profile.css";
import "../styles/Profile.css";

const Profile = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

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
    <div className="containerStyles">
      {isSidebarOpen && <div className="overlayStyles" onClick={() => setSidebarOpen(false)}></div>}

      <header className="navbarStyles">
        <button onClick={toggleSidebar} className="menuButtonStyles">☰</button>
        <img src={logo} alt="Logo" className="logoStyles" />
        <h1 className="navbarTitleStyles">QUIZENA</h1>
      </header>

      <div className="sidebarStyles" style={{ transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)" }}>
        <div className="sidebarHeaderStyles">
          <img src={logo} alt="Profile" className="profileImgStyles" />
          <h3>{userDetails.username}</h3>
        </div>
        <nav>
          <ul className="navListStyles">
            <li>
              <Link to="/" className={`navLinkStyles ${location.pathname === "/" ? "sidebarActiveStyles" : ""}`}>
                <span className="iconStyles">🏠</span> Home
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className={`navLinkStyles ${location.pathname === "/dashboard" ? "sidebarActiveStyles" : ""}`}>
                <span className="iconStyles">⚔️</span> Enter Arena
              </Link>
            </li>
            <li>
              <Link to="/profile" className={`navLinkStyles ${location.pathname === "/profile" ? "sidebarActiveStyles" : ""}`}>
                <span className="iconStyles">👤</span> Profile
              </Link>
            </li>
            <li>
              <Link to="/leaderboard" className={`navLinkStyles ${location.pathname === "/leaderboard" ? "sidebarActiveStyles" : ""}`}>
                <span className="iconStyles">🏆</span> Leaderboard
              </Link>
            </li>
            <li>
              <Link to="/rules" className={`navLinkStyles ${location.pathname === "/rules" ? "sidebarActiveStyles" : ""}`}>
                <span className="iconStyles">📜</span> Rules
              </Link>
            </li>
            <li>
              <Link to="/logout" className="logoutLinkStyles">
                <span className="iconStyles">🚪</span> Logout
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="mainContentStyles">
        <div className="contentOverlayStyles">
          <div className="userInfoCardStyles">
            <div className="userAvatarContainerStyles">
              <img src={logo} alt="User Avatar" className="userAvatarStyles" />
            </div>
            <h2 className="userNameStyles">{userDetails.username}</h2>
            <div className="userDetailsContainerStyles">
              <div className="userDetailItemStyles">
                <span className="userDetailLabelStyles">Points:</span>
                <span className="userDetailValueStyles">{userDetails.points}</span>
              </div>
              <div className="userDetailItemStyles">
                <span className="userDetailLabelStyles">Matches:</span>
                <span className="userDetailValueStyles">{userDetails.matchesPlayed}</span>
              </div>
            </div>
          </div>

          <Slide direction="up" in={showCharts} timeout={1000}>
            <div className="statsSectionStyles">
              <h2 className="sectionTitleStyles">Game Statistics</h2>
              
              <div className="chartsContainerStyles">
                <div className="chartCardStyles">
                  <h3 className="chartTitleStyles">Match Results</h3>
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
                
                <div className="chartCardStyles">
                  <h3 className="chartTitleStyles">Question Difficulty</h3>
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

export default Profile;