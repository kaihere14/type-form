import { trpc } from "~/trpc/client"

export function useForm(formId: string | undefined) {
  const { data, isLoading, isFetching } = trpc.form.getById.useQuery(
    { id: formId as string },
    { enabled: !!formId, staleTime: 0, refetchOnMount: "always" },
  )
  const updateForm = trpc.form.update.useMutation()

  return { form: data, isLoading, isFetching, updateForm }
}
