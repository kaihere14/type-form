import { trpc } from "~/trpc/client"

export function useFolders(workspaceId: string | undefined) {
  const utils = trpc.useUtils()

  const { data, isLoading } = trpc.folder.list.useQuery(
    { workspaceId: workspaceId as string },
    { enabled: !!workspaceId },
  )

  const createFolder = trpc.folder.create.useMutation({
    onSuccess: () => utils.folder.list.invalidate(),
  })

  const deleteFolder = trpc.folder.delete.useMutation({
    onSuccess: () => utils.folder.list.invalidate(),
  })

  return { folders: data ?? [], isLoading, createFolder, deleteFolder }
}
