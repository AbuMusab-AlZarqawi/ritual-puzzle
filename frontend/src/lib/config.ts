import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";

export const ritualTestnet = defineChain({
  id: 1979,
  name: "Ritual Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "RITUAL",
    symbol: "RITUAL",
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RPC_URL || "https://rpc.ritualfoundation.org"],
    },
  },
  testnet: true,
});

export const wagmiConfig = getDefaultConfig({
  appName: "RitualPuzzle",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [ritualTestnet],
  ssr: true,
});

export const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "") as `0x${string}`;

export const CONTRACT_ABI = [
  {
    inputs: [{ internalType: "uint8", name: "puzzleId", type: "uint8" }, { internalType: "uint256", name: "moves", type: "uint256" }],
    name: "recordSolve",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "limit", type: "uint256" }],
    name: "getLeaderboard",
    outputs: [
      {
        components: [
          { internalType: "address", name: "solver", type: "address" },
          { internalType: "uint256", name: "moves", type: "uint256" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "uint8", name: "puzzleId", type: "uint8" },
        ],
        internalType: "struct RitualPuzzle.Solve[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalSolves",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "solvePrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "bestMoves",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "solver", type: "address" },
      { indexed: false, internalType: "uint256", name: "moves", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "timestamp", type: "uint256" },
      { indexed: false, internalType: "uint8", name: "puzzleId", type: "uint8" },
    ],
    name: "PuzzleSolved",
    type: "event",
  },
] as const;
