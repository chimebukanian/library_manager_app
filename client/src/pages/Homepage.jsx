import React from "react";
import { Box, Typography, Card, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChatRounded from "@mui/icons-material/ChatRounded";

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center", // Centers horizontally
        alignItems: "center", // Centers vertically
        height: "100vh", // Full viewport height
        backgroundColor: "background.default", // Optional background color
      }}
    >
      <Box
        p={2}
        sx={{
          textAlign: "center", // Aligns text to the center
          width: "fit-content", // Adjusts width dynamically to fit the content
          maxWidth: "80%", // Optional: Restricts the width to ensure responsiveness
        }}
      >
        <Typography variant="h4" mb={2} fontWeight="bold">
          AI ChatBot
        </Typography>
        <Card
          onClick={() => navigate("/chatbot")}
          sx={{
            boxShadow: 2,
            borderRadius: 5,
            height: "auto",
            padding: 2,
            "&:hover": {
              border: 2,
              boxShadow: 0,
              borderColor: "primary.dark",
              cursor: "pointer",
            },
          }}
        >
          <ChatRounded
            sx={{
              fontSize: 80,
              color: "primary.main",
              margin: "0 auto",
              display: "block",
            }}
          />
          <Stack p={2}>
            <Typography fontWeight="bold" variant="h5">
              Chatbot
            </Typography>
            <Typography variant="h6">
              <i>EbukAI is an interactive AI assistant serving basically as  chimebuka's  portfolio website and as well, can also help with any topic you may have.</i>
                </Typography>
          </Stack>
        </Card>
      </Box>
    </Box>
  );
};

export default Homepage;
