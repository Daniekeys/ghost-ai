"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Bot, X, FileText, Download, Loader2 } from "lucide-react"
import { useStorage, useSelf, useMutation } from "@liveblocks/react"
import { useRealtimeRun } from "@trigger.dev/react-hooks"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useWorkspace } from "./workspace-provider"
import { AiStatusFeedPayloadSchema, ChatMessageSchema, type ChatMessage } from "@/types/tasks"

const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false })

const STARTER_CHIPS = [
  "Design an e-commerce backend",
  "Create a chat app architecture",
  "Build a CI/CD pipeline",
]

const TERMINAL_STATUSES = new Set([
  "COMPLETED",
  "FAILED",
  "CANCELED",
  "TIMED_OUT",
  "CRASHED",
  "INTERRUPTED",
  "SYSTEM_FAILURE",
])

interface SpecItem {
  id: string
  createdAt: string
}

interface RunTrackerProps {
  runId: string
  accessToken: string
  onTerminal: (status: string) => void
}

function RunTracker({ runId, accessToken, onTerminal }: RunTrackerProps) {
  const { run } = useRealtimeRun(runId, { accessToken })

  useEffect(() => {
    if (run && TERMINAL_STATUSES.has(run.status)) {
      onTerminal(run.status)
    }
  }, [run?.status, onTerminal])

  return null
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return (
    date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) +
    " · " +
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  )
}

interface AiSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function AiSidebar({ isOpen, onClose }: AiSidebarProps) {
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [pendingRunId, setPendingRunId] = useState<string | null>(null)
  const [publicToken, setPublicToken] = useState<string | null>(null)
  const architectScrollEndRef = useRef<HTMLDivElement>(null)

  const [chatInput, setChatInput] = useState("")
  const [chatError, setChatError] = useState<string | null>(null)
  const chatScrollEndRef = useRef<HTMLDivElement>(null)
  const chatTextareaRef = useRef<HTMLTextAreaElement>(null)

  // Specs tab state
  const [activeTab, setActiveTab] = useState("architect")
  const [specs, setSpecs] = useState<SpecItem[]>([])
  const [specsLoading, setSpecsLoading] = useState(false)
  const [previewSpec, setPreviewSpec] = useState<SpecItem | null>(null)
  const [specContent, setSpecContent] = useState<string | null>(null)
  const [specContentLoading, setSpecContentLoading] = useState(false)
  const [specGenerating, setSpecGenerating] = useState(false)
  const [specRunId, setSpecRunId] = useState<string | null>(null)
  const [specRunToken, setSpecRunToken] = useState<string | null>(null)

  const { projectId } = useWorkspace()
  const self = useSelf()

  // Subscribe to the shared ai-status-feed from Liveblocks Storage
  const rawFeed = useStorage((root) => root.aiStatusFeed)
  const feedResult = rawFeed != null ? AiStatusFeedPayloadSchema.safeParse(rawFeed) : null
  const validFeed = feedResult?.success ? feedResult.data : null
  const feedIsThinking = validFeed?.type === "thinking"

  // Subscribe to the ai-chat feed from Liveblocks Storage
  const rawChatMessages = useStorage((root) => root.aiChat)
  const allChatMessages: ChatMessage[] = rawChatMessages
    ? rawChatMessages
        .map((msg) => ChatMessageSchema.safeParse(msg))
        .filter((r): r is { success: true; data: ChatMessage } => r.success)
        .map((r) => r.data)
    : []

  // Architect tab: only messages tagged as "architect"
  const architectMessages = allChatMessages.filter((m) => m.source === "architect")

  // Chat tab: messages tagged as "chat" or untagged (backward compat)
  const chatMessages = allChatMessages.filter((m) => !m.source || m.source === "chat")

  const appendChatMessage = useMutation(
    ({ storage }, message: ChatMessage) => {
      storage.get("aiChat").push(message)
    },
    [],
  )

  // Fetch specs when specs tab is active
  useEffect(() => {
    if (activeTab !== "specs" || !projectId) return
    let cancelled = false

    setSpecsLoading(true)
    fetch(`/api/projects/${projectId}/specs`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { specs: SpecItem[] }) => {
        if (!cancelled) setSpecs(data.specs ?? [])
      })
      .catch(() => {
        if (!cancelled) setSpecs([])
      })
      .finally(() => {
        if (!cancelled) setSpecsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [activeTab, projectId])

  async function generateSpecHandler() {
    if (!projectId || specGenerating) return
    setSpecGenerating(true)

    const chatHistory = architectMessages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }))

    try {
      const res = await fetch("/api/ai/spec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: projectId, chatHistory }),
      })
      if (!res.ok) throw new Error("Failed to trigger spec generation")
      const { runId } = (await res.json()) as { runId: string }

      const tokenRes = await fetch("/api/ai/spec/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runId }),
      })
      if (!tokenRes.ok) throw new Error("Failed to get spec run token")
      const { token } = (await tokenRes.json()) as { token: string }

      setSpecRunId(runId)
      setSpecRunToken(token)
    } catch {
      setSpecGenerating(false)
    }
  }

  function handleSpecTerminal(status: string) {
    setSpecGenerating(false)
    setSpecRunId(null)
    setSpecRunToken(null)
    if (status === "COMPLETED" && projectId) {
      setSpecsLoading(true)
      fetch(`/api/projects/${projectId}/specs`)
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then((data: { specs: SpecItem[] }) => setSpecs(data.specs ?? []))
        .catch(() => {})
        .finally(() => setSpecsLoading(false))
    }
  }

  function downloadSpec(specId: string) {
    const a = document.createElement("a")
    a.href = `/api/projects/${projectId}/specs/${specId}/download`
    a.download = `spec-${specId}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  async function openPreview(spec: SpecItem) {
    setPreviewSpec(spec)
    setSpecContent(null)
    setSpecContentLoading(true)
    try {
      const res = await fetch(`/api/projects/${projectId}/specs/${spec.id}/download`)
      if (res.ok) {
        setSpecContent(await res.text())
      }
    } finally {
      setSpecContentLoading(false)
    }
  }

  const handleTerminalStatus = (status: string) => {
    const isSuccess = status === "COMPLETED"
    appendChatMessage({
      id: `ai-${Date.now()}`,
      sender: { id: "ai-ghost", name: "Ghost AI" },
      role: "assistant",
      content: isSuccess
        ? "Done! The canvas has been updated with the generated architecture. Feel free to edit and refine it."
        : "Failed to generate architecture. Please try again.",
      timestamp: Date.now(),
      source: "architect",
    })
    setIsLoading(false)
    setPendingRunId(null)
    setPublicToken(null)
  }

  // Scroll to bottom when architect messages change
  useEffect(() => {
    architectScrollEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [architectMessages.length, isLoading, feedIsThinking])

  // Scroll to bottom when chat messages change
  useEffect(() => {
    chatScrollEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages.length])

  if (!isOpen) return null

  const inputDisabled = isLoading || feedIsThinking
  const chatStorageReady = rawChatMessages !== null
  const chatSendDisabled = !chatInput.trim() || !self || !chatStorageReady

  async function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || inputDisabled) return

    appendChatMessage({
      id: `user-${Date.now()}`,
      sender: { id: self?.id ?? "unknown", name: self?.info?.name ?? "You" },
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
      source: "architect",
    })

    setInput("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/ai/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: trimmed, roomId: projectId, projectId }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error((err as { error?: string }).error ?? `Request failed (${res.status})`)
      }

      const { runId, publicToken: token } = (await res.json()) as {
        runId: string
        publicToken: string
      }
      setPendingRunId(runId)
      setPublicToken(token)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong."
      appendChatMessage({
        id: `err-${Date.now()}`,
        sender: { id: "ai-ghost", name: "Ghost AI" },
        role: "assistant",
        content: message,
        timestamp: Date.now(),
        source: "architect",
      })
      setIsLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value)
    const ta = e.target
    ta.style.height = "auto"
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`
  }

  function sendChatMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed || !self || !chatStorageReady) return
    setChatError(null)

    const message: ChatMessage = {
      id: `chat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      sender: { id: self.id, name: self.info?.name ?? "Unknown" },
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
      source: "chat",
    }

    try {
      appendChatMessage(message)
      setChatInput("")
      if (chatTextareaRef.current) {
        chatTextareaRef.current.style.height = "auto"
      }
    } catch {
      setChatError("Failed to send message. Please try again.")
    }
  }

  function handleChatKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendChatMessage(chatInput)
    }
  }

  function handleChatTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setChatInput(e.target.value)
    const ta = e.target
    ta.style.height = "auto"
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`
  }

  return (
    <aside className="w-80 shrink-0 border-l border-surface-border bg-base/95 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="size-7 rounded-xl bg-ai/20 flex items-center justify-center shrink-0">
            <Bot className="size-4 text-ai-text" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-copy-primary leading-tight">
              AI Workspace
            </h2>
            <p className="text-xs text-copy-muted leading-tight">
              Collaborate with Ghost AI
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Close AI sidebar"
        >
          <X className="size-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col min-h-0 overflow-hidden"
      >
        <TabsList className="mx-3 mt-3 shrink-0">
          <TabsTrigger
            value="architect"
            className="flex-1 text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=inactive]:text-copy-muted"
          >
            Architect
          </TabsTrigger>
          <TabsTrigger
            value="chat"
            className="flex-1 text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=inactive]:text-copy-muted"
          >
            Chat
          </TabsTrigger>
          <TabsTrigger
            value="specs"
            className="flex-1 text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=inactive]:text-copy-muted"
          >
            Specs
          </TabsTrigger>
        </TabsList>

        {/* AI Architect tab */}
        <TabsContent
          value="architect"
          className="flex-1 flex flex-col min-h-0 mt-2 overflow-hidden p-0"
        >
          <ScrollArea className="flex-1 min-h-0">
            {architectMessages.length === 0 && !isLoading && !feedIsThinking ? (
              <div className="flex flex-col items-center gap-4 py-8 px-3">
                <div className="size-10 rounded-2xl bg-ai/20 flex items-center justify-center">
                  <Bot className="size-5 text-ai-text" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-copy-primary">
                    Ask Ghost AI
                  </p>
                  <p className="text-xs text-copy-muted mt-1 leading-relaxed">
                    Describe a system and Ghost AI will design the architecture
                    for you.
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 w-full">
                  {STARTER_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => sendMessage(chip)}
                      disabled={inputDisabled}
                      className="text-left px-3 py-2 rounded-xl bg-subtle text-xs text-ai-text hover:bg-elevated transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 p-3 pb-2">
                {architectMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "self-end bg-brand text-white"
                        : "self-start bg-elevated border border-surface-border text-ai-text",
                    )}
                  >
                    {msg.content}
                  </div>
                ))}
                {(isLoading || feedIsThinking) && (
                  <div className="self-start flex items-center gap-2 bg-elevated border border-surface-border rounded-xl px-3 py-2">
                    <Loader2 className="size-3.5 text-ai-text animate-spin" />
                    <span className="text-xs text-ai-text">
                      {validFeed?.type === "thinking"
                        ? validFeed.message
                        : "Ghost AI is thinking…"}
                    </span>
                  </div>
                )}
                <div ref={architectScrollEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input area */}
          <div className="px-3 pb-3 pt-2 border-t border-surface-border shrink-0 flex flex-col gap-2">
            {feedIsThinking && validFeed && (
              <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-elevated border border-brand/30 shrink-0">
                <div className="size-1.5 rounded-full bg-brand animate-pulse shrink-0" />
                <span className="text-xs text-brand font-medium leading-tight truncate">
                  {validFeed.message || "Ghost AI is thinking…"}
                </span>
              </div>
            )}
            <Textarea
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={
                inputDisabled
                  ? "Waiting for Ghost AI…"
                  : "Describe an architecture…"
              }
              disabled={inputDisabled}
              className="resize-none text-sm bg-elevated border-surface-border text-copy-primary placeholder:text-copy-faint overflow-y-auto disabled:opacity-60"
              style={{ minHeight: "72px", maxHeight: "160px" }}
              rows={3}
            />
            <Button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || inputDisabled}
              size="sm"
              className="self-end bg-brand text-white hover:bg-brand/90 disabled:opacity-40"
            >
              {isLoading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                "Send"
              )}
            </Button>
          </div>
        </TabsContent>

        {/* Chat tab */}
        <TabsContent
          value="chat"
          className="flex-1 flex flex-col min-h-0 mt-2 overflow-hidden p-0"
        >
          <ScrollArea className="flex-1 min-h-0">
            {chatMessages.length === 0 ? (
              <div className="flex flex-col items-center gap-3 py-8 px-3 text-center">
                <p className="text-sm font-semibold text-copy-primary">Room chat</p>
                <p className="text-xs text-copy-muted leading-relaxed">
                  Messages here are shared with everyone in this room in real time.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3 p-3 pb-2">
                {chatMessages.map((msg) => {
                  const isOwn = msg.sender.id === self?.id
                  return (
                    <div
                      key={msg.id}
                      className={cn("flex flex-col gap-0.5 max-w-[85%]", isOwn ? "self-end items-end" : "self-start items-start")}
                    >
                      <div className="flex items-baseline gap-1.5">
                        {!isOwn && (
                          <span className="text-xs font-semibold text-copy-primary">
                            {msg.sender.name}
                          </span>
                        )}
                        <span className="text-[10px] text-copy-faint">
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "rounded-xl px-3 py-2 text-sm leading-relaxed",
                          isOwn
                            ? "bg-brand text-white"
                            : "bg-elevated border border-surface-border text-copy-primary",
                        )}
                      >
                        {msg.content}
                      </div>
                    </div>
                  )
                })}
                <div ref={chatScrollEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Chat input area */}
          <div className="px-3 pb-3 pt-2 border-t border-surface-border shrink-0 flex flex-col gap-2">
            {chatError && (
              <p className="text-xs text-error leading-tight">{chatError}</p>
            )}
            <Textarea
              ref={chatTextareaRef}
              value={chatInput}
              onChange={handleChatTextareaChange}
              onKeyDown={handleChatKeyDown}
              placeholder="Send a message…"
              disabled={!chatStorageReady || !self}
              className="resize-none text-sm bg-elevated border-surface-border text-copy-primary placeholder:text-copy-faint overflow-y-auto disabled:opacity-60"
              style={{ minHeight: "72px", maxHeight: "160px" }}
              rows={3}
            />
            <Button
              onClick={() => sendChatMessage(chatInput)}
              disabled={chatSendDisabled}
              size="sm"
              className="self-end bg-brand text-white hover:bg-brand/90 disabled:opacity-40"
            >
              Send
            </Button>
          </div>
        </TabsContent>

        {/* Specs tab */}
        <TabsContent
          value="specs"
          className="flex-1 flex flex-col min-h-0 mt-2 overflow-hidden p-0"
        >
          <div className="px-3 pt-1 pb-2 shrink-0">
            <Button
              onClick={generateSpecHandler}
              disabled={specGenerating || !projectId}
              className="w-full bg-brand text-white hover:bg-brand/90 disabled:opacity-60"
              size="sm"
            >
              {specGenerating ? (
                <>
                  <Loader2 className="size-3.5 animate-spin mr-1.5" />
                  Generating...
                </>
              ) : (
                "Generate Spec"
              )}
            </Button>
          </div>

          {specsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-4 animate-spin text-copy-muted" />
            </div>
          ) : specs.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-8 px-3 text-center">
              <FileText className="size-8 text-copy-faint" />
              <p className="text-sm text-copy-muted">No specs yet</p>
              <p className="text-xs text-copy-faint leading-relaxed">
                Generate a spec from your canvas to see it here.
              </p>
            </div>
          ) : (
            <ScrollArea className="flex-1 min-h-0 px-3 pb-3">
              <div className="flex flex-col gap-2">
                {specs.map((spec) => (
                  <button
                    key={spec.id}
                    type="button"
                    onClick={() => openPreview(spec)}
                    className="group w-full text-left rounded-xl bg-elevated border border-surface-border p-3 hover:border-brand/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="size-7 rounded-lg bg-subtle flex items-center justify-center shrink-0">
                        <FileText className="size-3.5 text-copy-muted" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-copy-primary truncate">
                          spec-{spec.id.slice(-8)}.md
                        </p>
                        <p className="text-[10px] text-copy-faint mt-0.5">
                          {formatDate(spec.createdAt)}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation()
                          downloadSpec(spec.id)
                        }}
                        aria-label="Download spec"
                        asChild={false}
                      >
                        <Download className="size-3.5" />
                      </Button>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>

      {/* Spec preview dialog */}
      <Dialog
        open={previewSpec !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewSpec(null)
            setSpecContent(null)
          }
        }}
      >
        <DialogContent className="max-w-2xl h-[75vh] flex flex-col gap-0 p-0 bg-surface border-surface-border">
          <DialogHeader className="px-6 pt-5 pb-4 border-b border-surface-border shrink-0">
            <DialogTitle className="text-sm font-semibold text-copy-primary">
              spec-{previewSpec?.id}.md
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 min-h-0">
            <div className="px-6 py-4">
              {specContentLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="size-5 animate-spin text-copy-muted" />
                </div>
              ) : (
                <div className="prose-spec text-sm text-copy-primary leading-relaxed">
                  <ReactMarkdown>{specContent ?? ""}</ReactMarkdown>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-surface-border shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setPreviewSpec(null)
                setSpecContent(null)
              }}
            >
              Close
            </Button>
            {previewSpec && (
              <Button
                size="sm"
                className="bg-brand text-white hover:bg-brand/90 gap-1.5"
                onClick={() => downloadSpec(previewSpec.id)}
              >
                <Download className="size-3.5" />
                Download
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {pendingRunId && publicToken && (
        <RunTracker
          runId={pendingRunId}
          accessToken={publicToken}
          onTerminal={handleTerminalStatus}
        />
      )}

      {specRunId && specRunToken && (
        <RunTracker
          runId={specRunId}
          accessToken={specRunToken}
          onTerminal={handleSpecTerminal}
        />
      )}
    </aside>
  )
}
