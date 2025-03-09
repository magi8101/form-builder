import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Link from "next/link"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Edit, Share, BarChart } from "lucide-react"
import FormResponses from "@/components/form-responses"
import FormShare from "@/components/form-share"

export default async function FormDetails({ params }: { params: { id: string } }) {
  const supabase = createServerComponentClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch form details
  const { data: form, error } = await supabase
    .from("forms")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", session.user.id)
    .single()

  if (error || !form) {
    redirect("/dashboard")
  }

  // Fetch form responses count
  const { count } = await supabase
    .from("responses")
    .select("*", { count: "exact", head: true })
    .eq("form_id", params.id)

  return (
    <DashboardLayout>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{form.title}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {form.published ? (
                <span className="text-green-500">Published</span>
              ) : (
                <span className="text-yellow-500">Draft</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{count || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Date(form.created_at).toLocaleDateString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(form.updated_at || form.created_at).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4 mb-6">
        <Button asChild>
          <Link href={`/dashboard/forms/${params.id}/edit`}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Form
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href={`/form/${params.id}`} target="_blank">
            <Share className="h-4 w-4 mr-2" />
            View Form
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="responses" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="responses">
            <BarChart className="h-4 w-4 mr-2" />
            Responses
          </TabsTrigger>
          <TabsTrigger value="share">
            <Share className="h-4 w-4 mr-2" />
            Share
          </TabsTrigger>
        </TabsList>

        <TabsContent value="responses">
          <FormResponses formId={params.id} />
        </TabsContent>

        <TabsContent value="share">
          <FormShare formId={params.id} formTitle={form.title} />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

