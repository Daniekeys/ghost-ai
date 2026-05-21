import type { Metadata } from 'next'
import './globals.css'
import { Geist, Geist_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

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
    <ClerkProvider
      appearance={{
        theme: dark,
        variables: {
          colorBackground: 'var(--bg-surface)',
          colorInput: 'var(--bg-elevated)',
          colorInputForeground: 'var(--text-primary)',
          colorForeground: 'var(--text-primary)',
          colorMutedForeground: 'var(--text-secondary)',
          colorPrimary: 'var(--accent-primary)',
          colorDanger: 'var(--state-error)',
          colorSuccess: 'var(--state-success)',
          colorNeutral: 'var(--text-muted)',
          borderRadius: '0.75rem',
        },
      }}
    >
      <html lang="en" className={cn("dark", geistSans.variable, geistMono.variable)}>
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
