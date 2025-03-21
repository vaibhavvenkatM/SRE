// Registration.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import registerImage from "../assets/register.jpg";
// import "./Registration.css"; // Import styles
import "../styles/Registration.css";

const Registration: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    setSuccessMessage("");

    if (!formData.username || !formData.email || !formData.password) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/auth/register", formData);
      setSuccessMessage(response.data.message);
      setFormData({ username: "", email: "", password: "" });

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.response ? err.response.data.error : "Failed to register. Please try again.");
    }
  };

  return (
    <>
      <Box className="registration-container">
        <Box className="registration-box">
          <Typography variant="h4" className="registration-title">
            Sign Up
          </Typography>

          {error && <Typography className="registration-error">{error}</Typography>}
          {successMessage && <Typography className="registration-success">{successMessage}</Typography>}

          <Typography className="registration-label">Username</Typography>
          <TextField
            name="username"
            variant="outlined"
            fullWidth
            placeholder="Enter username"
            className="registration-input"
            value={formData.username}
            onChange={handleChange}
          />

          <Typography className="registration-label">Email</Typography>
          <TextField
            name="email"
            type="email"
            variant="outlined"
            fullWidth
            placeholder="Enter email"
            className="registration-input"
            value={formData.email}
            onChange={handleChange}
          />

          <Typography className="registration-label">Password</Typography>
          <TextField
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            placeholder="Enter password"
            className="registration-input"
            value={formData.password}
            onChange={handleChange}
          />

          <Button variant="contained" className="registration-submit-button" onClick={handleSubmit}>
            Submit
          </Button>

          <Typography className="registration-login-text">
            Already have an account?{" "}
            <Link to="/login" className="registration-login-link">
              Login
            </Link>
          </Typography>

          <Button component={Link} to="/" variant="contained" className="registration-submit-button">
            Move to Home Page
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default Registration;