import { trpc } from "~/trpc/client"

export function useForm(formId: string | undefined) {
  const { data, isLoading } = trpc.form.getById.useQuery({ id: formId as string }, { enabled: !!formId })
  const updateForm = trpc.form.update.useMutation()

  return { form: data, isLoading, updateForm }
}
