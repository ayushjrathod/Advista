import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Bot, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export default function ChatBot() {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const initialMessage = searchParams.get("input") || params.initialMessage || "";
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [chatComplete, setChatComplete] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const messagesEndRef = useRef(null);
  const initializationDone = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

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

        const startResponse = await axios.post("/api/v1/chat/start", {});
        setSessionId(startResponse.data.session_id);

        if (initialMessage) {
          // add user message
          setMessages((prev) => [...prev, { id: Date.now(), role: "user", content: initialMessage }]);
          const response = await axios.post("/api/v1/chat/message", {
            message: initialMessage,
            session_id: startResponse.data.session_id,
          });

          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              role: "bot",
              content: response.data.message,
            },
          ]);

          if (response.data.is_complete) {
            setChatComplete(true);
            await fetchReferences(startResponse.data.session_id);
          }
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

  const fetchReferences = async (session_id) => {
    try {
      await axios.get(`/api/v1/chat/references?session_id=${session_id}`);
      // You can set state for references if needed
    } catch (error) {
      console.error("Error fetching references:", error);
      // maybe no user-facing error needed here, but you could set one if relevant
    }
  };

  const sendUserMessage = async (message) => {
    if (!sessionId) {
      setErrorMessage("Session not established. Please refresh and try again.");
      return;
    }

    // Add user message
    setMessages((prev) => [...prev, { id: Date.now(), role: "user", content: message }]);
    setInput("");
    setErrorMessage(null);
    try {
      setIsLoading(true);
      const response = await axios.post("/api/v1/chat/message", {
        message,
        session_id: sessionId,
      });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "bot",
          content: response.data.message,
        },
      ]);

      if (response.data.is_complete) {
        setChatComplete(true);
        await fetchReferences(sessionId);
        // Optionally provide a “next step” UI instead of immediate navigation
        navigate(`/dashboard?session_id=${sessionId}`);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setErrorMessage("There was a problem sending your message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    await sendUserMessage(input);
  };

  useEffect(() => {
    if (chatComplete && sessionId) {
      navigate(`/dashboard?session_id=${sessionId}`);
    }
  }, [chatComplete, sessionId, navigate]);

  return (
    <div className="flex flex-col h-screen bg-black text-white">
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

          {chatComplete && (
            <div className="text-center mt-4">
              <p>Chat is complete. Redirecting…</p>
              {/* Or optionally display a “Go to Dashboard” button instead of immediate redirect */}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="z-10 w-full">
        <form onSubmit={onSubmit} className="max-w-2xl mx-auto p-4 w-full">
          <div className="relative rounded-full overflow-hidden bg-zinc-900 border border-zinc-800 shadow-xl">
            <input
              className="input bg-transparent outline-none border-none pl-4 pr-8 py-3 w-full font-sans text-md text-zinc-100 placeholder-zinc-400"
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message..."
              disabled={isLoading || chatComplete}
              aria-label="Type your message"
            />
            <div className="absolute right-1 top-[0.2em]">
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-violet-600 hover:bg-violet-500 group shadow-xl flex items-center justify-center relative overflow-hidden"
                disabled={isLoading || !input.trim() || chatComplete}
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
