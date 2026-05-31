import { useState } from "react";
import axios from "axios";

function AIChat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      type: "user",
      text: message,
    };

    setChat((prev) => [...prev, userMessage]);

    const currentMessage = message;
    setMessage("");

    try {
      const res = await axios.post(
        "https://mindease-ai-mtzh.onrender.com/api/chat",
        {
          message: currentMessage,
        }
      );

      const botMessage = {
        type: "bot",
        text: res.data.reply,
      };

      setChat((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);

      setChat((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Sorry, something went wrong. Please try again.",
        },
      ]);
    }
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-4xl font-bold mb-6">
        AI Wellness Chat
      </h1>

      <div className="h-[500px] overflow-y-auto border rounded p-4 mb-4">
        {chat.map((item, index) => (
          <div
            key={index}
            className={
              item.type === "user"
                ? "text-right mb-4"
                : "text-left mb-4"
            }
          >
            <span className="inline-block p-3 rounded bg-slate-700">
              {item.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <input
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          className="flex-1 p-3 text-black rounded"
          placeholder="Type message..."
        />

        <button
          onClick={sendMessage}
          className="bg-purple-600 px-6 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default AIChat;