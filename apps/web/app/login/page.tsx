"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LoginForm } from "~/components/login-form"
import { GalleryVerticalEndIcon } from "lucide-react"
import { useLoginUser } from "~/hooks/auth/use-auth"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const { mutateAsync } = useLoginUser()
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
      const { id } = await mutateAsync({ email: formData.get("email") as string, password: formData.get("password") as string })
      if (id) {
        router.push("/dashboard?from=login")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error))
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEndIcon className="size-4" />
          </div>
          JAF
        </a>
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
