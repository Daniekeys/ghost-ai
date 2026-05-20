import type { Metadata } from 'next'
import './globals.css'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { EditorShell } from "@/components/editor/editor-shell";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Ghost AI',
  description: 'Ghost AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("dark font-sans", geist.variable)}>
      <body>
        <EditorShell>
          {children}
        </EditorShell>
      </body>
    </html>
  )
}
