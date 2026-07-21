import { trpc } from "~/trpc/client"

export function useResponses(formId: string | undefined) {
  const { data, isLoading } = trpc.response.listByForm.useQuery(
    { formId: formId as string },
    { enabled: !!formId },
  )

  return { responses: data ?? [], isLoading }
}
