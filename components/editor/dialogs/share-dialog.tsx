"use client";

import { useState, useEffect, useCallback } from "react";
import { Link2, X, UserMinus, Loader2, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Collaborator {
  email: string;
  name: string | null;
  imageUrl: string | null;
}

interface ShareDialogProps {
  projectId: string;
  projectName: string;
  isOwner: boolean;
  open: boolean;
  onClose: () => void;
}

function CollaboratorAvatar({
  name,
  email,
  imageUrl,
}: {
  name: string | null;
  email: string;
  imageUrl: string | null;
}) {
  const initials = name
    ? name
        .split(" ")
        .map((p) => p[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : email[0].toUpperCase();

  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt={name ?? email}
        className="size-8 rounded-full object-cover shrink-0"
      />
    );
  }

  return (
    <div className="size-8 rounded-full bg-subtle border border-surface-border flex items-center justify-center shrink-0">
      <span className="text-xs font-medium text-copy-secondary">
        {initials}
      </span>
    </div>
  );
}

export function ShareDialog({
  projectId,
  projectName,
  isOwner,
  open,
  onClose,
}: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [removingEmail, setRemovingEmail] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);

  const fetchCollaborators = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`);
      if (!res.ok) {
        setError("Failed to load collaborators");
        return;
      }
      const data = (await res.json()) as { collaborators: Collaborator[] };
      setError(null);
      setCollaborators(data.collaborators);
    } catch {
      setError("Failed to load collaborators");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (open) {
      fetchCollaborators();
      setInviteEmail("");
      setInviteError(null);
    }
  }, [open, fetchCollaborators]);

  async function handleInvite() {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    setInviteError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      });
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setInviteError(data.error ?? "Failed to invite");
        return;
      }
      setInviteEmail("");
      await fetchCollaborators();
    } finally {
      setInviting(false);
    }
  }

  async function handleRemove(email: string) {
    setRemovingEmail(email);
    try {
      const res = await fetch(
        `/api/projects/${projectId}/collaborators/${encodeURIComponent(email)}`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) {
        throw new Error("Failed to remove collaborator");
      }
      setCollaborators((prev) => prev.filter((c) => c.email !== email));
    } finally {
      setRemovingEmail(null);
    }
  }

  async function handleCopyLink() {
    const url = `${window.location.origin}/editor/${projectId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
      setCopyError(true);
      setTimeout(() => setCopyError(false), 2000);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md bg-surface border border-surface-border rounded-3xl p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-surface-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-semibold text-copy-primary">
              Share &ldquo;{projectName}&rdquo;
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              aria-label="Close"
            >
              <X className="size-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 py-4 flex flex-col gap-5">
          {/* Copy link */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 border border-surface-border rounded-xl h-9 px-3 text-sm text-copy-secondary hover:text-copy-primary hover:bg-subtle"
            onClick={handleCopyLink}
          >
            {copied ? (
              <Check className="size-4 text-success shrink-0" />
            ) : copyError ? (
              <Link2 className="size-4 text-error shrink-0" />
            ) : (
              <Link2 className="size-4 shrink-0" />
            )}
            {copied
              ? "Copied!"
              : copyError
                ? "Failed to copy"
                : "Copy project link"}
          </Button>

          {/* Collaborators */}
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-copy-muted uppercase tracking-wider">
              Collaborators
            </p>

            {loading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="size-4 animate-spin text-copy-muted" />
              </div>
            ) : error ? (
              <p className="text-sm text-error py-2">{error}</p>
            ) : collaborators.length === 0 ? (
              <p className="text-sm text-copy-muted py-2">
                No collaborators yet.
              </p>
            ) : (
              <ScrollArea className="max-h-48">
                <div className="flex flex-col gap-1">
                  {collaborators.map((c) => (
                    <div
                      key={c.email}
                      className="flex items-center gap-3 px-1 py-1.5 rounded-xl"
                    >
                      <CollaboratorAvatar
                        name={c.name}
                        email={c.email}
                        imageUrl={c.imageUrl}
                      />
                      <div className="flex-1 min-w-0">
                        {c.name && (
                          <p className="text-sm font-medium text-copy-primary truncate">
                            {c.name}
                          </p>
                        )}
                        <p className="text-xs text-copy-muted truncate">
                          {c.email}
                        </p>
                      </div>
                      {isOwner && (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleRemove(c.email)}
                          disabled={removingEmail === c.email}
                          aria-label={`Remove ${c.email}`}
                          className="text-copy-muted hover:text-error shrink-0"
                        >
                          {removingEmail === c.email ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <UserMinus className="size-3.5" />
                          )}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Invite (owner only) */}
          {isOwner && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium text-copy-muted uppercase tracking-wider">
                Invite by email
              </p>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value);
                    setInviteError(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                  className="flex-1 h-9 text-sm text-white bg-elevated border-surface-border rounded-xl"
                />
                <Button
                  size="sm"
                  onClick={handleInvite}
                  disabled={inviting || !inviteEmail.trim()}
                  className="h-9 px-4 rounded-xl"
                >
                  {inviting ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    "Invite"
                  )}
                </Button>
              </div>
              {inviteError && (
                <p className="text-xs text-error">{inviteError}</p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
