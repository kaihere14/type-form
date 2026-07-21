"use client"

import { Checkbox } from "~/components/ui/checkbox"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Textarea } from "~/components/ui/textarea"
import { StarRating } from "~/components/builder/star-rating"
import type { QuestionType } from "~/components/builder/question-types"

export interface PublicQuestion {
  id: string
  type: QuestionType
  label: string
  description?: string
  required: boolean
  options?: string[]
  order: number
}

export function QuestionField({
  question,
  value,
  onChange,
}: {
  question: PublicQuestion
  value: unknown
  onChange: (value: unknown) => void
}) {
  const options = question.options ?? []
  const selectedOptions = Array.isArray(value) ? (value as string[]) : []

  return (
    <div className="flex flex-col gap-4">
      <Label className="flex-col items-start gap-1 text-2xl font-semibold text-balance md:text-3xl">
        <span>
          {question.label}
          {question.required && <span className="text-[var(--color-warm)]"> *</span>}
        </span>
        {question.description && (
          <span className="text-muted-foreground text-base font-normal md:text-lg">{question.description}</span>
        )}
      </Label>

      {(question.type === "short_text" || question.type === "email" || question.type === "number") && (
        <Input
          type={question.type === "email" ? "email" : question.type === "number" ? "number" : "text"}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="h-14 rounded-2xl px-4 text-lg md:text-xl"
        />
      )}

      {question.type === "long_text" && (
        <Textarea
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-36 rounded-2xl px-4 py-3 text-lg md:text-xl"
        />
      )}

      {question.type === "date" && (
        <Input
          type="date"
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="h-14 rounded-2xl px-4 text-lg md:text-xl"
        />
      )}

      {question.type === "multiple_choice" && (
        <RadioGroup value={(value as string) ?? ""} onValueChange={onChange} className="gap-4">
          {options.map((option) => (
            <label key={option} className="flex items-center gap-3 text-lg">
              <RadioGroupItem value={option} className="size-5" />
              {option}
            </label>
          ))}
        </RadioGroup>
      )}

      {question.type === "dropdown" && (
        <Select value={(value as string) ?? ""} onValueChange={onChange}>
          <SelectTrigger className="h-14 w-full rounded-2xl px-4 text-lg md:text-xl">
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option} className="text-lg">
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {question.type === "checkbox" && (
        <div className="flex flex-col gap-4">
          {options.map((option) => (
            <label key={option} className="flex items-center gap-3 text-lg">
              <Checkbox
                checked={selectedOptions.includes(option)}
                onCheckedChange={(checked) =>
                  onChange(
                    checked
                      ? [...selectedOptions, option]
                      : selectedOptions.filter((selected) => selected !== option),
                  )
                }
                className="size-5"
              />
              {option}
            </label>
          ))}
        </div>
      )}

      {question.type === "rating" && <StarRating value={(value as number) ?? 0} onChange={onChange} size="lg" />}
    </div>
  )
}
