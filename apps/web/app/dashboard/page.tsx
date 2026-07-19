"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense } from "react"
import { CheckCircle2Icon } from "lucide-react"
import { Button } from "~/components/ui/button"
import { AmbientGlow, CheckBubble, DashMark, StarBubble, YesBubble } from "~/components/decor"

function DashboardDoodles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden xl:block">
      <YesBubble className="animate-in fade-in zoom-in-95 absolute top-[16%] left-[9%] size-24 -rotate-3 text-foreground/40 duration-700" />
      <StarBubble className="animate-in fade-in zoom-in-95 absolute bottom-[18%] left-[7%] size-24 rotate-2 text-foreground/40 delay-150 duration-700" />
      <DashMark className="absolute top-[12%] right-[14%] size-6 rotate-45 text-[var(--color-warm)]/70" />
      <CheckBubble className="animate-in fade-in zoom-in-95 absolute top-[20%] right-[6%] size-20 rotate-2 text-foreground/40 delay-200 duration-700" />
      <DashMark className="absolute bottom-[16%] right-[10%] size-5 -rotate-12 text-[var(--color-warm)]/70" />
    </div>
  )
}

function DashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get("from")

  const title = from === "signup" ? "Account created" : "Welcome back"
  const description =
    from === "signup"
      ? "Your account is ready. Your forms will live here once form building ships."
      : "You're signed in. Your forms will live here once form building ships."

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden">
      <AmbientGlow />
      <DashboardDoodles />

      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <span className="text-sm font-semibold tracking-tight">JAF</span>
        <Button variant="ghost" size="sm" onClick={() => {
          router.push("/")
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
        }}>
          Log out
        </Button>
      </header>

      <div className="relative flex flex-1 flex-col items-center justify-center gap-6 p-6">
        <div className="animate-in fade-in zoom-in-95 flex flex-col items-center gap-5 text-center duration-500">
          <div className="flex size-14 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--color-warm)_18%,transparent)]">
            <CheckCircle2Icon className="size-7 text-[var(--color-warm)]" />
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              {description}
            </p>
          </div>

          <Button asChild variant="outline" size="sm" className="mt-2">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  )
}
