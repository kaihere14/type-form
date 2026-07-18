import Link from "next/link";
import { ArrowRightIcon, CornerDownLeftIcon } from "lucide-react";
import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,color-mix(in_oklch,var(--color-warm)_18%,transparent),transparent)]"
      />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <span className="text-sm font-semibold tracking-tight">JAF</span>
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/login" className="text-muted-foreground hover:text-foreground px-3 py-1.5 transition-colors">
            Log in
          </Link>
          <Button asChild size="sm">
            <Link href="/signup">
              Get started
            </Link>
          </Button>
        </nav>
      </header>

      <section className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 items-center gap-16 px-6 py-16 md:grid-cols-2 md:px-10 md:py-24">
        <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-start gap-6 duration-700">
          <span className="text-muted-foreground rounded-full border border-border px-3 py-1 text-xs tracking-wide uppercase">
            Forms, without the form-feel
          </span>

          <h1 className="text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Ask one question
            <br />
            at a{" "}
            <span className="text-[color-mix(in_oklch,var(--color-warm)_85%,var(--foreground))]">
              time.
            </span>
          </h1>

          <p className="text-muted-foreground max-w-md text-base leading-relaxed sm:text-lg">
            Build forms that feel like a conversation, not a spreadsheet.
            One question fills the screen, people answer, and you get
            finished responses instead of half-abandoned tabs.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button asChild size="lg">
              <Link href="/signup">
                Start building
                <ArrowRightIcon />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/login">Log in to your account</Link>
            </Button>
          </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-6 flex justify-center delay-150 duration-700 md:justify-end">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-black/20">
            <div className="mb-8 flex items-center justify-between">
              <span className="text-muted-foreground text-xs tracking-wide">
                Question 1 of 3
              </span>
              <div className="flex gap-1.5">
                <span className="h-1.5 w-6 rounded-full bg-[var(--color-warm)]" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted" />
                <span className="h-1.5 w-1.5 rounded-full bg-muted" />
              </div>
            </div>

            <p className="mb-4 text-lg leading-snug font-medium text-balance">
              What should we call you?
            </p>

            <div className="flex items-center gap-1 border-b border-border pb-2 text-lg">
              <span className="text-muted-foreground">Arman</span>
              <span
                aria-hidden
                className="animate-caret-blink h-5 w-[2px] bg-[var(--color-warm)]"
              />
            </div>

            <div className="text-muted-foreground mt-6 flex items-center justify-end gap-1.5 text-xs">
              Press Enter
              <CornerDownLeftIcon className="size-3.5" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
