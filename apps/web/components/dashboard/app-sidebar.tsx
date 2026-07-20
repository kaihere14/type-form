"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  CheckIcon,
  ChevronsUpDownIcon,
  FileTextIcon,
  InboxIcon,
  LayoutGridIcon,
  LineChartIcon,
  PlugIcon,
  PlusIcon,
  SettingsIcon,
} from "lucide-react"

import { Button } from "~/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
} from "~/components/ui/collapsible"
import { CreateWorkspaceDialog } from "~/components/dashboard/create-workspace-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar"
import { useCurrentWorkspace } from "~/providers/workspace"
import { useFolders } from "~/hooks/dashboard/use-folders"
import { useForms } from "~/hooks/dashboard/use-forms"

const navItems = [
  { title: "Templates", href: "/dashboard/templates", icon: FileTextIcon },
  { title: "Responses", href: "/dashboard/responses", icon: InboxIcon },
  { title: "Analytics", href: "/dashboard/analytics", icon: LineChartIcon },
  { title: "Integrations", href: "/dashboard/integrations", icon: PlugIcon },
]

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const isFormsSection = pathname === "/dashboard" || pathname.startsWith("/dashboard/forms")

  const { workspace, workspaces, isLoading: isWorkspaceLoading, selectWorkspace } = useCurrentWorkspace()
  const { folders } = useFolders(workspace?.id)
  const { forms } = useForms({ workspaceId: workspace?.id })
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false)

  const hasWorkspace = workspaces.length > 0
  const showOnboarding = !isWorkspaceLoading && !hasWorkspace

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {hasWorkspace ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg">
                    <Image
                      src="/logo.png"
                      alt="JAF logo"
                      width={24}
                      height={24}
                      className="rounded-md"
                    />
                    <span className="truncate font-semibold">{workspace?.name}</span>
                    <ChevronsUpDownIcon className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56"
                >
                  <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {workspaces.map((item) => (
                    <DropdownMenuItem key={item.id} onClick={() => selectWorkspace(item.id)}>
                      <span className="truncate">{item.name}</span>
                      {item.id === workspace?.id && <CheckIcon className="ml-auto size-4" />}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setCreateDialogOpen(true)}>
                    <PlusIcon />
                    Create workspace
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Popover open={showOnboarding} onOpenChange={() => {}}>
                <PopoverTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="ring-2 ring-[var(--color-warm)] ring-offset-2 ring-offset-sidebar"
                  >
                    <Image
                      src="/logo.png"
                      alt="JAF logo"
                      width={24}
                      height={24}
                      className="rounded-md"
                    />
                    <span className="truncate font-semibold">No workspace yet</span>
                  </SidebarMenuButton>
                </PopoverTrigger>
                <PopoverContent side="right" align="start" className="w-72">
                  <div className="flex flex-col gap-3">
                    <p className="text-sm font-semibold">Create your first workspace</p>
                    <p className="text-muted-foreground text-sm">
                      Workspaces hold your forms and folders. Start here to set one up.
                    </p>
                    <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
                      Create workspace
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === "/dashboard"} tooltip="Forms">
                  <Link href="/dashboard">
                    <LayoutGridIcon />
                    <span>Forms</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuBadge>{forms.length}</SidebarMenuBadge>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Collapsible open={isFormsSection}>
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
            <SidebarGroup className="pt-0">
              <SidebarGroupLabel>Folders</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {folders.map((folder) => (
                    <SidebarMenuItem key={folder.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/dashboard/forms/${folder.id}`}
                      >
                        <Link href={`/dashboard/forms/${folder.id}`}>
                          <span>{folder.name}</span>
                        </Link>
                      </SidebarMenuButton>
                      <SidebarMenuBadge>{folder.formCount}</SidebarMenuBadge>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </CollapsibleContent>
        </Collapsible>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href} tooltip={item.title}>
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/dashboard/settings"} tooltip="Settings">
              <Link href="/dashboard/settings">
                <SettingsIcon />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />

      <CreateWorkspaceDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </Sidebar>
  )
}
