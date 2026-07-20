import { trpc } from "~/trpc/client"

type FormStatus = "draft" | "live" | "closed"

export function useForms(params: {
  workspaceId: string | undefined
  folderId?: string
  status?: FormStatus
}) {
  const utils = trpc.useUtils()
  const { workspaceId, folderId, status } = params

  const { data, isLoading } = trpc.form.list.useQuery(
    { workspaceId: workspaceId as string, folderId, status },
    { enabled: !!workspaceId },
  )

  const invalidate = () => {
    utils.form.list.invalidate()
    utils.folder.list.invalidate()
  }

  const createForm = trpc.form.create.useMutation({ onSuccess: invalidate })
  const deleteForm = trpc.form.delete.useMutation({ onSuccess: invalidate })

  return { forms: data ?? [], isLoading, createForm, deleteForm }
}
