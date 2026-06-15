import React from "react";
import { Shield, Zap, Database, Server, Cpu, Globe } from "lucide-react";

export const About = () => {
  const architecturalFeatures = [
    { icon: Server, title: "AWS API Gateway", desc: "Standard entry points mapping client endpoints directly to microservices." },
    { icon: Cpu, title: "AWS Lambda", desc: "Pay-per-use, trigger-based serverless compute running zero backend servers." },
    { icon: Database, title: "Amazon DynamoDB", desc: "NoSQL, schema-free operational database optimized for horizontal scalability." },
    { icon: Shield, title: "Amazon Cognito", desc: "Federated single sign-on security, managing token sign-ups and roles." },
    { icon: Zap, title: "Amazon S3 & CDN", desc: "Vite static content assets distribution via CloudFront edge caches." },
    { icon: Globe, title: "Multi-Region Ready", desc: "Global latency minimization via DNS routing and edge server deployments." }
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
            Redefining E-Commerce with Serverless Architecture
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            QuickCart is a state-of-the-art catalog application designed to run entirely serverless. By decoupling the frontend and backend layers, we make database queries fast, secure, and incredibly cost-effective.
          </p>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            Our templates look premium, perform with sub-second response times, and are fully structured for zero-effort AWS migrations.
          </p>
        </div>

        <div className="aspect-video rounded-[32px] overflow-hidden bg-slate-100 dark:bg-slate-900 border shadow-md relative">
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop"
            alt="Cloud Computing Architecture"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Cloud architecture section */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold font-sans text-slate-900 dark:text-white tracking-tight">
            AWS Cloud Integration Ready
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            QuickCart is architected from the ground up for serverless integrations. When you are ready, hook it up to AWS with zero redesigns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {architecturalFeatures.map((feat, index) => {
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
