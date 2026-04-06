"use client";

import { KeyboardEvent, useRef } from "react";
import { formatRelativeTime } from "@/lib/format";

interface Conversation {
  _id: string;
  gigTitle: string;
  lastMessageAt: string;
  lastMessageText?: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  activeConversationId: string;
  onSelect: (conversationId: string) => void;
}

export default function ConversationList({
  conversations,
  activeConversationId,
  onSelect,
}: ConversationListProps) {
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const onOptionKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(conversations[index]._id);
      return;
    }

    if (
      event.key !== "ArrowDown" &&
      event.key !== "ArrowUp" &&
      event.key !== "Home" &&
      event.key !== "End"
    ) {
      return;
    }

    event.preventDefault();
    let nextIndex = index;
    if (event.key === "ArrowDown") {
      nextIndex = (index + 1) % conversations.length;
    } else if (event.key === "ArrowUp") {
      nextIndex = (index - 1 + conversations.length) % conversations.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = conversations.length - 1;
    }

    onSelect(conversations[nextIndex]._id);
    optionRefs.current[nextIndex]?.focus();
  };

  if (conversations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-outline-variant p-6 text-center">
        <p className="text-sm text-on-surface-variant">No conversations yet.</p>
        <p className="mt-2 text-xs text-outline">
          Start a chat from a gig detail page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2" role="listbox" aria-label="Conversation list">
      {conversations.map((conversation) => {
        const isActive = conversation._id === activeConversationId;
        const index = conversations.findIndex((item) => item._id === conversation._id);
        return (
          <button
            key={conversation._id}
            ref={(element) => {
              optionRefs.current[index] = element;
            }}
            onClick={() => onSelect(conversation._id)}
            onKeyDown={(event) => onOptionKeyDown(event, index)}
            role="option"
            aria-selected={isActive}
            aria-label={`Open conversation: ${conversation.gigTitle}`}
            className={`w-full rounded-xl border px-4 py-3 text-left transition ${
              isActive
                ? "border-primary bg-primary-container/30"
                : "border-outline-variant bg-surface hover:border-primary/50"
            } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{conversation.gigTitle}</p>
                <p className="mt-1 line-clamp-1 text-xs text-on-surface-variant">
                  {conversation.lastMessageText || "No messages yet"}
                </p>
              </div>
              <span
                className="text-[10px] uppercase tracking-wider text-outline"
                title={new Date(conversation.lastMessageAt).toLocaleString()}
              >
                {formatRelativeTime(conversation.lastMessageAt)}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
