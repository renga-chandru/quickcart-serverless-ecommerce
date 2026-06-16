import ticketService from "../services/ticketService.js";
import jwt from "jsonwebtoken";

// @desc    Create a new support ticket
// @route   POST /api/tickets
// @access  Public (Optional Auth)
export const createTicket = async (req, res, next) => {
  try {
    const { name, email, subject, message, priority, category } = req.body;
    if (!name || !email || !message) {
      res.status(400);
      throw new Error("Please provide name, email, and message details");
    }

    // Optional Auth: Decode token if provided to link ticket to logged-in user
    let userId = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "quickcart-secret-key-2026");
        userId = decoded.id;
      } catch (err) {
        console.error("Optional token decode failed in ticket creation:", err.message);
      }
    }

    const ticket = await ticketService.createTicket({
      userId,
      userName: name,
      userEmail: email,
      subject,
      message,
      priority,
      category
    });

    res.status(201).json(ticket);
  } catch (error) {
    next(error);
  }
};

// @desc    Get support tickets for logged-in user
// @route   GET /api/tickets/my-tickets
// @access  Private (Customer only)
export const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await ticketService.getTicketsForUser(req.user._id);
    res.json(tickets);
  } catch (error) {
    next(error);
  }
};

// @desc    Get count of unread admin replies for logged-in user
// @route   GET /api/tickets/unread-count
// @access  Private (Customer only)
export const getUnreadReplyCount = async (req, res, next) => {
  try {
    const count = await ticketService.getUnreadReplyCount(req.user._id);
    res.json({ count });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark admin reply as read
// @route   PUT /api/tickets/:id/read
// @access  Private (Customer only)
export const markReplyAsRead = async (req, res, next) => {
  try {
    const ticketId = req.params.id;
    const ticket = await ticketService.markReplyAsRead(ticketId, req.user._id);
    res.json(ticket);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all support tickets (search & filter)
// @route   GET /api/tickets
// @access  Private (Admin only)
export const getAllTickets = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const tickets = await ticketService.getAllTickets({ status, search });
    res.json(tickets);
  } catch (error) {
    next(error);
  }
};

// @desc    Reply to a customer ticket
// @route   PUT /api/tickets/:id/reply
// @access  Private (Admin only)
export const replyToTicket = async (req, res, next) => {
  try {
    const ticketId = req.params.id;
    const { replyText } = req.body;
    if (!replyText || !replyText.trim()) {
      res.status(400);
      throw new Error("Reply content is required");
    }
    const ticket = await ticketService.replyToTicket(ticketId, replyText, req.user.name);
    res.json(ticket);
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket status
// @route   PUT /api/tickets/:id/status
// @access  Private (Admin only)
export const updateTicketStatus = async (req, res, next) => {
  try {
    const ticketId = req.params.id;
    const { status, priority, category } = req.body;
    if (!status && !priority && !category) {
      res.status(400);
      throw new Error("Please provide fields to update (status, priority, category)");
    }
    const ticket = await ticketService.updateTicketStatus(ticketId, { status, priority, category });
    res.json(ticket);
  } catch (error) {
    next(error);
  }
};
