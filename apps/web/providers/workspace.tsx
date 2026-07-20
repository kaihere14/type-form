"use client"

import * as React from "react"
import type { RouterOutputs } from "@repo/trpc/client"
import { trpc } from "~/trpc/client"

type Workspace = RouterOutputs["workspace"]["list"][number]

const STORAGE_KEY = "currentWorkspaceId"

interface WorkspaceContextValue {
  workspaces: Workspace[]
  workspace: Workspace | undefined
  isLoading: boolean
  selectWorkspace: (id: string) => void
}

const WorkspaceContext = React.createContext<WorkspaceContextValue | null>(null)

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { data: workspaces, isLoading } = trpc.workspace.list.useQuery()
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [hydrated, setHydrated] = React.useState(false)

  React.useEffect(() => {
    setSelectedId(localStorage.getItem(STORAGE_KEY))
    setHydrated(true)
  }, [])

  const selectWorkspace = React.useCallback((id: string) => {
    localStorage.setItem(STORAGE_KEY, id)
    setSelectedId(id)
  }, [])

  const workspace = React.useMemo(() => {
    if (!hydrated || !workspaces || workspaces.length === 0) return undefined
    return workspaces.find((item) => item.id === selectedId) ?? workspaces[0]
  }, [hydrated, workspaces, selectedId])

  // Fall back to the first workspace (and persist that choice) whenever nothing
  // valid is stored yet — e.g. first load, or the stored id no longer exists.
  React.useEffect(() => {
    if (workspace && workspace.id !== selectedId) {
      localStorage.setItem(STORAGE_KEY, workspace.id)
      setSelectedId(workspace.id)
    }
  }, [workspace, selectedId])

  const value = React.useMemo(
    () => ({
      workspaces: workspaces ?? [],
      workspace,
      isLoading: isLoading || !hydrated,
      selectWorkspace,
    }),
    [workspaces, workspace, isLoading, hydrated, selectWorkspace],
  )

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useCurrentWorkspace() {
  const ctx = React.useContext(WorkspaceContext)
  if (!ctx) throw new Error("useCurrentWorkspace must be used within a WorkspaceProvider")
  return ctx
}
