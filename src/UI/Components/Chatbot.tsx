import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Button,
  Box,
} from "@mui/material";
import Input from "@mui/joy/Input";
import CloseIcon from "@mui/icons-material/Close";
import ReactMarkdown from "react-markdown";
import { useComponentStore } from "../../stores/ZustandStores";

interface ChatbotProps {
  isChatbotModalOpen: boolean;
  onChatbotModalClose: () => void;
}

const ChatBotModal: React.FC<ChatbotProps> = (props) => {
  const [messages, setMessages] = useState<
    { type: "user" | "bot"; text: string }[]
  >([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const { showCrosshair } = useComponentStore();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    setMessages((prev) => [...prev, { type: "user", text: currentMessage }]);

    try {
      const response = await fetch(
        "https://strategy-fox-go-bked.com/api/chatbot/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userInput: currentMessage }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const botMessage =
          data.response || "I'm sorry, I couldn't process that.";

        setMessages((prev) => [...prev, { type: "bot", text: botMessage }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: "Failed to communicate with the chatbot." },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "An error occurred while communicating with the chatbot.",
        },
      ]);
    }

    setCurrentMessage("");
  };

  useEffect(() => {
    if (props.isChatbotModalOpen) {
      const scrollY = window.scrollY;
      const joystickZone = document.getElementById("joystickZone");

      if (joystickZone) {
        joystickZone.style.display = "none";
      }

      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";

      return () => {
        if (joystickZone) {
          joystickZone.style.display = "block";
        }

        document.body.style.position = "";
        document.body.style.top = "";
        document.body.style.width = "";
        document.body.style.overflow = "";
        document.body.style.touchAction = "";
        window.scrollTo(0, scrollY);
      };
    }
  }, [props.isChatbotModalOpen]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  if (!props.isChatbotModalOpen) return null;

  return (
    <Card
      sx={{
        position: "fixed",
        bottom: "1.5%",
        right: "1.5%",
        width: { xs: "90vw", sm: "40vw", lg: "25vw", md: "30vw" },
        height: "60vh",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(10px)",
        borderRadius: "10px",
        boxShadow: 4,
        overflow: "hidden",
        pointerEvents: "auto",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "3px solid rgba(0, 0, 0, 0.1)",
          padding: "16px",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <img
            src="/fox-logo.png" 
            alt="Logo"
            style={{ width: "30px", height: "30px" }}
          />
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "1.2rem",
              fontFamily: "'Poppins', sans-serif",
              paddingLeft: "10px",
            }}
          >
            CHAT WITH FOX
          </Typography>
        </Box>
        <IconButton
          onPointerDown={() => {
            props.onChatbotModalClose();
            showCrosshair();
          }}
          size="small"
          sx={{
            marginLeft: "auto",
            zIndex: 1001,
            borderRadius: "50%", 
            backgroundColor: "#9f9f9f",
            color: "black",
            width: "1.5rem",
            height: "1.5rem",
            "&:hover": { backgroundColor: "#eeeeee", color: "black" },
          }}
        >
          <CloseIcon
            sx={{
              height: "1rem",
            }}
          />
        </IconButton>
      </CardContent>

      <CardContent
        ref={chatContainerRef} 
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: 2,
          display: "flex",
          flexDirection: "column",
          "&::-webkit-scrollbar": { display: "none" }, 
          scrollbarWidth: "none",
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent:
                message.type === "user" ? "flex-end" : "flex-start",
              marginBottom: 1,
            }}
          >
            <Box
              sx={{
                maxWidth: "70%",
                padding: 1,
                borderRadius: "10px",
                backgroundColor:
                  message.type === "user" ? "#e2441e" : "rgba(0, 0, 0, 0.1)",
                color: message.type === "user" ? "white" : "black",
                wordWrap: "break-word",
              }}
            >
              <Typography
                sx={{
                  fontSize: "1rem",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </Typography>
            </Box>
          </Box>
        ))}
      </CardContent>

      {/* Footer */}
      <CardActions
        sx={{
          display: "flex",
          alignItems: "center",
          padding: "8px",
          borderTop: "3px solid rgba(0, 0, 0, 0.1)",
          gap: 1,
        }}
      >
        <Input
          placeholder="Enter your message"
          value={currentMessage}
          ref={inputRef}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
          sx={{
            flex: 1,
            padding: 1.5,
            fontFamily: "'Poppins', sans-serif",
          }}
        />
        <Button
          sx={{
            color: "white",
            backgroundColor: "#e2441e",
            padding: 1.5,
            fontFamily: "'Poppins', sans-serif",
          }}
          onPointerDown={handleSendMessage}
        >
          Send
        </Button>
      </CardActions>
    </Card>
  );
};

export default ChatBotModal;
