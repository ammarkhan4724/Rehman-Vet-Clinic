import React from "react";

interface LogoProps {
  className?: string;
  light?: boolean;
}

export default function Logo({ className = "", light = false }: LogoProps) {
  return (
    <a href="#home" className={`flex items-center gap-3 group transition-transform duration-300 ${className}`}>
      <div className="relative">
        {/* Ambient Glow */}
        <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-md opacity-30 group-hover:opacity-60 transition duration-300" />
        
        {/* Logo Badge */}
        <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border border-emerald-500/40 grid place-items-center shadow-lg shadow-emerald-950/20 group-hover:scale-105 group-hover:border-amber-400/60 transition-all duration-300">
          <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Subtle medical cross background */}
            <path d="M16 4V28M4 16H28" stroke="url(#logo-grad-amber)" strokeWidth="2.2" strokeLinecap="round" opacity="0.3"/>
            
            {/* Dynamic ECG Heartbeat pulse & clinical care line */}
            <path
              d="M6 16.5H10L12.5 10.5L15.5 21.5L18 12.5L19.5 16.5H26"
              stroke="url(#logo-grad-amber)"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Gentle pet paw accent markers */}
            <circle cx="16" cy="7.5" r="1.8" fill="#F59E0B" />
            <circle cx="12.5" cy="8.5" r="1.3" fill="#10B981" />
            <circle cx="19.5" cy="8.5" r="1.3" fill="#10B981" />
            
            <defs>
              <linearGradient id="logo-grad-amber" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F59E0B" />
                <stop offset="0.5" stopColor="#34D399" />
                <stop offset="1" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <div>
        <div className={`font-black text-[18px] leading-none tracking-tight transition-colors ${light ? "text-white" : "text-slate-900 group-hover:text-emerald-800"}`}>
          Rehman
        </div>
        <div className="text-[10px] font-extrabold text-emerald-600 tracking-[0.22em] uppercase mt-1">
          VETERINARY
        </div>
      </div>
    </a>
  );
}
