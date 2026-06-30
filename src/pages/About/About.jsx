import React from "react";
import { ShoppingBag, Sliders, Heart, Lock, Truck, Smartphone } from "lucide-react";

export const About = () => {
  const shoppingFeatures = [
    { icon: ShoppingBag, title: "Wide Product Collection", desc: "Browse through our extensive catalog of handpicked products across fashion, electronics, home decor, and more." },
    { icon: Sliders, title: "Smart Search & Filters", desc: "Find exactly what you are looking for in seconds with our advanced filtering and instant search options." },
    { icon: Heart, title: "Wishlist Support", desc: "Save your favorite items to your personal wishlist and track them for price drops and restocks." },
    { icon: Lock, title: "Secure Checkout", desc: "Shop with peace of mind using our end-to-end encrypted secure checkout with multiple payment modes." },
    { icon: Truck, title: "Fast Delivery", desc: "Get your orders delivered swiftly and safely right to your doorstep, with real-time tracking updates." },
    { icon: Smartphone, title: "Responsive Shopping Experience", desc: "Enjoy a smooth, seamless shopping experience on any device, whether you are on a phone, tablet, or laptop." }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
      
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center text-left">
        <div className="space-y-6">
          <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            Our Vision
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-sans text-slate-900 dark:text-white leading-tight">
            Redefining Your Online Shopping Experience
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            QuickCart is a premium online shopping platform designed to make digital storefronts accessible, lightning-fast, and user-friendly. We connect shoppers with high-quality products, affordable prices, and a reliable customer care network.
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Our catalog is curated with utmost care, ensuring every item meets our high standards of quality and value. We focus on providing a seamless interface, speedy deliveries, and helpful support.
          </p>
        </div>

        <div className="aspect-video rounded-[32px] overflow-hidden bg-slate-100 dark:bg-slate-900 border shadow-md relative">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop"
            alt="Online Shopping Experience"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Shopping Features section */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white tracking-tight">
            Designed for Modern Shoppers
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            We offer key services and storefront benefits to make sure you have a hassle-free, secure, and delightful experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {shoppingFeatures.map((feat, index) => {
            const FeatIcon = feat.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <FeatIcon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-850 dark:text-white">{feat.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};

export default About;
