"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { BellIcon, MoonIcon, PlusIcon, SearchIcon, SunIcon } from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Input } from "~/components/ui/input"
import { Separator } from "~/components/ui/separator"
import { SidebarTrigger } from "~/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipTrigger } from "~/components/ui/tooltip"
import { trpc } from "~/trpc/client"
import { useCurrentWorkspace } from "~/providers/workspace"

export function SiteHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [hasUnread, setHasUnread] = React.useState(true)
  const { workspace } = useCurrentWorkspace()
  const utils = trpc.useUtils()

  const folderMatch = pathname.match(/^\/dashboard\/forms\/([^/]+)$/)
  const currentFolderId = folderMatch ? folderMatch[1] : undefined

  const createForm = trpc.form.create.useMutation({
    onSuccess: () => {
      utils.form.list.invalidate()
      utils.folder.list.invalidate()
    },
  })

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  async function handleCreateForm() {
    if (!workspace) return
    try {
      await createForm.mutateAsync({
        workspaceId: workspace.id,
        folderId: currentFolderId,
        title: "Untitled form",
      })
      toast.success("Form created")
      router.push(currentFolderId ? `/dashboard/forms/${currentFolderId}` : "/dashboard")
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create form")
    }
  }

  function logout() {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    router.push("/")
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b px-4 md:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 h-5" />

      <div className="relative w-full max-w-sm">
        <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input placeholder="Search forms..." className="rounded-full pl-9" />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
        </Button>

        <DropdownMenu onOpenChange={(open) => open && setHasUnread(false)}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative" aria-label="Notifications">
              <BellIcon />
              {hasUnread && (
                <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[var(--color-warm)]" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex-col items-start gap-0.5">
              <span className="text-sm font-medium">Waitlist — Beta Access</span>
              <span className="text-muted-foreground text-xs">12 new responses today</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex-col items-start gap-0.5">
              <span className="text-sm font-medium">Product Feedback Q3</span>
              <span className="text-muted-foreground text-xs">Draft saved 5h ago</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <span tabIndex={workspace ? undefined : 0}>
              <Button
                className="bg-[var(--color-warm)] text-black hover:bg-[var(--color-warm)]/90"
                onClick={handleCreateForm}
                disabled={!workspace || createForm.isPending}
              >
                <PlusIcon />
                Create form
              </Button>
            </span>
          </TooltipTrigger>
          {!workspace && <TooltipContent>Create a workspace first</TooltipContent>}
        </Tooltip>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer bg-[var(--color-warm)]">
              <AvatarFallback className="bg-[var(--color-warm)] font-semibold text-black">
                J
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={logout}>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
