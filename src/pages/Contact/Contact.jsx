import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, Check, MessageSquare } from "lucide-react";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import { useAuth } from "../../context/AuthContext";
import ticketService from "../../services/ticketService";
import chatService from "../../services/chatService";
import Modal from "../../components/Modal/Modal";
import FAQBot from "../../components/FAQBot/FAQBot";
import ChatWindow from "../../components/ChatWindow/ChatWindow";

export const Contact = () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("Other");
  const [priority, setPriority] = useState("Low");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [createdTicketId, setCreatedTicketId] = useState("");

  // Chat States
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [adminOnline, setAdminOnline] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);

  // Auto-fill logged in user info
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleLiveSupportClick = async () => {
    if (!name.trim() || !email.trim()) {
      setSubmitError("Please enter your name and email address to start Live Support.");
      return;
    }

    setSubmitError("");
    setCheckingStatus(true);
    try {
      const online = await chatService.checkAdminOnline();
      setAdminOnline(online);
      setIsChatModalOpen(true);
    } catch (err) {
      console.error("Live status check error:", err);
      setSubmitError("Unable to connect to live support server. Please try again.");
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitting(true);
      setSubmitError("");
      try {
        const ticket = await ticketService.submitTicket({
          name,
          email,
          subject,
          message,
          category,
          priority
        });
        setCreatedTicketId(ticket.id);
        setSubmitted(true);
        setSubject("");
        setMessage("");
        setCategory("Other");
        setPriority("Low");
        // Reset name/email only if guest
        if (!user) {
          setName("");
          setEmail("");
        }
        setTimeout(() => setSubmitted(false), 8000);
      } catch (err) {
        setSubmitError(err.message || "Failed to submit support ticket. Please try again.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const contactInfos = [
    { icon: Phone, title: "Support Phone", value: "+91 98765 43210", desc: "Monday – Saturday, 9:00 AM – 6:00 PM" },
    { icon: Mail, title: "Email Address", value: "support@quickcart.in", desc: "Average response within 2 hours" },
    { icon: MapPin, title: "Headquarters", value: "Coimbatore, Tamil Nadu, India", desc: "123, Avinashi Road, Coimbatore - 641018" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-sans text-slate-900 dark:text-white tracking-tight">
          Get in Touch
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          Have questions about orders, payments, or your shopping experience? Our friendly support team is here to help!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-left">
        
        {/* Left: Contact info cards (Col 1) */}
        <div className="lg:col-span-1 space-y-6">
          {contactInfos.map((info, idx) => {
            const InfoIcon = info.icon;
            return (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-3xl shadow-sm flex items-start space-x-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <InfoIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-base">{info.title}</h4>
                  <p className="text-sm font-bold text-primary mt-1 font-sans">{info.value}</p>
                  <p className="text-xs text-slate-405 dark:text-slate-500 mt-0.5">{info.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Contact Form (Col 2) */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-[32px] p-6 sm:p-10 shadow-sm space-y-6">
            <h3 className="text-xl font-bold font-sans text-slate-900 dark:text-white">
              Send us a Message
            </h3>
            
            {submitted && (
              <div className="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-450 p-4 rounded-xl border border-emerald-250 dark:border-emerald-950/40 text-xs font-semibold flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Message received! Your Support Ticket ID is: <strong className="underline font-bold font-sans text-sm">{createdTicketId}</strong>. You can track this in your profile portal.</span>
              </div>
            )}

            {submitError && (
              <div className="bg-red-550/10 text-red-650 dark:bg-red-950/30 dark:text-red-400 p-4 rounded-xl border border-red-200 dark:border-red-950/40 text-xs font-semibold flex items-center space-x-2">
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  required
                  disabled={!!user}
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. priya@example.com"
                  required
                  disabled={!!user}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1.5 text-left">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-305 font-sans">
                    Inquiry Category
                  </label>
                  <select
                    id="inquiry-category-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-sans"
                    disabled={submitting}
                  >
                    <option value="Complaint">Complaint</option>
                    <option value="Feedback">Feedback</option>
                    <option value="Order Issue">Order Issue</option>
                    <option value="Payment Issue">Payment Issue</option>
                    <option value="Delivery Issue">Delivery Issue</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col space-y-1.5 text-left">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-305 font-sans">
                    Ticket Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-sans"
                    disabled={submitting}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <Input
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Inquiry regarding order ORD-928"
              />

              <div className="flex flex-col space-y-1.5 w-full text-left">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Message Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message-details-textarea"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type details of your inquiry..."
                  rows="5"
                  className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-905 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-sans disabled:opacity-60 disabled:bg-slate-50 dark:disabled:bg-slate-900/50"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleLiveSupportClick}
                  disabled={checkingStatus}
                  className={`px-6 py-2.5 font-bold rounded-xl text-sm transition-all flex items-center justify-center space-x-2 border shadow-sm ${
                    checkingStatus
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-450 dark:text-slate-500 border-slate-200/50 dark:border-slate-800 cursor-not-allowed"
                      : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200/50 dark:border-slate-800 hover:-translate-y-0.5"
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span>{checkingStatus ? "Checking Status..." : "Live Support"}</span>
                </button>
                <Button
                  type="submit"
                  icon={Send}
                  className="px-6"
                  isLoading={submitting}
                >
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </div>

      </div>

      {/* Support Chat Modal (Loaded inline inside support page) */}
      <Modal
        isOpen={isChatModalOpen}
        onClose={() => setIsChatModalOpen(false)}
        title={adminOnline ? "Live Support Chat" : "Automated Help Bot"}
        size="md"
      >
        {adminOnline ? (
          <ChatWindow
            name={name}
            email={email}
            userId={user?.id || user?._id || null}
          />
        ) : (
          <FAQBot
            onEscalate={() => {
              setIsChatModalOpen(false);
              // Smoothly focus on Category input
              setTimeout(() => {
                const categoryEl = document.getElementById("inquiry-category-select");
                const messageEl = document.getElementById("message-details-textarea");
                
                if (categoryEl) {
                  categoryEl.focus();
                  categoryEl.scrollIntoView({ behavior: "smooth", block: "center" });
                }
                
                if (messageEl) {
                  messageEl.placeholder = "Please type details of your inquiry here to submit a support ticket...";
                }
              }, 300);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Contact;
