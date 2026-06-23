import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Send } from "lucide-react";
import { GithubIcon, TwitterIcon, LinkedinIcon, FacebookIcon } from "../Icons/SocialIcons";

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-900/50 transition-colors duration-300">
      {/* Top section: Main info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* Col 1: Brand & Desc */}
        <div className="lg:col-span-2 space-y-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="w-8 h-8 rounded-lg bg-primary dark:bg-white flex items-center justify-center text-white dark:text-black font-sans font-extrabold text-lg shadow-sm">
              Q
            </span>
            <span className="text-xl font-bold font-sans tracking-tight text-gradient-primary">
              QuickCart
            </span>
          </Link>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm leading-relaxed">
            QuickCart is a premium, serverless-ready, high-performance product catalog platform designed for modern, lightning-fast digital storefronts.
          </p>
          {/* Social Icons */}
          <div className="flex space-x-4 pt-2">
            <a href="#" className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-500 hover:text-primary transition-all duration-300 shadow-sm">
              <TwitterIcon className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-500 hover:text-primary transition-all duration-300 shadow-sm">
              <GithubIcon className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-500 hover:text-primary transition-all duration-300 shadow-sm">
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a href="#" className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-500 hover:text-primary transition-all duration-300 shadow-sm">
              <FacebookIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Col 2: Company */}
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">
            Company
          </h4>
          <ul className="space-y-2.5">
            <li>
              <Link to="/about" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                Blog
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Support */}
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">
            Support
          </h4>
          <ul className="space-y-2.5">
            <li>
              <Link to="/contact" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                Help Center
              </a>
            </li>
            <li>
              <a href="#" className="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
                FAQs
              </a>
            </li>
          </ul>
        </div>

        {/* Col 4: Newsletter Sign-up */}
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">
            Stay Updated
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
            Subscribe to receive product releases and special flash deals.
          </p>
          <form onSubmit={handleSubscribe} className="relative flex items-center">
            <input
              type="email"
              placeholder={subscribed ? "Subscribed! Thank you" : "Enter email"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={subscribed}
              className={`w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white pl-4 pr-10 py-2 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-300 ${
                subscribed ? "text-emerald-500 placeholder-emerald-500 font-semibold" : ""
              }`}
              required
            />
            <button
              type="submit"
              disabled={subscribed}
              className="absolute right-1 p-1.5 rounded-lg bg-primary dark:bg-white hover:bg-primary-dark dark:hover:bg-neutral-200 text-white dark:text-black transition-colors disabled:bg-emerald-500"
            >
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>

      </div>

      {/* Bottom section: Legal & Copyright */}
      <div className="bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200/40 dark:border-slate-900/45 py-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} QuickCart. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
