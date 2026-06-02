import { useState } from "react";
import API from "../api/auth";
import "./chat.css";

function ChatBot() {

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {

    if (!message.trim()) return;

    const userMessage = {
      sender: "user",
      text: message
    };

    setMessages((prev) => [...prev, userMessage]);

    try {

      const res = await API.post("/chat", {
        message
      });

      const botMessage = {
        sender: "bot",
        text: res.data.reply
      };

      setMessages((prev) => [
        ...prev,
        botMessage
      ]);

    } catch (err) {
      console.log(err);
    }

    setMessage("");
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        /*style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          border: "none",
          fontSize: "24px",
          cursor: "pointer",
          zIndex: 1000
        }}*/ className="chat-button"
      >
        🤖
      </button>

      {/* CHAT WINDOW */}
      {open && (
        <div
          /*style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "350px",
            height: "500px",
            background: "white",
            borderRadius: "10px",
            padding: "10px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1000
          }}*/ className="chat-window"
        >

          <h3 className="chat-header">AI Assistant</h3>

          {/* MESSAGES */}
          <div
            /*style={{
              flex: 1,
              overflowY: "auto",
              marginBottom: "10px"
            }}*/className="chat-messages"
          >
            {messages.map((msg, index) => (
              <div
              //className="chat-input"
                key={index}
                style={{
                  textAlign:
                    msg.sender === "user"
                      ? "right"
                      : "left",
                  marginBottom: "10px"
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px",
                    borderRadius: "10px",
                    background:
                      msg.sender === "user"
                        ? "#007bff"
                        : "#e5e5e5",
                    color:
                      msg.sender === "user"
                        ? "white"
                        : "black"
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div
            style={{
              display: "flex",
              gap: "5px"
            }}
          >
            <input
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Ask anything..."
              style={{
                flex: 1,
                padding: "10px"
              }}
            />

            <button onClick={sendMessage}> 
              Send
            </button>
          </div>

        </div>
      )}
    </>
  );
}

export default ChatBot;