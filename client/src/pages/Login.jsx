import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from '../utils/axios';
import { 
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  TextField,
  Button,
  Alert,
  Collapse,
} from "@mui/material";

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  //media
  const isNotMobile = useMediaQuery("(min-width: 1000px)");
  // states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //register ctrl
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
      "http://localhost:3000/api/v1/auth/login", 
      { email, password },
      { withCredentials: true });
      const { success, message, accessToken } = data;
      if (success && accessToken) {
        console.log(message)
        toast.success(message, {
          position: "bottom-left",
        });
        console.log('Setting accessToken in localStorage:', accessToken);
        localStorage.setItem('accessToken', accessToken);
        console.log('AccessToken set:', localStorage.getItem('accessToken'));
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }   else {
        toast.error(message, {
          position: "bottom-left",
        });
      }
    } catch (err) {
      console.log(err);
      // if (err.response.data.error) {
      //   // setError(err.response.data.error);
      // } else if (err.message) {
        const errorMessage = err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : err.message;
        setError(errorMessage);
        toast.error(errorMessage);
      // }
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };
  return (
    <Box
      width={isNotMobile ? "40%" : "80%"}
      p={"2rem"}
      m={"2rem auto"}
      borderRadius={5}
      sx={{ boxShadow: 5 }}
      backgroundColor={theme.palette.background.alt}
    >
      <Collapse in={error}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Collapse>
      <form onSubmit={handleSubmit}>
        <Typography variant="h3">Sign In</Typography>

        <TextField
          label="email"
          type="email"
          required
          margin="normal"
          fullWidth
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <TextField
          label="password"
          type="password"
          required
          margin="normal"
          fullWidth
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ color: "white", mt: 2 }}
        >
          Sign In
        </Button>
        <Typography mt={2}>
          Dont have an account ? <Link to="/register">Please Register</Link>
        </Typography>
      </form>
      <ToastContainer />
    </Box>
  );
};

export default Login;