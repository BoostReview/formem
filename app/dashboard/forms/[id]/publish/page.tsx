import { notFound, redirect } from "next/navigation"
import { getForm } from "@/app/actions/forms"
import { validateFormForPublish } from "@/app/actions/publish"
import { PublishPageClient } from "./PublishPageClient"

interface PublishPageProps {
  params: Promise<{ id: string }>
}

export default async function PublishFormPage({ params }: PublishPageProps) {
  const { id } = await params

  const formResult = await getForm(id)

  if (!formResult.success || !formResult.form) {
    notFound()
  }

  const form = formResult.form
  const validation = await validateFormForPublish(id)

  return (
    <PublishPageClient
      form={form}
      initialValidation={validation}
    />
  )
}
