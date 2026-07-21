"use client"

import * as React from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"
import { toast } from "sonner"

import { AmbientGlow } from "~/components/decor"
import { QuestionField, type PublicQuestion } from "~/components/public-form/question-field"
import { Button } from "~/components/ui/button"
import { Spinner } from "~/components/ui/spinner"
import { trpc } from "~/trpc/client"

function isAnswered(value: unknown) {
  if (Array.isArray(value)) return value.length > 0
  return value !== undefined && value !== null && value !== ""
}

export default function PublicFormPage() {
  const { shareCode } = useParams<{ shareCode: string }>()
  const {
    data: form,
    isLoading,
    error,
  } = trpc.form.getByShareCode.useQuery({ shareCode }, { enabled: !!shareCode, retry: false })
  const submitResponse = trpc.response.submit.useMutation()

  const [answers, setAnswers] = React.useState<Record<string, unknown>>({})
  const [submitted, setSubmitted] = React.useState(false)
  const [stepIndex, setStepIndex] = React.useState(0)

  function setAnswer(questionId: string, value: unknown) {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  function submitAnswers() {
    if (!form) return

    const payload = form.questions
      .filter((question) => isAnswered(answers[question.id]))
      .map((question) => ({ questionId: question.id, value: answers[question.id] }))

    submitResponse.mutate(
      { shareCode, answers: payload },
      {
        onSuccess: () => setSubmitted(true),
        onError: (err) => toast.error(err.message),
      },
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner className="size-8 text-[var(--color-warm)]" />
      </div>
    )
  }

  if (error || !form) {
    return (
      <div className="relative flex min-h-svh flex-col items-center justify-center gap-3 overflow-hidden p-6 text-center">
        <AmbientGlow />
        <p className="text-muted-foreground text-sm">
          This form doesn&apos;t exist or is no longer accepting responses.
        </p>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="relative flex min-h-svh flex-col items-center justify-center gap-5 overflow-hidden p-6 text-center">
        <AmbientGlow />
        <Image src="/logo.png" alt="JAF logo" width={56} height={56} className="rounded-xl" />
        <h1 className="text-3xl font-semibold">Thanks for your response!</h1>
        <p className="text-muted-foreground text-lg">Your answers have been recorded.</p>
      </div>
    )
  }

  const questions = [...form.questions].sort((a, b) => a.order - b.order)

  if (questions.length === 0) {
    return (
      <div className="relative flex min-h-svh flex-col items-center justify-center gap-3 overflow-hidden p-6 text-center">
        <AmbientGlow />
        <p className="text-muted-foreground text-sm">This form doesn&apos;t have any questions yet.</p>
      </div>
    )
  }

  const currentQuestion = questions[Math.min(stepIndex, questions.length - 1)]!
  const isLastQuestion = stepIndex === questions.length - 1

  function handleStepSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (currentQuestion.required && !isAnswered(answers[currentQuestion.id])) {
      toast.error("This question is required")
      return
    }

    if (isLastQuestion) {
      submitAnswers()
    } else {
      setStepIndex((index) => index + 1)
    }
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center overflow-hidden px-6 py-12">
      <AmbientGlow />

      <div className="flex w-full max-w-2xl flex-1 flex-col gap-10">
        <div className="flex items-center gap-4">
          {stepIndex > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setStepIndex((index) => index - 1)}
              aria-label="Previous question"
            >
              <ArrowLeftIcon />
            </Button>
          )}
          <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
            <div
              className="h-full rounded-full bg-[var(--color-warm)] transition-all"
              style={{ width: `${((stepIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
          <span className="text-muted-foreground shrink-0 text-sm tabular-nums">
            {stepIndex + 1} / {questions.length}
          </span>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-10">
          <div className="flex flex-col items-center gap-4 text-center">
            <Image src="/logo.png" alt="JAF logo" width={72} height={72} className="rounded-2xl" />
            <p className="text-foreground text-2xl font-semibold md:text-3xl">{form.title}</p>
          </div>

          <form onSubmit={handleStepSubmit} className="flex w-full flex-col gap-10">
            <QuestionField
              key={currentQuestion.id}
              question={currentQuestion as PublicQuestion}
              value={answers[currentQuestion.id]}
              onChange={(value) => setAnswer(currentQuestion.id, value)}
            />

            <Button type="submit" size="lg" disabled={submitResponse.isPending} className="h-14 w-full text-lg">
              {submitResponse.isPending ? "Submitting…" : isLastQuestion ? "Submit" : "Next"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
