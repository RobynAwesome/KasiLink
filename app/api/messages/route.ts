import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
  fetchMessages,
  RouteError,
  sendMessage,
} from "@/features/chat/messages-service";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const conversationId = searchParams.get("conversationId");
    if (!conversationId) {
      return NextResponse.json(
        { error: "conversationId is required" },
        { status: 400 },
      );
    }

    const messages = await fetchMessages({ userId, conversationId });
    return NextResponse.json({ messages });
  } catch (err) {
    if (err instanceof RouteError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    console.error("[GET /api/messages]", err);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }

    const body = await req.json();
    const { message } = await sendMessage({ userId, body });
    return NextResponse.json({ message }, { status: 201 });
  } catch (err) {
    if (err instanceof RouteError) {
      return NextResponse.json(
        { error: err.message, details: err.details },
        { status: err.status },
      );
    }
    console.error("[POST /api/messages]", err);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
