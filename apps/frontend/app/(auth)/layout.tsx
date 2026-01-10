"use client";

import Link from "next/link";
import { Activity } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-zinc-950 p-10 text-white lg:flex dark:border-r border-zinc-800 overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
             <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
        </div>
        
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Link href="/" className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold tracking-tight">Upbeat</span>
          </Link>
        </div>
        
        {/* Center Visual */}
        <div className="relative z-10 flex-1 flex items-center justify-center my-12">
            <div className="relative w-full max-w-[600px] [perspective:1000px] group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition duration-1000" />
                <img 
                    src="/hero-dashboard.png" 
                    alt="App Preview" 
                    className="relative rounded-xl border border-white/10 shadow-2xl transform [transform:rotateX(5deg)_rotateY(10deg)_rotateZ(-2deg)] scale-90 transition-all duration-700 ease-out group-hover:[transform:rotateX(0deg)_rotateY(0deg)_rotateZ(0deg)] group-hover:scale-100 opacity-90 hover:opacity-100"
                />
            </div>
        </div>
        
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-4">
            <p className="text-xl font-medium leading-relaxed max-w-lg text-zinc-200">
              "We used to find out about downtime from angry customers on Twitter. With Upbeat, we know before they do. It's paid for itself 10x over."
            </p>
            <footer className="text-sm text-zinc-400 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white">SD</div>
                <div>
                    <div className="font-semibold text-white">Sofia Davis</div>
                    <div className="text-xs">CTO at TechFlow</div>
                </div>
            </footer>
          </blockquote>
        </div>
      </div>
      <div className="p-8 lg:p-8 flex items-center justify-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
           {children}
        </div>
      </div>
    </div>
  );
}
