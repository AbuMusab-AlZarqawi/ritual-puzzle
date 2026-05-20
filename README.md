# 🐱 RitualPuzzle

A sliding puzzle dApp built on **Ritual Chain Testnet**. Solve the black cat puzzle and record your victory permanently onchain.

## What it does
- 3×3 sliding puzzle with a beautiful black cat image
- Preview of the complete image always visible
- Move counter tracks your efficiency
- Connects to MetaMask via RainbowKit
- Solve → pay 0.001 RITUAL → your wallet, move count & timestamp are recorded forever on Ritual Chain
- Onchain leaderboard of all solvers

---

## Prerequisites
- Node.js v18+ installed
- npm installed
- MetaMask with Ritual Testnet added:
  - **RPC:** https://rpc.ritualfoundation.org
  - **Chain ID:** 1979
  - **Symbol:** RITUAL
- Testnet RITUAL tokens in your wallet
- A WalletConnect Project ID (free at https://cloud.walletconnect.com)

---

## Project Structure
```
RitualPuzzle/
├── contracts/
│   └── RitualPuzzle.sol        ← Smart contract
├── scripts/
│   └── deploy.ts               ← Deployment script
├── hardhat.config.ts           ← Hardhat + Ritual Chain config
├── package.json                ← Contract dependencies
├── .env.example                ← Contract env template
├── frontend/
│   ├── src/
│   │   ├── app/                ← Next.js pages
│   │   ├── components/         ← React components
│   │   ├── hooks/              ← Wagmi hooks
│   │   └── lib/                ← Config + puzzle logic
│   ├── package.json
│   └── .env.example            ← Frontend env template
└── README.md
```

---

## Step 1 — Deploy the Smart Contract

### 1.1 Install contract dependencies
Open PowerShell in VS Code, navigate to the root folder:
```powershell
cd RitualPuzzle
npm install
```

### 1.2 Set up environment
```powershell
copy .env.example .env
```
Edit `.env` and fill in:
```
PRIVATE_KEY=your_wallet_private_key_here
RITUAL_RPC_URL=https://rpc.ritualfoundation.org
```

> ⚠️ Never share your private key. Export it from MetaMask: Account Details → Export Private Key

### 1.3 Compile the contract
```powershell
npm run compile
```

### 1.4 Deploy to Ritual Testnet
```powershell
npm run deploy
```

You'll see output like:
```
✅ RitualPuzzle deployed to: 0xABCDEF...
👉 Copy this address into your frontend/.env.local:
NEXT_PUBLIC_CONTRACT_ADDRESS=0xABCDEF...
```

**Copy that contract address — you need it in Step 2.**

---

## Step 2 — Run the Frontend

### 2.1 Navigate to frontend
```powershell
cd frontend
npm install
```

### 2.2 Set up frontend environment
```powershell
copy .env.example .env.local
```
Edit `.env.local`:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourDeployedAddressHere
NEXT_PUBLIC_CHAIN_ID=1979
NEXT_PUBLIC_RPC_URL=https://rpc.ritualfoundation.org
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

> Get a free WalletConnect Project ID at https://cloud.walletconnect.com → Create Project

### 2.3 Run locally
```powershell
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Step 3 — Deploy to Vercel

### 3.1 Push to GitHub
```powershell
cd .. # back to RitualPuzzle root
git init
git add .
git commit -m "Initial RitualPuzzle commit"
git remote add origin https://github.com/YOUR_USERNAME/ritual-puzzle.git
git push -u origin main
```

### 3.2 Deploy on Vercel
1. Go to https://vercel.com → New Project
2. Import your GitHub repo
3. Set **Root Directory** to `frontend`
4. Add all environment variables from `.env.local`
5. Click Deploy ✅

---

## How to Play
1. Visit the site and see the black cat image preview
2. Click **SCRAMBLE & PLAY** — tiles get shuffled
3. Click any tile **adjacent to the empty space** to slide it
4. Rearrange all tiles to restore the original image
5. When solved, connect your MetaMask wallet
6. Click **RECORD ONCHAIN** — pays 0.001 RITUAL and writes your solve to the blockchain permanently

---

## Contract Functions
| Function | Description |
|----------|-------------|
| `recordSolve(puzzleId, moves)` | Records a solve, requires 0.001 RITUAL payment |
| `getLeaderboard(limit)` | Returns recent solves |
| `getTotalSolves()` | Total number of onchain solves |
| `setSolvePrice(newPrice)` | Owner only: update solve fee |
| `withdraw()` | Owner only: withdraw accumulated RITUAL |

---

## Tech Stack
- **Blockchain:** Ritual Chain Testnet (Chain ID: 1979)
- **Smart Contract:** Solidity 0.8.20 + Hardhat
- **Frontend:** Next.js 14 + TypeScript
- **Wallet:** wagmi v2 + viem + RainbowKit
- **Styling:** Tailwind CSS + Framer Motion
- **Deploy:** Vercel

---

## Troubleshooting

**"Cannot connect to network"** → Make sure Ritual Testnet is added to MetaMask with correct RPC and Chain ID 1979

**"Insufficient funds"** → Get testnet RITUAL tokens from the Ritual faucet

**Canvas not rendering** → Allow cross-origin images in browser; try refreshing

**Deploy fails** → Double-check your PRIVATE_KEY has no spaces and has enough RITUAL for gas
