"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { LoginForm } from "~/components/login-form"
import { useLoginUser, useLoginWithProvider } from "~/hooks/auth/use-auth"
import { AmbientGlow, BubbleLines, DashMark, FaceDoodle, StarBubble, YesBubble } from "~/components/decor"

function AuthDoodles() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 hidden xl:block">
      <BubbleLines className="absolute top-[14%] left-[8%] size-20 text-foreground/40" />
      <FaceDoodle className="absolute bottom-[16%] left-[10%] size-16 -rotate-6 text-foreground/30" />
      <DashMark className="absolute top-[10%] right-[16%] size-6 rotate-45 text-[var(--color-warm)]/70" />
      <YesBubble className="absolute top-[18%] right-[8%] size-24 -rotate-3 text-foreground/40" />
      <StarBubble className="absolute bottom-[14%] right-[7%] size-24 rotate-2 text-foreground/40" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  )
}

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState("")
  const { mutateAsync } = useLoginUser()
  const { mutateAsync: mutateAsyncProvider } = useLoginWithProvider()

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("accessToken") && localStorage.getItem("refreshToken")) {
      router.push("/dashboard");
    } else {
      setChecked(true);
    }
  }, [router]);

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      setError(errorParam)
    }
  }, [searchParams]);

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

  async function handleProviderLogin(provider: "google" | "apple") {
    const {redirect} = await mutateAsyncProvider({provider})
    if (redirect) {
      window.location.href = redirect
    }
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden p-6 md:p-10">
      <AmbientGlow />
      <AuthDoodles />

      <div className="animate-in fade-in slide-in-from-bottom-4 flex w-full max-w-sm flex-col gap-6 duration-700">
        <Link href="/" className="flex items-center self-center text-sm font-semibold tracking-tight">
          <Image src="/logo.png" alt="JAF logo" width={46} height={46} className="rounded-md" />
          JAF
        </Link>
        {error && (
          <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
        <LoginForm onSubmit={handleSubmit} onProviderLogin={handleProviderLogin} />
      </div>
    </div>
  )
}
