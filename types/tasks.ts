import { z } from "zod"

export const AiStatusFeedPayloadSchema = z.object({
  message: z.string(),
  type: z.enum(["thinking", "complete", "error"]),
  runId: z.string(),
  text: z.string().optional(),
  timestamp: z.number(),
})

export type AiStatusFeedPayload = z.infer<typeof AiStatusFeedPayloadSchema>

export const ChatMessageSchema = z.object({
  id: z.string(),
  sender: z.object({
    id: z.string(),
    name: z.string(),
  }),
  role: z.enum(["user", "assistant"]),
  content: z.string(),
  timestamp: z.number(),
  source: z.enum(["architect", "chat"]).optional(),
})

export type ChatMessage = z.infer<typeof ChatMessageSchema>
