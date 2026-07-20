"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function useAuthGuard() {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem("accessToken") || !localStorage.getItem("refreshToken")) {
      router.push("/login")
    } else {
      setChecked(true)
    }
  }, [router])

  return checked
}
