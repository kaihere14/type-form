"use client"

import { Suspense, useEffect } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Spinner } from "~/components/ui/spinner"
import { AmbientGlow } from "~/components/decor"

function SuccessPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const accessToken = searchParams.get("accessToken")
    const refreshToken = searchParams.get("refreshToken")

    if (!accessToken || !refreshToken) {
      router.replace("/login?error=Something went wrong signing you in")
      return
    }

    localStorage.setItem("accessToken", accessToken)
    localStorage.setItem("refreshToken", refreshToken)
    router.replace("/dashboard?from=login")
  }, [router, searchParams])

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden p-6 md:p-10">
      <AmbientGlow />

      <div className="animate-in fade-in zoom-in-95 flex flex-col items-center gap-4 text-center duration-500">
        <Image src="/logo.png" alt="JAF logo" width={64} height={64} className="rounded-lg" />
        <Spinner className="size-8 text-[var(--color-warm)]" />
        <p className="text-muted-foreground text-sm">Signing you in...</p>
      </div>
    </div>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessPageContent />
    </Suspense>
  )
}
