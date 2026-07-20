"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"
import { toast } from "sonner"

import { FormsTable } from "~/components/dashboard/forms-table"

function SignupToast() {
  const searchParams = useSearchParams()
  const from = searchParams.get("from")

  useEffect(() => {
    if (from === "signup") {
      toast.success("Account created", {
        description: "Your account is ready to go.",
      })
    }
  }, [from])

  return null
}

export default function DashboardPage() {
  return (
    <>
      <Suspense>
        <SignupToast />
      </Suspense>
      <FormsTable />
    </>
  )
}
