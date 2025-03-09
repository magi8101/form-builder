import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import FormSubmission from "@/components/form-submission"

export default async function FormPage({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  // Fetch form details
  const { data: form, error } = await supabase
    .from("forms")
    .select("*")
    .eq("id", params.id)
    .eq("published", true)
    .single()

  if (error || !form) {
    notFound()
  }

  return <FormSubmission form={form} />
}

