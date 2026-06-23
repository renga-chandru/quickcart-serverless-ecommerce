import React, { useState } from "react";
import { MessageSquare, ArrowRight, User, HelpCircle } from "lucide-react";

const FAQ_DATA = [
  {
    q: "Where is my order?",
    a: "You can track your order status in your profile portal under the 'Order History' tab, or view your track progress in the Orders page directly."
  },
  {
    q: "How to cancel an order?",
    a: "To cancel an order, please request cancellation before the status updates to 'Shipped'. Go to your Orders history page or contact support if the option is locked."
  },
  {
    q: "Refund process?",
    a: "Refunds are automatically processed to your original payment method. Depending on your bank, it takes 3-5 business days to reflect in your account."
  },
  {
    q: "Delivery time?",
    a: "Standard shipping takes 3-7 business days. Express shipping takes 1-3 business days. You will receive email tracking alerts once dispatched."
  },
  {
    q: "Contact support?",
    a: "Our customer service is open Mon-Fri, 9am - 6pm EST. You can email support@quickcart.com or submit a Support Ticket in this form to open a query."
  }
];

export const FAQBot = ({ onEscalate }) => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm the QuickCart virtual assistant. Our live support team is currently offline, but I can help answer common questions. Choose one below:",
      timestamp: Date.now()
    }
  ]);

  const handleSelectQuestion = (faq) => {
    // Add user question
    const userMsg = {
      sender: "user",
      text: faq.q,
      timestamp: Date.now()
    };
    
    // Add bot response
    const botMsg = {
      sender: "bot",
      text: faq.a,
      timestamp: Date.now() + 300 // Slight delay for natural feel
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    
    // Scroll to bottom of message list
    setTimeout(() => {
      const container = document.getElementById("faq-message-container");
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 400);
  };

  return (
    <div className="flex flex-col h-[480px] bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-150 dark:border-slate-800/80 overflow-hidden font-sans">
      {/* Bot Info Header */}
      <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200/50 dark:border-slate-800 p-4 flex items-center space-x-3 text-left">
        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-655 dark:text-slate-350">
          <HelpCircle className="w-5.5 h-5.5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-white">QuickCart Bot</h4>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Automated FAQ System</p>
        </div>
      </div>

      {/* Message History area */}
      <div
        id="faq-message-container"
        className="flex-grow p-4 overflow-y-auto space-y-3 Scrollbar-thin text-left"
      >
        {messages.map((m, idx) => {
          const isBot = m.sender === "bot";
          return (
            <div
              key={idx}
              className={`flex items-start gap-2.5 max-w-[85%] ${
                isBot ? "mr-auto" : "ml-auto flex-row-reverse"
              }`}
            >
              <div
                className={`w-7.5 h-7.5 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isBot
                    ? "bg-slate-200 dark:bg-slate-850 text-slate-600 dark:text-slate-400"
                    : "bg-primary text-white dark:bg-white dark:text-slate-950"
                }`}
              >
                {isBot ? "QB" : <User className="w-4 h-4" />}
              </div>
              <div
                className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                  isBot
                    ? "bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 text-slate-700 dark:text-slate-300"
                    : "bg-primary text-white dark:bg-white dark:text-slate-950"
                }`}
              >
                <p className="whitespace-pre-line">{m.text}</p>
                <span className={`block text-[9px] mt-1 text-right ${isBot ? "text-slate-400" : "text-white/60 dark:text-slate-950/60"}`}>
                  {new Date(m.timestamp).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ suggestions panel */}
      <div className="bg-white dark:bg-slate-900 border-t border-slate-150 dark:border-slate-800/80 p-4 space-y-3.5 flex-shrink-0">
        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-left">
          Select a question to ask:
        </p>
        <div className="flex flex-wrap gap-2 text-left justify-start">
          {FAQ_DATA.map((faq, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectQuestion(faq)}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {faq.q}
            </button>
          ))}
        </div>

        {/* Ticket escalation bar */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-850/60 mt-1">
          <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Still need assistance?</span>
          <button
            onClick={onEscalate}
            className="text-xs text-primary dark:text-white font-bold flex items-center space-x-1 hover:underline hover:scale-105 active:scale-95 transition-transform"
          >
            <span>Submit a Ticket</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQBot;
