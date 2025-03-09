import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Fetch user's forms
  const { data: forms, error } = await supabase
    .from("forms")
    .select("*")
    .eq("user_id", session.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching forms:", error)
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Your Forms</h1>
        <Link href="/dashboard/forms/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Form
          </Button>
        </Link>
      </div>

      {forms && forms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <Link href={`/dashboard/forms/${form.id}`} key={form.id}>
              <Card className="h-full cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="truncate">{form.title}</CardTitle>
                  <CardDescription>{new Date(form.created_at).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{form.description || "No description"}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="text-sm text-muted-foreground">{form.responses_count || 0} responses</div>
                  <div className="text-sm font-medium">{form.published ? "Published" : "Draft"}</div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle>No forms yet</CardTitle>
            <CardDescription>Create your first form to start collecting responses</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center py-6">
            <Link href="/dashboard/forms/create">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create your first form
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}

