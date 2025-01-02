import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import axios from '../utils/axios';
import toast from "react-hot-toast";

const Navbar = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const accessToken = localStorage.getItem("accessToken");
    const loggedIn = Boolean(accessToken);

    //handle logout
  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/auth/logout");
      localStorage.removeItem("accessToken");
      toast.success("logout successfully ");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const Home = async () => {
    navigate("/");
  }
  const linkStyle = {
    textDecoration: 'none', // Removes the underline
    color: 'inherit', // Makes the link color the same as the surrounding text
    '&:hover': {
      color: 'primary.main', // Changes the link color to the primary color when hovered over
    },
  };
  return (
    <Box
      width={"100%"}
      backgroundColor={theme.palette.background.alt}
      p="1rem 6%"
      textAlign={"center"}
      sx={{ boxShadow: 3, mb: 2 }}
    >
      <Typography style={{ cursor: 'pointer' }} onClick={Home} variant="h1" color="primary" fontWeight="bold">
        EbukAI
      </Typography>
      {loggedIn ? (
        <>
          <NavLink to="/" p={1} style={linkStyle}>
            Home
          </NavLink>{" "}
          <NavLink to="/login" style={linkStyle} onClick={handleLogout} p={1}>
            Logout
          </NavLink>
        </>
      ) : (
        <>

          <NavLink to="/register" p={1} style={linkStyle}>
            Sign Up
          </NavLink>{" "}
          <NavLink to="/login" p={1} style={linkStyle}>
            Sign In
          </NavLink>
        </>
      )}
    </Box>
  );
};

export default Navbar;