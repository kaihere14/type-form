"use client"

import * as React from "react"
import { StarIcon } from "lucide-react"

import { cn } from "~/lib/utils"

const STAR_COUNT = 5

export function StarRating({
  value = 0,
  onChange,
  readOnly = false,
  size = "default",
}: {
  value?: number
  onChange?: (value: number) => void
  readOnly?: boolean
  size?: "default" | "sm"
}) {
  const [hovered, setHovered] = React.useState<number | null>(null)
  const displayValue = hovered ?? value

  return (
    <div
      className="flex items-center gap-1"
      onMouseLeave={() => setHovered(null)}
      role={readOnly ? undefined : "radiogroup"}
      aria-label="Rating"
    >
      {Array.from({ length: STAR_COUNT }, (_, index) => index + 1).map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly}
          aria-label={`${star} star${star === 1 ? "" : "s"}`}
          aria-pressed={value >= star}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onClick={() => !readOnly && onChange?.(star)}
          className={cn(
            "text-muted-foreground/40 transition-colors",
            !readOnly && "cursor-pointer hover:scale-110",
            readOnly && "cursor-default",
          )}
        >
          <StarIcon
            className={cn(
              size === "sm" ? "size-4" : "size-6",
              star <= displayValue && "fill-[var(--color-warm)] text-[var(--color-warm)]",
            )}
          />
        </button>
      ))}
    </div>
  )
}
