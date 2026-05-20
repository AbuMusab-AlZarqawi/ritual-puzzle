import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying RitualPuzzle with account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  const RitualPuzzle = await ethers.getContractFactory("RitualPuzzle");
  const puzzle = await RitualPuzzle.deploy();
  await puzzle.waitForDeployment();

  const address = await puzzle.getAddress();
  console.log("✅ RitualPuzzle deployed to:", address);
  console.log("\n👉 Copy this address into your frontend/.env.local:");
  console.log(`NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
