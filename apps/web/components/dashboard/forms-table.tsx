"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import {
  CopyIcon,
  GripVerticalIcon,
  LayoutGridIcon,
  ListIcon,
  Share2Icon,
  Trash2Icon,
} from "lucide-react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { cn } from "~/lib/utils"
import { useCurrentWorkspace } from "~/providers/workspace"
import { useForms } from "~/hooks/dashboard/use-forms"

const statusFilters = ["All", "Draft", "Live", "Closed"] as const
type StatusFilter = (typeof statusFilters)[number]

function StatusBadge({ status }: { status: "draft" | "live" | "closed" }) {
  if (status === "live") {
    return (
      <Badge className="bg-[color-mix(in_oklch,var(--color-warm)_18%,transparent)] text-[var(--color-warm)]">
        Live
      </Badge>
    )
  }
  if (status === "closed") {
    return (
      <Badge variant="outline" className="border-[var(--color-warm)]/50 text-[var(--color-warm)]">
        Closed
      </Badge>
    )
  }
  return <Badge variant="secondary">Draft</Badge>
}

export function FormsTable({ folderId, heading = "All forms" }: { folderId?: string; heading?: string }) {
  const router = useRouter()
  const { workspace } = useCurrentWorkspace()
  const [filter, setFilter] = React.useState<StatusFilter>("All")
  const [view, setView] = React.useState<"list" | "grid">("list")
  const [pendingDeleteId, setPendingDeleteId] = React.useState<string | null>(null)

  const statusParam = filter === "All" ? undefined : (filter.toLowerCase() as "draft" | "live" | "closed")
  const { forms, isLoading, deleteForm } = useForms({
    workspaceId: workspace?.id,
    folderId,
    status: statusParam,
  })

  async function handleCopyLink(shareCode: string) {
    const link = `${window.location.origin}/f/${shareCode}`
    await navigator.clipboard.writeText(link)
    toast.success("Link copied to clipboard")
  }

  async function handleDelete(id: string) {
    try {
      await deleteForm.mutateAsync({ id })
      toast.success("Form deleted")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete form")
    } finally {
      setPendingDeleteId(null)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>

        <div className="flex flex-wrap items-center gap-2">
          <Tabs value={filter} onValueChange={(value) => setFilter(value as StatusFilter)}>
            <TabsList>
              {statusFilters.map((status) => (
                <TabsTrigger key={status} value={status}>
                  {status}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Select defaultValue="edited">
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="edited">Sort: Last edited</SelectItem>
              <SelectItem value="name">Sort: Name</SelectItem>
              <SelectItem value="responses">Sort: Responses</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center rounded-lg border p-0.5">
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => setView("grid")}
              aria-label="Grid view"
            >
              <LayoutGridIcon />
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="icon-sm"
              onClick={() => setView("list")}
              aria-label="List view"
            >
              <ListIcon />
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-10" />
              <TableHead>Form</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Responses</TableHead>
              <TableHead>Edited</TableHead>
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {forms.map((form) => (
              <TableRow
                key={form.id}
                className="group cursor-pointer"
                onClick={() => router.push(`/builder/${form.id}`)}
              >
                <TableCell>
                  <GripVerticalIcon className="text-muted-foreground size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </TableCell>
                <TableCell className="font-semibold">{form.title}</TableCell>
                <TableCell>
                  <StatusBadge status={form.status} />
                </TableCell>
                <TableCell className="tabular-nums">{form.responseCount.toLocaleString()}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(form.lastEditedAt), { addSuffix: true })}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <div
                    className={cn(
                      "flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100",
                    )}
                  >
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Share"
                      onClick={() => handleCopyLink(form.shareCode)}
                    >
                      <Share2Icon className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Duplicate"
                      onClick={() => toast("Duplicate is coming soon")}
                    >
                      <CopyIcon className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Delete"
                      onClick={() => setPendingDeleteId(form.id)}
                    >
                      <Trash2Icon className="size-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

            {!isLoading && forms.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-muted-foreground h-24 text-center">
                  {workspace
                    ? "No forms match this filter."
                    : "Create a workspace to start adding forms."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={pendingDeleteId !== null} onOpenChange={(open) => !open && setPendingDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this form?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the form and all of its responses. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => pendingDeleteId && handleDelete(pendingDeleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
