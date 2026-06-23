import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// In-memory chat storage
// sessionId -> { sessionId, user: { id, name, email }, messages: [], status: "waiting" | "active" | "closed", lastActive: timestamp }
const activeChats = {};

// Keep track of admin online heartbeats
let adminLastActive = 0;
const ADMIN_TIMEOUT = 12000; // 12 seconds

// Check admin online status
router.get("/status", (req, res) => {
  const isOnline = (Date.now() - adminLastActive) < ADMIN_TIMEOUT;
  res.json({ adminOnline: isOnline });
});

// Admin heartbeat to register online presence
// Can be called by authenticated admin
router.post("/admin/heartbeat", protect, adminOnly, (req, res) => {
  adminLastActive = Date.now();
  res.json({ success: true, adminOnline: true });
});

// Initialize or resume a chat session for a user (can be guest or logged-in)
router.post("/session/init", (req, res) => {
  const { name, email, userId } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required to start chat" });
  }

  // Look for any existing open chat session (waiting or active) for this email
  const existingSessionId = Object.keys(activeChats).find(
    (id) => activeChats[id].user.email.toLowerCase() === email.toLowerCase() && activeChats[id].status !== "closed"
  );

  if (existingSessionId) {
    activeChats[existingSessionId].lastActive = Date.now();
    return res.json(activeChats[existingSessionId]);
  }

  // Generate new session ID
  const sessionId = "session_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();

  const newSession = {
    sessionId,
    user: {
      id: userId || null,
      name,
      email,
    },
    messages: [
      {
        sender: "admin",
        text: `Hello ${name}! Welcome to QuickCart Live Support. An administrator has been notified and will be with you shortly.`,
        timestamp: Date.now(),
        name: "QuickCart Bot"
      }
    ],
    status: "waiting",
    lastActive: Date.now()
  };

  activeChats[sessionId] = newSession;
  res.json(newSession);
});

// Get session details (history, status)
router.get("/session/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  const session = activeChats[sessionId];

  if (!session) {
    return res.status(404).json({ message: "Chat session not found" });
  }

  session.lastActive = Date.now();
  res.json(session);
});

// Post a message in the session
router.post("/session/:sessionId/message", (req, res) => {
  const { sessionId } = req.params;
  const { sender, text, name } = req.body;

  if (!sender || !text) {
    return res.status(400).json({ message: "Sender and text are required" });
  }

  const session = activeChats[sessionId];
  if (!session) {
    return res.status(404).json({ message: "Chat session not found" });
  }

  const newMessage = {
    sender, // "user" | "admin"
    text,
    timestamp: Date.now(),
    name: name || (sender === "admin" ? "Administrator" : session.user.name)
  };

  session.messages.push(newMessage);
  session.lastActive = Date.now();

  res.json(session);
});

// Admin-only: Get all active / waiting chat sessions
router.get("/admin/sessions", protect, adminOnly, (req, res) => {
  // Update admin online status on this list check
  adminLastActive = Date.now();

  const sessions = Object.values(activeChats).filter(
    (s) => s.status === "waiting" || s.status === "active"
  );
  
  // Sort by last active so newest/most active show up first
  sessions.sort((a, b) => b.lastActive - a.lastActive);
  
  res.json(sessions);
});

// Admin-only: Join/accept a chat session
router.post("/admin/session/:sessionId/join", protect, adminOnly, (req, res) => {
  const { sessionId } = req.params;
  const session = activeChats[sessionId];

  if (!session) {
    return res.status(404).json({ message: "Chat session not found" });
  }

  session.status = "active";
  session.lastActive = Date.now();
  
  // Add system message that admin joined
  session.messages.push({
    sender: "admin",
    text: `${req.user.name} has joined the conversation.`,
    timestamp: Date.now(),
    name: "System"
  });

  res.json(session);
});

// Admin-only: Close a chat session
router.post("/admin/session/:sessionId/close", protect, adminOnly, (req, res) => {
  const { sessionId } = req.params;
  const session = activeChats[sessionId];

  if (!session) {
    return res.status(404).json({ message: "Chat session not found" });
  }

  session.status = "closed";
  session.lastActive = Date.now();
  
  session.messages.push({
    sender: "admin",
    text: "This chat session has been closed by the administrator.",
    timestamp: Date.now(),
    name: "System"
  });

  res.json(session);
});

export default router;
