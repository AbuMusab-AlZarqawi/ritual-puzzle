
"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { PuzzleBoard } from "@/components/PuzzleBoard";
import { Leaderboard } from "@/components/Leaderboard";

export default function Home() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = new Audio("/background.mp3");
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;
    return () => { audio.pause(); audio.src = ""; };
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { audio.play().then(() => setIsPlaying(true)).catch(() => {}); }
  };

  return (
    <main className="min-h-screen bg-ritual-dark relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-10" style={{ background: "radial-gradient(circle, #C9A84C 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-5" style={{ background: "radial-gradient(circle, #C9A84C 0%, transparent 70%)" }} />
      </div>
      <header className="relative z-10 flex items-center justify-between px-6 py-5 border-b border-ritual-muted/50">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-ritual-gold flex items-center justify-center text-ritual-dark font-bold text-sm">R</div>
          <div>
            <h1 className="text-ritual-gold font-display text-xl leading-none">RitualPuzzle</h1>
            <p className="text-ritual-dim text-xs font-mono mt-0.5">Ritual Chain Testnet</p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="flex items-center gap-3">
          <button onClick={toggleMusic} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all duration-300 ${isPlaying ? "border-ritual-gold text-ritual-gold bg-ritual-gold/10" : "border-ritual-muted text-ritual-dim hover:border-ritual-gold hover:text-ritual-gold"}`}>
            <span className="text-base">{isPlaying ? "⏸" : "🎵"}</span>
            <span className="hidden sm:inline text-xs">{isPlaying ? "Playing" : "Music"}</span>
          </button>
          <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />
        </motion.div>
      </header>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="text-center pt-8 pb-6 px-4">
        <h2 className="font-display text-4xl md:text-5xl text-ritual-text mb-2">Slide. Solve. <span className="text-ritual-gold italic">Immortalize.</span></h2>
        <p className="text-ritual-dim text-sm max-w-md mx-auto">Rearrange the tiles to reveal the hidden image. Every solve is recorded permanently on Ritual Chain.</p>
      </motion.div>
      <div className="relative z-10 flex flex-col lg:flex-row items-start justify-center gap-10 px-4 pb-16 max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.3 }} className="flex-shrink-0">
          <PuzzleBoard />
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="w-full lg:w-80 pt-2">
          <div className="mb-8 p-4 rounded-xl bg-ritual-surface border border-ritual-muted">
            <h3 className="text-ritual-gold font-display text-sm mb-3 uppercase tracking-widest">How to Play</h3>
            <ol className="space-y-2 text-ritual-dim text-sm">
              <li className="flex gap-2"><span className="text-ritual-gold font-mono text-xs mt-0.5">01</span><span>Study the preview image in the corner</span></li>
              <li className="flex gap-2"><span className="text-ritual-gold font-mono text-xs mt-0.5">02</span><span>Click Scramble and Play to shuffle the tiles</span></li>
              <li className="flex gap-2"><span className="text-ritual-gold font-mono text-xs mt-0.5">03</span><span>Click tiles adjacent to the empty space to slide them</span></li>
              <li className="flex gap-2"><span className="text-ritual-gold font-mono text-xs mt-0.5">04</span><span>Restore the original image to win</span></li>
              <li className="flex gap-2"><span className="text-ritual-gold font-mono text-xs mt-0.5">05</span><span>Connect wallet and pay 0.001 RITUAL to record onchain</span></li>
            </ol>
          </div>
          <Leaderboard />
        </motion.div>
      </div>
      <footer className="relative z-10 text-center pb-6 text-ritual-dim text-xs font-mono border-t border-ritual-muted/30 pt-4">
        <p>Built on Ritual Chain Testnet (Chain ID: 1979) · RitualPuzzle</p>
      </footer>
    </main>
  );
}
