"use client"

import { AppSidebar } from "~/components/dashboard/app-sidebar"
import { SiteHeader } from "~/components/dashboard/site-header"
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar"
import { WorkspaceProvider } from "~/providers/workspace"
import { useAuthGuard } from "~/hooks/auth/use-auth-guard"

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const checked = useAuthGuard()

  if (!checked) return null

  return (
    <WorkspaceProvider>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </WorkspaceProvider>
  )
}
