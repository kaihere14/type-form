"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LoginForm } from "~/components/login-form"
import { useLoginUser } from "~/hooks/auth/use-auth"
import { AmbientGlow, BubbleLines, DashMark, FaceDoodle, StarBubble, YesBubble } from "~/components/decor"

function AuthDoodles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden xl:block">
      <BubbleLines className="animate-in fade-in zoom-in-95 absolute top-[14%] left-[8%] size-20 text-foreground/40 duration-700" />
      <FaceDoodle className="animate-in fade-in zoom-in-95 absolute bottom-[16%] left-[10%] size-16 -rotate-6 text-foreground/30 delay-150 duration-700" />
      <DashMark className="absolute top-[10%] right-[16%] size-6 rotate-45 text-[var(--color-warm)]/70" />
      <YesBubble className="animate-in fade-in zoom-in-95 absolute top-[18%] right-[8%] size-24 -rotate-3 text-foreground/40 delay-200 duration-700" />
      <StarBubble className="animate-in fade-in zoom-in-95 absolute bottom-[14%] right-[7%] size-24 rotate-2 text-foreground/40 delay-300 duration-700" />
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const { mutateAsync } = useLoginUser()

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
    const email = formData.get("email")
    const password = formData.get("password")

    if (!email || !password) {
      setError("Email and password are required")
      return
    }

    setError("")
    try {
      const { user, refreshToken, accessToken } = await mutateAsync({ email: formData.get("email") as string, password: formData.get("password") as string })
      if (user && accessToken && refreshToken) {
        router.push("/dashboard?from=login")
        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("refreshToken", refreshToken)
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
        <Link href="/" className="self-center text-sm font-semibold tracking-tight">
          JAF
        </Link>
        {error && (
          <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <LoginForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}
