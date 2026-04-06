"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/format";

interface Message {
  _id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

interface DefaultChatPanelProps {
  conversationId: string;
  gigTitle: string;
}

export default function DefaultChatPanel({
  conversationId,
  gigTitle,
}: DefaultChatPanelProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [copyFeedbackId, setCopyFeedbackId] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchMessages = async () => {
      if (document.visibilityState === "hidden") return;
      try {
        const res = await fetch(`/api/messages?conversationId=${conversationId}`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setMessages(data.messages ?? []);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 6000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [conversationId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const messageText = text.trim();
    if (!messageText || sending) return;

    setSending(true);
    setSendError("");
    setText("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, text: messageText }),
      });
      if (!res.ok) {
        setText(messageText);
        setSendError(
          "Message failed to send. Check your connection and try again.",
        );
        return;
      }
      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } catch {
      setText(messageText);
      setSendError("Message failed to send. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const copyMessage = async (messageId: string, content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopyFeedbackId(messageId);
      setTimeout(() => setCopyFeedbackId(""), 1200);
    } catch {
      setSendError("Could not copy message. Please try again.");
    }
  };

  return (
    <div className="kasi-card min-h-[70vh] flex flex-col">
      <div className="mb-4 border-b border-outline-variant/40 pb-4">
        <p className="text-xs uppercase tracking-wider text-outline">Conversation</p>
        <h3 className="text-lg font-bold">{gigTitle}</h3>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {loading ? (
          <p className="py-8 text-center text-sm text-on-surface-variant">
            Loading messages...
          </p>
        ) : messages.length === 0 ? (
          <div className="py-8 text-center text-sm text-on-surface-variant space-y-3">
            <p>No messages yet. Start the conversation below.</p>
            <Link href="/marketplace" className="btn btn-outline btn-sm">
              Find gigs in marketplace
            </Link>
          </div>
        ) : (
          messages.map((message) => {
            const mine = message.senderId === user?.id;
            return (
              <div
                key={message._id}
                className={`max-w-[85%] rounded-xl px-3 py-2 ${
                  mine
                    ? "ml-auto bg-primary text-on-primary"
                    : "bg-surface-container text-on-surface"
                }`}
              >
                <p className="text-xs font-semibold mb-1 opacity-85">
                  {mine ? "You" : message.senderName}
                </p>
                <p className="text-sm leading-relaxed break-words">{message.text}</p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <p className="text-[10px] opacity-75">
                    {formatRelativeTime(message.createdAt)}
                  </p>
                  <button
                    type="button"
                    onClick={() => copyMessage(message._id, message.text)}
                    className="text-[10px] underline underline-offset-2 opacity-85 hover:opacity-100"
                  >
                    {copyFeedbackId === message._id ? "Copied" : "Copy"}
                  </button>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSend} className="mt-4 flex gap-2 pt-3 border-t border-outline-variant/30">
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          className="kasi-input flex-1"
          placeholder="Type your message..."
          aria-label="Message text"
          maxLength={1000}
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="btn btn-primary"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </form>
      {sendError && (
        <p className="mt-2 text-xs text-danger">
          {sendError} You can retry by pressing Send again.
        </p>
      )}
    </div>
  );
}
