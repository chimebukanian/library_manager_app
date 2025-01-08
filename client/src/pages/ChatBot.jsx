import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "../utils/axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  TextField,
  Button,
  Alert,
  Collapse,
  Card,
  Divider,
} from "@mui/material";

const ChatBot = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isNotMobile = useMediaQuery("(min-width: 1000px)");

  const [text, setText] = useState("");
  const [conversations, setConversations] = useState([]); // Array to hold prompt-response pairs
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return; // Prevent empty submissions

    try {
      const { data } = await axios.post("/api/v1/gemini/chatbot", { text });
      
      setConversations((prev) => [
        ...prev,
        { prompt: text, response: data },
      ]);
      setText("");
    } catch (err) {
      console.log(err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      }
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <Box
      width={isNotMobile ? "50%" : "90%"}
      p={"2rem"}
      m={"2rem auto"}
      borderRadius={5}
      sx={{ boxShadow: 5 }}
      backgroundColor={theme.palette.background.alt}
    >
      <Collapse in={!!error}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Collapse>


      <Card
        sx={{
          mt: 4,
          border: 1,
          boxShadow: 0,
          borderRadius: 5,
          borderColor: "natural.medium",
          bgcolor: "background.default",
          maxHeight: "500px",
          overflowY: "auto",
        }}
      >
        {conversations.length > 0 ? (
          <Box p={2}>
            {conversations.map((conv, index) => (
              <Box key={index} mb={2}>
                <Typography variant="body1" fontWeight="bold">
                  You:
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ whiteSpace: "pre-wrap", mb: 1 }}
                >
                  {conv.prompt}
                </Typography>

                <Typography variant="body1" fontWeight="bold">
                  EbukAI:
                </Typography>
                <ReactMarkdown
                  children={conv.response}
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node, ...props }) => (
                      <Typography variant="h4" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <Typography variant="h5" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <Typography variant="body1" {...props} />
                    ),
                    code: ({ node, inline, ...props }) => (
                      <Box
                        component="code"
                        sx={{
                          backgroundColor: theme.palette.background.alt,
                          padding: "2px 4px",
                          borderRadius: "4px",
                          fontSize: "0.875rem",
                          fontFamily: "monospace",
                        }}
                        {...props}
                      />
                    ),
                  }}
                />

                {index < conversations.length - 1 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))}
          </Box>
        ) : (
          <Typography
            variant="h5"
            color="natural.main"
            sx={{
              textAlign: "center",
              verticalAlign: "middle",
              lineHeight: "normal",
              padding: "20px 0",
            }}
          >
            
          </Typography>
        )}
      </Card>
      <form onSubmit={handleSubmit}>
        <Typography variant="h3" gutterBottom>
          Ask EbukAI Chatbot
        </Typography>

        <TextField
          placeholder="Ask anything. e.g., who is EbukAI?"
          type="text"
          multiline
          required
          margin="normal"
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{ color: "white", mt: 2 }}
        >
          Chat
        </Button>
        <Typography mt={2}>
          Not this tool? <Link to="/">GO BACK</Link>
        </Typography>
      </form>
    </Box>
  );
};

export default ChatBot;