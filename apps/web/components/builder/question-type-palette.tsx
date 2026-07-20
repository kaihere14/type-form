"use client"

import { useDraggable } from "@dnd-kit/core"

import { cn } from "~/lib/utils"
import { QUESTION_TYPE_CONFIG, QUESTION_TYPES, type QuestionType } from "./question-types"

function PaletteItem({ type, onClick }: { type: QuestionType; onClick: () => void }) {
  const { label, icon: Icon } = QUESTION_TYPE_CONFIG[type]
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette:${type}`,
    data: { source: "palette", questionType: type },
  })

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={onClick}
      className={cn(
        "border-border bg-card flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm font-medium transition-colors hover:border-[var(--color-warm)]/50 hover:bg-muted",
        isDragging && "opacity-40",
      )}
      {...listeners}
      {...attributes}
    >
      <Icon className="text-muted-foreground size-4 shrink-0" />
      {label}
    </button>
  )
}

export function QuestionTypePalette({ onAddQuestion }: { onAddQuestion: (type: QuestionType) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-muted-foreground px-1 text-xs font-medium tracking-wide uppercase">Question types</p>
      {QUESTION_TYPES.map((type) => (
        <PaletteItem key={type} type={type} onClick={() => onAddQuestion(type)} />
      ))}
      <p className="text-muted-foreground px-1 pt-1 text-xs leading-relaxed">
        Click to add, or drag onto the form.
      </p>
    </div>
  )
}
