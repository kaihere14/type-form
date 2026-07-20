"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  pointerWithin,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { GripVerticalIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "~/components/ui/button"
import { BuilderHeader } from "~/components/builder/builder-header"
import { QuestionCard } from "~/components/builder/question-card"
import { QuestionTypePalette } from "~/components/builder/question-type-palette"
import { CHOICE_QUESTION_TYPES, QUESTION_TYPE_CONFIG, type QuestionType } from "~/components/builder/question-types"
import type { BuilderQuestion } from "~/components/builder/types"
import { useAuthGuard } from "~/hooks/auth/use-auth-guard"
import { useForm } from "~/hooks/dashboard/use-form"
import { trpc } from "~/trpc/client"

type FormStatus = "draft" | "live" | "closed"

interface ServerQuestion {
  id: string
  type: QuestionType
  label: string
  description?: string
  required: boolean
  options?: string[]
  order: number
}

function toBuilderQuestions(questions: ServerQuestion[]): BuilderQuestion[] {
  return [...questions]
    .sort((a, b) => a.order - b.order)
    .map((q) => ({
      localId: crypto.randomUUID(),
      type: q.type,
      label: q.label,
      description: q.description,
      required: q.required,
      options: q.options,
      order: q.order,
    }))
}

function CanvasDropzone({ children }: { children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id: "canvas-dropzone" })
  return (
    <div ref={setNodeRef} className="flex min-h-[60vh] flex-col gap-3">
      {children}
    </div>
  )
}

export default function BuilderPage() {
  const checked = useAuthGuard()
  const router = useRouter()
  const { formId } = useParams<{ formId: string }>()
  const { form, isLoading, updateForm } = useForm(formId)
  const utils = trpc.useUtils()

  const [title, setTitle] = React.useState("")
  const [status, setStatus] = React.useState<FormStatus>("draft")
  const [questions, setQuestions] = React.useState<BuilderQuestion[]>([])
  const [saveState, setSaveState] = React.useState<"idle" | "saving" | "saved">("idle")
  const isInitialized = React.useRef(false)

  React.useEffect(() => {
    if (!form || isInitialized.current) return
    setTitle(form.title)
    setStatus(form.status)
    setQuestions(toBuilderQuestions(form.questions))
    isInitialized.current = true
  }, [form])

  React.useEffect(() => {
    if (!isInitialized.current || !formId) return
    setSaveState("saving")
    const timeout = setTimeout(() => {
      updateForm.mutate(
        {
          id: formId,
          title: title.trim() || "Untitled form",
          status,
          questions: questions.map(({ localId, label, ...rest }) => ({
            ...rest,
            label: label.trim() || "Untitled question",
          })),
        },
        {
          onSuccess: () => {
            setSaveState("saved")
            utils.form.list.invalidate()
          },
          onError: (err) => {
            toast.error(err.message)
            setSaveState("idle")
          },
        },
      )
    }, 800)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, status, questions, formId])

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const [activeDragItem, setActiveDragItem] = React.useState<
    { kind: "palette"; type: QuestionType } | { kind: "question"; question: BuilderQuestion } | null
  >(null)

  function handleDragStart(event: DragStartEvent) {
    const data = event.active.data.current as { source?: string; questionType?: QuestionType } | undefined
    if (data?.source === "palette" && data.questionType) {
      setActiveDragItem({ kind: "palette", type: data.questionType })
      return
    }
    const question = questions.find((q) => q.localId === event.active.id)
    if (question) setActiveDragItem({ kind: "question", question })
  }

  function addQuestion(type: QuestionType, index?: number) {
    const newQuestion: BuilderQuestion = {
      localId: crypto.randomUUID(),
      type,
      label: "",
      description: "",
      required: false,
      options: CHOICE_QUESTION_TYPES.includes(type) ? ["Option 1"] : undefined,
      order: 0,
    }
    setQuestions((prev) => {
      const next = [...prev]
      const insertAt = index === undefined ? next.length : index
      next.splice(insertAt, 0, newQuestion)
      return next.map((q, i) => ({ ...q, order: i }))
    })
  }

  function updateQuestion(localId: string, patch: Partial<BuilderQuestion>) {
    setQuestions((prev) => prev.map((q) => (q.localId === localId ? { ...q, ...patch } : q)))
  }

  function deleteQuestion(localId: string) {
    setQuestions((prev) => prev.filter((q) => q.localId !== localId))
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDragItem(null)
    const { active, over } = event
    if (!over) return

    const activeData = active.data.current as { source?: string; questionType?: QuestionType } | undefined

    if (activeData?.source === "palette" && activeData.questionType) {
      const overIndex = questions.findIndex((q) => q.localId === over.id)
      addQuestion(activeData.questionType, overIndex === -1 ? questions.length : overIndex)
      return
    }

    if (active.id !== over.id) {
      setQuestions((prev) => {
        const oldIndex = prev.findIndex((q) => q.localId === active.id)
        const newIndex = prev.findIndex((q) => q.localId === over.id)
        if (oldIndex === -1 || newIndex === -1) return prev
        return arrayMove(prev, oldIndex, newIndex).map((q, i) => ({ ...q, order: i }))
      })
    }
  }

  if (!checked) return null

  if (isLoading) {
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

  return (
    <div className="flex min-h-svh flex-col">
      <BuilderHeader
        title={title}
        status={status}
        shareCode={form.shareCode}
        saveState={saveState}
        onTitleChange={setTitle}
        onStatusChange={setStatus}
        onBack={() => router.push("/dashboard")}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveDragItem(null)}
      >
        <div className="flex flex-1 gap-6 overflow-hidden p-4 md:p-6">
          <aside className="w-64 shrink-0">
            <QuestionTypePalette onAddQuestion={(type) => addQuestion(type)} />
          </aside>

          <div className="mx-auto w-full max-w-2xl overflow-y-auto pb-12">
            <SortableContext items={questions.map((q) => q.localId)} strategy={verticalListSortingStrategy}>
              <CanvasDropzone>
                {questions.length === 0 && (
                  <div className="text-muted-foreground rounded-xl border border-dashed p-12 text-center text-sm">
                    Click or drag a question type from the left to get started.
                  </div>
                )}
                {questions.map((question) => (
                  <QuestionCard
                    key={question.localId}
                    question={question}
                    onChange={(patch) => updateQuestion(question.localId, patch)}
                    onDelete={() => deleteQuestion(question.localId)}
                  />
                ))}
              </CanvasDropzone>
            </SortableContext>
          </div>
        </div>

        <DragOverlay>
          {activeDragItem?.kind === "palette" &&
            (() => {
              const { label, icon: Icon } = QUESTION_TYPE_CONFIG[activeDragItem.type]
              return (
                <div className="border-border bg-card flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm font-medium shadow-lg">
                  <Icon className="text-muted-foreground size-4 shrink-0" />
                  {label}
                </div>
              )
            })()}
          {activeDragItem?.kind === "question" && (
            <div className="bg-card flex items-center gap-2 rounded-xl border p-4 shadow-lg">
              <GripVerticalIcon className="text-muted-foreground size-4 shrink-0" />
              <span className="text-sm font-medium">{activeDragItem.question.label || "Untitled question"}</span>
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
