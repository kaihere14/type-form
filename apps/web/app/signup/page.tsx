"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { SignupForm } from "~/components/signup-form"
import { useCreateUser } from "~/hooks/auth/use-auth"
import { AmbientGlow, CheckBubble, DashMark, DollarBubble, SmileyDoodle, StarBubble } from "~/components/decor"

function AuthDoodles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden xl:block">
      <SmileyDoodle className="animate-in fade-in zoom-in-95 absolute top-[12%] left-[9%] size-16 -rotate-6 text-foreground/35 duration-700" />
      <DollarBubble className="animate-in fade-in zoom-in-95 absolute bottom-[18%] left-[7%] size-14 rotate-3 text-foreground/40 delay-150 duration-700" />
      <DashMark className="absolute top-[8%] right-[15%] size-6 -rotate-12 text-[var(--color-warm)]/70" />
      <CheckBubble className="animate-in fade-in zoom-in-95 absolute top-[20%] right-[6%] size-20 rotate-2 text-foreground/40 delay-200 duration-700" />
      <StarBubble className="animate-in fade-in zoom-in-95 absolute bottom-[14%] right-[5%] size-24 -rotate-2 text-foreground/40 delay-300 duration-700" />
    </div>
  )
}

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const { mutateAsync } = useCreateUser()

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("accessToken") && localStorage.getItem("refreshToken")) {
      router.push("/dashboard");
    } else {
      setChecked(true);
    }
  }, [router]);

  if (!checked) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const password = formData.get("password")
    const confirmPassword = formData.get("confirm-password")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setError("")
    try {
      const { id } = await mutateAsync({ name: formData.get("name") as string, email: formData.get("email") as string, password: password as string })
      if (id) {
        router.push("/login")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error))
    }
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden p-6 md:p-10">
      <AmbientGlow />
      <AuthDoodles />

      <div className="animate-in fade-in slide-in-from-bottom-4 flex w-full max-w-sm flex-col gap-6 duration-700">
        <Link href="/" className="flex items-center self-center text-sm font-semibold tracking-tight">
          <Image src="/logo.png" alt="JAF logo" width={46} height={46} className="rounded-md" />
          JAF<span className="pl-2 text-muted-foreground hidden font-normal sm:inline">— Just another form</span>
        </Link>
        {error && (
          <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <SignupForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
