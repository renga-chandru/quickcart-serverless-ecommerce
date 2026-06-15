import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, Check } from "lucide-react";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";

export const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name && email && message) {
      setSubmitted(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
      setTimeout(() => setSubmitted(false), 4000);
    }
  };

  const contactInfos = [
    { icon: Phone, title: "Support Phone", value: "+1 (555) 019-2834", desc: "Monday – Friday, 9am – 6pm EST" },
    { icon: Mail, title: "Email Address", value: "support@quickcart.com", desc: "Average response within 2 hours" },
    { icon: MapPin, title: "Headquarters", value: "120 Vercel Way, Suite 400", desc: "San Francisco, CA 94107" }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold font-sans text-slate-900 dark:text-white tracking-tight">
          Get in Touch
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
          Have questions about orders, payments, or cloud deployments? Contact our support staff.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-left">
        
        {/* Left: Contact info cards (Col 1) */}
        <div className="lg:col-span-1 space-y-6">
          {contactInfos.map((info, idx) => {
            const InfoIcon = info.icon;
            return (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-3xl shadow-sm flex items-start space-x-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl">
                  <InfoIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-white text-base">{info.title}</h4>
                  <p className="text-sm font-bold text-primary mt-1 font-sans">{info.value}</p>
                  <p className="text-xs text-slate-405 dark:text-slate-500 mt-0.5">{info.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Contact Form (Col 2) */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 rounded-[32px] p-6 sm:p-10 shadow-sm space-y-6">
            <h3 className="text-xl font-bold font-sans text-slate-900 dark:text-white">
              Send us a Message
            </h3>
            
            {submitted && (
              <div className="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-450 p-4 rounded-xl border border-emerald-250 dark:border-emerald-950/40 text-xs font-semibold flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>Message received! Our support specialists will contact you shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  required
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. jane@example.com"
                  required
                />
              </div>

              <Input
                label="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Inquiry regarding order ORD-928"
              />

              <div className="flex flex-col space-y-1.5 w-full text-left">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Message Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type details of your inquiry..."
                  rows="5"
                  className="w-full px-4 py-2.5 rounded-xl border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300 font-sans"
                  required
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  type="submit"
                  icon={Send}
                  className="px-6"
                >
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
