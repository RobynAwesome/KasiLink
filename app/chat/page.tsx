import { Suspense } from "react";
import ChatPageClient from "@/components/chat/ChatPageClient";

function ChatPageFallback() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="kasi-card min-h-[50vh] flex items-center justify-center">
        <p className="text-sm text-on-surface-variant">Loading chat...</p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatPageFallback />}>
      <ChatPageClient />
    </Suspense>
  );
}
