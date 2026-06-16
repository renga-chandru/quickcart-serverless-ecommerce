import api from "./api";

const ticketService = {
  submitTicket: async (ticketData) => {
    try {
      const response = await api.post("/tickets", ticketData);
      return response.data;
    } catch (error) {
      console.error("Error submitting support ticket:", error);
      throw new Error(error.response?.data?.message || "Failed to submit ticket");
    }
  },

  getMyTickets: async () => {
    try {
      const response = await api.get("/tickets/my-tickets");
      return response.data;
    } catch (error) {
      console.error("Error fetching support tickets:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch tickets");
    }
  },

  getUnreadCount: async () => {
    try {
      const response = await api.get("/tickets/unread-count");
      return response.data.count;
    } catch (error) {
      console.error("Error fetching unread support tickets count:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch unread count");
    }
  },

  markAsRead: async (ticketId) => {
    try {
      const response = await api.put(`/tickets/${ticketId}/read`);
      return response.data;
    } catch (error) {
      console.error("Error marking ticket as read:", error);
      throw new Error(error.response?.data?.message || "Failed to mark ticket as read");
    }
  },

  // Admin endpoints
  getAllTickets: async (params = {}) => {
    try {
      const response = await api.get("/tickets", { params });
      return response.data;
    } catch (error) {
      console.error("Error fetching all tickets:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch tickets");
    }
  },

  replyToTicket: async (ticketId, replyText) => {
    try {
      const response = await api.put(`/tickets/${ticketId}/reply`, { replyText });
      return response.data;
    } catch (error) {
      console.error("Error replying to ticket:", error);
      throw new Error(error.response?.data?.message || "Failed to reply to ticket");
    }
  },

  updateStatus: async (ticketId, updateFields) => {
    try {
      const body = typeof updateFields === "string" ? { status: updateFields } : updateFields;
      const response = await api.put(`/tickets/${ticketId}/status`, body);
      return response.data;
    } catch (error) {
      console.error("Error updating ticket properties:", error);
      throw new Error(error.response?.data?.message || "Failed to update ticket");
    }
  }
};

export default ticketService;
