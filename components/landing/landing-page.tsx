"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Sparkles,
  Users,
  LayoutGrid,
  FileCode,
  Palette,
  Shield,
  Zap,
  Menu,
  X,
} from "lucide-react";

function IconTwitter() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconGithub() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function IconDiscord() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
    </svg>
  );
}

// ─── Color palette ──────────────────────────────────────────────────────────
const COLORS = {
  blue:   { fill: "#10233D", text: "#52A8FF" },
  purple: { fill: "#2E1938", text: "#BF7AF0" },
  orange: { fill: "#331B00", text: "#FF990A" },
  green:  { fill: "#0F2E18", text: "#62C073" },
  teal:   { fill: "#062822", text: "#0AC7B4" },
  pink:   { fill: "#3A1726", text: "#F75F8F" },
  red:    { fill: "#3C1618", text: "#FF6166" },
  neutral:{ fill: "#1F1F1F", text: "#EDEDED" },
};

// ─── Ghost icon ──────────────────────────────────────────────────────────────
function GhostIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="2" width="14" height="13" rx="7" fill="var(--text-muted)" />
      <rect x="3" y="9" width="14" height="7" fill="var(--text-muted)" />
      <path d="M3 16 Q5 13 7 16 Q9 13 10 16 Q11 13 13 16 Q15 13 17 16" stroke="var(--bg-base)" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

// ─── Section label pill ──────────────────────────────────────────────────────
function LabelPill({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        background: "var(--accent-primary-dim)",
        color: "var(--accent-primary)",
        borderRadius: "99px",
        fontSize: "12px",
        padding: "4px 12px",
        fontWeight: 600,
        display: "inline-block",
        marginBottom: "16px",
      }}
    >
      {children}
    </span>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = ["Features", "Templates", "Pricing", "Docs"];

  return (
    <>
      <nav
        style={{
          position: "sticky",
          top: 0,
          height: "56px",
          zIndex: 100,
          background: "var(--bg-base)",
          backdropFilter: "blur(16px)",
          borderBottom: scrolled
            ? "1px solid var(--border-subtle)"
            : "1px solid var(--border-default)",
          boxShadow: scrolled ? "0 1px 24px rgba(0,0,0,0.6)" : "none",
          transition: "border-color 200ms, box-shadow 200ms",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
        }}
      >
        {/* Wordmark */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            textDecoration: "none",
          }}
        >
          <GhostIcon />
          <span style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "-0.3px" }}>
            <span style={{ color: "var(--text-primary)" }}>Ghost</span>
            <span style={{ color: "var(--accent-primary)" }}>AI</span>
          </span>
        </Link>

        {/* Center links — desktop only */}
        <div
          style={{ display: "flex", gap: "32px", alignItems: "center" }}
          className="nav-center-links"
        >
          {navLinks.map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase()}`}
              style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                textDecoration: "none",
                transition: "color 150ms",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLAnchorElement).style.color = "var(--text-primary)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLAnchorElement).style.color = "var(--text-secondary)")
              }
            >
              {l}
            </a>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Link
            href="/sign-in"
            style={{
              fontSize: "14px",
              color: "var(--text-secondary)",
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "12px",
              transition: "color 150ms",
            }}
            className="nav-signin-link"
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text-primary)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = "var(--text-secondary)")
            }
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            style={{
              background: "var(--accent-primary)",
              color: "#000",
              fontWeight: 600,
              fontSize: "14px",
              borderRadius: "12px",
              padding: "8px 18px",
              textDecoration: "none",
              transition: "filter 150ms, transform 150ms",
              minHeight: "44px",
              display: "flex",
              alignItems: "center",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.filter = "brightness(1.1)";
              (e.currentTarget as HTMLElement).style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.filter = "";
              (e.currentTarget as HTMLElement).style.transform = "";
            }}
          >
            Start for free
          </Link>

          {/* Hamburger — mobile only */}
          <button
            className="hamburger-btn"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-secondary)",
              padding: "8px",
              display: "none",
              minHeight: "44px",
              minWidth: "44px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Menu size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "var(--bg-elevated)",
            zIndex: 200,
            display: "flex",
            flexDirection: "column",
            padding: "24px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px" }}>
            <span style={{ fontSize: "16px", fontWeight: 600 }}>
              <span style={{ color: "var(--text-primary)" }}>Ghost</span>
              <span style={{ color: "var(--accent-primary)" }}>AI</span>
            </span>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-secondary)",
                minHeight: "44px",
                minWidth: "44px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={22} />
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {navLinks.map((l) => (
              <a
                key={l}
                href={`#${l.toLowerCase()}`}
                onClick={() => setMobileOpen(false)}
                style={{
                  fontSize: "18px",
                  color: "var(--text-primary)",
                  textDecoration: "none",
                  padding: "12px 8px",
                  fontWeight: 500,
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {l}
              </a>
            ))}
            <div style={{ height: "1px", background: "var(--border-default)", margin: "16px 0" }} />
            <Link
              href="/sign-in"
              style={{ fontSize: "16px", color: "var(--text-secondary)", textDecoration: "none", padding: "12px 8px", minHeight: "44px", display: "flex", alignItems: "center" }}
              onClick={() => setMobileOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              style={{
                background: "var(--accent-primary)",
                color: "#000",
                fontWeight: 700,
                fontSize: "16px",
                borderRadius: "12px",
                padding: "14px 24px",
                textDecoration: "none",
                textAlign: "center",
                marginTop: "8px",
              }}
              onClick={() => setMobileOpen(false)}
            >
              Start for free
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 767px) {
          .nav-center-links { display: none !important; }
          .hamburger-btn { display: flex !important; }
          .nav-signin-link { display: none; }
        }
      `}</style>
    </>
  );
}

// ─── Hero canvas visual ──────────────────────────────────────────────────────
function HeroCanvas() {
  const nodes = [
    { label: "API Gateway",   color: COLORS.blue,   top: 60,  left: 40,  active: true },
    { label: "Auth Service",  color: COLORS.purple, top: 60,  left: 220, active: false },
    { label: "Order Service", color: COLORS.orange, top: 160, left: 130, active: false },
    { label: "PostgreSQL",    color: COLORS.green,  top: 260, left: 60,  active: false },
    { label: "Redis Cache",   color: COLORS.teal,   top: 260, left: 260, active: false },
  ];

  // Approximate node centers (node ~120px wide, ~38px tall)
  const nc = [
    { x: 100, y: 79  },
    { x: 280, y: 79  },
    { x: 190, y: 179 },
    { x: 120, y: 279 },
    { x: 320, y: 279 },
  ];

  const edges = [
    { x1: nc[0].x, y1: nc[0].y, x2: nc[1].x, y2: nc[1].y, delay: "0.6s" },
    { x1: nc[0].x, y1: nc[0].y, x2: nc[2].x, y2: nc[2].y, delay: "0.8s" },
    { x1: nc[2].x, y1: nc[2].y, x2: nc[3].x, y2: nc[3].y, delay: "1.0s" },
    { x1: nc[2].x, y1: nc[2].y, x2: nc[4].x, y2: nc[4].y, delay: "1.1s" },
  ];

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "64px auto 0",
        borderRadius: "24px",
        background: "var(--bg-surface)",
        border: "1px solid var(--border-default)",
        overflow: "hidden",
        animation: "fade-up 0.7s ease 0.5s both",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          height: "40px",
          background: "var(--bg-elevated)",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: "0",
        }}
      >
        <div style={{ display: "flex", gap: "8px", marginRight: "auto" }}>
          {["#ff5f57", "#ffbd2e", "#28ca42"].map((c) => (
            <div key={c} style={{ width: "12px", height: "12px", borderRadius: "50%", background: c }} />
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--bg-subtle)",
            borderRadius: "6px",
            padding: "3px 12px",
            fontSize: "12px",
            color: "var(--text-muted)",
          }}
        >
          ghost.ai/workspace/my-system
        </div>
      </div>

      {/* Canvas area */}
      <div
        className="hero-canvas-area"
        style={{
          position: "relative",
          background: "var(--bg-base)",
          backgroundImage: "radial-gradient(circle, var(--border-default) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          overflow: "hidden",
        }}
      >
        {/* SVG connection lines */}
        <svg
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          aria-hidden="true"
        >
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="var(--border-subtle)" />
            </marker>
          </defs>
          {edges.map((e, i) => (
            <line
              key={i}
              x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
              stroke="var(--border-subtle)"
              strokeWidth="1.5"
              markerEnd="url(#arrowhead)"
              style={{
                strokeDasharray: 500,
                strokeDashoffset: 500,
                animation: `line-draw 1.2s ease-out ${e.delay} both`,
              }}
            />
          ))}
        </svg>

        {/* Nodes */}
        {nodes.map((n, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: n.top,
              left: n.left,
              background: n.color.fill,
              color: n.color.text,
              borderRadius: "10px",
              padding: "10px 16px",
              fontSize: "13px",
              fontWeight: 600,
              border: n.active
                ? "1.5px solid var(--accent-primary)"
                : "1px solid rgba(255,255,255,0.08)",
              boxShadow: n.active
                ? "0 0 0 3px var(--accent-primary-dim), 0 4px 20px rgba(0,0,0,0.4)"
                : "0 4px 20px rgba(0,0,0,0.4)",
              whiteSpace: "nowrap",
            }}
          >
            {n.label}
          </div>
        ))}

        {/* Cursor 1 — Alex */}
        <div
          style={{
            position: "absolute",
            top: 120,
            left: 310,
            display: "flex",
            alignItems: "flex-start",
            gap: "4px",
            animation: "drift-1 5s ease-in-out infinite",
            pointerEvents: "none",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" style={{ flexShrink: 0 }}>
            <path d="M1 1 L1 10 L4 7 L7 11 L8 10 L5 6 L9 6 Z" fill="#00c8d4" />
          </svg>
          <span
            style={{
              background: "#00c8d4",
              color: "#000",
              fontSize: "11px",
              fontWeight: 600,
              padding: "2px 6px",
              borderRadius: "4px",
              marginTop: "-2px",
            }}
          >
            Alex
          </span>
        </div>

        {/* Cursor 2 — Maya */}
        <div
          style={{
            position: "absolute",
            top: 200,
            left: 400,
            display: "flex",
            alignItems: "flex-start",
            gap: "4px",
            animation: "drift-2 6s ease-in-out infinite",
            pointerEvents: "none",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" style={{ flexShrink: 0 }}>
            <path d="M1 1 L1 10 L4 7 L7 11 L8 10 L5 6 L9 6 Z" fill="#f75f8f" />
          </svg>
          <span
            style={{
              background: "#f75f8f",
              color: "#000",
              fontSize: "11px",
              fontWeight: 600,
              padding: "2px 6px",
              borderRadius: "4px",
              marginTop: "-2px",
            }}
          >
            Maya
          </span>
        </div>

        {/* AI thinking badge */}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            background: "rgba(100, 87, 249, 0.15)",
            border: "1px solid var(--accent-ai)",
            borderRadius: "99px",
            padding: "6px 12px",
            fontSize: "12px",
            color: "var(--accent-ai-text)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              border: "1.5px solid var(--accent-ai)",
              borderTopColor: "transparent",
              display: "inline-block",
              animation: "spin 0.8s linear infinite",
              flexShrink: 0,
            }}
          />
          Ghost AI is thinking...
        </div>
      </div>

      <style>{`
        .hero-canvas-area { height: 360px; }
        @media (max-width: 767px) {
          .hero-canvas-area { height: 200px; }
        }
      `}</style>
    </div>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "80px 24px 60px",
        maxWidth: "1100px",
        margin: "0 auto",
      }}
    >
      {/* Eyebrow badge */}
      <div
        style={{
          background: "rgba(100, 87, 249, 0.15)",
          border: "1px solid var(--accent-ai)",
          color: "var(--accent-ai-text)",
          borderRadius: "99px",
          padding: "4px 14px",
          fontSize: "13px",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "32px",
          animation: "fade-up 0.6s ease 0ms both",
        }}
      >
        <span
          style={{
            width: "7px",
            height: "7px",
            background: "var(--accent-ai)",
            borderRadius: "50%",
            display: "inline-block",
            animation: "spin-pulse 1.5s ease-in-out infinite",
          }}
        />
        Now in open beta
      </div>

      {/* Headline */}
      <h1
        style={{
          fontSize: "clamp(44px, 6vw, 80px)",
          fontWeight: 700,
          letterSpacing: "-2px",
          lineHeight: 1.05,
          margin: 0,
          animation: "fade-up 0.6s ease 100ms both",
        }}
      >
        Architecture lives
        <br />
        <span style={{ color: "var(--accent-primary)" }}>on the canvas.</span>
      </h1>

      {/* Subheadline */}
      <p
        style={{
          fontSize: "clamp(16px, 2vw, 20px)",
          color: "var(--text-secondary)",
          maxWidth: "560px",
          lineHeight: 1.65,
          margin: "24px auto",
          animation: "fade-up 0.6s ease 200ms both",
        }}
      >
        Describe your system in plain English. Ghost AI generates the architecture live —
        and every collaborator sees it happen in real time.
      </p>

      {/* CTA row */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          justifyContent: "center",
          flexWrap: "wrap",
          animation: "fade-up 0.6s ease 350ms both",
        }}
      >
        <Link
          href="/sign-up"
          style={{
            background: "var(--accent-primary)",
            color: "#000",
            fontWeight: 700,
            fontSize: "16px",
            padding: "14px 32px",
            borderRadius: "12px",
            textDecoration: "none",
            boxShadow: "var(--shadow-glow-cyan)",
            animation: "cta-pulse 3s ease-in-out infinite",
            transition: "filter 150ms",
            minHeight: "44px",
            display: "flex",
            alignItems: "center",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLElement).style.filter = "brightness(1.1)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLElement).style.filter = "")
          }
        >
          Start building free →
        </Link>
        <button
          style={{
            background: "transparent",
            color: "var(--text-primary)",
            fontWeight: 500,
            fontSize: "16px",
            padding: "14px 28px",
            borderRadius: "12px",
            border: "1px solid var(--border-subtle)",
            cursor: "pointer",
            transition: "background 150ms, border-color 150ms",
            minHeight: "44px",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--bg-surface)";
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border-default)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)";
          }}
        >
          ▶ Watch demo
        </button>
      </div>

      {/* Canvas visual */}
      <div style={{ width: "100%", animation: "fade-up 0.7s ease 500ms both" }}>
        <HeroCanvas />
      </div>
    </section>
  );
}

// ─── Social Proof Strip ──────────────────────────────────────────────────────
function SocialProofStrip() {
  const companies = ["Stripe", "Vercel", "Linear", "Notion", "Figma"];
  return (
    <section
      style={{
        padding: "32px 24px",
        borderTop: "1px solid var(--border-default)",
        borderBottom: "1px solid var(--border-default)",
      }}
    >
      <div
        className="social-proof-inner"
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "40px",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{ fontSize: "14px", color: "var(--text-faint)", whiteSpace: "nowrap" }}
        >
          Trusted by engineering teams at
        </span>
        <div
          className="companies-row"
          style={{
            display: "flex",
            gap: "40px",
            alignItems: "center",
            overflowX: "auto",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          {companies.map((c) => (
            <span
              key={c}
              style={{
                fontSize: "16px",
                color: "var(--text-faint)",
                fontWeight: 700,
                letterSpacing: "-0.5px",
                whiteSpace: "nowrap",
                transition: "color 200ms",
                cursor: "default",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "var(--text-muted)")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "var(--text-faint)")
              }
            >
              {c}
            </span>
          ))}
        </div>
      </div>
      <style>{`.companies-row::-webkit-scrollbar { display: none; }`}</style>
    </section>
  );
}

// ─── Features Bento Grid ─────────────────────────────────────────────────────
function FeatureBentoGrid() {
  const cardBase: React.CSSProperties = {
    background: "var(--bg-surface)",
    border: "1px solid var(--border-default)",
    borderRadius: "16px",
    padding: "28px",
    transition: "border-color 200ms, transform 200ms, box-shadow 200ms",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  };

  function FeatureIcon({ children }: { children: React.ReactNode }) {
    return (
      <div
        style={{
          width: "40px",
          height: "40px",
          background: "var(--accent-primary-dim)",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--accent-primary)",
          flexShrink: 0,
        }}
      >
        {children}
      </div>
    );
  }

  function Card({
    icon,
    title,
    desc,
    extra,
    wide,
    delay,
  }: {
    icon: React.ReactNode;
    title: string;
    desc: string;
    extra?: React.ReactNode;
    wide?: boolean;
    delay: number;
  }) {
    const [hovered, setHovered] = useState(false);
    return (
      <div
        className={`reveal feature-card${wide ? " feature-wide" : ""}`}
        style={{
          ...cardBase,
          borderColor: hovered ? "var(--border-subtle)" : "var(--border-default)",
          transform: hovered ? "translateY(-3px)" : "none",
          boxShadow: hovered ? "var(--shadow-card)" : "none",
          transitionDelay: `${delay}ms`,
          gridColumn: wide ? "span 2" : "span 1",
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <FeatureIcon>{icon}</FeatureIcon>
        <div>
          <h3
            style={{ fontSize: "16px", fontWeight: 700, margin: "0 0 8px", color: "var(--text-primary)" }}
          >
            {title}
          </h3>
          <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
            {desc}
          </p>
        </div>
        {extra && <div style={{ marginTop: "auto" }}>{extra}</div>}
      </div>
    );
  }

  // AI card extra — mock prompt input
  const aiExtra = (
    <div
      style={{
        display: "flex",
        gap: "8px",
        background: "var(--bg-elevated)",
        borderRadius: "10px",
        padding: "10px 12px",
        alignItems: "center",
        border: "1px solid var(--border-default)",
      }}
    >
      <span style={{ fontSize: "13px", color: "var(--text-faint)", flex: 1 }}>
        Describe a microservices e-commerce system...
      </span>
      <span
        style={{
          background: "var(--accent-primary)",
          color: "#000",
          fontSize: "12px",
          fontWeight: 700,
          padding: "4px 10px",
          borderRadius: "6px",
          whiteSpace: "nowrap",
        }}
      >
        Generate
      </span>
    </div>
  );

  // Collab extra — avatars
  const collabExtra = (
    <div style={{ display: "flex" }}>
      {[
        { i: "A", c: "#00c8d4" },
        { i: "M", c: "#f75f8f" },
        { i: "J", c: "#6457f9" },
      ].map((av, idx) => (
        <div
          key={av.i}
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "50%",
            background: av.c,
            color: "#000",
            fontSize: "11px",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid var(--bg-surface)",
            marginLeft: idx > 0 ? "-8px" : 0,
          }}
        >
          {av.i}
        </div>
      ))}
    </div>
  );

  // Templates extra — 3 mini thumbnails
  const templatesExtra = (
    <div style={{ display: "flex", gap: "10px" }}>
      {[COLORS.blue, COLORS.orange, COLORS.teal].map((c, i) => (
        <div
          key={i}
          style={{
            width: "100px",
            height: "60px",
            background: "var(--bg-elevated)",
            borderRadius: "8px",
            border: "1px solid var(--border-default)",
            position: "relative",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <div style={{ position: "absolute", top: 8, left: 8, background: c.fill, color: c.text, fontSize: "8px", fontWeight: 700, padding: "3px 6px", borderRadius: "4px" }}>SVC</div>
          <div style={{ position: "absolute", bottom: 8, right: 8, background: c.fill, color: c.text, fontSize: "8px", fontWeight: 700, padding: "3px 6px", borderRadius: "4px" }}>DB</div>
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} aria-hidden="true">
            <line x1="30" y1="20" x2="70" y2="44" stroke={c.text} strokeWidth="1" opacity="0.4" />
          </svg>
        </div>
      ))}
    </div>
  );

  // Spec extra — code snippet
  const specExtra = (
    <div
      style={{
        background: "var(--bg-elevated)",
        borderRadius: "8px",
        padding: "10px 12px",
        fontFamily: "var(--font-geist-mono), monospace",
        fontSize: "11px",
        color: "var(--text-secondary)",
        lineHeight: 1.6,
        border: "1px solid var(--border-default)",
      }}
    >
      <span style={{ color: "var(--accent-primary)" }}># System Architecture</span>
      <br />
      <span style={{ color: "var(--text-muted)" }}>## Services</span>
      <br />- API Gateway
      <br />- Auth Service...
    </div>
  );

  // Color swatches extra
  const colorExtra = (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 20px)",
        gap: "6px",
      }}
    >
      {Object.values(COLORS).map((c) => (
        <div
          key={c.fill}
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "5px",
            background: c.fill,
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        />
      ))}
    </div>
  );

  return (
    <section
      id="features"
      style={{ padding: "100px 24px", maxWidth: "1100px", margin: "0 auto" }}
    >
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <LabelPill>Features</LabelPill>
        <h2
          style={{
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 700,
            letterSpacing: "-1.5px",
            margin: "0 0 16px",
          }}
        >
          Everything your architecture needs
        </h2>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", margin: 0 }}>
          One canvas. Real-time collaboration. AI that actually understands systems.
        </p>
      </div>

      <div
        className="features-grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}
      >
        <Card wide icon={<Sparkles size={20} />} title="AI Architecture Generation" desc="Type a prompt. Ghost AI generates nodes, edges, and service topology directly on the shared canvas — while every collaborator watches it appear live." extra={aiExtra} delay={0} />
        <Card icon={<Users size={20} />} title="Real-time Collaboration" desc="Live cursors, presence avatars, and shared canvas state. Everyone sees every change the instant it happens." extra={collabExtra} delay={50} />
        <Card wide icon={<LayoutGrid size={20} />} title="Starter Templates" desc="Import a production-ready architecture. Microservices, CI/CD pipelines, event-driven systems — fully wired and ready to extend." extra={templatesExtra} delay={100} />
        <Card icon={<FileCode size={20} />} title="One-click Spec Generation" desc="Turn your canvas into a Markdown technical specification. Stored, versioned, and downloadable." extra={specExtra} delay={150} />
        <Card icon={<Palette size={20} />} title="Full Node Control" desc="8 color themes, 6 shapes, resize handles, inline label editing." extra={colorExtra} delay={200} />
        <Card icon={<Shield size={20} />} title="Role-based Access" desc="Owner and collaborator roles. Invite by email. Room tokens scoped per user." delay={250} />
        <Card icon={<Zap size={20} />} title="Durable AI Tasks" desc="Architecture generation runs as a background task. Close the tab — it still finishes and syncs when you return." delay={300} />
      </div>

      <style>{`
        @media (max-width: 1023px) {
          .features-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .feature-wide { grid-column: span 1 !important; }
        }
        @media (max-width: 767px) {
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── How It Works ────────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    {
      n: 1,
      title: "Describe your system",
      desc: "Type what you're building in plain English. Ghost AI interprets architecture intent, not just words — services, databases, queues, and connections.",
    },
    {
      n: 2,
      title: "Watch it build live",
      desc: "Nodes and edges appear on the shared canvas in real time. Every collaborator sees the design form as the AI generates it.",
    },
    {
      n: 3,
      title: "Generate the spec",
      desc: "One click exports your canvas as a structured Markdown technical specification. Ready to commit, share, or review.",
    },
  ];

  return (
    <section
      id="how-it-works"
      style={{ padding: "100px 24px", maxWidth: "900px", margin: "0 auto", textAlign: "center" }}
    >
      <LabelPill>How it works</LabelPill>
      <h2
        style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-1.5px", margin: "0 0 64px" }}
      >
        From idea to spec in minutes
      </h2>

      <div className="steps-container" style={{ position: "relative" }}>
        {/* Dashed connector — desktop only */}
        <div
          className="steps-connector"
          style={{
            position: "absolute",
            top: "24px",
            left: "calc(16.5% + 24px)",
            right: "calc(16.5% + 24px)",
            borderTop: "1px dashed var(--border-default)",
            pointerEvents: "none",
          }}
        />

        <div
          className="steps-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px", position: "relative" }}
        >
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="reveal"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                transitionDelay: `${i * 150}ms`,
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background: "var(--bg-base)",
                  border: "1px solid var(--accent-primary)",
                  color: "var(--accent-primary)",
                  fontSize: "20px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {s.n}
              </div>
              <h3 style={{ fontSize: "18px", fontWeight: 600, margin: 0, color: "var(--text-primary)" }}>
                {s.title}
              </h3>
              <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .steps-grid { grid-template-columns: 1fr !important; }
          .steps-connector { display: none !important; }
        }
        @media (max-width: 1023px) {
          .steps-connector { display: none !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Templates Showcase ──────────────────────────────────────────────────────
function TemplatesShowcase() {
  const templates = [
    {
      name: "Microservices E-Commerce",
      desc: "API gateway, auth, order, product, payment, and notification services with an event bus and shared databases.",
      badge: "12 nodes · 8 connections",
      nodes: [
        { label: "API GW",  color: COLORS.blue,   top: 10, left: 50  },
        { label: "Auth",    color: COLORS.purple,  top: 60, left: 10  },
        { label: "Orders",  color: COLORS.orange,  top: 60, left: 80  },
        { label: "Postgres",color: COLORS.green,   top: 110,left: 30  },
        { label: "Redis",   color: COLORS.teal,    top: 110,left: 100 },
      ],
    },
    {
      name: "CI/CD Pipeline",
      desc: "Source control, build server, test runner, security scan, artifact registry, and staged deployment.",
      badge: "8 nodes · Linear flow",
      nodes: [
        { label: "Source", color: COLORS.blue,   top: 65, left: 5   },
        { label: "Build",  color: COLORS.purple,  top: 65, left: 60  },
        { label: "Test",   color: COLORS.orange,  top: 65, left: 115 },
        { label: "Deploy", color: COLORS.green,   top: 65, left: 170 },
      ],
    },
    {
      name: "Event-Driven System",
      desc: "Event producer, message broker, multiple consumers, dead-letter queue, and monitoring layer.",
      badge: "10 nodes · Event mesh",
      nodes: [
        { label: "Producer", color: COLORS.blue,   top: 55, left: 5   },
        { label: "Broker",   color: COLORS.purple,  top: 55, left: 80  },
        { label: "Consumer", color: COLORS.teal,    top: 10, left: 160 },
        { label: "Consumer", color: COLORS.green,   top: 55, left: 160 },
        { label: "DLQ",      color: COLORS.red,     top: 110,left: 80  },
      ],
    },
  ];

  function MiniCanvas({ nodes }: { nodes: typeof templates[0]["nodes"] }) {
    return (
      <div
        style={{
          height: "160px",
          background: "var(--bg-base)",
          backgroundImage: "radial-gradient(circle, var(--border-default) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {nodes.map((n, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: n.top,
              left: n.left,
              background: n.color.fill,
              color: n.color.text,
              fontSize: "9px",
              fontWeight: 700,
              padding: "4px 8px",
              borderRadius: "6px",
              border: "1px solid rgba(255,255,255,0.08)",
              whiteSpace: "nowrap",
            }}
          >
            {n.label}
          </div>
        ))}
      </div>
    );
  }

  return (
    <section
      id="templates"
      style={{ padding: "100px 24px", maxWidth: "1100px", margin: "0 auto" }}
    >
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <LabelPill>Templates</LabelPill>
        <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-1.5px", margin: "0 0 16px" }}>
          Start with battle-tested architectures
        </h2>
        <p style={{ fontSize: "16px", color: "var(--text-secondary)", margin: 0 }}>
          Import any template into your canvas. Extend it with AI.
        </p>
      </div>

      <div
        className="templates-grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}
      >
        {templates.map((t, i) => {
          const [hovered, setHovered] = useState(false);
          return (
            <div
              key={t.name}
              className="reveal"
              style={{
                background: "var(--bg-surface)",
                border: `1px solid ${hovered ? "var(--border-subtle)" : "var(--border-default)"}`,
                borderRadius: "16px",
                overflow: "hidden",
                transform: hovered ? "translateY(-4px)" : "none",
                boxShadow: hovered ? "var(--shadow-card)" : "none",
                transition: "transform 200ms, box-shadow 200ms, border-color 200ms",
                transitionDelay: `${i * 100}ms`,
              }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <MiniCanvas nodes={t.nodes} />
              <div style={{ padding: "20px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: 700, margin: "0 0 8px", color: "var(--text-primary)" }}>
                  {t.name}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 12px" }}>
                  {t.desc}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      background: "var(--bg-elevated)",
                      padding: "3px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    {t.badge}
                  </span>
                  <Link
                    href="/sign-up"
                    style={{ fontSize: "13px", color: "var(--accent-primary)", textDecoration: "none", fontWeight: 600 }}
                  >
                    Import template →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 767px) {
          .templates-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Testimonials ────────────────────────────────────────────────────────────
function Testimonials() {
  const cards = [
    {
      quote: "Ghost AI cut our architecture review time from two hours to twenty minutes. We just pull up the canvas and everyone is aligned.",
      name: "Sarah K.",
      role: "Staff Engineer",
      initials: "SK",
    },
    {
      quote: "I've tried every diagramming tool. This is the first one that actually understands what I'm trying to build, not just what I'm drawing.",
      name: "Marcus T.",
      role: "CTO",
      initials: "MT",
    },
    {
      quote: "The spec generation alone is worth it. We finally have real technical documentation instead of outdated Confluence pages.",
      name: "Priya M.",
      role: "Engineering Lead",
      initials: "PM",
    },
  ];

  return (
    <section
      style={{ padding: "80px 24px", maxWidth: "1000px", margin: "0 auto" }}
    >
      <h2
        style={{
          fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 700,
          letterSpacing: "-1px",
          textAlign: "center",
          margin: "0 0 48px",
        }}
      >
        Built for engineers who ship
      </h2>

      <div
        className="testimonials-grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}
      >
        {cards.map((c, i) => (
          <div
            key={c.name}
            className="reveal"
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
              borderRadius: "16px",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              transitionDelay: `${i * 100}ms`,
            }}
          >
            <div style={{ color: "var(--accent-primary)", fontSize: "14px", letterSpacing: "2px" }}>
              {"★★★★★"}
            </div>
            <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7, fontStyle: "italic", margin: 0 }}>
              &ldquo;{c.quote}&rdquo;
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "auto" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "var(--bg-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--text-secondary)",
                  flexShrink: 0,
                }}
              >
                {c.initials}
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{c.name}</div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{c.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 767px) {
          .testimonials-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Pricing ─────────────────────────────────────────────────────────────────
function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Free",
      monthly: 0,
      annual: 0,
      desc: "Perfect for solo exploration.",
      features: ["3 projects", "1 collaborator per project", "10 AI generations / month", "5 spec generations", "Community support"],
      cta: "Start free",
      ctaStyle: "outline" as const,
      featured: false,
    },
    {
      name: "Pro",
      monthly: 19,
      annual: 15,
      desc: "For teams that ship fast.",
      features: ["Unlimited projects", "5 collaborators per project", "100 AI generations / month", "Unlimited spec generations", "Priority generation queue", "Email support"],
      cta: "Start Pro trial",
      ctaStyle: "filled" as const,
      featured: true,
    },
    {
      name: "Team",
      monthly: 49,
      annual: 39,
      desc: "For larger engineering orgs.",
      features: ["Everything in Pro", "Unlimited collaborators", "Dedicated generation queue", "SSO / SAML", "Priority support + SLA", "Custom data retention"],
      cta: "Contact sales",
      ctaStyle: "outline" as const,
      featured: false,
    },
  ];

  return (
    <section
      id="pricing"
      style={{ padding: "100px 24px", maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}
    >
      <LabelPill>Pricing</LabelPill>
      <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, letterSpacing: "-1.5px", margin: "0 0 12px" }}>
        Simple, transparent pricing
      </h2>
      <p style={{ fontSize: "16px", color: "var(--text-secondary)", margin: "0 0 32px" }}>
        Start free. Scale with your team.
      </p>

      {/* Toggle */}
      <div
        style={{
          display: "inline-flex",
          background: "var(--bg-surface)",
          border: "1px solid var(--border-default)",
          borderRadius: "99px",
          padding: "4px",
          marginBottom: "48px",
        }}
      >
        {(["Monthly", "Annual (save 20%)"] as const).map((label, idx) => {
          const active = idx === 1 ? isAnnual : !isAnnual;
          return (
            <button
              key={label}
              onClick={() => setIsAnnual(idx === 1)}
              style={{
                background: active ? "var(--accent-primary)" : "transparent",
                color: active ? "#000" : "var(--text-muted)",
                border: "none",
                borderRadius: "99px",
                padding: "6px 18px",
                fontSize: "14px",
                fontWeight: active ? 700 : 400,
                cursor: "pointer",
                transition: "background-color 200ms, color 200ms",
                minHeight: "44px",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div
        className="pricing-grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", alignItems: "start" }}
      >
        {plans.map((p, i) => (
          <div
            key={p.name}
            className="reveal"
            style={{
              background: "var(--bg-surface)",
              border: p.featured ? "1px solid var(--accent-primary)" : "1px solid var(--border-default)",
              borderRadius: "16px",
              padding: "32px",
              position: "relative",
              boxShadow: p.featured ? "var(--shadow-glow-cyan)" : "none",
              textAlign: "left",
              transitionDelay: `${i * 100}ms`,
            }}
          >
            {p.featured && (
              <div
                style={{
                  position: "absolute",
                  top: "-14px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "var(--accent-primary)",
                  color: "#000",
                  borderRadius: "99px",
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "4px 16px",
                  whiteSpace: "nowrap",
                }}
              >
                Most popular
              </div>
            )}

            <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "8px", color: "var(--text-primary)" }}>
              {p.name}
            </div>
            <div style={{ marginBottom: "8px" }}>
              <span style={{ fontSize: "48px", fontWeight: 800, letterSpacing: "-1px", color: "var(--text-primary)" }}>
                ${isAnnual ? p.annual : p.monthly}
              </span>
              <span style={{ fontSize: "16px", color: "var(--text-muted)" }}>/month</span>
            </div>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "20px" }}>{p.desc}</p>
            <div style={{ height: "1px", background: "var(--border-default)", marginBottom: "20px" }} />
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", display: "flex", flexDirection: "column", gap: "10px" }}>
              {p.features.map((f) => (
                <li key={f} style={{ fontSize: "14px", color: "var(--text-secondary)", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                  <span style={{ color: "var(--accent-primary)", flexShrink: 0, marginTop: "1px" }}>✓</span>
                  {f}
                </li>
              ))}
            </ul>

            <Link
              href={p.name === "Team" ? "#" : "/sign-up"}
              style={{
                display: "block",
                textAlign: "center",
                padding: "12px 20px",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "15px",
                textDecoration: "none",
                transition: "filter 150ms",
                minHeight: "44px",
                lineHeight: "20px",
                ...(p.ctaStyle === "filled"
                  ? {
                      background: "var(--accent-primary)",
                      color: "#000",
                    }
                  : {
                      background: "transparent",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border-subtle)",
                    }),
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.filter = "brightness(1.1)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.filter = "")
              }
            >
              {p.cta}
            </Link>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 767px) {
          .pricing-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

// ─── Final CTA ───────────────────────────────────────────────────────────────
function FinalCTA() {
  return (
    <section
      style={{
        padding: "120px 24px",
        background:
          "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(0,200,212,0.08) 0%, transparent 70%), var(--bg-elevated)",
        borderTop: "1px solid var(--border-default)",
        textAlign: "center",
      }}
    >
      <h2
        className="reveal"
        style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 700, letterSpacing: "-1.5px", margin: "0 0 20px" }}
      >
        Your architecture, on the canvas.
      </h2>
      <p className="reveal" style={{ fontSize: "18px", color: "var(--text-secondary)", margin: "0 0 40px", transitionDelay: "100ms" }}>
        Start designing in 60 seconds. No setup. No boilerplate.
      </p>
      <Link
        className="reveal"
        href="/sign-up"
        style={{
          background: "var(--accent-primary)",
          color: "#000",
          fontWeight: 700,
          fontSize: "18px",
          padding: "16px 40px",
          borderRadius: "12px",
          textDecoration: "none",
          boxShadow: "var(--shadow-glow-cyan)",
          display: "inline-flex",
          alignItems: "center",
          transition: "filter 150ms",
          minHeight: "44px",
          transitionDelay: "200ms",
        } as React.CSSProperties}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLElement).style.filter = "brightness(1.1)")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLElement).style.filter = "")
        }
      >
        Start building for free →
      </Link>
      <p className="reveal" style={{ fontSize: "13px", color: "var(--text-faint)", marginTop: "20px", transitionDelay: "300ms" }}>
        Free forever plan · No credit card required
      </p>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function Footer() {
  const cols = [
    { header: "Product",   links: ["Features", "Templates", "Pricing", "Changelog"] },
    { header: "Resources", links: ["Docs", "API Reference", "Blog", "Status"] },
    { header: "Company",   links: ["About", "Careers", "Privacy Policy", "Terms of Service"] },
  ];

  const linkStyle: React.CSSProperties = {
    fontSize: "14px",
    color: "var(--text-muted)",
    textDecoration: "none",
    transition: "color 150ms",
    display: "block",
    padding: "4px 0",
    minHeight: "44px",
    lineHeight: "36px",
  };

  const headerStyle: React.CSSProperties = {
    fontSize: "13px",
    color: "var(--text-faint)",
    fontWeight: 600,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    marginBottom: "16px",
  };

  return (
    <footer
      style={{
        background: "var(--bg-base)",
        borderTop: "1px solid var(--border-default)",
        padding: "64px 24px 32px",
      }}
    >
      <div
        className="footer-grid"
        style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "40px", marginBottom: "48px" }}
      >
        {/* Brand col */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <GhostIcon />
            <span style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "-0.3px" }}>
              <span style={{ color: "var(--text-primary)" }}>Ghost</span>
              <span style={{ color: "var(--accent-primary)" }}>AI</span>
            </span>
          </div>
          <p style={{ fontSize: "14px", color: "var(--text-muted)", margin: "0 0 20px", lineHeight: 1.6 }}>
            The canvas that thinks with you.
          </p>
          <div style={{ display: "flex", gap: "16px" }}>
            {[
              { Icon: IconTwitter, label: "Twitter" },
              { Icon: IconGithub, label: "GitHub" },
              { Icon: IconDiscord, label: "Discord" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                style={{ color: "var(--text-muted)", transition: "color 150ms", minHeight: "44px", minWidth: "44px", display: "flex", alignItems: "center", justifyContent: "center" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")
                }
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {cols.map((col) => (
          <div key={col.header}>
            <div style={headerStyle}>{col.header}</div>
            {col.links.map((l) => (
              <a
                key={l}
                href="#"
                style={linkStyle}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.color = "var(--text-muted)")
                }
              >
                {l}
              </a>
            ))}
          </div>
        ))}
      </div>

      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          borderTop: "1px solid var(--border-default)",
          paddingTop: "32px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <span style={{ fontSize: "13px", color: "var(--text-faint)" }}>
          © 2025 Ghost AI. All rights reserved.
        </span>
        <div style={{ display: "flex", gap: "20px" }}>
          {["Privacy", "Terms", "Security"].map((l) => (
            <a
              key={l}
              href="#"
              style={{ fontSize: "13px", color: "var(--text-faint)", textDecoration: "none", transition: "color 150ms" }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "var(--text-primary)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color = "var(--text-faint)")
              }
            >
              {l}
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 767px) {
          .footer-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 479px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </footer>
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: "var(--bg-base)", color: "var(--text-primary)" }}>
      <Navbar />
      <Hero />
      <SocialProofStrip />
      <FeatureBentoGrid />
      <HowItWorks />
      <TemplatesShowcase />
      <Testimonials />
      <Pricing />
      <FinalCTA />
      <Footer />

      {/* Global focus-visible */}
      <style>{`
        *:focus-visible {
          outline: 2px solid var(--accent-primary);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}
