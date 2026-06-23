import React, { useState, useEffect, useRef } from "react";
import { Send, User, MessageCircle, AlertCircle, Circle } from "lucide-react";
import chatService from "../../services/chatService";

export const ChatWindow = ({ name, email, userId }) => {
  const [session, setSession] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const pollingRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize or fetch the session on mount
  useEffect(() => {
    const initChat = async () => {
      setLoading(true);
      setError("");
      try {
        const ses = await chatService.initSession({ name, email, userId });
        setSession(ses);
      } catch (err) {
        console.error("Error starting chat:", err);
        setError("Failed to connect to live support. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    initChat();

    // Clean up interval on unmount
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [name, email, userId]);

  // Start polling when session is established
  useEffect(() => {
    if (!session || !session.sessionId) return;

    // Clear previous if any
    if (pollingRef.current) clearInterval(pollingRef.current);

    const pollSession = async () => {
      try {
        const updated = await chatService.getSession(session.sessionId);
        setSession(updated);
      } catch (err) {
        console.error("Error polling chat messages:", err);
      }
    };

    // Poll every 1.5 seconds
    pollingRef.current = setInterval(pollSession, 1500);

    return () => clearInterval(pollingRef.current);
  }, [session?.sessionId]);

  // Scroll to bottom when messages list updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [session?.messages?.length]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !session || sending) return;

    const messageText = text;
    setText("");
    setSending(true);

    try {
      const updated = await chatService.sendMessage(session.sessionId, {
        sender: "user",
        text: messageText,
        name: name
      });
      setSession(updated);
    } catch (err) {
      console.error("Failed to send message:", err);
      setError("Failed to send message. Please retry.");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[480px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-sm text-slate-400 font-semibold mt-3">Connecting to Live Support...</p>
      </div>
    );
  }

  if (error && !session) {
    return (
      <div className="flex flex-col items-center justify-center h-[480px] bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-sm text-slate-600 dark:text-slate-400 font-semibold">{error}</p>
      </div>
    );
  }

  const isClosed = session?.status === "closed";
  const isWaiting = session?.status === "waiting";

  return (
    <div className="flex flex-col h-[480px] bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-150 dark:border-slate-800/80 overflow-hidden font-sans">
      {/* Session Connection Header */}
      <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800 p-4 flex items-center justify-between text-left flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <MessageCircle className="w-5.5 h-5.5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800 dark:text-white">Live Customer Chat</h4>
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Session ID: {session?.sessionId.slice(-6)}</p>
          </div>
        </div>

        {/* Live Status indicator */}
        <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-850 px-2.5 py-1 rounded-full border border-slate-200/30 dark:border-slate-800">
          <Circle className={`w-2 h-2 fill-current ${isClosed ? "text-slate-400" : isWaiting ? "text-amber-500 animate-pulse" : "text-emerald-500"}`} />
          <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300 capitalize">
            {isClosed ? "Closed" : isWaiting ? "Queue" : "Connected"}
          </span>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-grow p-4 overflow-y-auto space-y-4 Scrollbar-thin text-left">
        {/* Waiting status warning banner */}
        {isWaiting && (
          <div className="bg-amber-500/10 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200/30 p-3 rounded-xl text-xs text-center font-medium">
            Waiting for an administrator to join the chat...
          </div>
        )}

        {session?.messages.map((m, idx) => {
          const isUser = m.sender === "user";
          const isSystem = m.name === "System";
          
          if (isSystem) {
            return (
              <div key={idx} className="text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest my-2">
                — {m.text} —
              </div>
            );
          }

          return (
            <div
              key={idx}
              className={`flex items-start gap-2.5 max-w-[85%] ${
                isUser ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              <div
                className={`w-7.5 h-7.5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isUser
                    ? "bg-primary text-white dark:bg-white dark:text-slate-950"
                    : "bg-slate-200 dark:bg-slate-850 text-slate-600 dark:text-slate-400"
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : "AD"}
              </div>
              <div
                className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                  isUser
                    ? "bg-primary text-white dark:bg-white dark:text-slate-950"
                    : "bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 text-slate-700 dark:text-slate-300"
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <span className={`block text-[9px] mt-1 text-right ${isUser ? "text-white/60 dark:text-slate-950/60" : "text-slate-400"}`}>
                  {new Date(m.timestamp).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input controls form */}
      <form
        onSubmit={handleSend}
        className="bg-white dark:bg-slate-900 border-t border-slate-150 dark:border-slate-800/80 p-3 flex items-center gap-2.5 flex-shrink-0"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isClosed ? "This session has been closed" : "Type message details..."}
          disabled={isClosed}
          className="flex-grow px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-sans rounded-xl text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          required
        />
        <button
          type="submit"
          disabled={isClosed || !text.trim() || sending}
          className="p-3 bg-primary hover:bg-primary-dark text-white dark:bg-black dark:text-white dark:border dark:border-white/20 dark:hover:bg-neutral-900/50 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed flex-shrink-0"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
