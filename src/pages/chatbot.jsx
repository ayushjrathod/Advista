import SmokeSceneComponent from "@/components/landing/SmokeScreenComponent";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Bot, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [researchBrief, setResearchBrief] = useState(null);
  const [showBriefPreview, setShowBriefPreview] = useState(false);

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
            content:
              "Hi! I'm Advista Research Assistant. I'll ask you a few quick questions to create your advertising research brief. What product or service would you like to advertise?",
          },
        ]);
        // Generate a thread id for streaming conversations
        const tid =
          typeof crypto !== "undefined" && crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        setThreadId(tid);
      } catch (error) {
        console.error("Error initializing chat:", error);
        setErrorMessage("Something went wrong while starting the chat. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, []);

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

  const fetchResearchBrief = async (tid) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/chat/research-brief/${tid}`,
        {
          credentials: "include",
        }
      );
      if (res.ok) {
        const data = await res.json();
        setResearchBrief(data);
        // Show preview if brief has any progress at all
        if (data.is_complete || data.completion_percentage > 0) {
          setShowBriefPreview(true);
        }
      }
    } catch (error) {
      console.error("Error fetching research brief:", error);
    }
  };

  const handleConfirmBrief = async () => {
    if (!researchBrief?.brief) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/chat/start-research`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ research_brief: researchBrief.brief }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            role: "bot",
            content: `✅ ${data.message} I'll now begin analyzing your product and market. This may take a few moments...`,
          },
        ]);
        setShowBriefPreview(false);
      } else {
        throw new Error("Failed to start research");
      }
    } catch (error) {
      console.error("Error starting research:", error);
      setErrorMessage("Failed to start research. Please try again.");
    }
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

      // After message is complete, fetch updated research brief
      await fetchResearchBrief(tid);
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
      <SmokeSceneComponent />

      {/* Toggle Button when brief is hidden */}
      {!showBriefPreview && researchBrief && (
        <button
          onClick={() => setShowBriefPreview(true)}
          className="fixed top-4 right-4 z-50 bg-gradient-to-br from-violet-900/60 to-zinc-800/50 backdrop-blur-sm text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-lg flex items-center gap-2 cursor-pointer"
        >
          📋 Show Brief ({Math.round(researchBrief.completion_percentage)}%)
        </button>
      )}

      {/* Fixed Floating Research Brief Summary */}
      {showBriefPreview && researchBrief && (
        <div className="fixed top-4 right-4 z-50 w-96 max-h-[80vh] overflow-y-auto">
          <div className="border border-violet-600/50 bg-gradient-to-br from-violet-950/10 to-zinc-900/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-violet-400">📋 Research Brief</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">{Math.round(researchBrief.completion_percentage)}%</span>
                <button
                  onClick={() => setShowBriefPreview(false)}
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Hide preview"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              {researchBrief.brief.product_name && (
                <div>
                  <span className="text-zinc-400 text-xs">Product:</span>
                  <p className="text-white">{researchBrief.brief.product_name}</p>
                </div>
              )}
              {researchBrief.brief.product_description && (
                <div>
                  <span className="text-zinc-400 text-xs">Description:</span>
                  <p className="text-white">{researchBrief.brief.product_description}</p>
                </div>
              )}
              {researchBrief.brief.target_audience && (
                <div>
                  <span className="text-zinc-400 text-xs">Target Audience:</span>
                  <p className="text-white">{researchBrief.brief.target_audience}</p>
                </div>
              )}
              {researchBrief.brief.campaign_goals && (
                <div>
                  <span className="text-zinc-400 text-xs">Goals:</span>
                  <p className="text-white">{researchBrief.brief.campaign_goals}</p>
                </div>
              )}
              {researchBrief.brief.competitor_names?.length > 0 && (
                <div>
                  <span className="text-zinc-400 text-xs">Competitors:</span>
                  <p className="text-white">{researchBrief.brief.competitor_names.join(", ")}</p>
                </div>
              )}
              {researchBrief.brief.budget_range && (
                <div>
                  <span className="text-zinc-400 text-xs">Budget:</span>
                  <p className="text-white">{researchBrief.brief.budget_range}</p>
                </div>
              )}
              {researchBrief.brief.preferred_platforms?.length > 0 && (
                <div>
                  <span className="text-zinc-400 text-xs">Platforms:</span>
                  <p className="text-white">{researchBrief.brief.preferred_platforms.join(", ")}</p>
                </div>
              )}
              {researchBrief.brief.tone_and_style && (
                <div>
                  <span className="text-zinc-400 text-xs">Tone & Style:</span>
                  <p className="text-white">{researchBrief.brief.tone_and_style}</p>
                </div>
              )}
              {researchBrief.brief.timeline && (
                <div>
                  <span className="text-zinc-400 text-xs">Timeline:</span>
                  <p className="text-white">{researchBrief.brief.timeline}</p>
                </div>
              )}
            </div>

            {(researchBrief.is_complete || researchBrief.completion_percentage >= 70) && (
              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={handleConfirmBrief}
                  className="w-full bg-gradient-to-br from-violet-950/35 to-zinc-900/35 text-white font-medium py-2.5 px-4 rounded-lg transition-colors shadow-lg cursor-pointer"
                >
                  ✓ Confirm & Start Research
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
