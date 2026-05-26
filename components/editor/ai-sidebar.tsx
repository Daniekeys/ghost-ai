"use client"

import { useState } from "react"
import { Bot, X, FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

const STARTER_CHIPS = [
  "Design an e-commerce backend",
  "Create a chat app architecture",
  "Build a CI/CD pipeline",
]

interface AiSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function AiSidebar({ isOpen, onClose }: AiSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")

  if (!isOpen) return null

  function sendMessage(text: string) {
    const trimmed = text.trim()
    if (!trimmed) return
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${Math.random()}`, role: "user", content: trimmed },
    ])
    setInput("")
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
      <Tabs defaultValue="architect" className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <TabsList className="mx-3 mt-3 shrink-0">
          <TabsTrigger
            value="architect"
            className="flex-1 text-xs data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=inactive]:text-copy-muted"
          >
            AI Architect
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
            {messages.length === 0 ? (
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
                      className="text-left px-3 py-2 rounded-xl bg-subtle text-xs text-ai-text hover:bg-elevated transition-colors cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 p-3 pb-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "self-end bg-accent-dim border-2 border-brand/50 text-copy-primary"
                        : "self-start bg-elevated border border-surface-border text-ai-text",
                    )}
                  >
                    {msg.content}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {/* Input area */}
          <div className="px-3 pb-3 pt-2 border-t border-surface-border shrink-0 flex flex-col gap-2">
            <Textarea
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Describe an architecture…"
              className="resize-none text-sm bg-elevated border-surface-border text-copy-primary placeholder:text-copy-faint overflow-y-auto"
              style={{ minHeight: "72px", maxHeight: "160px" }}
              rows={3}
            />
            <Button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              size="sm"
              className="self-end bg-brand text-base hover:bg-brand/90 disabled:opacity-40"
            >
              Send
            </Button>
          </div>
        </TabsContent>

        {/* Specs tab */}
        <TabsContent
          value="specs"
          className="flex-1 overflow-y-auto mt-2 p-3"
        >
          <Button
            className="w-full bg-brand text-base hover:bg-brand/90 mb-4"
            size="sm"
          >
            Generate Spec
          </Button>

          <div className="rounded-2xl bg-elevated border border-surface-border p-4">
            <div className="flex items-start gap-3">
              <div className="size-8 rounded-xl bg-subtle flex items-center justify-center shrink-0">
                <FileText className="size-4 text-copy-muted" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-copy-primary truncate">
                  E-commerce System
                </p>
                <p className="text-xs text-copy-muted mt-1 leading-relaxed line-clamp-3">
                  Microservices architecture: API Gateway, Auth, Products,
                  Orders, Payments, Notifications.
                </p>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                disabled
                className="gap-1.5 text-xs text-copy-faint"
              >
                <Download className="size-3" />
                Download
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  )
}
