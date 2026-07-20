"use client"

import * as React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVerticalIcon, PlusIcon, Trash2Icon, XIcon } from "lucide-react"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Switch } from "~/components/ui/switch"
import { Textarea } from "~/components/ui/textarea"
import { cn } from "~/lib/utils"
import { CHOICE_QUESTION_TYPES, QUESTION_TYPE_CONFIG } from "./question-types"
import { StarRating } from "./star-rating"
import type { BuilderQuestion } from "./types"

export function QuestionCard({
  question,
  onChange,
  onDelete,
}: {
  question: BuilderQuestion
  onChange: (patch: Partial<BuilderQuestion>) => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.localId,
  })
  const [previewRating, setPreviewRating] = React.useState(0)

  const style = { transform: CSS.Transform.toString(transform), transition }
  const { label: typeLabel, icon: Icon } = QUESTION_TYPE_CONFIG[question.type]
  const isChoiceType = CHOICE_QUESTION_TYPES.includes(question.type)

  function updateOption(index: number, value: string) {
    const options = [...(question.options ?? [])]
    options[index] = value
    onChange({ options })
  }

  function addOption() {
    onChange({ options: [...(question.options ?? []), ""] })
  }

  function removeOption(index: number) {
    onChange({ options: (question.options ?? []).filter((_, i) => i !== index) })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("bg-card group flex flex-col gap-4 rounded-xl border p-4", isDragging && "opacity-50")}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          className="text-muted-foreground mt-2 cursor-grab touch-none active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <GripVerticalIcon className="size-4" />
        </button>

        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-center gap-2">
            <Icon className="text-muted-foreground size-3.5" />
            <span className="text-muted-foreground text-xs font-medium">{typeLabel}</span>
          </div>

          <Input
            value={question.label}
            onChange={(e) => onChange({ label: e.target.value })}
            placeholder="Question"
            className="font-medium"
          />
          <Textarea
            value={question.description ?? ""}
            onChange={(e) => onChange({ description: e.target.value })}
            placeholder="Description (optional)"
            className="min-h-16 resize-none text-sm"
          />

          {isChoiceType && (
            <div className="flex flex-col gap-2">
              {(question.options ?? []).map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeOption(index)}
                    disabled={(question.options ?? []).length <= 1}
                    aria-label="Remove option"
                  >
                    <XIcon className="size-3.5" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-fit" onClick={addOption}>
                <PlusIcon />
                Add option
              </Button>
            </div>
          )}

          {question.type === "rating" && (
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="text-muted-foreground text-xs">Preview</span>
              <StarRating value={previewRating} onChange={setPreviewRating} />
            </div>
          )}
        </div>

        <Button variant="ghost" size="icon-sm" onClick={onDelete} aria-label="Delete question">
          <Trash2Icon className="size-3.5" />
        </Button>
      </div>

      <div className="flex items-center justify-end gap-2 border-t pt-3">
        <span className="text-muted-foreground text-xs">Required</span>
        <Switch checked={question.required} onCheckedChange={(checked) => onChange({ required: checked })} />
      </div>
    </div>
  )
}
