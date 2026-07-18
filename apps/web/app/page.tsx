"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRightIcon, CheckIcon, CornerDownLeftIcon, RotateCcwIcon } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"

const QUESTIONS = [
  { label: "What should we call you?", placeholder: "Jane Doe" },
  { label: "What are you building forms for?", placeholder: "Customer feedback, job applications..." },
  { label: "How many responses do you expect a month?", placeholder: "e.g. 200" },
]

const PERKS = ["No code", "Instant share link", "Real-time responses"]

// --- hand-drawn doodles, light strokes for dark mode ---

function DashMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden>
      <path d="M6 26 Q16 18 26 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function Squiggle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 15 Q20 3 36 15 T68 15 T100 15 T132 15 T164 15 T196 15"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function BubbleLines({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 70" fill="none" className={className} aria-hidden>
      <path
        d="M10 12 Q8 8 14 7 L74 5 Q82 5 82 14 L83 40 Q83 48 75 48 L34 49 L18 62 L21 49 L16 49 Q9 49 9 41 Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M22 20 H68" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M22 30 H60" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M22 40 H50" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

function FaceDoodle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 90" fill="none" className={className} aria-hidden>
      <path
        d="M40 8 Q64 8 66 34 Q68 60 52 74 Q40 84 28 74 Q12 60 14 34 Q16 8 40 8 Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <circle cx="30" cy="38" r="2.4" fill="currentColor" />
      <circle cx="52" cy="38" r="2.4" fill="currentColor" />
      <path d="M28 58 Q40 50 54 58" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M18 20 Q22 10 30 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M50 8 Q60 10 64 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function YesBubble({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 110 80" fill="none" className={className} aria-hidden>
      <path
        d="M10 10 Q8 6 14 5 L94 8 Q102 9 101 18 L99 44 Q98 52 90 51 L40 49 L22 66 L26 50 L18 50 Q10 49 10 41 Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <text
        x="26"
        y="35"
        fontSize="22"
        fontStyle="italic"
        fontFamily="Georgia, serif"
        fill="currentColor"
        transform="rotate(-4 30 34)"
      >
        yes!
      </text>
    </svg>
  )
}

function DollarBubble({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 70 60" fill="none" className={className} aria-hidden>
      <path
        d="M8 8 Q6 5 11 4 L58 6 Q64 7 63 14 L62 32 Q61 38 55 38 L26 37 L14 48 L17 37 L13 37 Q7 36 7 30 Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <text x="25" y="27" fontSize="16" fontFamily="Georgia, serif" fill="currentColor">
        $
      </text>
    </svg>
  )
}

function StarBubble({ className }: { className?: string }) {
  const star = "M0 -8 L2.2 -2.6 L8 -2.2 L3.4 1.6 L5 7.6 L0 4.2 L-5 7.6 L-3.4 1.6 L-8 -2.2 L-2.2 -2.6 Z"
  return (
    <svg viewBox="0 0 110 70" fill="none" className={className} aria-hidden>
      <path
        d="M8 10 Q6 6 12 5 L98 7 Q104 8 103 16 L102 40 Q101 47 94 46 L28 45 L14 60 L18 45 L12 45 Q6 44 6 37 Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <g fill="currentColor" transform="translate(32,25)">
        <path d={star} />
      </g>
      <g fill="currentColor" transform="translate(54,25)">
        <path d={star} />
      </g>
      <g fill="currentColor" transform="translate(76,25)">
        <path d={star} />
      </g>
    </svg>
  )
}

function HeroDoodles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden xl:block">
      <DashMark className="absolute top-[4%] left-[6%] size-8 text-foreground/30" />
      <BubbleLines className="animate-in fade-in zoom-in-95 absolute top-[15%] left-[2%] size-20 text-foreground/40 duration-700" />
      <FaceDoodle className="animate-in fade-in zoom-in-95 absolute top-[33%] left-[3%] size-16 text-foreground/35 delay-150 duration-700" />
      <DashMark className="absolute top-[8%] right-[13%] size-6 rotate-45 text-[var(--color-warm)]/70" />
      <YesBubble className="animate-in fade-in zoom-in-95 absolute top-[16%] right-[3%] size-24 -rotate-3 text-foreground/40 delay-200 duration-700" />
      <FaceDoodle className="animate-in fade-in zoom-in-95 absolute top-[36%] right-[1%] size-14 rotate-6 text-foreground/30 delay-300 duration-700" />
      <DashMark className="absolute top-[47%] right-[8%] size-5 -rotate-12 text-[var(--color-warm)]/70" />
      <FaceDoodle className="animate-in fade-in zoom-in-95 absolute bottom-[10%] left-[1%] size-16 -rotate-6 text-foreground/30 delay-200 duration-700" />
      <DollarBubble className="animate-in fade-in zoom-in-95 absolute bottom-[4%] left-[9%] size-14 rotate-3 text-foreground/40 delay-300 duration-700" />
      <StarBubble className="animate-in fade-in zoom-in-95 absolute bottom-[6%] right-[2%] size-24 rotate-2 text-foreground/40 delay-150 duration-700" />
    </div>
  )
}

function BrowserFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl shadow-black/30">
      <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
        <span className="size-2.5 rounded-full bg-muted" />
        <span className="size-2.5 rounded-full bg-muted" />
        <span className="size-2.5 rounded-full bg-muted" />
      </div>
      <div className="p-8">{children}</div>
    </div>
  )
}

function DemoCard() {
  const [step, setStep] = useState(0)
  const [value, setValue] = useState("")
  const [name, setName] = useState("")
  const done = step >= QUESTIONS.length

  function advance() {
    if (!value.trim()) return
    if (step === 0) setName(value.trim())
    setValue("")
    setStep((s) => s + 1)
  }

  function reset() {
    setStep(0)
    setValue("")
    setName("")
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <span className="text-muted-foreground text-xs tracking-wide">
          {done ? "All done" : `Question ${step + 1} of ${QUESTIONS.length}`}
        </span>
        <div className="flex gap-1.5">
          {QUESTIONS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i <= step ? "w-6 bg-[var(--color-warm)]" : "w-1.5 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {done ? (
        <div key="done" className="animate-in fade-in slide-in-from-right-4 flex flex-col items-start gap-4 duration-400">
          <div className="flex size-10 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--color-warm)_18%,transparent)]">
            <CheckIcon className="size-5 text-[var(--color-warm)]" />
          </div>
          <p className="text-lg leading-snug font-medium text-balance">
            Nice to meet you{name ? `, ${name}` : ""}. That's the whole idea:
            one question at a time.
          </p>
          <button
            onClick={reset}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs transition-colors"
          >
            <RotateCcwIcon className="size-3.5" />
            Try it again
          </button>
        </div>
      ) : (
        <div key={step} className="animate-in fade-in slide-in-from-right-4 duration-400">
          <p className="mb-4 text-lg leading-snug font-medium text-balance">
            {QUESTIONS[step]!.label}
          </p>

          <div className="flex items-center gap-1 border-b border-border pb-2 text-lg">
            <Input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") advance()
              }}
              placeholder={QUESTIONS[step]!.placeholder}
              className="h-auto border-none bg-transparent p-0 text-lg shadow-none caret-(--color-warm) focus-visible:ring-0 dark:bg-transparent rounded-none"
            />
          </div>

          <button
            onClick={advance}
            disabled={!value.trim()}
            className="text-muted-foreground hover:text-foreground mt-6 ml-auto flex items-center gap-1.5 text-xs transition-colors disabled:opacity-40"
          >
            Press Enter
            <CornerDownLeftIcon className="size-3.5" />
          </button>
        </div>
      )}
    </>
  )
}

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
        <div className="animate-drift-a absolute -top-24 left-[20%] size-[420px] rounded-full bg-[color-mix(in_oklch,var(--color-warm)_16%,transparent)] blur-3xl" />
        <div className="animate-drift-b absolute top-32 right-[15%] size-[380px] rounded-full bg-[color-mix(in_oklch,var(--foreground)_5%,transparent)] blur-3xl" />
      </div>

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <span className="text-sm font-semibold tracking-tight">JAF</span>
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/login" className="text-muted-foreground hover:text-foreground px-3 py-1.5 transition-colors">
            Log in
          </Link>
          <Button asChild size="sm">
            <Link href="/signup">Get started</Link>
          </Button>
        </nav>
      </header>

      <section className="relative mx-auto w-full max-w-6xl flex-1 px-6 py-10 md:px-10 md:py-16">
        <HeroDoodles />

        <div className="animate-in fade-in slide-in-from-bottom-4 mx-auto flex max-w-2xl flex-col items-center gap-6 text-center duration-700">
          <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Ask one question at a{" "}
            <span className="relative inline-block whitespace-nowrap">
              time.
              <Squiggle className="absolute -bottom-3 left-0 h-3 w-full text-[var(--color-warm)]" />
            </span>
          </h1>

          <p className="text-muted-foreground max-w-md text-base leading-relaxed sm:text-lg">
            Build forms that feel like a conversation, not a spreadsheet.
            One question fills the screen, people answer, and you get
            finished responses instead of half-abandoned tabs.
          </p>

          <div className="flex flex-col items-center gap-2 pt-2">
            <Button asChild size="lg">
              <Link href="/signup">
                Create a free form
                <ArrowRightIcon className="transition-transform group-hover/button:translate-x-0.5" />
              </Link>
            </Button>
            <span className="text-muted-foreground text-xs">No credit card required</span>
          </div>

          <div className="text-muted-foreground flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs">
            {PERKS.map((perk, i) => (
              <span key={perk} className="inline-flex items-center gap-3">
                {i > 0 && <span className="text-border">·</span>}
                {perk}
              </span>
            ))}
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-6 mt-14 flex justify-center delay-150 duration-700">
          <BrowserFrame>
            <DemoCard />
          </BrowserFrame>
        </div>
      </section>
    </main>
  )
}
