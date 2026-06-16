import Ticket from "../models/Ticket.js";

const ticketService = {
  createTicket: async (ticketData) => {
    // Generate unique Ticket ID: TKT-XXXXXX
    let ticketId = "";
    let isUnique = false;
    while (!isUnique) {
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      ticketId = `TKT-${randomNum}`;
      const existing = await Ticket.findOne({ id: ticketId });
      if (!existing) {
        isUnique = true;
      }
    }

    const ticket = new Ticket({
      id: ticketId,
      userId: ticketData.userId || "",
      userName: ticketData.userName,
      userEmail: ticketData.userEmail,
      subject: ticketData.subject || "",
      message: ticketData.message,
      priority: ticketData.priority || "Low",
      category: ticketData.category || "Other",
      status: "Unread",
      adminReply: "",
      userHasUnreadReply: false
    });

    return await ticket.save();
  },

  getTicketsForUser: async (userId) => {
    return await Ticket.find({ userId: userId.toString() }).sort({ createdAt: -1 });
  },

  getUnreadReplyCount: async (userId) => {
    return await Ticket.countDocuments({ userId: userId.toString(), userHasUnreadReply: true });
  },

  markReplyAsRead: async (ticketId, userId) => {
    const ticket = await Ticket.findOne({ id: ticketId, userId: userId.toString() });
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    ticket.userHasUnreadReply = false;
    // If ticket was Replied, mark as Read
    if (ticket.status === "Replied") {
      ticket.status = "Read";
    }
    return await ticket.save();
  },

  getAllTickets: async ({ status, search }) => {
    const query = {};
    if (status && status !== "All") {
      query.status = status;
    }
    if (search) {
      const searchRegex = new RegExp(search, "i");
      query.$or = [
        { id: searchRegex },
        { userName: searchRegex },
        { userEmail: searchRegex },
        { subject: searchRegex },
        { message: searchRegex }
      ];
    }
    return await Ticket.find(query).sort({ createdAt: -1 });
  },

  replyToTicket: async (ticketId, replyText, adminName) => {
    const ticket = await Ticket.findOne({ id: ticketId });
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    ticket.adminReply = replyText;
    ticket.adminRepliedAt = new Date();
    ticket.adminName = adminName || "Administrator";
    ticket.status = "Replied";
    ticket.userHasUnreadReply = true;
    return await ticket.save();
  },

  updateTicketStatus: async (ticketId, { status, priority, category }) => {
    const ticket = await Ticket.findOne({ id: ticketId });
    if (!ticket) {
      throw new Error("Ticket not found");
    }
    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;
    if (category) ticket.category = category;
    return await ticket.save();
  }
};

export default ticketService;
