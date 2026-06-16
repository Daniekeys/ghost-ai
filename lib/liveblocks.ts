import { Liveblocks } from "@liveblocks/node";

declare const global: typeof globalThis & { liveblocksGlobal?: Liveblocks };

const CURSOR_COLORS = [
  "#E57373",
  "#F06292",
  "#BA68C8",
  "#7986CB",
  "#4FC3F7",
  "#4DD0E1",
  "#4DB6AC",
  "#81C784",
  "#DCE775",
  "#FFD54F",
  "#FF8A65",
  "#A1887F",
];

type LiveblocksWriteAccesses = Record<string, ["room:write"]>;

export function getCursorColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }
  return CURSOR_COLORS[hash % CURSOR_COLORS.length];
}

export function getLiveblocksClient(): Liveblocks {
  if (!global.liveblocksGlobal) {
    global.liveblocksGlobal = new Liveblocks({
      secret: process.env.LIVEBLOCKS_SECRET_KEY!,
    });
  }
  return global.liveblocksGlobal;
}

export async function ensureLiveblocksRoom(roomId: string): Promise<void> {
  const secret = process.env.LIVEBLOCKS_SECRET_KEY;
  if (!secret) {
    throw new Error("LIVEBLOCKS_SECRET_KEY is not set in this environment");
  }
  if (!secret.startsWith("sk_")) {
    throw new Error(
      `LIVEBLOCKS_SECRET_KEY must be a secret key starting with "sk_" — got a key starting with "${secret.slice(0, 3)}". Check your env vars.`,
    );
  }
  const liveblocks = getLiveblocksClient();
  await liveblocks.upsertRoom(roomId, {
    update: {},
    create: { defaultAccesses: [] },
  });
}

export async function grantLiveblocksRoomAccess(
  roomId: string,
  userId: string,
): Promise<void> {
  const liveblocks = getLiveblocksClient();
  const usersAccesses: LiveblocksWriteAccesses = {
    [userId]: ["room:write"],
  };

  await liveblocks.upsertRoom(roomId, {
    update: { usersAccesses },
    create: {
      defaultAccesses: [],
      usersAccesses,
    },
  });
}
