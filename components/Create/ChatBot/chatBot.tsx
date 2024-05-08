import { useState } from "react";

interface Message {
  id: number;
  message: string;
  sender: string;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [user_input, setUserInput] = useState("");

  const sendMessage = async () => {
    if (user_input.trim()) {
      const newMessage = {
        id: Date.now(),
        message: user_input,
        sender: "user",
      };
      setMessages([...messages, newMessage]);

      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: user_input.trim(),
          session_id: "abc12345",
        }), // TODO add session id
      });

      if (!response.ok) {
        console.log("error: ", response);
        return;
      }
      const responseJson = await response.json();
      console.log("answer: ", responseJson.answer.answer);

      setMessages((messages) => [
        ...messages,
        { id: Date.now(), message: responseJson.answer.answer, sender: "bot" },
      ]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col jsutify-center items-center">
      <div className="bg-white p-6 rounded shadow w-96">
        <div className="overflow-auto h-80">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`my-2 p-2 rounded ${
                message.sender == "user"
                  ? "bg-blue-200 self-end"
                  : "bg-green-200 self-start"
              }`}
            >
              {message.message}
            </div>
          ))}
        </div>
      </div>
      <div className="m-4">
        <input
          type="text"
          value={user_input}
          onChange={(e) => setUserInput(e.target.value)}
          className="border p-2 w-full text-black border-gray-300"
        />
        <button
          onClick={sendMessage}
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
