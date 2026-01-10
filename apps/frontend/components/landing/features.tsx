"use client";

import { Zap, Shield, Globe, Bell, Smartphone, Clock } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Zap className="h-6 w-6 text-yellow-500" />,
    title: "Real-time Monitoring",
    description: "We check your website every 30 seconds from multiple locations around the world.",
  },
  {
    icon: <Bell className="h-6 w-6 text-red-500" />,
    title: "Instant Alerts",
    description: "Get notified immediately via Email, SMS, or Slack when your site goes down.",
  },
  {
    icon: <Globe className="h-6 w-6 text-blue-500" />,
    title: "Global Coverage",
    description: "Verify downtime from up to 30 different locations to prevent false alarms.",
  },
  {
    icon: <Shield className="h-6 w-6 text-emerald-500" />,
    title: "Incident Management",
    description: "Collaborate with your team to resolve incidents faster with built-in tools.",
  },
  {
    icon: <Smartphone className="h-6 w-6 text-purple-500" />,
    title: "On-call Scheduling",
    description: "Define on-call rotations so the right person gets woken up, not everyone.",
  },
  {
    icon: <Clock className="h-6 w-6 text-orange-500" />,
    title: "Historical Data",
    description: "Keep a permanent record of your uptime and response times for analysis.",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 bg-black relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Everything you need to <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">stay online.</span>
          </h2>
          <p className="text-lg text-zinc-400">
            Comprehensive monitoring tools designed for developers, startups, and enterprises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 hover:border-emerald-500/50 transition-colors group"
            >
              <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
