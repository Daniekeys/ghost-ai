"use client";

import { LiveList } from "@liveblocks/client";
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import { ErrorBoundary } from "react-error-boundary";
import { CanvasFlow } from "./canvas-flow";
import { PresenceAvatars } from "./presence-avatars";
import { AiSidebar } from "../ai-sidebar";
import { useWorkspace } from "../workspace-provider";

interface CanvasRoomProps {
  roomId: string;
}

function CanvasLoading() {
  return (
    <div className="w-full h-full bg-base flex items-center justify-center">
      <p className="text-sm text-copy-muted animate-pulse">Connecting…</p>
    </div>
  );
}

function CanvasConnectionError({ error }: { error?: Error }) {
  const isAuth =
    error?.message?.includes("403") ||
    error?.message?.includes("401") ||
    error?.message?.includes("Unauthorized") ||
    error?.message?.includes("Forbidden");

  const isService = error?.message?.includes("503");

  return (
    <div className="w-full h-full bg-base flex flex-col items-center justify-center gap-3">
      <p className="text-sm font-medium text-copy">
        {isAuth
          ? "You don't have access to this canvas."
          : isService
            ? "Authentication service is temporarily unavailable."
            : "Could not connect to the canvas."}
      </p>
      <p className="text-xs text-copy-muted">
        {isAuth
          ? "Ask the project owner to invite you."
          : "Refresh the page to try again."}
      </p>
      {!isAuth && (
        <button
          onClick={() => window.location.reload()}
          className="mt-1 text-xs text-accent hover:underline"
        >
          Refresh
        </button>
      )}
    </div>
  );
}

export function CanvasRoom({ roomId }: CanvasRoomProps) {
  const { isAiSidebarOpen, toggleAiSidebar } = useWorkspace();

  return (
    <LiveblocksProvider
      authEndpoint={async (room) => {
        const response = await fetch("/api/liveblocks-auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: room }),
        });

        if (!response.ok) {
          let message = `Canvas auth failed (${response.status})`;
          try {
            const data = await response.json();
            if (data?.error) message = `${data.error} (${response.status})`;
          } catch {
            // body wasn't JSON — keep the status-code message
          }
          throw new Error(message);
        }

        return response.json();
      }}
    >
      <RoomProvider
        id={roomId}
        initialPresence={{ cursor: null, thinking: false }}
        initialStorage={{ aiStatusFeed: null, aiChat: new LiveList([]) }}
      >
        <div className="flex h-full w-full">
          <div className="relative flex-1 overflow-hidden">
            <ErrorBoundary fallbackRender={({ error }) => <CanvasConnectionError error={error instanceof Error ? error : undefined} />}>
              <ClientSideSuspense fallback={<CanvasLoading />}>
                <CanvasFlow />
              </ClientSideSuspense>
            </ErrorBoundary>
            <PresenceAvatars />
          </div>
          <AiSidebar isOpen={isAiSidebarOpen} onClose={toggleAiSidebar} />
        </div>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
