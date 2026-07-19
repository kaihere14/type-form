"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRightIcon, CheckIcon, CornerDownLeftIcon, RotateCcwIcon } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { AmbientGlow, BubbleLines, CheckBubble, DashMark, DollarBubble, FaceDoodle, SmileyDoodle, Squiggle, StarBubble, YesBubble } from "~/components/decor"

const QUESTIONS = [
  { label: "What should we call you?", placeholder: "Jane Doe" },
  { label: "What are you building forms for?", placeholder: "Customer feedback, job applications..." },
  { label: "How many responses do you expect a month?", placeholder: "e.g. 200" },
]

const PERKS = ["No code", "Instant share link", "Real-time responses"]

function HeroDoodles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden xl:block">
      <DashMark className="absolute top-[4%] left-[6%] size-8 text-foreground/30" />
      <BubbleLines className="absolute top-[15%] left-[2%] size-20 text-foreground/40" />
      <FaceDoodle className="absolute top-[33%] left-[3%] size-16 text-foreground/35" />
      <DashMark className="absolute top-[8%] right-[13%] size-6 rotate-45 text-[var(--color-warm)]/70" />
      <YesBubble className="absolute top-[16%] right-[3%] size-24 -rotate-3 text-foreground/40" />
      <FaceDoodle className="absolute top-[36%] right-[1%] size-14 rotate-6 text-foreground/30" />
      <DashMark className="absolute top-[47%] right-[8%] size-5 -rotate-12 text-[var(--color-warm)]/70" />
      <CheckBubble className="absolute top-[57%] left-[5%] size-20 -rotate-2 text-foreground/40" />
      <DashMark className="absolute top-[68%] left-[12%] size-6 rotate-12 text-[var(--color-warm)]/70" />
      <SmileyDoodle className="absolute top-[62%] right-[6%] size-16 rotate-6 text-foreground/35" />
      <DashMark className="absolute top-[75%] right-[15%] size-5 -rotate-6 text-[var(--color-warm)]/70" />
      <FaceDoodle className="absolute bottom-[10%] left-[1%] size-16 -rotate-6 text-foreground/30" />
      <DollarBubble className="absolute bottom-[4%] left-[9%] size-14 rotate-3 text-foreground/40" />
      <StarBubble className="absolute bottom-[6%] right-[2%] size-24 rotate-2 text-foreground/40" />
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
      <AmbientGlow />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <span className="flex items-center text-sm font-semibold tracking-tight">
          <Image src="/logo.png" alt="JAF logo" width={46} height={46} className="rounded-md" />
          JAF
          <span className="pl-2 text-muted-foreground hidden font-normal sm:inline">— Just another form</span>
        </span>
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

          <p className="text-muted-foreground max-w-lg text-base leading-relaxed sm:text-lg">
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
