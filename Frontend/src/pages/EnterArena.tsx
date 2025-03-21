
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";
import axios from "axios"; // Import axios for API call

import registerImage from "../assets/register.jpg";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // For navigation after login

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
        const response = await fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Login failed");
        }

        console.log("Login Successful:", data);
        
        // Store token in localStorage or sessionStorage (optional)
        localStorage.setItem("token", data.token);

        navigate("/dashboard"); // Redirect on success

    } catch (error: any) {
        setError(error.message); // Show error message in UI
    }
};



  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${registerImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          padding: "30px",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontWeight: "bold",
          fontSize: "2rem",
          color: "white",
          width: "350px",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.6)",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: "20px", fontFamily: "serif" }}>
          Login
        </Typography>

        {/* Display Error Message if Any */}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Form Start */}
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Typography sx={styles.label}>Email</Typography>
          <TextField
            type="email"
            variant="outlined"
            fullWidth
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            sx={styles.input}
          />

          <Typography sx={styles.label}>Password</Typography>
          <TextField
            type="password"
            variant="outlined"
            fullWidth
            placeholder="Enter your password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            sx={styles.input}
          />

          <Button type="submit" variant="contained" sx={styles.submitButton}>
            Submit
          </Button>
        </form>
        {/* Form End */}

        <Typography sx={styles.registerText}>
          Don't have an account?{" "}
          <Link to="/registration" style={styles.registerLink}>
            Register
          </Link>
        </Typography>

        {/* Move to Home Page Button */}
        <Button component={Link} to="/" variant="contained" sx={styles.submitButton}>
          Move to Home Page
        </Button>
      </Box>
    </Box>
  );
};

// Styles
const styles = {
  label: {
    alignSelf: "flex-start",
    fontSize: "14px",
    fontWeight: "bold",
    marginTop: "10px",
  },
  input: {
    marginTop: "5px",
    background: "white",
    borderRadius: "5px",
    "& .MuiOutlinedInput-root": {
      height: "40px",
      fontSize: "14px",
      "& input": {
        padding: "8px",
      },
    },
  },
  submitButton: {
    width: "100%",
    padding: "10px",
    marginTop: "20px",
    background: "#3B3FCB",
    color: "white",
    fontSize: "16px",
    fontWeight: "bold",
    borderRadius: "5px",
    cursor: "pointer",
    "&:hover": {
      background: "#3038a5",
    },
  },
  registerText: {
    marginTop: "15px",
    fontSize: "16px",
  },
  registerLink: {
    color: "#FFD700",
    textDecoration: "underline",
    cursor: "pointer",
  },
};

export default Login;
