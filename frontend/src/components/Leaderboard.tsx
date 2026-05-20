"use client";
import { motion } from "framer-motion";
import { useLeaderboard, useTotalSolves } from "@/hooks/useContract";
import { formatAddress, formatTime } from "@/lib/puzzle";
import { Trophy, Clock, Hash } from "lucide-react";

export function Leaderboard() {
  const { data: leaderboard, isLoading } = useLeaderboard(10);
  const { data: totalSolves } = useTotalSolves();

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy size={16} className="text-ritual-gold" />
          <h2 className="text-ritual-gold font-display text-lg">Leaderboard</h2>
        </div>
        {totalSolves !== undefined && (
          <span className="text-ritual-dim font-mono text-xs">
            {totalSolves.toString()} total solves
          </span>
        )}
      </div>

      <div className="space-y-2">
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-6 h-6 border-2 border-ritual-gold border-t-transparent rounded-full"
            />
          </div>
        )}

        {!isLoading && (!leaderboard || (leaderboard as any[]).length === 0) && (
          <div className="text-center py-8 text-ritual-dim text-sm">
            <p>No solves yet.</p>
            <p className="text-xs mt-1">Be the first to solve onchain!</p>
          </div>
        )}

        {leaderboard && (leaderboard as any[]).map((entry: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 p-3 rounded-lg bg-ritual-surface border border-ritual-muted hover:border-ritual-gold/30 transition-colors"
          >
            <span className="text-ritual-dim font-mono text-xs w-4">{i + 1}</span>

            <div className="flex-1 min-w-0">
              <p className="text-ritual-text font-mono text-xs truncate">
                {formatAddress(entry.solver)}
              </p>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1 text-ritual-dim text-xs">
                  <Hash size={10} />
                  {entry.moves.toString()} moves
                </span>
                <span className="flex items-center gap-1 text-ritual-dim text-xs">
                  <Clock size={10} />
                  {formatTime(Number(entry.timestamp))}
                </span>
              </div>
            </div>

            {i === 0 && <span className="text-sm">🏆</span>}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
