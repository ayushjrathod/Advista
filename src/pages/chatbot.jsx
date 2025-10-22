import SmokeSceneComponent from "@/components/landing/SmokeScreenComponent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

import { Bot, Home, LogOut, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";

export default function ChatBot() {
  const { user, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const params = useParams();
  const initialMessage = searchParams.get("input") || params.initialMessage || "";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const initializationDone = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Refocus input field after sending a message
  useEffect(() => {
    if (inputRef.current && !isLoading) {
      inputRef.current.focus();
    }
  }, [messages.length, isLoading]);

  // Initialize chat session
  useEffect(() => {
    if (initializationDone.current) return;
    initializationDone.current = true;

    const initializeChat = async () => {
      try {
        setIsLoading(true);
        // Optionally: add a welcome bot message
        setMessages([
          {
            id: Date.now(),
            role: "bot",
            content: "Hi! I’m Advista Research Assistant. Please share details of your product or service?",
          },
        ]);
        // Generate a thread id for streaming conversations
        const tid =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        setThreadId(tid);

        if (initialMessage) {
          // Prefill input with the initial message but do not call the API yet
          // The API call should happen only after the user explicitly sends the first message
          setInput(initialMessage);
        }
      } catch (error) {
        console.error("Error initializing chat:", error);
        setErrorMessage("Something went wrong while starting the chat. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, [initialMessage]);

  const sendUserMessage = async (message) => {
    if (!threadId) {
      setErrorMessage("Chat not initialized. Please refresh and try again.");
      return;
    }

    // Add user message
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", content: message }]);
    setInput("");

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    setErrorMessage(null);
    await sendStreamingMessage(message, threadId);
  };

  const sendStreamingMessage = async (message, tid) => {
    try {
      setIsLoading(true);
      const botId = Date.now() + 1;

      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        credentials: "include", // Include cookies
        body: JSON.stringify({ thread_id: tid, message }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Authentication required. Please sign in to continue chatting.");
        }
        throw new Error(`Streaming request failed with status ${res.status}`);
      }

      if (!res.body) {
        throw new Error("No response body received");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let botMessageAdded = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE frames separated by double newlines
        const parts = buffer.split("\n\n");
        buffer = parts.pop() || ""; // keep last partial

        for (const part of parts) {
          const line = part.trim();
          if (!line) continue;
          // Expect lines like: "data: <chunk>"
          const prefix = "data:";
          if (line.startsWith(prefix)) {
            const chunk = line.slice(prefix.length).trim();
            if (chunk) {
              // Add bot message only when we receive the first chunk
              if (!botMessageAdded) {
                setMessages((prev) => [
                  ...prev,
                  {
                    id: botId,
                    role: "bot",
                    content: chunk,
                  },
                ]);
                botMessageAdded = true;
                setIsLoading(false); // Stop showing loading indicator
              } else {
                // Update existing bot message
                setMessages((prev) =>
                  prev.map((m) => (m.id === botId ? { ...m, content: (m.content || "") + chunk } : m))
                );
              }
            }
          }
        }
      }

      // If no content was received, ensure loading is stopped
      if (!botMessageAdded) {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Streaming error:", error);
      setErrorMessage("There was a problem streaming the response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px"; // Max height of 120px
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    await sendUserMessage(input);
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Navbar */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800">
        <Link to="/" className="flex items-center space-x-2 text-white hover:text-zinc-300">
          <Home size={20} />
          <span className="font-semibold">Advista</span>
        </Link>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-zinc-400">{user?.email}</span>
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-zinc-700 hover:bg-zinc-800 transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <SmokeSceneComponent />
      <ScrollArea className="z-10 h-screen flex-1 px-4 py-6 overflow-y-auto">
        <div className="max-w-4xl bg-gradient-to-r p-2 rounded-xl mx-auto space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn("flex items-start space-x-2 mb-4", m.role === "user" ? "justify-end" : "justify-start")}
            >
              {m.role !== "user" && (
                <div className="w-8 h-8 rounded-full border border-zinc-700/30 text-white flex items-center justify-center">
                  <Bot size={16} />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2 border backdrop-blur-sm",
                  m.role === "user"
                    ? "border-zinc-700/20 bg-gradient-to-br from-zinc-900/90 to-zinc-800/70"
                    : "border-zinc-800/20 bg-gradient-to-br from-zinc-950/90 to-zinc-900/70"
                )}
              >
                <p className="text-base leading-relaxed whitespace-pre-wrap">{m.content}</p>
              </div>
              {m.role === "user" && (
                <div className="w-8 h-8 rounded-full border border-zinc-700/30 text-white flex items-center justify-center">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-2 mb-4 justify-start">
              <div className="w-8 h-8 rounded-full border border-zinc-700/30 text-white flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="max-w-[80%] rounded-2xl px-4 py-2 border backdrop-blur-sm border-zinc-800/20 bg-gradient-to-br from-zinc-950/90 to-zinc-900/70">
                <div className="flex items-center space-x-2">
                  <p className="text-zinc-400">Bot is typing…</p>
                  <div className="flex space-x-1">
                    <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
                    <span className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.1s]"></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {errorMessage && <div className="text-red-500 text-center mt-4">{errorMessage}</div>}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="z-10 w-full">
        <form onSubmit={onSubmit} className="max-w-2xl mx-auto p-4 w-full">
          <div className="relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-xl">
            <textarea
              ref={inputRef}
              className="input bg-transparent outline-none border-none pl-4 pr-12 py-3 w-full font-sans text-md text-zinc-100 placeholder-zinc-400 resize-none min-h-[48px] max-h-[120px]"
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message..."
              disabled={isLoading}
              aria-label="Type your message"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSubmit(e);
                }
              }}
            />
            <div className="absolute right-1 bottom-1">
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-violet-600 hover:bg-violet-500 group shadow-xl flex items-center justify-center relative overflow-hidden"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
              >
                <svg
                  className="relative z-10"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 64 64"
                  height="35"
                  width="35"
                >
                  <path
                    fillOpacity="0.01"
                    fill="white"
                    d="M63.6689 29.0491L34.6198 63.6685L0.00043872 34.6194L29.0496 1.67708e-05L63.6689 29.0491Z"
                  ></path>
                  <path
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="3.76603"
                    stroke="white"
                    d="M42.8496 18.7067L21.0628 44.6712"
                  ></path>
                  <path
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    strokeWidth="3.76603"
                    stroke="white"
                    d="M26.9329 20.0992L42.85 18.7067L44.2426 34.6238"
                  ></path>
                </svg>
                <div className="w-full h-full rotate-45 absolute left-[32%] top-[32%] bg-black group-hover:-left-[100%] group-hover:-top-[100%] duration-500"></div>
                <div className="w-full h-full -rotate-45 absolute -left-[32%] -top-[32%] group-hover:left-[100%] group-hover:top-[100%] bg-black duration-500"></div>
              </button>
            </div>
          </div>
        </form>
      </div>
      {/*backGroundBeams*/}
    </div>
  );
}
