"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  Board,
  createSolvedBoard,
  shuffleBoard,
  moveTile,
  isSolved,
  getValidMoves,
  GRID_SIZE,
  EMPTY_TILE,
  getTilePosition,
} from "@/lib/puzzle";
import { useSolvePrice, useRecordSolve } from "@/hooks/useContract";
import { formatEther } from "viem";

const PUZZLES = [
  {
    id: 0,
    name: "Midnight Whisker",
    // Black cat image from Unsplash - free to use
    url: "https://images.unsplash.com/photo-1555169062-013468b47731?w=600&h=600&fit=crop&crop=faces,center",
    description: "A mysterious black cat",
  },
];

const TILE_SIZE = 180; // px per tile
const BOARD_SIZE = TILE_SIZE * GRID_SIZE;

type GameState = "preview" | "playing" | "solved" | "submitting" | "confirmed";

export function PuzzleBoard() {
  const { isConnected } = useAccount();
  const [board, setBoard] = useState<Board>(createSolvedBoard());
  const [moves, setMoves] = useState(0);
  const [gameState, setGameState] = useState<GameState>("preview");
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { data: solvePrice } = useSolvePrice();
  const { recordSolve, isPending, isConfirming, isSuccess } = useRecordSolve();

  const puzzle = PUZZLES[0];

  // Preload image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = puzzle.url;
    img.onload = () => {
      imgRef.current = img;
      setImgLoaded(true);
    };
  }, [puzzle.url]);

  // Draw tiles on canvas
  const drawBoard = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !imgLoaded) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, BOARD_SIZE, BOARD_SIZE);

    board.forEach((tileValue, boardIdx) => {
      if (tileValue === EMPTY_TILE) {
        // Draw empty space
        ctx.fillStyle = "#0A0806";
        ctx.fillRect(
          (boardIdx % GRID_SIZE) * TILE_SIZE,
          Math.floor(boardIdx / GRID_SIZE) * TILE_SIZE,
          TILE_SIZE,
          TILE_SIZE
        );
        // Subtle empty cell indicator
        ctx.strokeStyle = "rgba(201,168,76,0.15)";
        ctx.lineWidth = 1;
        ctx.strokeRect(
          (boardIdx % GRID_SIZE) * TILE_SIZE + 2,
          Math.floor(boardIdx / GRID_SIZE) * TILE_SIZE + 2,
          TILE_SIZE - 4,
          TILE_SIZE - 4
        );
        return;
      }

      // Source position in original image
      const srcCol = tileValue % GRID_SIZE;
      const srcRow = Math.floor(tileValue / GRID_SIZE);

      // Destination position on canvas
      const dstCol = boardIdx % GRID_SIZE;
      const dstRow = Math.floor(boardIdx / GRID_SIZE);

      const srcX = srcCol * (img.width / GRID_SIZE);
      const srcY = srcRow * (img.height / GRID_SIZE);
      const srcW = img.width / GRID_SIZE;
      const srcH = img.height / GRID_SIZE;

      const dstX = dstCol * TILE_SIZE;
      const dstY = dstRow * TILE_SIZE;

      ctx.drawImage(img, srcX, srcY, srcW, srcH, dstX, dstY, TILE_SIZE, TILE_SIZE);

      // Tile border
      ctx.strokeStyle = "rgba(10,8,6,0.8)";
      ctx.lineWidth = 2;
      ctx.strokeRect(dstX, dstY, TILE_SIZE, TILE_SIZE);
    });
  }, [board, imgLoaded]);

  useEffect(() => {
    drawBoard();
  }, [drawBoard]);

  useEffect(() => {
    if (isSuccess) setGameState("confirmed");
  }, [isSuccess]);

  const handleStart = () => {
    setBoard(shuffleBoard(createSolvedBoard()));
    setMoves(0);
    setGameState("playing");
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== "playing") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const col = Math.floor(x / TILE_SIZE);
    const row = Math.floor(y / TILE_SIZE);
    const clickedIdx = row * GRID_SIZE + col;

    const validMoves = getValidMoves(board);
    if (!validMoves.includes(clickedIdx)) return;

    const newBoard = moveTile(board, clickedIdx);
    if (!newBoard) return;

    const newMoves = moves + 1;
    setBoard(newBoard);
    setMoves(newMoves);

    if (isSolved(newBoard)) {
      setGameState("solved");
    }
  };

  const handleSubmitOnchain = () => {
    if (!solvePrice) return;
    setGameState("submitting");
    recordSolve(puzzle.id, moves, solvePrice as bigint);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Stats bar */}
      <div className="flex items-center gap-8 font-mono text-sm">
        <div className="flex flex-col items-center">
          <span className="text-ritual-dim uppercase tracking-widest text-xs">Moves</span>
          <span className="text-ritual-gold text-2xl font-bold">{moves}</span>
        </div>
        <div className="h-8 w-px bg-ritual-muted" />
        <div className="flex flex-col items-center">
          <span className="text-ritual-dim uppercase tracking-widest text-xs">Status</span>
          <span className="text-ritual-text text-sm capitalize">{gameState}</span>
        </div>
        {solvePrice && (
          <>
            <div className="h-8 w-px bg-ritual-muted" />
            <div className="flex flex-col items-center">
              <span className="text-ritual-dim uppercase tracking-widest text-xs">Solve Fee</span>
              <span className="text-ritual-gold text-sm">{formatEther(solvePrice as bigint)} RITUAL</span>
            </div>
          </>
        )}
      </div>

      {/* Canvas wrapper */}
      <div className="relative">
        {/* Preview thumbnail - top left corner */}
        {imgLoaded && (
          <div className="absolute -top-3 -right-3 z-10 w-20 h-20 rounded-lg overflow-hidden border-2 border-ritual-gold shadow-lg shadow-ritual-gold/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={puzzle.url}
              alt="Complete puzzle preview"
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 flex items-end justify-center pb-1">
              <span className="text-[8px] text-ritual-gold font-mono bg-ritual-dark/80 px-1 rounded">GOAL</span>
            </div>
          </div>
        )}

        {/* Main canvas */}
        <motion.div
          className="relative rounded-xl overflow-hidden"
          style={{
            boxShadow: gameState === "solved"
              ? "0 0 60px rgba(201,168,76,0.6), 0 0 120px rgba(201,168,76,0.2)"
              : "0 0 40px rgba(0,0,0,0.8)",
          }}
          animate={gameState === "solved" ? { scale: [1, 1.01, 1] } : {}}
          transition={{ duration: 0.5 }}
        >
          <canvas
            ref={canvasRef}
            width={BOARD_SIZE}
            height={BOARD_SIZE}
            onClick={handleCanvasClick}
            className="block"
            style={{
              width: `min(${BOARD_SIZE}px, 90vw)`,
              height: `min(${BOARD_SIZE}px, 90vw)`,
              cursor: gameState === "playing" ? "pointer" : "default",
              imageRendering: "pixelated",
            }}
          />

          {/* Overlay states */}
          <AnimatePresence>
            {gameState === "preview" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-ritual-dark/80 backdrop-blur-sm"
              >
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-6xl mb-4"
                >
                  🐱
                </motion.div>
                <p className="text-ritual-text font-display text-xl mb-2">{puzzle.name}</p>
                <p className="text-ritual-dim text-sm mb-6">Study the image, then solve it!</p>
                <button
                  onClick={handleStart}
                  className="px-8 py-3 bg-ritual-gold text-ritual-dark font-bold rounded-lg hover:bg-ritual-amber transition-colors font-body tracking-wide"
                >
                  SCRAMBLE & PLAY
                </button>
              </motion.div>
            )}

            {gameState === "solved" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-ritual-dark/85 backdrop-blur-sm"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6 }}
                  className="text-6xl mb-4"
                >
                  ✨
                </motion.div>
                <p className="text-ritual-gold font-display text-2xl mb-1">Puzzle Solved!</p>
                <p className="text-ritual-dim text-sm mb-6">
                  Completed in <span className="text-ritual-gold font-bold">{moves}</span> moves
                </p>

                {isConnected ? (
                  <button
                    onClick={handleSubmitOnchain}
                    className="px-8 py-3 bg-ritual-gold text-ritual-dark font-bold rounded-lg hover:bg-ritual-amber transition-colors mb-3 font-body"
                  >
                    RECORD ONCHAIN 🔗
                  </button>
                ) : (
                  <div className="mb-3">
                    <p className="text-ritual-dim text-xs mb-2 text-center">Connect wallet to record onchain</p>
                    <ConnectButton />
                  </div>
                )}

                <button
                  onClick={handleStart}
                  className="px-6 py-2 border border-ritual-muted text-ritual-dim rounded-lg hover:border-ritual-gold hover:text-ritual-gold transition-colors text-sm font-body"
                >
                  Play Again
                </button>
              </motion.div>
            )}

            {(gameState === "submitting" || gameState === "confirmed") && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-ritual-dark/90 backdrop-blur-sm"
              >
                {gameState === "submitting" || isPending || isConfirming ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-2 border-ritual-gold border-t-transparent rounded-full mb-4"
                    />
                    <p className="text-ritual-gold font-display text-lg">
                      {isPending ? "Confirm in wallet..." : "Recording onchain..."}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-5xl mb-4">⛓️</div>
                    <p className="text-ritual-gold font-display text-xl mb-2">Recorded Onchain!</p>
                    <p className="text-ritual-dim text-sm mb-6">Your solve is permanently on Ritual Chain</p>
                    <button
                      onClick={handleStart}
                      className="px-8 py-3 bg-ritual-gold text-ritual-dark font-bold rounded-lg hover:bg-ritual-amber transition-colors font-body"
                    >
                      Play Again
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
