import { SignIn } from "@clerk/nextjs";

function WorkflowDiagram() {
  return (
    <svg
      viewBox="0 0 280 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="w-full max-w-70"
    >
      {/* ── Nodes ── */}

      {/* Describe (pill, top-left) */}
      <rect x="0.5" y="0.5" width="110" height="36" rx="18"
        fill="var(--bg-subtle)" stroke="var(--border-subtle)" strokeWidth="1" />
      <text x="55" y="23" textAnchor="middle"
        fill="var(--text-secondary)" fontSize="11" fontFamily="inherit" fontWeight="500">
        Describe
      </text>

      {/* Generate (rect, top-right) */}
      <rect x="169.5" y="0.5" width="110" height="36" rx="6"
        fill="var(--bg-elevated)" stroke="var(--accent-ai)" strokeOpacity="0.35" strokeWidth="1" />
      <text x="224" y="23" textAnchor="middle"
        fill="var(--accent-ai-text)" fontSize="11" fontFamily="inherit" fontWeight="500">
        AI Generate
      </text>

      {/* Canvas (rect, bottom-right) */}
      <rect x="169.5" y="91.5" width="110" height="36" rx="6"
        fill="var(--bg-elevated)" stroke="var(--accent-primary)" strokeOpacity="0.3" strokeWidth="1" />
      <text x="224" y="114" textAnchor="middle"
        fill="var(--accent-primary)" fontSize="11" fontFamily="inherit" fontWeight="500">
        Canvas
      </text>

      {/* Spec (rect, bottom-left) */}
      <rect x="0.5" y="91.5" width="110" height="36" rx="6"
        fill="var(--bg-subtle)" stroke="var(--border-subtle)" strokeWidth="1" />
      <text x="55" y="114" textAnchor="middle"
        fill="var(--text-secondary)" fontSize="11" fontFamily="inherit" fontWeight="500">
        Spec
      </text>

      {/* ── Connectors ── */}

      {/* → top: Describe → Generate */}
      <line x1="113" y1="18" x2="167" y2="18"
        stroke="var(--border-subtle)" strokeWidth="1" strokeLinecap="round" />
      <polyline points="161,13 169,18 161,23"
        stroke="var(--border-subtle)" strokeWidth="1" fill="none"
        strokeLinecap="round" strokeLinejoin="round" />

      {/* ↓ right: Generate → Canvas */}
      <line x1="224" y1="38" x2="224" y2="89"
        stroke="var(--accent-primary)" strokeOpacity="0.25" strokeWidth="1" strokeLinecap="round" />
      <polyline points="219,83 224,91 229,83"
        stroke="var(--accent-primary)" strokeOpacity="0.35" strokeWidth="1" fill="none"
        strokeLinecap="round" strokeLinejoin="round" />

      {/* ← bottom: Canvas → Spec */}
      <line x1="167" y1="109" x2="113" y2="109"
        stroke="var(--border-subtle)" strokeWidth="1" strokeLinecap="round" />
      <polyline points="119,104 111,109 119,114"
        stroke="var(--border-subtle)" strokeWidth="1" fill="none"
        strokeLinecap="round" strokeLinejoin="round" />

      {/* ↑ left: Spec → Describe (closes the loop) */}
      <line x1="56" y1="89" x2="56" y2="38"
        stroke="var(--border-default)" strokeWidth="1" strokeDasharray="3 3" strokeLinecap="round" />
      <polyline points="51,44 56,36 61,44"
        stroke="var(--border-default)" strokeWidth="1" fill="none"
        strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-base flex">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[44%] shrink-0 flex-col justify-center px-14 xl:px-20 border-r border-surface-border">
        <div className="max-w-85">

          {/* Brand mark */}
          <div className="flex items-center gap-2 mb-14">
            <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block" />
            <span className="text-[10.5px] font-medium text-copy-muted tracking-[0.16em] uppercase select-none">
              Ghost AI
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[2.4rem] font-semibold text-copy-primary leading-[1.08] tracking-tight mb-4">
            Architecture,<br />
            at the speed<br />
            <span className="text-brand">of thought.</span>
          </h1>

          <p className="text-copy-muted text-[0.875rem] leading-relaxed mb-12">
            Describe your system in plain English. AI builds the canvas.
            Your team refines it. A spec is generated.
          </p>

          {/* Workflow loop diagram */}
          <div className="mb-12">
            <WorkflowDiagram />
          </div>

          {/* Feature list */}
          <ul className="space-y-3.5">
            {[
              ['Describe', 'your system in plain English'],
              ['Generate', 'nodes, edges, and structure with AI'],
              ['Collaborate', 'and refine on a shared canvas'],
              ['Export', 'a complete technical specification'],
            ].map(([label, rest]) => (
              <li key={label} className="flex items-baseline gap-2.5 text-[0.8125rem]">
                <span className="text-brand font-medium shrink-0">{label}</span>
                <span className="text-copy-muted">{rest}</span>
              </li>
            ))}
          </ul>

        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <SignIn />
      </div>

    </div>
  )
}
