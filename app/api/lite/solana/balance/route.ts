import { NextRequest, NextResponse } from "next/server";
import { SOLANA_WALLET_ENDPOINT } from "@/lib/solana-wallet-spine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    // [BlackMass] Testing direct JSON-RPC read without @solana/web3.js bloat
    const response = await fetch(SOLANA_WALLET_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "getBalance",
        params: [address],
      }),
      // Cache briefly to avoid spamming the RPC
      next: { revalidate: 10 },
    });

    if (!response.ok) {
      throw new Error(`RPC responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || "RPC Error");
    }

    // Convert Lamports to SOL (1 SOL = 1,000,000,000 Lamports)
    const lamports = data.result?.value ?? 0;
    const sol = lamports / 1_000_000_000;

    return NextResponse.json({ sol, lamports });
  } catch (error) {
    console.error("[Solana RPC Proxy Error]:", error);
    return NextResponse.json(
      { error: "Failed to fetch balance from cluster" },
      { status: 500 }
    );
  }
}
