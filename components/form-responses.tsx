"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Loader2 } from "lucide-react"

interface FormResponsesProps {
  formId: string
}

export default function FormResponses({ formId }: FormResponsesProps) {
  const supabase = createClientComponentClient()
  const [responses, setResponses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // Fetch form details to get questions
      const { data: formData } = await supabase.from("forms").select("*").eq("id", formId).single()

      if (formData) {
        setForm(formData)
      }

      // Fetch responses
      const { data, error } = await supabase
        .from("responses")
        .select("*")
        .eq("form_id", formId)
        .order("created_at", { ascending: false })

      if (data) {
        setResponses(data)
      }

      setLoading(false)
    }

    fetchData()
  }, [formId, supabase])

  const downloadResponses = () => {
    if (!responses.length || !form) return

    // Create CSV content
    const questions = form.questions.map((q: any) => q.title)
    const headers = ["Submission Date", ...questions]

    const csvContent = [
      headers.join(","),
      ...responses.map((response) => {
        const date = new Date(response.created_at).toLocaleDateString()
        const answers = form.questions.map((q: any, index: number) => {
          const answer = response.answers[index] || ""
          // Escape commas and quotes in the answer
          return typeof answer === "string" ? `"${answer.replace(/"/g, '""')}"` : answer
        })

        return [date, ...answers].join(",")
      }),
    ].join("\n")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `${form.title}_responses.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!responses.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No responses yet</CardTitle>
          <CardDescription>Share your form to start collecting responses</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {responses.length} {responses.length === 1 ? "Response" : "Responses"}
        </h2>
        <Button onClick={downloadResponses} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download CSV
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  {form?.questions.map((question: any, index: number) => (
                    <TableHead key={index}>{question.title}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {responses.map((response, responseIndex) => (
                  <TableRow key={responseIndex}>
                    <TableCell>{new Date(response.created_at).toLocaleDateString()}</TableCell>
                    {form?.questions.map((question: any, questionIndex: number) => (
                      <TableCell key={questionIndex}>{response.answers[questionIndex] || "-"}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

