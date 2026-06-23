import api from "./api";

const chatService = {
  // Check if any admin is online
  checkAdminOnline: async () => {
    try {
      const response = await api.get("/chat/status");
      return response.data.adminOnline;
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false; // Fallback to offline/FAQ mode
    }
  },

  // Admin: Send heartbeat to backend
  sendAdminHeartbeat: async () => {
    try {
      const response = await api.post("/chat/admin/heartbeat");
      return response.data.success;
    } catch (error) {
      console.error("Error sending admin heartbeat:", error);
      return false;
    }
  },

  // Initialize or resume chat session
  initSession: async (userData) => {
    try {
      const response = await api.post("/chat/session/init", userData);
      return response.data;
    } catch (error) {
      console.error("Error initializing chat session:", error);
      throw new Error(error.response?.data?.message || "Failed to start chat session");
    }
  },

  // Retrieve chat session messages and status
  getSession: async (sessionId) => {
    try {
      const response = await api.get(`/chat/session/${sessionId}`);
      return response.data;
    } catch (error) {
      console.error(`Error loading session ${sessionId}:`, error);
      throw new Error(error.response?.data?.message || "Failed to load chat history");
    }
  },

  // Post message to session
  sendMessage: async (sessionId, messageData) => {
    try {
      const response = await api.post(`/chat/session/${sessionId}/message`, messageData);
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw new Error(error.response?.data?.message || "Failed to send message");
    }
  },

  // Admin: List all waiting or active sessions
  getAdminSessions: async () => {
    try {
      const response = await api.get("/chat/admin/sessions");
      return response.data;
    } catch (error) {
      console.error("Error loading chat sessions:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch chat requests");
    }
  },

  // Admin: Join active chat session
  joinSession: async (sessionId) => {
    try {
      const response = await api.post(`/chat/admin/session/${sessionId}/join`);
      return response.data;
    } catch (error) {
      console.error(`Error joining session ${sessionId}:`, error);
      throw new Error(error.response?.data?.message || "Failed to join session");
    }
  },

  // Admin: Close chat session
  closeSession: async (sessionId) => {
    try {
      const response = await api.post(`/chat/admin/session/${sessionId}/close`);
      return response.data;
    } catch (error) {
      console.error(`Error closing session ${sessionId}:`, error);
      throw new Error(error.response?.data?.message || "Failed to close session");
    }
  }
};

export default chatService;
