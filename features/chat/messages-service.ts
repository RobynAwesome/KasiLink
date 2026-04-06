import Conversation from "@/lib/models/Conversation";
import Message from "@/lib/models/Message";
import Notification from "@/lib/models/Notification";
import User from "@/lib/models/User";
import connectDB from "@/lib/db";
import { sanitize, validateMessage } from "@/lib/validation";

export class RouteError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function loadConversation(conversationId: string) {
  await connectDB();
  return Conversation.findById(conversationId);
}

export async function fetchMessages({
  userId,
  conversationId,
}: {
  userId: string;
  conversationId: string;
}) {
  const conversation = await loadConversation(conversationId);
  if (!conversation) {
    throw new RouteError(404, "Conversation not found");
  }
  if (!conversation.participants.includes(userId)) {
    throw new RouteError(403, "Forbidden");
  }

  await Message.updateMany(
    { conversationId, senderId: { $ne: userId }, readAt: null },
    { readAt: new Date() },
  );

  const messages = await Message.find({ conversationId })
    .sort({ createdAt: 1 })
    .limit(100)
    .lean();

  return messages;
}

export async function sendMessage({
  userId,
  body,
}: {
  userId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any;
}) {
  const validation = validateMessage(body);
  if (!validation.valid) {
    throw new RouteError(400, "Invalid message payload", validation.errors);
  }

  const conversationId = String(body.conversationId ?? "").trim();
  const conversation = await loadConversation(conversationId);
  if (!conversation) {
    throw new RouteError(404, "Conversation not found");
  }
  if (!conversation.participants.includes(userId)) {
    throw new RouteError(403, "Forbidden");
  }

  await connectDB();
  const sender = await User.findOne({ clerkId: userId });
  if (!sender) {
    throw new RouteError(404, "Profile not found");
  }

  const text = sanitize(body.text).slice(0, 1000);
  const message = await Message.create({
    conversationId: conversation._id,
    senderId: userId,
    senderName: sender.displayName || "Anonymous",
    text,
  });

  conversation.lastMessageAt = new Date();
  conversation.lastMessageText = text.slice(0, 100);
  await conversation.save();

  const otherParticipant = conversation.participants.find(
    (participant) => participant !== userId,
  );
  if (otherParticipant) {
    await Notification.create({
      userId: otherParticipant,
      type: "message",
      title: "New message received",
      message: `${sender.displayName || "Someone"} sent you a message`,
      link: "/chat",
    });
  }

  return { message };
}
