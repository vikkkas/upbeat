"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link className="flex items-center gap-2 font-bold text-xl tracking-tight" href="/">
          <Activity className="h-7 w-7 text-emerald-500" />
          <span className="text-white text-2xl">Upbeat</span>
        </Link>
        <div className="hidden md:flex gap-6 text-sm font-medium text-zinc-400">
          <Link className="hover:text-white transition-colors" href="#features">
            Features
          </Link>
          <Link className="hover:text-white transition-colors" href="#pricing">
            Pricing
          </Link>
          <Link className="hover:text-white transition-colors" href="#docs">
            Docs
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-white/10">
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold">
              Start Monitoring
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
