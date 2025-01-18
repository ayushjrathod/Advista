"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Bot, Moon, Send, Sun, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Start a new chat session when the component mounts and pass the initial message
  useEffect(() => {
    const startChatSession = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post("http://localhost:8000/chat/start");
        console.log("Chat session started:", response.data);
        const sessionId = response.data.session_id;

        setSessionId(sessionId);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: "bot",
            content: response.data.message,
          },
        ]);

        // Send the initial message from the user to start the conversation
        await sendUserMessage("Hello! I'd like to create an ad.");
      } catch (error) {
        console.error("Error starting chat session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    startChatSession();
  }, []);

  // Function to send a user message
  const sendUserMessage = async (message) => {
    if (!sessionId) return;

    setMessages((prev) => [...prev, { id: Date.now(), role: "user", content: message }]);

    try {
      setIsLoading(true);
      const response = await axios.post("http://localhost:8000/chat/message", {
        message,
        session_id: sessionId,
      });
      console.log("Bot response:chat/msg::", response.data);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "bot",
          content: response.data.message,
        },
      ]);

      // If the response contains the '[SUFFICIENT]' keyword, fetch the results
      if (response.data.is_complete) {
        const resultResponse = await axios.get(`http://localhost:8000/results/${sessionId}`);
        console.log("Bot response:results::", resultResponse.data);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: "bot",
            content: `Final Results: ${JSON.stringify(resultResponse.data.youtube_results, null, 2)}`,
          },
        ]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Send user message
    await sendUserMessage(input);

    setInput(""); // Clear input field
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100",
        darkMode ? "dark" : ""
      )}
    >
      <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 shadow-md">
        <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400">Modern Chatbot</h1>
        <Button variant="outline" size="icon" onClick={toggleDarkMode} className="rounded-full">
          {darkMode ? (
            <Sun className="h-[1.2rem] w-[1.2rem] text-yellow-400" />
          ) : (
            <Moon className="h-[1.2rem] w-[1.2rem] text-purple-600" />
          )}
        </Button>
      </header>
      <ScrollArea className="flex-1 p-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn("flex items-start space-x-2 mb-4", m.role === "user" ? "justify-end" : "justify-start")}
          >
            {m.role !== "user" && (
              <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                <Bot size={18} />
              </div>
            )}
            <div
              className={cn(
                "max-w-[80%] rounded-lg p-3",
                m.role === "user"
                  ? "bg-purple-500 text-white"
                  : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              )}
            >
              {m.content}
            </div>
            {m.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                <User size={18} />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </ScrollArea>
      <form onSubmit={onSubmit} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-purple-500"
          />
          <Button
            type="submit"
            disabled={isLoading || input.trim() === ""}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}
