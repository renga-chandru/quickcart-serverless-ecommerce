import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, Phone, ShieldAlert, Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";

export const Signup = () => {
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // States
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: "Very Weak", color: "bg-red-500" });

  // Password strength calculator
  useEffect(() => {
    const pwd = formData.password;
    if (!pwd) {
      setPasswordStrength({ score: 0, text: "Very Weak", color: "bg-slate-200" });
      return;
    }

    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    const strengthMap = [
      { text: "Very Weak", color: "bg-red-500 w-1/5" },
      { text: "Weak", color: "bg-orange-500 w-2/5" },
      { text: "Medium", color: "bg-yellow-500 w-3/5" },
      { text: "Strong", color: "bg-emerald-500 w-4/5" },
      { text: "Very Strong", color: "bg-emerald-600 w-full" }
    ];

    const idx = Math.min(score, strengthMap.length - 1);
    setPasswordStrength({
      score,
      text: strengthMap[idx].text,
      className: strengthMap[idx].color
    });
  }, [formData.password]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Full name is required";
    
    if (!formData.email.trim()) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Email is invalid";
    
    if (!formData.phone.trim()) errs.phone = "Phone number is required";
    
    if (!formData.password) errs.password = "Password is required";
    else if (formData.password.length < 6) errs.password = "Password must be at least 6 characters";
    
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    if (!agreeTerms) {
      errs.terms = "You must agree to the terms and conditions";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      });
      navigate("/");
    } catch (err) {
      setErrors({ api: err.message || "Registration failed. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
      
      {/* Background decorations */}
      <div className="absolute top-10 left-10 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-accent/5 blur-3xl pointer-events-none" />

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
            Create an Account
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Join QuickCart and enjoy lightning-fast e-commerce shopping
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8 rounded-3xl shadow-xl border border-white/20 dark:border-slate-800/40 text-left space-y-5">
          
          {errors.api && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-xl border border-red-500/20 text-xs font-semibold flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0" />
              <span>{errors.api}</span>
            </div>
          )}

          <form onSubmit={handleSignupSubmit} className="space-y-4 font-sans">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={errors.name}
              placeholder="e.g. Arun Kumar"
              required
            />

            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={errors.email}
              placeholder="e.g. arun@example.com"
              required
            />

            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              error={errors.phone}
              placeholder="e.g. +91 98765 43210"
              required
            />

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-350">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Minimum 6 characters"
                className={`w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 ${
                  errors.password ? "border-red-500 focus:ring-red-500/20" : ""
                }`}
                required
              />
              {errors.password && (
                <span className="text-xs text-red-550 block font-medium">{errors.password}</span>
              )}

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-1.5 pt-1.5">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                    <span>Password Strength:</span>
                    <span className="text-slate-655 dark:text-slate-350">{passwordStrength.text}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                    <div className={`h-full rounded-full transition-all duration-350 ${passwordStrength.className}`} />
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              placeholder="Re-type your password"
              required
            />

            {/* Terms checkbox */}
            <div className="pt-1">
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    if (errors.terms) setErrors((prev) => ({ ...prev, terms: "" }));
                  }}
                  className="rounded border-slate-300 dark:border-slate-700 text-primary focus:ring-primary accent-primary mt-0.5"
                />
                <span className="text-xs text-slate-500 dark:text-slate-405 leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="text-primary font-bold hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary font-bold hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
              {errors.terms && (
                <span className="text-xs text-red-500 block font-medium mt-1">{errors.terms}</span>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              className="w-full py-3 mt-4"
            >
              Sign Up
            </Button>
          </form>

        </div>

        {/* Redirect to login */}
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-bold">
            Sign In
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;
