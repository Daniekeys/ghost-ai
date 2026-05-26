"use client";

import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense";
import { ErrorBoundary } from "react-error-boundary";
import { CanvasFlow } from "./canvas-flow";
import { PresenceAvatars } from "./presence-avatars";

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

function CanvasConnectionError() {
  return (
    <div className="w-full h-full bg-base flex items-center justify-center">
      <p className="text-sm text-copy-muted">
        Could not connect to the canvas. Refresh to try again.
      </p>
    </div>
  );
}

export function CanvasRoom({ roomId }: CanvasRoomProps) {
  return (
    <LiveblocksProvider
      authEndpoint={async (room) => {
        const response = await fetch("/api/liveblocks-auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectId: room }),
        });
        return response.json();
      }}
    >
      <RoomProvider
        id={roomId}
        initialPresence={{ cursor: null, thinking: false }}
      >
        <div className="relative w-full h-full">
          <ErrorBoundary fallback={<CanvasConnectionError />}>
            <ClientSideSuspense fallback={<CanvasLoading />}>
              <CanvasFlow />
            </ClientSideSuspense>
          </ErrorBoundary>
          <PresenceAvatars />
        </div>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
