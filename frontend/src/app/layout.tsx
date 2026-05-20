import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "RitualPuzzle — Onchain Sliding Puzzle",
  description: "Solve the sliding puzzle and record your victory permanently on Ritual Chain.",
  openGraph: {
    title: "RitualPuzzle",
    description: "Onchain sliding puzzle on Ritual Chain",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
