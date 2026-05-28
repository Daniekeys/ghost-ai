import { LiveList } from "@liveblocks/client";

declare global {
  interface Liveblocks {
    Presence: {
      cursor: { x: number; y: number } | null;
      thinking: boolean;
    };

    Storage: {
      aiStatusFeed: {
        message: string;
        type: "thinking" | "complete" | "error";
        runId: string;
        timestamp: number;
        text?: string;
      } | null;
      aiChat: LiveList<{
        id: string;
        sender: { id: string; name: string };
        role: "user" | "assistant";
        content: string;
        timestamp: number;
        source?: "architect" | "chat";
      }>;
    };

    UserMeta: {
      id: string;
      info: {
        name: string;
        avatar: string;
        color: string;
      };
    };

    RoomEvent:
      | { type: "AI_STATUS"; message: string; runId: string }
      | { type: "AI_COMPLETE"; message: string; runId: string }
      | { type: "AI_ERROR"; message: string; runId: string };

    ThreadMetadata: {};

    RoomInfo: {};
  }
}

export {};
