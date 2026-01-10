"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl opacity-20 pointer-events-none">
        <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-emerald-500/30 rounded-full blur-[120px]" />
        <div className="absolute top-[10%] right-[20%] w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-zinc-400 backdrop-blur-sm mb-6"
        >
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Now available in public beta
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent"
        >
          Downtime happens. <br />
          <span className="text-white">Be the first to know.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed"
        >
          Reliable website monitoring with instant alerts. Get notified via Email, Slack, or SMS the second your site goes down.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center gap-4"
        >
          <Link href="/signup">
            <Button size="lg" className="h-12 px-8 text-base bg-emerald-500 hover:bg-emerald-600 text-black font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-shadow">
              Start Monitoring Free
            </Button>
          </Link>
          <Link href="#demo">
            <Button size="lg" variant="outline" className="h-12 px-8 text-base border-white/10 bg-white/5 hover:bg-white/10 text-white hover:text-white">
              Live Demo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 flex items-center gap-6 text-sm text-zinc-500"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-zinc-400" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-zinc-400" />
            <span>30-second setup</span>
          </div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
            className="mt-16 w-full max-w-5xl"
            style={{ perspective: "1000px" }}
        >
            <div className="relative rounded-xl border border-white/10 bg-white/5 p-2 shadow-2xl backdrop-blur-sm ring-1 ring-white/10">
                <div className="rounded-lg overflow-hidden border border-white/5 bg-black/50">
                     <img 
                        src="/hero-dashboard.png" 
                        alt="Upbeat Dashboard" 
                        className="w-full h-auto object-cover rounded-lg shadow-2xl"
                     />
                </div>
                
                {/* Decorative Glows */}
                <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute -bottom-20 -right-20 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
            </div>
        </motion.div>
      </div>
    </section>
  );
}
