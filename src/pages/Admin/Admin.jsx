import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  TrendingUp,
  Users,
  Layers,
  Settings,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  Check,
  ChevronRight,
  Eye,
  LogOut,
  Sparkles,
  MessageSquare,
  Search
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import productService from "../../services/productService";
import orderService from "../../services/orderService";
import ticketService from "../../services/ticketService";
import chatService from "../../services/chatService";
import { PRODUCTS, CATEGORIES } from "../../constants/data";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

// Mock Analytical Data
const SALES_DATA = [
  { month: "Jan", revenue: 8400, orders: 120 },
  { month: "Feb", revenue: 9200, orders: 150 },
  { month: "Mar", revenue: 11400, orders: 210 },
  { month: "Apr", revenue: 9800, orders: 180 },
  { month: "May", revenue: 13500, orders: 310 },
  { month: "Jun", revenue: 14890, orders: 420 },
];

const CATEGORY_DISTRIBUTION = [
  { name: "Electronics", sales: 240 },
  { name: "Fashion", sales: 180 },
  { name: "Home", sales: 120 },
  { name: "Sports", sales: 90 },
  { name: "Grocery", sales: 150 },
];

const getPaymentMethodDisplay = (method) => {
  if (!method) return "Not found";
  const m = method.toLowerCase();
  if (m.includes("card")) return "Card";
  if (m.includes("upi")) return "UPI";
  if (m.includes("net banking") || m.includes("banking")) return "Net Banking";
  if (m.includes("delivery") || m.includes("cash") || m.includes("cod")) return "Cash on Delivery";
  return method;
};

export const Admin = () => {
  const { user, isAdmin, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Route protection
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (!isAdmin) {
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // Sidebar Menu states
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'products' | 'categories' | 'orders' | 'users' | 'settings' | 'support'

  // Support Live Chat states
  const [adminChatOnline, setAdminChatOnline] = useState(false);
  const [chatSessions, setChatSessions] = useState([]);
  const [activeAdminChatSession, setActiveAdminChatSession] = useState(null);
  const [adminChatText, setAdminChatText] = useState("");
  const [sendingAdminMessage, setSendingAdminMessage] = useState(false);

  // Polling Heartbeat
  useEffect(() => {
    if (!adminChatOnline) return;

    const sendHeartbeat = async () => {
      try {
        await chatService.sendAdminHeartbeat();
      } catch (err) {
        console.error("Heartbeat error:", err);
      }
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 4000);
    return () => clearInterval(interval);
  }, [adminChatOnline]);

  // Polling Active Chat Sessions List
  useEffect(() => {
    if (!adminChatOnline || activeTab !== "support") {
      setChatSessions([]);
      return;
    }

    const loadSessions = async () => {
      try {
        const sessions = await chatService.getAdminSessions();
        setChatSessions(sessions);
      } catch (err) {
        console.error("Load chat sessions error:", err);
      }
    };

    loadSessions();
    const interval = setInterval(loadSessions, 2000);
    return () => clearInterval(interval);
  }, [adminChatOnline, activeTab]);

  // Polling current open chat details
  useEffect(() => {
    if (!activeAdminChatSession) return;

    const loadSessionDetails = async () => {
      try {
        const updated = await chatService.getSession(activeAdminChatSession.sessionId);
        
        // If the session status changed to closed and we are checking details,
        // update the state, but don't force clear it unless admin wants to close it.
        setActiveAdminChatSession(updated);
      } catch (err) {
        console.error("Load active chat session details error:", err);
      }
    };

    const interval = setInterval(loadSessionDetails, 1500);
    return () => clearInterval(interval);
  }, [activeAdminChatSession?.sessionId]);

  const handleJoinChat = async (sessionId) => {
    try {
      const updated = await chatService.joinSession(sessionId);
      setActiveAdminChatSession(updated);
    } catch (err) {
      console.error("Failed to join chat session:", err);
      alert(err.message || "Failed to join chat");
    }
  };

  const handleCloseChat = async (sessionId) => {
    if (!window.confirm("Are you sure you want to end this live chat session?")) return;
    try {
      await chatService.closeSession(sessionId);
      if (activeAdminChatSession && activeAdminChatSession.sessionId === sessionId) {
        setActiveAdminChatSession(null);
      }
      // Refresh session list immediately
      const sessions = await chatService.getAdminSessions();
      setChatSessions(sessions);
    } catch (err) {
      console.error("Failed to close session:", err);
      alert(err.message || "Failed to close session");
    }
  };

  const handleSendAdminMessage = async (e) => {
    e.preventDefault();
    if (!adminChatText.trim() || !activeAdminChatSession || sendingAdminMessage) return;

    const textToSend = adminChatText;
    setAdminChatText("");
    setSendingAdminMessage(true);

    try {
      const updated = await chatService.sendMessage(activeAdminChatSession.sessionId, {
        sender: "admin",
        text: textToSend,
        name: user.name
      });
      setActiveAdminChatSession(updated);
    } catch (err) {
      console.error("Failed to send admin reply message:", err);
      alert("Failed to send message.");
    } finally {
      setSendingAdminMessage(false);
    }
  };

  // Admin Data states
  const [productList, setProductList] = useState([]);
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Support Tickets states
  const [supportTickets, setSupportTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [ticketSearch, setTicketSearch] = useState("");
  const [ticketStatusFilter, setTicketStatusFilter] = useState("All");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [adminReplyText, setAdminReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  // CRUD Product Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Product Form states
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    discount: "0",
    category: "Electronics",
    stock: "10",
    description: "",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d35e?q=80&w=600&auto=format&fit=crop"
  });

  // Fetch admin products and orders
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const prodsResult = await productService.getProducts({ limit: 100 });
      setProductList(prodsResult.products);

      const orders = await orderService.getAllOrders();
      setOrderList(orders);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSupportTickets = async () => {
    setLoadingTickets(true);
    try {
      const tickets = await ticketService.getAllTickets({
        status: ticketStatusFilter,
        search: ticketSearch
      });
      setSupportTickets(tickets);
    } catch (err) {
      console.error("Error loading support tickets:", err);
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAdminData();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (isAdmin && activeTab === "support") {
      fetchSupportTickets();
    }
  }, [isAdmin, activeTab, ticketStatusFilter]);

  const handleOpenTicket = async (ticket) => {
    setSelectedTicket(ticket);
    setAdminReplyText(ticket.adminReply || "");
    setIsTicketModalOpen(true);
    if (ticket.status === "Unread") {
      try {
        const updated = await ticketService.updateStatus(ticket.id, "Read");
        setSupportTickets(prev => prev.map(t => t.id === ticket.id ? updated : t));
      } catch (err) {
        console.error("Failed to mark ticket as read:", err);
      }
    }
  };

  const handleSaveReply = async (e) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !selectedTicket) return;
    setIsReplying(true);
    try {
      const updated = await ticketService.replyToTicket(selectedTicket.id, adminReplyText);
      setSupportTickets(prev => prev.map(t => t.id === selectedTicket.id ? updated : t));
      setIsTicketModalOpen(false);
      setSelectedTicket(null);
      setAdminReplyText("");
      alert("Reply saved successfully!");
    } catch (err) {
      console.error("Failed to reply to ticket:", err);
      alert(err.message || "Failed to save reply");
    } finally {
      setIsReplying(false);
    }
  };

  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    try {
      const updated = await ticketService.updateStatus(ticketId, newStatus);
      setSupportTickets(prev => prev.map(t => t.id === ticketId ? updated : t));
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket(updated);
      }
    } catch (err) {
      console.error("Failed to update ticket status:", err);
      alert("Failed to update ticket status");
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      await loadAdminData();
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  // CRUD Products handlers using productService
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    const newProd = {
      name: productForm.name,
      price: parseFloat(productForm.price),
      discount: parseInt(productForm.discount),
      category: productForm.category,
      stock: parseInt(productForm.stock),
      description: productForm.description,
      images: [productForm.image],
      rating: 4.5,
      reviews: []
    };

    try {
      await productService.createProduct(newProd);
      setIsAddModalOpen(false);
      
      // Reset Form
      setProductForm({
        name: "",
        price: "",
        discount: "0",
        category: "Electronics",
        stock: "10",
        description: "",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d35e?q=80&w=600&auto=format&fit=crop"
      });
      
      await loadAdminData();
    } catch (err) {
      console.error("Failed to create product:", err);
      alert(err.message || "Failed to create product");
    }
  };

  const handleEditProductClick = (prod) => {
    setSelectedProduct(prod);
    setProductForm({
      name: prod.name,
      price: prod.price.toString(),
      discount: (prod.discount || 0).toString(),
      category: prod.category,
      stock: prod.stock.toString(),
      description: prod.description,
      image: prod.images?.[0] || prod.image || ""
    });
    setIsEditModalOpen(true);
  };

  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    const updatedData = {
      name: productForm.name,
      price: parseFloat(productForm.price),
      discount: parseInt(productForm.discount),
      category: productForm.category,
      stock: parseInt(productForm.stock),
      description: productForm.description,
      images: [productForm.image]
    };

    try {
      await productService.updateProduct(selectedProduct.id, updatedData);
      setIsEditModalOpen(false);
      setSelectedProduct(null);
      await loadAdminData();
    } catch (err) {
      console.error("Failed to update product:", err);
      alert(err.message || "Failed to update product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product listing?")) {
      try {
        await productService.deleteProduct(id);
        await loadAdminData();
      } catch (err) {
        console.error("Failed to delete product:", err);
        alert(err.message || "Failed to delete product");
      }
    }
  };

  const handleLogoutClick = async () => {
    await logout();
    navigate("/");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "products", label: "Manage Products", icon: ShoppingBag },
    { id: "categories", label: "Category Analytics", icon: Layers },
    { id: "orders", label: "Manage Orders", icon: Layers },
    { id: "support", label: "Customer Messages", icon: MessageSquare },
    { id: "users", label: "Customers", icon: Users },
    { id: "settings", label: "Admin Settings", icon: Settings }
  ];

  if (!user || !isAdmin) return null;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 overflow-hidden font-sans transition-colors">

      {/* 1. ADMIN SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200/50 dark:border-slate-850 justify-between py-6 px-4 flex-shrink-0">
        <div className="space-y-8 text-left">
          {/* Logo */}
          <div className="flex items-center space-x-2 px-2">
            <span className="w-8 h-8 rounded-lg bg-primary dark:bg-white flex items-center justify-center text-white dark:text-black font-extrabold text-lg shadow-sm">
              Q
            </span>
            <span className="text-xl font-bold tracking-tight text-gradient-primary">
              Admin Portal
            </span>
          </div>

          {/* Menus */}
          <div className="space-y-1">
            {menuItems.map((item) => {
              const MenuIcon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${isActive
                    ? "bg-primary dark:bg-white text-white dark:text-black shadow-md shadow-primary/10 dark:shadow-none"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:text-slate-800 dark:hover:text-white"
                    }`}
                >
                  <MenuIcon className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Admin profiles & sign out */}
        <div className="border-t border-slate-100 dark:border-slate-850 pt-4 space-y-3">
          <div className="flex items-center space-x-3 px-2 text-left">
            <img src={user.avatar} alt="" className="w-10 h-10 rounded-full border border-primary/20" />
            <div className="min-w-0 flex-grow">
              <p className="text-sm font-bold truncate text-slate-800 dark:text-white">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">Portal Administrator</p>
            </div>
          </div>

          <button
            onClick={handleLogoutClick}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-bold text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
          >
            <LogOut className="w-4.5 h-4.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN ADMIN CONTENT WRAPPER */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header toolbar */}
        <header className="sticky top-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-850 py-4 px-6 sm:px-8 z-30 flex justify-between items-center text-left">
          <div className="md:hidden flex items-center space-x-3">
            {/* Small screen mobile logo */}
            <span className="w-7 h-7 rounded-md bg-primary dark:bg-white flex items-center justify-center text-white dark:text-black font-black text-sm">
              Q
            </span>
            <span className="text-lg font-bold tracking-tight text-gradient-primary">
              Admin Portal
            </span>
          </div>

          <div className="hidden md:block">
            <h2 className="text-xl font-bold font-sans text-slate-805 dark:text-white capitalize">
              {activeTab} Overview
            </h2>
          </div>

          {/* Quick links to shop */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-1.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              View Shop Frontend
            </button>
          </div>
        </header>

        {/* Tab contents pane */}
        <div className="p-6 sm:p-8 space-y-8">

          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Stat widgets cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                {/* Revenue card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">Total Revenue</span>
                    <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white font-sans">$14,890.00</h3>
                    <p className="text-xs text-emerald-500 font-bold mt-1">+12% from last month</p>
                  </div>
                </div>

                {/* Orders card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-455 dark:text-slate-500 font-bold uppercase tracking-wider">Completed Orders</span>
                    <div className="p-2 bg-primary/10 text-primary rounded-lg">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white font-sans">420</h3>
                    <p className="text-xs text-primary font-bold mt-1">+8% from last week</p>
                  </div>
                </div>

                {/* Visitors card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">Site Visitors</span>
                    <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white font-sans">12,450</h3>
                    <p className="text-xs text-secondary font-bold mt-1">+22% from last week</p>
                  </div>
                </div>

                {/* Products card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-450 dark:text-slate-500 font-bold uppercase tracking-wider">Catalog Products</span>
                    <div className="p-2 bg-purple-500/10 text-purple-500 rounded-lg">
                      <Sparkles className="w-5 h-5" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white font-sans">{productList.length} Active</h3>
                    <p className="text-xs text-slate-400 font-bold mt-1">1 product out of stock</p>
                  </div>
                </div>
              </div>

              {/* Analytical Charts grids */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue chart (Col span 2) */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-3xl shadow-sm text-left">
                  <h4 className="text-base font-bold text-slate-800 dark:text-white mb-6 font-sans">Monthly Revenue Performance ($)</h4>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={SALES_DATA}>
                        <defs>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--chart-stroke-1)" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="var(--chart-stroke-1)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                        <XAxis dataKey="month" stroke="var(--slate-400)" fontSize={11} tickLine={false} />
                        <YAxis stroke="var(--slate-400)" fontSize={11} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Area type="monotone" dataKey="revenue" stroke="var(--chart-stroke-1)" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Category distributions bar chart (Col span 1) */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-3xl shadow-sm text-left">
                  <h4 className="text-base font-bold text-slate-800 dark:text-white mb-6 font-sans">Sales by Category</h4>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={CATEGORY_DISTRIBUTION}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                        <XAxis dataKey="name" stroke="var(--slate-400)" fontSize={10} tickLine={false} />
                        <YAxis stroke="var(--slate-400)" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip />
                        <Bar dataKey="sales" fill="var(--chart-stroke-2)" radius={[6, 6, 0, 0]} name="Orders" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Recent Orders Overview table */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm text-left overflow-x-auto">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-850 mb-6">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white font-sans">Recent Order History</h3>
                  <button onClick={() => setActiveTab("orders")} className="text-xs text-primary hover:underline font-bold">
                    Manage All Orders &rarr;
                  </button>
                </div>

                <table className="w-full text-sm font-sans divide-y divide-slate-100 dark:divide-slate-850">
                  <thead>
                    <tr className="text-xs text-slate-400 font-bold uppercase tracking-wider text-left pb-3">
                      <th className="py-3">Order ID</th>
                      <th className="py-3">Date</th>
                      <th className="py-3">Status</th>
                      <th className="py-3">Total</th>
                      <th className="py-3 text-right">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-300">
                    {orderList.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                        <td className="py-3.5 font-bold text-slate-800 dark:text-white">{ord.id}</td>
                        <td className="py-3.5">{ord.date}</td>
                        <td className="py-3.5">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${ord.status === "Delivered" ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
                            }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3.5 font-bold text-slate-800 dark:text-white">${ord.summary.total.toFixed(2)}</td>
                        <td className="py-3.5 text-right font-medium">{ord.paymentMethod}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCT CATALOGUE CRUD MANAGER */}
          {activeTab === "products" && (
            <div className="space-y-6 text-left">
              <div className="flex justify-between items-center pb-4 border-b border-slate-200/50 dark:border-slate-850">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white font-sans">Manage Products</h3>
                  <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">Create, edit, or delete listings in the catalog</p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-4 py-2 bg-primary dark:bg-black hover:bg-primary-dark dark:hover:bg-neutral-900/50 text-white dark:text-white dark:border dark:border-white rounded-xl text-sm font-bold flex items-center shadow-md shadow-primary/10 dark:shadow-none hover:shadow-primary/20"
                >
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add Product
                </button>
              </div>

              {/* Table listings */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm divide-y divide-slate-100 dark:divide-slate-850 text-left font-sans">
                  <thead>
                    <tr className="text-xs text-slate-400 font-bold uppercase tracking-wider p-4 border-b">
                      <th className="p-4">Item Details</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Discount</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 dark:divide-slate-850 text-slate-700 dark:text-slate-300">
                    {productList.map((prod) => (
                      <tr key={prod.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/40">
                        <td className="p-4 flex items-center space-x-3">
                          <img
                            src={prod.images?.[0] || prod.image}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover bg-slate-105"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-slate-850 dark:text-white truncate max-w-[200px]">{prod.name}</p>
                            <p className="text-xs text-slate-400">ID: {prod.id}</p>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">{prod.category}</td>
                        <td className="p-4 font-extrabold text-slate-850 dark:text-white">${prod.price.toFixed(2)}</td>
                        <td className="p-4 font-bold text-red-500">{prod.discount || 0}% OFF</td>
                        <td className="p-4 font-semibold">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${prod.stock <= 0 ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"
                            }`}>
                            {prod.stock} Units
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => handleEditProductClick(prod)}
                              className="p-1.5 rounded-lg border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-primary transition-colors"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-1.5 rounded-lg border hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-550 hover:text-red-500 transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CATEGORY ANALYTICS */}
          {activeTab === "categories" && (
            <div className="space-y-6 text-left">
              <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white font-sans">Category Analytics</h3>
                <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">Review category distribution counts</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {CATEGORIES.map((cat) => (
                  <div key={cat.id} className="bg-white dark:bg-slate-900 border p-5 rounded-3xl flex items-center space-x-4 shadow-sm">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                      <Layers className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white">{cat.name}</h4>
                      <p className="text-xs text-slate-400 mt-1">{cat.count} Products Indexed</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: MANAGE ORDERS STATUS ENABLER */}
          {activeTab === "orders" && (
            <div className="space-y-6 text-left">
              <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white font-sans">Manage Customer Orders</h3>
                <p className="text-xs text-slate-450 dark:text-slate-550 mt-1">Audit transactions and update shipping statuses</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm divide-y divide-slate-100 dark:divide-slate-850 font-sans">
                  <thead>
                    <tr className="text-xs text-slate-400 font-bold uppercase tracking-wider p-4 border-b">
                      <th className="p-4">Order Ref</th>
                      <th className="p-4">Customer Details</th>
                      <th className="p-4">Items Count</th>
                      <th className="p-4">Total Price</th>
                      <th className="p-4">Payment Method</th>
                      <th className="p-4">Payment Status</th>
                      <th className="p-4">Active Status</th>
                      <th className="p-4 text-center">Status Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-350">
                    {orderList.map((ord) => {
                      const count = ord.items.reduce((acc, it) => acc + it.quantity, 0);
                      return (
                        <tr key={ord.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50">
                          <td className="p-4 font-bold text-slate-900 dark:text-white">{ord.id}</td>
                          <td className="p-4">
                            <p className="font-bold text-slate-800 dark:text-white">{ord.shippingAddress.name}</p>
                            <p className="text-xs text-slate-400">{ord.shippingAddress.city}, {ord.shippingAddress.state}</p>
                          </td>
                          <td className="p-4 font-semibold">{count} Items</td>
                          <td className="p-4 font-extrabold text-slate-900 dark:text-white">${ord.summary.total.toFixed(2)}</td>
                          <td className="p-4 font-semibold text-slate-800 dark:text-white">{getPaymentMethodDisplay(ord.paymentMethod)}</td>
                          <td className="p-4">
                            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500">
                              Paid
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${ord.status === "Delivered" ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary animate-pulse"
                              }`}>
                              {ord.status}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <select
                              value={ord.status}
                              onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                              className="px-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-xs font-bold text-slate-700 dark:text-slate-300"
                            >
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: USERS LISTINGS */}
          {activeTab === "users" && (
            <div className="space-y-6 text-left font-sans">
              <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white font-sans">Registered Customers</h3>
                <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">Manage portal member access</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-150 p-5 rounded-3xl flex items-center space-x-3 shadow-sm">
                  <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop" alt="" className="w-12 h-12 rounded-full" />
                  <div>
                    <h4 className="font-bold text-slate-805 dark:text-white">John Doe</h4>
                    <p className="text-xs text-slate-400">user@quickcart.com &bull; Customer Account</p>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-150 p-5 rounded-3xl flex items-center space-x-3 shadow-sm">
                  <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop" alt="" className="w-12 h-12 rounded-full" />
                  <div>
                    <h4 className="font-bold text-slate-805 dark:text-white">Admin User</h4>
                    <p className="text-xs text-slate-405">admin@quickcart.com &bull; Super Administrator</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: ADMIN SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6 text-left font-sans">
              <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
                <h3 className="text-xl font-bold text-slate-805 dark:text-white font-sans">Portal Configuration</h3>
                <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">Configure backend endpoints and credentials</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border p-6 rounded-3xl space-y-4">
                <Input
                  label="VITE_API_URL Endpoint"
                  value={import.meta.env.VITE_API_URL}
                  disabled
                />
                <span className="text-[10px] text-slate-450 font-bold block">
                  This values maps to AWS Cloud instances later. To connect DynamoDB/Lambda simply edit the config file.
                </span>
              </div>
            </div>
          )}

          {/* TAB 7: SUPPORT TICKETS & MESSAGES */}
          {activeTab === "support" && (
            <div className="space-y-6 text-left font-sans">
              
              {/* LIVE SUPPORT CHAT HEADER & TOGGLE */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-left">
                  <h4 className="text-lg font-bold text-slate-800 dark:text-white font-sans flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <span>Live Customer Support Chat</span>
                  </h4>
                  <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">Accept incoming user chat requests in real-time</p>
                </div>
                
                {/* Online Toggle */}
                <div className="flex items-center space-x-3">
                  <span className={`text-xs font-bold font-sans uppercase tracking-wider ${adminChatOnline ? "text-emerald-500" : "text-slate-400"}`}>
                    {adminChatOnline ? "Agent Online" : "Agent Offline"}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={adminChatOnline}
                      onChange={(e) => {
                        setAdminChatOnline(e.target.checked);
                        if (!e.target.checked) {
                          setActiveAdminChatSession(null);
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-305 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>

              {/* LIVE CHAT WORKSPACE (SPLIT SCREEN IF ONLINE) */}
              {adminChatOnline && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
                  {/* Left Column: Requests & Active list (Span 1) */}
                  <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5 shadow-sm space-y-4">
                    <h5 className="text-sm font-bold text-slate-800 dark:text-white pb-3 border-b uppercase tracking-wider text-left">
                      Active Requests ({chatSessions.length})
                    </h5>

                    {chatSessions.length === 0 ? (
                      <div className="text-center py-10 text-xs font-semibold text-slate-450 bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                        No active chat sessions
                      </div>
                    ) : (
                      <div className="space-y-2.5 overflow-y-auto max-h-[380px]">
                        {chatSessions.map((ses) => {
                          const isActive = activeAdminChatSession?.sessionId === ses.sessionId;
                          const isWaiting = ses.status === "waiting";
                          return (
                            <div
                              key={ses.sessionId}
                              onClick={() => handleJoinChat(ses.sessionId)}
                              className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left ${
                                isActive
                                  ? "border-primary bg-primary/5 dark:bg-primary/10"
                                  : "border-slate-150 dark:border-slate-800/80 hover:border-slate-350"
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <h6 className="font-bold text-sm text-slate-800 dark:text-white truncate flex-grow">
                                  {ses.user.name}
                                </h6>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                  isWaiting ? "bg-amber-500/10 text-amber-500 animate-pulse" : "bg-emerald-500/10 text-emerald-500"
                                }`}>
                                  {isWaiting ? "Queue" : "Active"}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400 truncate mt-0.5">{ses.user.email}</p>
                              
                              <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100/50 dark:border-slate-800/40">
                                <span className="text-[9px] font-semibold text-slate-450">
                                  Active: {new Date(ses.lastActive).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCloseChat(ses.sessionId);
                                  }}
                                  className="text-[10px] font-bold text-red-500 hover:underline"
                                >
                                  Close
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Active Conversation (Span 2) */}
                  <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between h-[450px]">
                    {activeAdminChatSession ? (
                      <div className="flex flex-col h-full">
                        {/* Conversation Header */}
                        <div className="p-4 border-b bg-slate-50 dark:bg-slate-950/20 flex items-center justify-between text-left">
                          <div>
                            <h5 className="font-bold text-sm text-slate-805 dark:text-white">
                              Chatting with: {activeAdminChatSession.user.name}
                            </h5>
                            <p className="text-[10px] text-slate-400">{activeAdminChatSession.user.email}</p>
                          </div>
                          <button
                            onClick={() => handleCloseChat(activeAdminChatSession.sessionId)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-650 text-xs font-bold rounded-xl border border-red-200/20 transition-all"
                          >
                            End Chat
                          </button>
                        </div>

                        {/* Messages Box */}
                        <div className="flex-grow p-4 overflow-y-auto space-y-3.5 Scrollbar-thin text-left bg-slate-50/50 dark:bg-slate-950/10">
                          {activeAdminChatSession.messages.map((m, idx) => {
                            const isSystem = m.name === "System";
                            const isMe = m.sender === "admin";
                            
                            if (isSystem) {
                              return (
                                <div key={idx} className="text-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest my-1">
                                  — {m.text} —
                                </div>
                              );
                            }

                            return (
                              <div
                                key={idx}
                                className={`flex items-start gap-2.5 max-w-[85%] ${
                                  isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                                }`}
                              >
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                                  isMe ? "bg-emerald-500 text-white" : "bg-primary text-white dark:bg-white dark:text-slate-950"
                                }`}>
                                  {isMe ? "AD" : "US"}
                                </div>
                                <div className={`p-3 rounded-2xl text-sm ${
                                  isMe ? "bg-emerald-500 text-white" : "bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-850 text-slate-700 dark:text-slate-300"
                                }`}>
                                  <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                                  <span className={`block text-[9px] mt-1 text-right ${isMe ? "text-white/60" : "text-slate-400"}`}>
                                    {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Input Footer */}
                        <form
                          onSubmit={handleSendAdminMessage}
                          className="p-3 border-t bg-white dark:bg-slate-900 flex items-center gap-2"
                        >
                          <input
                            type="text"
                            value={adminChatText}
                            onChange={(e) => setAdminChatText(e.target.value)}
                            placeholder="Type message response to customer..."
                            className="flex-grow px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-sans rounded-xl text-xs"
                            required
                          />
                          <button
                            type="submit"
                            disabled={!adminChatText.trim() || sendingAdminMessage}
                            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md font-bold text-xs transition-all flex items-center space-x-1 disabled:opacity-50"
                          >
                            <span>Send</span>
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-400">
                        <MessageSquare className="w-12 h-12 text-slate-305 mb-2.5 animate-bounce" />
                        <p className="text-sm font-semibold">Select a chat request from the left list to begin replying.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TICKET DIVIDER */}
              <div className="border-t border-slate-200/50 dark:border-slate-850 pt-6 mt-8">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white font-sans mb-1">Traditional Support Tickets</h3>
                <p className="text-xs text-slate-400">Manage support tickets submitted via contact form</p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-200/50 dark:border-slate-850">
                <div>
                  <h3 className="text-xl font-bold text-slate-805 dark:text-white font-sans">Support Tickets</h3>
                  <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">Read customer inquiries, reply to messages, and update status</p>
                </div>

                {/* Filter & Search actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <form onSubmit={(e) => { e.preventDefault(); fetchSupportTickets(); }} className="relative flex items-center">
                    <input
                      type="text"
                      placeholder="Search tickets..."
                      value={ticketSearch}
                      onChange={(e) => setTicketSearch(e.target.value)}
                      className="pl-9 pr-4 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-xs font-semibold text-slate-700 dark:text-slate-300 w-44 focus:w-60 transition-all duration-300"
                    />
                    <Search className="absolute left-3 w-3.5 h-3.5 text-slate-400" />
                    <button type="submit" className="hidden" />
                  </form>

                  <select
                    value={ticketStatusFilter}
                    onChange={(e) => setTicketStatusFilter(e.target.value)}
                    className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Unread">Unread</option>
                    <option value="Read">Read</option>
                    <option value="Replied">Replied</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Table listings */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl shadow-sm overflow-x-auto">
                <table className="w-full text-sm divide-y divide-slate-100 dark:divide-slate-850 text-left font-sans">
                  <thead>
                    <tr className="text-xs text-slate-400 font-bold uppercase tracking-wider p-4 border-b">
                      <th className="p-4">Ticket ID</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Priority</th>
                      <th className="p-4">Subject</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-155 dark:divide-slate-850 text-slate-700 dark:text-slate-300">
                    {loadingTickets ? (
                      <tr>
                        <td colSpan="8" className="p-8 text-center text-slate-400 font-semibold font-sans">
                          Loading support tickets...
                        </td>
                      </tr>
                    ) : supportTickets.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="p-8 text-center text-slate-400 font-semibold font-sans">
                          No support tickets found.
                        </td>
                      </tr>
                    ) : (
                      supportTickets.map((t) => {
                        let statusClass = "";
                        switch (t.status) {
                          case "Unread":
                            statusClass = "bg-blue-500/10 text-blue-550 dark:text-blue-400";
                            break;
                          case "Read":
                            statusClass = "bg-slate-500/10 text-slate-500 dark:text-slate-400";
                            break;
                          case "Replied":
                            statusClass = "bg-amber-500/10 text-amber-555 dark:text-amber-450";
                            break;
                          case "Closed":
                            statusClass = "bg-emerald-500/10 text-emerald-555 dark:text-emerald-450";
                            break;
                          default:
                            statusClass = "bg-slate-500/10 text-slate-500";
                        }

                        return (
                          <tr key={t.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-900/40">
                            <td className="p-4 font-bold text-primary font-sans">{t.id}</td>
                            <td className="p-4 text-xs font-sans">
                              {new Date(t.date).toLocaleDateString(undefined, {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                              })}
                            </td>
                            <td className="p-4 font-sans">
                              <p className="font-bold text-slate-800 dark:text-white leading-tight">{t.userName}</p>
                              <p className="text-xs text-slate-400">{t.userEmail}</p>
                              {t.userId ? (
                                <span className="inline-block text-[9px] bg-secondary/10 text-secondary px-1.5 py-0.2 rounded font-bold mt-1">Customer</span>
                              ) : (
                                <span className="inline-block text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.2 rounded font-bold mt-1">Guest</span>
                              )}
                            </td>
                            <td className="p-4 font-semibold text-slate-700 dark:text-slate-350 font-sans">
                              {t.category || "Other"}
                            </td>
                            <td className="p-4 font-semibold font-sans">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                t.priority === "High"
                                  ? "bg-red-500/10 text-red-650 dark:text-red-450"
                                  : t.priority === "Medium"
                                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-450"
                                    : "bg-blue-500/10 text-blue-500 dark:text-blue-450"
                              }`}>
                                {t.priority || "Low"}
                              </span>
                            </td>
                            <td className="p-4 font-semibold text-slate-700 dark:text-slate-300 max-w-[150px] truncate font-sans" title={t.subject}>
                              {t.subject || "No Subject"}
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-sans ${statusClass}`}>
                                {t.status}
                              </span>
                            </td>
                            <td className="p-4 text-center">
                              <button
                                onClick={() => handleOpenTicket(t)}
                                className="px-3.5 py-1.5 rounded-xl border border-slate-205 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all flex items-center justify-center mx-auto space-x-1"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Open Ticket</span>
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* CRUD 1: ADD PRODUCT MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Catalog Product"
        size="lg"
      >
        <form onSubmit={handleAddProductSubmit} className="space-y-4 text-left font-sans">
          <Input
            label="Product Title"
            value={productForm.name}
            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
            placeholder="e.g. Mechanical Keyboard"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price ($)"
              type="number"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              placeholder="e.g. 89.99"
              required
            />
            <Input
              label="Discount (%)"
              type="number"
              value={productForm.discount}
              onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
              placeholder="e.g. 10"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5 text-left">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-350">Category</label>
              <select
                value={productForm.category}
                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            <Input
              label="Stock Units"
              type="number"
              value={productForm.stock}
              onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
              placeholder="e.g. 50"
              required
            />
          </div>

          <Input
            label="Main Image URL"
            value={productForm.image}
            onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
            placeholder="e.g. Unsplash URL"
            required
          />

          <div className="flex flex-col space-y-1.5 text-left">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-350">Product Description</label>
            <textarea
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              placeholder="Type description features..."
              rows="4"
              className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-5 py-2.5 rounded-xl border text-slate-700 dark:text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <Button type="submit">
              Save Product
            </Button>
          </div>
        </form>
      </Modal>

      {/* CRUD 2: EDIT PRODUCT MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        title="Edit Product Details"
        size="lg"
      >
        {selectedProduct && (
          <form onSubmit={handleEditProductSubmit} className="space-y-4 text-left font-sans">
            <Input
              label="Product Title"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Price ($)"
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                required
              />
              <Input
                label="Discount (%)"
                type="number"
                value={productForm.discount}
                onChange={(e) => setProductForm({ ...productForm, discount: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5 text-left">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-350">Category</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <Input
                label="Stock Units"
                type="number"
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                required
              />
            </div>

            <Input
              label="Main Image URL"
              value={productForm.image}
              onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
              required
            />

            <div className="flex flex-col space-y-1.5 text-left">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-350">Product Description</label>
              <textarea
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                rows="4"
                className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setSelectedProduct(null);
                }}
                className="px-5 py-2.5 rounded-xl border text-slate-700 dark:text-slate-300 font-semibold"
              >
                Cancel
              </button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* SUPPORT TICKET DETAIL & REPLY MODAL */}
      <Modal
        isOpen={isTicketModalOpen}
        onClose={() => {
          setIsTicketModalOpen(false);
          setSelectedTicket(null);
        }}
        title={selectedTicket ? `Support Ticket: ${selectedTicket.id}` : ""}
        size="lg"
      >
        {selectedTicket && (
          <form onSubmit={handleSaveReply} className="space-y-4 text-left font-sans">
            {/* Header info card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Customer Details</span>
                <p className="text-sm font-bold text-slate-800 dark:text-white">{selectedTicket.userName}</p>
                <p className="text-xs text-slate-500">{selectedTicket.userEmail}</p>
                {selectedTicket.userId && <p className="text-[10px] text-slate-400">User ID: {selectedTicket.userId}</p>}
              </div>
              <div className="space-y-1 sm:text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Ticket Properties</span>
                <div className="flex flex-col sm:items-end gap-2 mt-1.5 font-sans">
                  {/* Status Select */}
                  <div className="flex items-center space-x-2 justify-end">
                    <span className="text-[10px] text-slate-400">Status:</span>
                    <select
                      value={selectedTicket.status}
                      onChange={(e) => handleUpdateTicketStatus(selectedTicket.id, { status: e.target.value })}
                      className="px-2 py-1 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none"
                    >
                      <option value="Unread">Unread</option>
                      <option value="Read">Read</option>
                      <option value="Replied">Replied</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  {/* Priority Select */}
                  <div className="flex items-center space-x-2 justify-end">
                    <span className="text-[10px] text-slate-400">Priority:</span>
                    <select
                      value={selectedTicket.priority || "Low"}
                      onChange={(e) => handleUpdateTicketStatus(selectedTicket.id, { priority: e.target.value })}
                      className="px-2 py-1 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none"
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  {/* Category Select */}
                  <div className="flex items-center space-x-2 justify-end">
                    <span className="text-[10px] text-slate-400">Category:</span>
                    <select
                      value={selectedTicket.category || "Other"}
                      onChange={(e) => handleUpdateTicketStatus(selectedTicket.id, { category: e.target.value })}
                      className="px-2 py-1 text-xs font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none"
                    >
                      <option value="Complaint">Complaint</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Order Issue">Order Issue</option>
                      <option value="Payment Issue">Payment Issue</option>
                      <option value="Delivery Issue">Delivery Issue</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 block mt-2">
                  Created: {new Date(selectedTicket.date).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Subject */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Subject</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {selectedTicket.subject || "No Subject"}
              </h4>
            </div>

            {/* Existing admin reply */}
            {selectedTicket.adminReply && (
              <div className="space-y-1 bg-primary/5 dark:bg-primary/10 border-l-4 border-primary p-4 rounded-xl text-sm font-sans">
                <span className="text-[10px] uppercase font-bold text-primary dark:text-primary-light tracking-wider block">Existing Reply by {selectedTicket.adminName || "Admin"}</span>
                <p className="text-slate-700 dark:text-slate-250 whitespace-pre-line leading-relaxed">{selectedTicket.adminReply}</p>
                {selectedTicket.adminRepliedAt && (
                  <p className="text-[10px] text-slate-405 dark:text-slate-500 text-right mt-1">
                    Replied on {new Date(selectedTicket.adminRepliedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {/* Message */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Message Details</span>
              <p className="text-sm text-slate-700 dark:text-slate-350 bg-slate-50 dark:bg-slate-950/20 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 whitespace-pre-line leading-relaxed">
                {selectedTicket.message}
              </p>
            </div>

            {/* Admin reply input */}
            <div className="flex flex-col space-y-1.5 pt-2 border-t">
              <label className="text-sm font-bold text-slate-805 dark:text-white">
                Admin Response Message
              </label>
              <textarea
                value={adminReplyText}
                onChange={(e) => setAdminReplyText(e.target.value)}
                placeholder="Type reply or response details here..."
                rows="5"
                className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-sans"
                required
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => {
                  setIsTicketModalOpen(false);
                  setSelectedTicket(null);
                }}
                className="px-5 py-2.5 rounded-xl border text-slate-700 dark:text-slate-300 font-semibold"
              >
                Close Ticket
              </button>
              <Button
                type="submit"
                isLoading={isReplying}
              >
                Send & Save Reply
              </Button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
};

export default Admin;
