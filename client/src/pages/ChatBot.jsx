import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
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
  const conversationEndRef = useRef(null);

  const [text, setText] = useState("");
  const [conversations, setConversations] = useState([]); // Array to hold prompt-response pairs
  const [error, setError] = useState("");

  useEffect(() => {
    if (conversations.length > 0) {
      conversationEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return; // Prevent empty submissions

    try {
      const { data } = await axios.post("/api/v1/gemini/chatbot", { text });

      setConversations((prev) => [
        ...prev,
        { prompt: text, response: data },
      ]);
      toast.success("Response received!");
      setText("");
    } catch (err) {
      console.log(err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.message) {
        setError(err.message);
      }
      toast.error("Something went wrong!");
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <Box
      width={isNotMobile ? "70%" : "90%"}
      p="1.5rem"
      m="1.5rem auto"
      borderRadius={5}
      sx={{ boxShadow: 5, position: "relative" }}
      backgroundColor={theme.palette.background.alt}
    >
      <Toaster position="top-right" reverseOrder={false} />

      <Collapse in={!!error}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Collapse>

      {conversations.length > 0 && (
        <Card
          sx={{
            mt: 2,
            border: 1,
            boxShadow: 0,
            borderRadius: 5,
            borderColor: "natural.medium",
            bgcolor: "background.default",
            maxHeight: "400px",
            overflowY: "auto",
            overflowX: "auto",
          }}
        >
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
            <div ref={conversationEndRef} />
          </Box>
        </Card>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ bottom: 0, backgroundColor: theme.palette.background.alt }}
      >
        <Typography variant="h3" gutterBottom>
          Ask EbukAI Chatbot
        </Typography>

        <TextField
          placeholder="Ask anything. e.g., who am i or my developer?"
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
