import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  Heart,
  User,
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  UserCheck
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export const Navbar = () => {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, logout, unreadSupportCount } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsProfileDropdownOpen(false);
    navigate("/");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Categories", path: "/categories" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const activeClass = "text-primary font-semibold";
  const inactiveClass = "text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-medium";

  return (
    <nav className="sticky top-0 z-40 w-full glass-nav shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-sans font-extrabold text-lg shadow-md shadow-primary/20">
                Q
              </span>
              <span className="text-xl font-bold font-sans tracking-tight text-gradient-primary">
                QuickCart
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`transition-colors duration-300 ${
                  location.pathname === link.path ? activeClass : inactiveClass
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Search bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex items-center relative max-w-xs w-full mx-4"
          >
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 dark:bg-slate-800 border-none text-slate-850 dark:text-slate-150 pl-10 pr-4 py-1.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white dark:focus:bg-slate-900 transition-all duration-300"
            />
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400" />
          </form>

          {/* Right Action Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 transition-colors"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 relative transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 relative transition-colors"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile Menu */}
            <div className="relative">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover border border-primary/20"
                    />
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-350 max-w-[80px] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                    {unreadSupportCount > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white dark:border-slate-900 animate-pulse" />
                    )}
                  </button>

                  {isProfileDropdownOpen && (
                    <>
                      {/* Backdrop for easy closing */}
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      />

                      <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 shadow-2xl p-2 z-40 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-850">
                          <p className="text-xs text-slate-400 dark:text-slate-500">Signed in as</p>
                          <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user.email}</p>
                        </div>
                        
                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setIsProfileDropdownOpen(false)}
                            className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-primary" />
                            <span className="font-medium">Admin Dashboard</span>
                          </Link>
                        )}

                        <Link
                          to="/profile"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <UserCheck className="w-4 h-4 text-secondary" />
                            <span className="font-medium">My Profile</span>
                          </div>
                          {unreadSupportCount > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              {unreadSupportCount}
                            </span>
                          )}
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors mt-1"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="font-medium">Log out</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-semibold bg-primary hover:bg-primary-dark text-white rounded-full shadow-md shadow-primary/10 hover:shadow-primary/20 transition-all duration-300 block"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile hamburger menu trigger */}
          <div className="flex items-center md:hidden space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-350 transition-colors relative"
            >
              {isDark ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
              {unreadSupportCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            {/* Mobile menu trigger button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors relative"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              {unreadSupportCount > 0 && !isMobileMenuOpen && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white dark:border-slate-950" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide Drawer */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 top-16 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm z-30"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute top-16 inset-x-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-850 shadow-2xl p-6 z-45 animate-in slide-in-from-top duration-300">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative w-full mb-6">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none text-slate-800 dark:text-white pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:bg-white dark:focus:bg-slate-900 transition-all duration-300"
              />
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            </form>

            {/* Mobile Nav Links */}
            <div className="flex flex-col space-y-4 mb-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-base px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 ${
                    location.pathname === link.path ? activeClass : inactiveClass
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between text-base px-2 py-1.5 rounded-lg text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/40"
              >
                <span>Wishlist</span>
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{wishlistCount}</span>
              </Link>
              <Link
                to="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between text-base px-2 py-1.5 rounded-lg text-slate-650 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/40"
              >
                <span>Cart</span>
                <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{cartCount}</span>
              </Link>
            </div>

            {/* Mobile Profile Actions */}
            <div className="border-t border-slate-100 dark:border-slate-880 pt-4 flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center space-x-3 px-2">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border border-primary/20"
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-white">{user.name}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user.email}</p>
                    </div>
                  </div>
                  
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-2 py-2 text-sm text-slate-700 dark:text-slate-300 font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 text-primary" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-2 py-2 text-sm text-slate-700 dark:text-slate-300 font-medium"
                  >
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-secondary" />
                      <span>My Profile</span>
                    </div>
                    {unreadSupportCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {unreadSupportCount}
                      </span>
                    )}
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-2 py-2 text-sm text-red-650 font-medium text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold shadow-md shadow-primary/10 transition-all duration-350"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
