"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { format, formatDistanceToNow } from "date-fns"
import { ArrowLeftIcon } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { CHOICE_QUESTION_TYPES } from "~/components/builder/question-types"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "~/components/ui/chart"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { useAuthGuard } from "~/hooks/auth/use-auth-guard"
import { useForm } from "~/hooks/dashboard/use-form"
import { useResponses } from "~/hooks/dashboard/use-responses"

const chartConfig = {
  count: { label: "Responses", color: "var(--color-warm)" },
} satisfies ChartConfig

function formatValue(value: unknown) {
  if (value === undefined || value === null || value === "") return "—"
  if (Array.isArray(value)) return value.length > 0 ? value.join(", ") : "—"
  return String(value)
}

export default function FormResponsesPage() {
  const checked = useAuthGuard()
  const router = useRouter()
  const { formId } = useParams<{ formId: string }>()
  const { form, isLoading: isFormLoading } = useForm(formId)
  const { responses, isLoading: isResponsesLoading } = useResponses(formId)
  const [openResponseId, setOpenResponseId] = React.useState<string | null>(null)

  if (!checked) return null

  if (isFormLoading || isResponsesLoading) {
    return (
      <div className="text-muted-foreground flex min-h-svh items-center justify-center text-sm">Loading…</div>
    )
  }

  if (!form) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-3">
        <p className="text-muted-foreground text-sm">
          This form doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <Button variant="outline" onClick={() => router.push("/dashboard")}>
          Back to dashboard
        </Button>
      </div>
    )
  }

  const questions = [...form.questions].sort((a, b) => a.order - b.order)
  const latestResponses = responses.slice(0, 3)
  const openResponse = responses.find((response) => response.id === openResponseId) ?? null
  const previewQuestion = questions[0]

  function answerFor(response: (typeof responses)[number], questionId: string) {
    return response.answers.find((answer) => answer.questionId === questionId)?.value
  }

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex h-16 shrink-0 items-center gap-3 border-b px-4 md:px-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push(`/builder/${formId}`)}
          aria-label="Back to builder"
        >
          <ArrowLeftIcon />
        </Button>
        <h1 className="truncate text-base font-semibold">{form.title}</h1>
        <Badge variant="outline" className="text-muted-foreground shrink-0">
          {responses.length.toLocaleString()} response{responses.length === 1 ? "" : "s"}
        </Badge>
      </header>

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 overflow-y-auto p-4 md:p-6">
        {responses.length === 0 ? (
          <div className="text-muted-foreground rounded-xl border border-dashed p-12 text-center text-sm">
            No responses yet. Share your form to start collecting answers.
          </div>
        ) : (
          <>
            <section className="flex flex-col gap-3">
              <h2 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Latest responses
              </h2>
              <div className="flex flex-col gap-3">
                {latestResponses.map((response) => (
                  <Card
                    key={response.id}
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => setOpenResponseId(response.id)}
                  >
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">
                        {formatDistanceToNow(new Date(response.submittedAt), { addSuffix: true })}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-1 text-sm">
                      {questions.slice(0, 3).map((question) => (
                        <div key={question.id} className="flex items-baseline gap-2">
                          <span className="text-muted-foreground shrink-0">{question.label}:</span>
                          <span className="truncate">{formatValue(answerFor(response, question.id))}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <h2 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">Breakdown</h2>
              {questions.map((question) => {
                const isChartable = CHOICE_QUESTION_TYPES.includes(question.type) || question.type === "rating"

                if (isChartable) {
                  const optionLabels = question.type === "rating" ? ["1", "2", "3", "4", "5"] : (question.options ?? [])
                  const counts = new Map<string, number>(optionLabels.map((label) => [label, 0]))
                  let answeredCount = 0

                  responses.forEach((response) => {
                    const value = answerFor(response, question.id)
                    if (value === undefined || value === null) return
                    answeredCount += 1
                    const values = Array.isArray(value) ? value : [value]
                    values.forEach((entry) => {
                      const key = String(entry)
                      counts.set(key, (counts.get(key) ?? 0) + 1)
                    })
                  })

                  const data = Array.from(counts.entries()).map(([option, count]) => ({ option, count }))

                  return (
                    <Card key={question.id}>
                      <CardHeader>
                        <CardTitle className="text-sm font-medium">{question.label}</CardTitle>
                        <p className="text-muted-foreground text-xs">
                          {answeredCount} of {responses.length} answered
                        </p>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer config={chartConfig} className="h-[200px] w-full">
                          <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
                            <CartesianGrid horizontal={false} />
                            <XAxis type="number" allowDecimals={false} hide />
                            <YAxis
                              type="category"
                              dataKey="option"
                              width={100}
                              tickLine={false}
                              axisLine={false}
                            />
                            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                            <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                          </BarChart>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                  )
                }

                const answeredCount = responses.filter((response) => {
                  const value = answerFor(response, question.id)
                  return value !== undefined && value !== null && value !== ""
                }).length

                return (
                  <Card key={question.id}>
                    <CardHeader>
                      <CardTitle className="text-sm font-medium">{question.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-semibold tabular-nums">{answeredCount}</p>
                      <p className="text-muted-foreground text-xs">of {responses.length} responded</p>
                    </CardContent>
                  </Card>
                )
              })}
            </section>

            <section className="flex flex-col gap-3 pb-8">
              <h2 className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                All responses
              </h2>
              <div className="overflow-hidden rounded-xl border">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead>Submitted</TableHead>
                      <TableHead>{previewQuestion?.label ?? "Answer"}</TableHead>
                      <TableHead className="w-20 text-right">View</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {responses.map((response) => (
                      <TableRow key={response.id}>
                        <TableCell className="text-muted-foreground">
                          {format(new Date(response.submittedAt), "PP p")}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {previewQuestion ? formatValue(answerFor(response, previewQuestion.id)) : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => setOpenResponseId(response.id)}>
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </section>
          </>
        )}
      </div>

      <Dialog open={openResponse !== null} onOpenChange={(open) => !open && setOpenResponseId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Response from{" "}
              {openResponse ? formatDistanceToNow(new Date(openResponse.submittedAt), { addSuffix: true }) : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto">
            {openResponse &&
              questions.map((question) => (
                <div key={question.id} className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-xs font-medium">{question.label}</span>
                  <span className="text-sm">{formatValue(answerFor(openResponse, question.id))}</span>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
