"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";

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
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchMessages = async () => {
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
    setText("");
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, text: messageText }),
      });
      if (!res.ok) {
        setText(messageText);
        return;
      }
      const data = await res.json();
      if (data.message) {
        setMessages((prev) => [...prev, data.message]);
      }
    } finally {
      setSending(false);
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
          <p className="py-8 text-center text-sm text-on-surface-variant">
            No messages yet. Start the conversation below.
          </p>
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
                <p className="mt-1 text-[10px] opacity-75">
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
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
    </div>
  );
}
