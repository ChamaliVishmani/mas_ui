import { useState } from "react";

interface Message {
  id: number;
  message: string;
  sender: string;
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [user_input, setUserInput] = useState("");

  const findAssistantAnswer = (answer: string) => {
    const assistantPattern = "Assistant: (.*?)(?:Human:|$)";
    const aiPattern = "AI: (.*?)(?:Human:|$)";
    const assistantRegex = new RegExp(assistantPattern, "s");
    const aiRegex = new RegExp(aiPattern, "s");

    const assistantMatch = assistantRegex.exec(answer);

    if (assistantMatch) {
      return assistantMatch[1];
    } else {
      const aiMatch = aiRegex.exec(answer);
      return aiMatch ? aiMatch[1].replace(/AI:/g, "") : "";
    }
  };

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
          session_id: "abc1@234567",
        }), // TODO - add session id
      });

      if (!response.ok) {
        throw new Error("Unable to get response from the chatbot.");
      }
      const responseJson = await response.json();

      const assistant_answer = findAssistantAnswer(responseJson.answer.answer);

      setMessages((messages) => [
        ...messages,
        { id: Date.now(), message: assistant_answer, sender: "bot" },
      ]);
      setUserInput("");
    }
  };

  return (
    <div className="bg-gray-100 flex flex-col jsutify-center items-center ">
      <div className="flex-1 w-full p-3 ">
        <div className="g-white p-3 overflow-auto max-h-[60vh]">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`my-2 p-2 rounded text-white ${
                message.sender == "user"
                  ? "bg-gray-600 self-end ml-10"
                  : "bg-blue-600 self-start mr-10"
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
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
