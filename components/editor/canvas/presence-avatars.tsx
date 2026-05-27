"use client";

import { useOthers } from "@liveblocks/react";
import { useUser, UserButton } from "@clerk/nextjs";

function getInitials(name: string): string {
  if (!name || !name.trim()) return "?";
  return name
    .trim()
    .split(" ")
    .filter((part) => part.length > 0)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function PresenceAvatars() {
  const others = useOthers();
  const { user } = useUser();
  const currentUserId = user?.id;

  const collaborators = others.filter((other) => other.id !== currentUserId);
  const visible = collaborators.slice(0, 5);
  const overflow = collaborators.length - 5;

  return (
    <div className="absolute top-3 right-3 z-10 flex items-center gap-2 pointer-events-none">
      {visible.length > 0 && (
        <div className="flex items-center">
          {visible.map((other, index) => {
            const info = other.info;
            return (
              <div
                key={other.connectionId}
                className="size-8 rounded-full ring-2 ring-surface flex items-center justify-center overflow-hidden shrink-0"
                style={{
                  marginLeft: index > 0 ? "-8px" : undefined,
                  zIndex: visible.length - index,
                  position: "relative",
                }}
                title={info?.name}
              >
                {info?.avatar ? (
                  <img
                    src={info.avatar}
                    alt={info.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <div
                    className="size-full flex items-center justify-center text-xs font-semibold text-white"
                    style={{ backgroundColor: info?.color ?? "#6366f1" }}
                  >
                    {info?.name ? getInitials(info.name) : "?"}
                  </div>
                )}
              </div>
            );
          })}
          {overflow > 0 && (
            <div
              className="size-8 rounded-full ring-2 ring-surface bg-subtle flex items-center justify-center text-xs font-semibold text-copy-muted shrink-0"
              style={{ marginLeft: "-8px", position: "relative", zIndex: 0 }}
            >
              +{overflow}
            </div>
          )}
        </div>
      )}

      {visible.length > 0 && <div className="w-px h-5 bg-surface-border" />}

      <div className="pointer-events-auto">
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "!size-8",
            },
          }}
        />
      </div>
    </div>
  );
}
