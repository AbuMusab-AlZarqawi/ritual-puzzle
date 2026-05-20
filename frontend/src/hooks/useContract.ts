"use client";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/lib/config";

export function useSolvePrice() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "solvePrice",
  });
}

export function useLeaderboard(limit = 10) {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getLeaderboard",
    args: [BigInt(limit)],
  });
}

export function useTotalSolves() {
  return useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: "getTotalSolves",
  });
}

export function useRecordSolve() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const recordSolve = (puzzleId: number, moves: number, price: bigint) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: "recordSolve",
      args: [puzzleId, BigInt(moves)],
      value: price,
    });
  };

  return { recordSolve, isPending, isConfirming, isSuccess, error, hash };
}
