declare global {
  interface Liveblocks {
    Presence: {
      cursor: { x: number; y: number } | null;
      thinking: boolean;
    };

    Storage: {};

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
