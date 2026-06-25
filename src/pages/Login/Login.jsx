import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Mail, Lock, ShieldAlert, ArrowRight, Apple } from "lucide-react";
import { GithubIcon, ChromeIcon } from "../../components/Icons/SocialIcons";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";

export const Login = () => {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) navigate("/admin");
      else navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  // States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load email if remember me was checked
  useEffect(() => {
    const savedEmail = localStorage.getItem("quickcart_remembered_email");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);

      // Save email if remember checked
      if (rememberMe) {
        localStorage.setItem("quickcart_remembered_email", email);
      } else {
        localStorage.removeItem("quickcart_remembered_email");
      }

      // Redirect based on role
      const userJSON = localStorage.getItem("quickcart_user");
      if (userJSON) {
        const u = JSON.parse(userJSON);
        if (u.role === "admin") {
          navigate("/admin");
        } else {
          // redirect to query state path or fallback to home
          const destination = location.state?.from?.pathname || "/";
          navigate(destination);
        }
      }
    } catch (err) {
      setError(err.message || "Invalid Email or Password");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">

      {/* Background glowing decorations */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-secondary/5 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">

        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center space-x-2">
            <span className="w-8 h-8 rounded-lg bg-primary dark:bg-white flex items-center justify-center text-white dark:text-black font-sans font-extrabold text-lg shadow-sm">
              Q
            </span>
            <span className="text-xl font-bold font-sans tracking-tight text-gradient-primary">
              QuickCart
            </span>
          </Link>
          <h2 className="text-3xl font-extrabold font-sans tracking-tight text-slate-900 dark:text-white mt-4">
            Welcome Back
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Sign in to manage your e-commerce dashboard or check out
          </p>
        </div>

        {/* Glassmorphic Form Card */}
        <div className="glass-card p-8 rounded-3xl shadow-xl border border-white/20 dark:border-slate-800/40 text-left space-y-6">

          {error && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-xl border border-red-500/20 text-xs font-semibold flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. user@quickcart.com"
              required
            />

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 font-sans">
                  Password
                </label>
                <a href="#" className="text-xs text-primary hover:underline font-semibold font-sans">
                  Forgot Password?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-sans"
                required
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary accent-primary"
                />
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Remember Me</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              className="w-full py-3 mt-4"
            >
              Sign In
            </Button>
          </form>

          {/* Social Sign In */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-850">
            <div className="relative flex justify-center text-xs uppercase font-bold text-slate-400">
              <span className="bg-white dark:bg-slate-900 px-3.5 relative z-10">Or continue with</span>
              <div className="absolute top-1/2 inset-x-0 h-px bg-slate-100 dark:bg-slate-850" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button className="flex items-center justify-center py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl text-slate-600 dark:text-slate-300 transition-colors shadow-sm">
                <ChromeIcon className="w-4 h-4" />
              </button>
              <button className="flex items-center justify-center py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl text-slate-600 dark:text-slate-300 transition-colors shadow-sm">
                <GithubIcon className="w-4 h-4" />
              </button>
              <button className="flex items-center justify-center py-2.5 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl text-slate-600 dark:text-slate-300 transition-colors shadow-sm">
                <Apple className="w-4 h-4" />
              </button>
            </div>
          </div>


        </div>

        {/* Redirect to signup */}
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline font-bold">
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
