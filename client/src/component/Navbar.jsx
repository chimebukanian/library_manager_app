import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import axios from "../utils/axios";
import toast from "react-hot-toast";

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(Boolean(localStorage.getItem("accessToken")));

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/auth/logout");
      localStorage.removeItem("accessToken");
      setLoggedIn(false); // Update login state
      toast.success("Logout successfully");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const handleHome = () => {
    navigate("/");
  };

  const linkStyle = {
    textDecoration: "none",
    color: "inherit",
  };

  useEffect(() => {
    setLoggedIn(Boolean(localStorage.getItem("accessToken")));
  }, []);

  return (
    <Box
      width="100%"
      backgroundColor={theme.palette.background.alt}
      p="1rem 6%"
      textAlign="center"
      sx={{ boxShadow: 3, mb: 2 }}
    >
      <Typography
        style={{ cursor: "pointer" }}
        onClick={handleHome}
        variant="h1"
        color="primary"
        fontWeight="bold"
      >
        EbukAI
      </Typography>
      {loggedIn ? (
        <>
          <NavLink to="/" style={linkStyle} p={1}>
            Home
          </NavLink>{" "}
          <NavLink to="/login" style={linkStyle} onClick={handleLogout} p={1}>
            Logout
          </NavLink>
        </>
      ) : (
        <>
          <NavLink to="/register" style={linkStyle} p={1}>
            Sign Up
          </NavLink>{" "}
          <NavLink to="/login" style={linkStyle} p={1}>
            Sign In
          </NavLink>
        </>
      )}
    </Box>
  );
};

export default Navbar;
