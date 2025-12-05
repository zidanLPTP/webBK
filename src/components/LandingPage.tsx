"use client";

import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";

export default function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0F0F12] overflow-hidden font-sans text-white">
      
      {/* 1. Background Effects (Aurora) */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
      
      {/* 2. Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-md animate-in fade-in zoom-in duration-700">
        
        {/* Logo dengan Animasi Floating */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-full" />
          <div className="relative w-32 h-32 animate-[bounce_3s_infinite]">
             <Image 
               src="/logo-kucing.png" 
               alt="BisikKampus" 
               fill 
               className="object-contain drop-shadow-2xl"
             />
          </div>
        </div>

        {/* Typography */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight bg-gradient-to-br from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
          BisikKampus
        </h1>
        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
          Satu tempat untuk semua rahasia, cerita, dan keluh kesah kampusmu. <br/>
          <span className="text-purple-400 font-semibold">100% Anonim.</span>
        </p>

        {/* Action Button */}
        <button 
          onClick={onStart}
          className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-105 transition-all duration-300 flex items-center gap-3"
        >
          Mulai Eksplorasi
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          
          {/* Sparkle Icon Absolute */}
          <Sparkles className="absolute -top-3 -right-3 w-6 h-6 text-yellow-400 animate-bounce" />
        </button>

        {/* Footer Text */}
        <p className="absolute bottom-8 text-xs text-gray-600 uppercase tracking-widest">
          Bergabung dengan Komunitas
        </p>
      </div>

    </div>
  );
}