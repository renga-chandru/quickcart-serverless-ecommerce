import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, ShoppingBag, Heart, MapPin, Settings, LogOut, Check, Save } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import orderService from "../../services/orderService";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";

export const Profile = () => {
  const { user, logout, updateProfile, isAuthenticated } = useAuth();
  const { wishlistItems } = useWishlist();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Tab State
  const [activeTab, setActiveTab] = useState("info"); // 'info' | 'orders' | 'wishlist' | 'addresses' | 'settings'
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Form States
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Address Form States
  const [address, setAddress] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    zip: user?.address?.zip || "",
    country: user?.address?.country || "United States"
  });

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || "");
      setAddress({
        street: user.address?.street || "",
        city: user.address?.city || "",
        state: user.address?.state || "",
        zip: user.address?.zip || "",
        country: user.address?.country || "United States"
      });
    }
  }, [user]);

  // Fetch orders on tab select
  useEffect(() => {
    if (activeTab === "orders") {
      const fetchOrders = async () => {
        setLoadingOrders(true);
        try {
          const list = await orderService.getOrders();
          setOrders(list);
        } catch (err) {
          console.error("Error fetching profile orders:", err);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [activeTab]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setUpdateSuccess(false);
    try {
      await updateProfile({
        name,
        phone,
        address
      });
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile details");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogoutClick = async () => {
    await logout();
    navigate("/");
  };

  const menuItems = [
    { id: "info", label: "Personal Info", icon: User },
    { id: "orders", label: "Order History", icon: ShoppingBag },
    { id: "wishlist", label: "My Wishlist", icon: Heart },
    { id: "addresses", label: "Saved Addresses", icon: MapPin },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-left border-b border-slate-200/50 dark:border-slate-850 pb-6 mb-10">
        <h1 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white">
          My Account
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Manage your account profile, shipping addresses, and track order histories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-left">
        {/* Sidebar Nav Tabs (Col 1) */}
        <div className="md:col-span-1 space-y-2">
          {/* Brief avatar card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-5 shadow-sm text-center mb-6 flex flex-col items-center">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-full border border-primary/20 object-cover mb-3"
            />
            <h3 className="font-bold text-slate-800 dark:text-white line-clamp-1">{user.name}</h3>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium truncate max-w-full">{user.email}</p>
            <span className="inline-block bg-primary/10 text-primary text-[10px] uppercase font-bold px-2 py-0.5 rounded-full mt-2 tracking-wide">
              {user.role}
            </span>
          </div>

          {/* Menus */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-3 shadow-sm space-y-1">
            {menuItems.map((item) => {
              const MenuItemIcon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-350 ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/10"
                      : "text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <MenuItemIcon className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-850"
            >
              <LogOut className="w-4.5 h-4.5" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Tab Contents Pane (Col 3) */}
        <div className="md:col-span-3">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-3xl p-6 sm:p-8 shadow-sm min-h-[300px]">
            
            {/* 1. PERSONAL INFORMATION */}
            {activeTab === "info" && (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-sans">
                    Personal Information
                  </h3>
                  <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">Update your personal contact details</p>
                </div>

                {updateSuccess && (
                  <div className="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-450 p-4 rounded-xl border border-emerald-200 dark:border-emerald-950/40 text-xs font-semibold flex items-center space-x-2">
                    <Check className="w-4 h-4" />
                    <span>Profile information updated successfully!</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <div className="flex flex-col space-y-1.5 w-full text-left">
                    <label className="text-sm font-medium text-slate-400 dark:text-slate-550 font-sans">
                      Email Address (Locked)
                    </label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="w-full px-4 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-850/50 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed text-sm font-sans"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isUpdating}
                    icon={Save}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            )}

            {/* 2. ORDER HISTORY */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-sans">
                    Order History
                  </h3>
                  <p className="text-xs text-slate-450 dark:text-slate-505 mt-1">Verify status and details of past purchases</p>
                </div>

                {loadingOrders ? (
                  <div className="text-center py-10 font-bold text-slate-400">Loading orders...</div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 font-semibold bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-dashed border-slate-250">
                    No orders placed yet.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-850">
                    {orders.map((ord) => (
                      <div key={ord.id} className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-800 dark:text-white">{ord.id}</p>
                          <p className="text-xs text-slate-400">Date: {ord.date} &bull; Total: ${ord.summary.total.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            ord.status === "Delivered" ? "bg-emerald-500/10 text-emerald-500" : "bg-primary/10 text-primary"
                          }`}>
                            {ord.status}
                          </span>
                          <button
                            onClick={() => navigate("/orders")}
                            className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl transition-all"
                          >
                            Track Order
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. WISHLIST SUMMARY */}
            {activeTab === "wishlist" && (
              <div className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-sans">
                    My Wishlist ({wishlistItems.length})
                  </h3>
                  <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">Saved items in your shopping wishlist</p>
                </div>

                {wishlistItems.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 font-semibold bg-slate-50 dark:bg-slate-950/20 rounded-2xl border border-dashed border-slate-250">
                    Your wishlist is empty.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistItems.map((item) => (
                      <div key={item.id} className="p-4 border border-slate-150 dark:border-slate-800 rounded-2xl flex items-center space-x-3 bg-slate-50/50 dark:bg-slate-900/50">
                        <img src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-white" />
                        <div className="flex-grow min-w-0">
                          <h4 className="font-bold text-sm text-slate-800 dark:text-white truncate">{item.name}</h4>
                          <p className="text-xs text-slate-400 font-sans font-bold mt-0.5">${item.price.toFixed(2)}</p>
                        </div>
                        <button
                          onClick={() => navigate("/wishlist")}
                          className="px-3 py-1 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-bold transition-all"
                        >
                          View
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. SAVED ADDRESSES */}
            {activeTab === "addresses" && (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-sans">
                    Saved Address Book
                  </h3>
                  <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">Manage default shipping destinations for checkout</p>
                </div>

                {updateSuccess && (
                  <div className="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-450 p-4 rounded-xl border border-emerald-200 dark:border-emerald-950/40 text-xs font-semibold flex items-center space-x-2">
                    <Check className="w-4 h-4" />
                    <span>Address settings updated!</span>
                  </div>
                )}

                <Input
                  label="Street Address"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="City"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    required
                  />
                  <Input
                    label="State"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    required
                  />
                  <Input
                    label="Zip / Postal"
                    value={address.zip}
                    onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                    required
                  />
                </div>

                <Input
                  label="Country"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  required
                />

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isUpdating}
                    icon={Save}
                  >
                    Save Address
                  </Button>
                </div>
              </form>
            )}

            {/* 5. SETTINGS */}
            {activeTab === "settings" && (
              <div className="space-y-6 font-sans">
                <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-sans">
                    Account Settings
                  </h3>
                  <p className="text-xs text-slate-450 dark:text-slate-500 mt-1">Configure security levels and theme overrides</p>
                </div>

                <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-850">
                  <div className="flex justify-between items-center py-3">
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">Email Notifications</p>
                      <p className="text-xs text-slate-400 mt-0.5">Receive discounts, coupon drops, and tracking alerts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="flex justify-between items-center py-3 pt-4">
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">Two-Factor Authentication</p>
                      <p className="text-xs text-slate-400 mt-0.5">Enforce login confirmations with code sends</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;
