"use client"

import { useParams } from "next/navigation"

import { FormsTable } from "~/components/dashboard/forms-table"
import { useCurrentWorkspace } from "~/providers/workspace"
import { useFolders } from "~/hooks/dashboard/use-folders"

export default function FolderFormsPage() {
  const { folderId } = useParams<{ folderId: string }>()
  const { workspace } = useCurrentWorkspace()
  const { folders } = useFolders(workspace?.id)

  const folder = folders.find((item) => item.id === folderId)

  return <FormsTable folderId={folderId} heading={folder?.name ?? "Folder"} />
}
