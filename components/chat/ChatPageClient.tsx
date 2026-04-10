"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import SkinSelector, { type SkinId } from "@/components/chat-skins/SkinSelector";
import WhatsAppSkin from "@/components/chat-skins/WhatsAppSkin";
import DiscordSkin from "@/components/chat-skins/DiscordSkin";
import InstagramSkin from "@/components/chat-skins/InstagramSkin";
import ConversationList from "@/components/chat/ConversationList";
import DefaultChatPanel from "@/components/chat/DefaultChatPanel";
import { Eyebrow, SectionHeading } from "@/components/ui/PagePrimitives";

interface Conversation {
  _id: string;
  gigId: string;
  gigTitle: string;
  lastMessageAt: string;
  lastMessageText?: string;
  participants: string[];
}

const SKIN_LABELS: Record<SkinId, string> = {
  default: "Default",
  whatsapp: "WhatsApp",
  discord: "Discord",
  instagram: "Instagram",
};

export default function ChatPageClient() {
  const { user, isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [activeSkin, setActiveSkin] = useState<SkinId>("default");
  const [loading, setLoading] = useState(true);
  const [conversationQuery, setConversationQuery] = useState(
    searchParams.get("q") ?? "",
  );
  // Track whether the URL write originated from local state to avoid sync loops
  const writingUrl = useRef(false);

  // URL → state: only sync when the URL changes externally (e.g. back/forward)
  useEffect(() => {
    if (writingUrl.current) return;
    const urlQuery = searchParams.get("q") ?? "";
    if (urlQuery !== conversationQuery) {
      setConversationQuery(urlQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // State → URL: debounce-free, guarded by ref to avoid loop
  useEffect(() => {
    writingUrl.current = true;
    const params = new URLSearchParams();
    if (conversationQuery.trim()) params.set("q", conversationQuery.trim());
    const nextUrl = params.toString() ? `/chat?${params.toString()}` : "/chat";
    router.replace(nextUrl, { scroll: false });
    // Reset guard after micro-task so the searchParams effect doesn't react
    Promise.resolve().then(() => { writingUrl.current = false; });
  }, [conversationQuery, router]);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  // Keep a ref to activeConversationId so the polling effect doesn't
  // restart the interval every time the user selects a different conversation.
  const activeConversationIdRef = useRef(activeConversationId);
  useEffect(() => { activeConversationIdRef.current = activeConversationId; }, [activeConversationId]);

  useEffect(() => {
    if (!isSignedIn) return;

    let cancelled = false;

    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/chat");
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        const nextConversations = (data.conversations ?? []) as Conversation[];
        setConversations(nextConversations);
        // Only auto-select on first load (no active conversation yet)
        if (!activeConversationIdRef.current && nextConversations.length > 0) {
          setActiveConversationId(nextConversations[0]._id);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchConversations();
    // Poll every 10s (reduced from 5s — conversations list changes rarely)
    const interval = setInterval(fetchConversations, 10_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  // isSignedIn is the only stable trigger; activeConversationId is via ref
  }, [isSignedIn]);

  const activeConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation._id === activeConversationId,
      ) ?? null,
    [conversations, activeConversationId],
  );

  const filteredConversations = useMemo(() => {
    const query = conversationQuery.trim().toLowerCase();
    if (!query) return conversations;
    return conversations.filter((conversation) =>
      conversation.gigTitle.toLowerCase().includes(query),
    );
  }, [conversations, conversationQuery]);

  const selectedConversationLabel = activeConversation
    ? activeConversation.gigTitle
    : "None selected";

  const skinContent = useMemo(() => {
    if (!activeConversation) return null;

    if (activeSkin === "whatsapp") {
      return (
        <WhatsAppSkin
          conversationId={activeConversation._id}
          gigTitle={activeConversation.gigTitle}
        />
      );
    }

    if (activeSkin === "discord") {
      return (
        <DiscordSkin
          conversationId={activeConversation._id}
          gigTitle={activeConversation.gigTitle}
        />
      );
    }

    if (activeSkin === "instagram") {
      return (
        <InstagramSkin
          conversationId={activeConversation._id}
          gigTitle={activeConversation.gigTitle}
        />
      );
    }

    return null;
  }, [activeConversation, activeSkin]);

  if (!isLoaded || !isSignedIn) {
    return null;
  }

  return (
    <div className="container page-shell max-w-6xl">
      <section className="page-hero animate-fade-in">
        <div className="page-hero-grid">
          <div className="page-hero-copy">
            <Eyebrow>Messaging</Eyebrow>
            <h1 className="page-hero-title mt-4 font-headline font-black text-on-background">
              Keep gig coordination direct, fast, and readable.
            </h1>
            <p className="page-hero-description">
              The default KasiLink chat stays calm and legible, while the skin
              switcher lets you explore alternate community looks without
              breaking the workflow.
            </p>
          </div>
          <aside className="page-hero-aside">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-outline">
              Session
            </p>
            <p className="mt-3 text-sm text-on-surface-variant">
              Signed in as {user?.firstName || user?.username || "member"}.
            </p>
            <p className="mt-3 text-sm text-on-surface-variant">
              Search by gig title, open a thread, and continue the conversation
              without leaving the product shell.
            </p>
          </aside>
        </div>
      </section>

      <div className="py-8">
        <SectionHeading
          eyebrow={<Eyebrow tone="neutral">Chat skins</Eyebrow>}
          title="Switch the visual tone, keep the same conversation state"
          description="This lets the product experiment with familiar chat aesthetics while keeping the functional workflow stable."
        />
        <SkinSelector activeSkin={activeSkin} onSkinChange={setActiveSkin} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="kasi-card h-fit">
          <div className="mb-4">
            <h2 className="text-lg font-bold">Conversations</h2>
            <p className="text-sm text-on-surface-variant">
              Recent gig conversations and community follow-ups.
            </p>
          </div>

          <div className="mb-4 space-y-3">
            <div className="flex gap-2">
              <input
                type="search"
                value={conversationQuery}
                onChange={(event) => setConversationQuery(event.target.value)}
                className="kasi-input"
                placeholder="Search conversations by gig title..."
                aria-label="Search conversations"
              />
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setConversationQuery("")}
                disabled={!conversationQuery.trim()}
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="badge badge-primary">
                {filteredConversations.length} shown
              </span>
              <span className="badge badge-secondary">
                Selected: {selectedConversationLabel}
              </span>
            </div>
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-on-surface-variant">
              Loading conversations...
            </p>
          ) : conversations.length > 0 && filteredConversations.length === 0 ? (
            <div className="rounded-xl border border-dashed border-outline-variant p-6 text-center">
              <p className="text-sm text-on-surface-variant">
                No conversations match &quot;{conversationQuery.trim()}&quot;.
              </p>
              <p className="mt-2 text-xs text-outline">
                Try a different gig title or clear search.
              </p>
            </div>
          ) : (
            <ConversationList
              conversations={filteredConversations}
              activeConversationId={activeConversationId}
              onSelect={setActiveConversationId}
            />
          )}
        </aside>

        <section className="space-y-4">
          {activeConversation ? (
            <>
              <div className="kasi-card border border-outline-variant/60">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-outline">
                      Active skin
                    </p>
                    <h2 className="text-xl font-bold">
                      {SKIN_LABELS[activeSkin]} on {activeConversation.gigTitle}
                    </h2>
                  </div>
                  <p className="text-sm text-on-surface-variant">
                    Conversation ID: {activeConversation._id}
                  </p>
                </div>
              </div>

              {activeSkin === "default" ? (
                <DefaultChatPanel
                  conversationId={activeConversation._id}
                  gigTitle={activeConversation.gigTitle}
                />
              ) : (
                skinContent
              )}
            </>
          ) : (
            <div className="kasi-card min-h-[70vh] flex items-center justify-center text-center">
              <div>
                <h2 className="text-xl font-bold">No conversation selected</h2>
                <p className="mt-2 text-sm text-on-surface-variant">
                  Pick a conversation from the list to open the chat skins.
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
