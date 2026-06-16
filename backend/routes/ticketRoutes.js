import express from "express";
import {
  createTicket,
  getMyTickets,
  getUnreadReplyCount,
  markReplyAsRead,
  getAllTickets,
  replyToTicket,
  updateTicketStatus
} from "../controllers/ticketController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer & Public operations
router.post("/", createTicket); // Public / Optional Auth (processed inside controller)
router.get("/my-tickets", protect, getMyTickets);
router.get("/unread-count", protect, getUnreadReplyCount);
router.put("/:id/read", protect, markReplyAsRead);

// Administrative operations
router.get("/", protect, adminOnly, getAllTickets);
router.put("/:id/reply", protect, adminOnly, replyToTicket);
router.put("/:id/status", protect, adminOnly, updateTicketStatus);

export default router;
