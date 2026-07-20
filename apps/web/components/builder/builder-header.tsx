"use client"

import { ArrowLeftIcon, Share2Icon } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

type FormStatus = "draft" | "live" | "closed"
type SaveState = "idle" | "saving" | "saved"

export function BuilderHeader({
  title,
  status,
  shareCode,
  saveState,
  onTitleChange,
  onStatusChange,
  onBack,
}: {
  title: string
  status: FormStatus
  shareCode: string
  saveState: SaveState
  onTitleChange: (title: string) => void
  onStatusChange: (status: FormStatus) => void
  onBack: () => void
}) {
  async function handleShare() {
    const link = `${window.location.origin}/f/${shareCode}`
    await navigator.clipboard.writeText(link)
    toast.success("Link copied to clipboard")
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b px-4 md:px-6">
      <Button variant="ghost" size="icon" onClick={onBack} aria-label="Back">
        <ArrowLeftIcon />
      </Button>

      <Input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Untitled form"
        className="h-9 max-w-sm border-transparent bg-transparent text-base font-semibold shadow-none hover:border-border focus-visible:border-input"
      />

      <Badge variant="outline" className="text-muted-foreground shrink-0">
        {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : ""}
      </Badge>

      <div className="ml-auto flex items-center gap-2">
        <Select value={status} onValueChange={(value) => onStatusChange(value as FormStatus)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={handleShare}>
          <Share2Icon />
          Share
        </Button>
      </div>
    </header>
  )
}
