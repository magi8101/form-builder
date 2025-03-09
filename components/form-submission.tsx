"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle } from "lucide-react"

interface FormSubmissionProps {
  form: any
}

export default function FormSubmission({ form }: FormSubmissionProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [answers, setAnswers] = useState<any[]>(Array(form.questions.length).fill(""))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleAnswerChange = (index: number, value: any) => {
    const newAnswers = [...answers]
    newAnswers[index] = value
    setAnswers(newAnswers)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Validate required fields
    const missingRequired = form.questions.some((q: any, index: number) => q.required && !answers[index])

    if (missingRequired) {
      setError("Please fill in all required fields")
      setLoading(false)
      return
    }

    try {
      const { error: submitError } = await supabase.from("responses").insert({
        form_id: form.id,
        answers,
      })

      if (submitError) throw submitError

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || "An error occurred while submitting the form")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="container max-w-3xl mx-auto py-12">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl text-center">Form Submitted</CardTitle>
            <CardDescription className="text-center">Thank you for your response!</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground">Your response has been recorded successfully.</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => window.location.reload()}>Submit Another Response</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{form.title}</CardTitle>
          {form.description && <CardDescription>{form.description}</CardDescription>}
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-8">
            {form.questions.map((question: any, index: number) => (
              <div key={index} className="space-y-2">
                <Label className="text-base">
                  {question.title}
                  {question.required && <span className="text-destructive ml-1">*</span>}
                </Label>

                {question.type === "short_text" && (
                  <Input
                    value={answers[index] || ""}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder={question.placeholder || ""}
                    required={question.required}
                  />
                )}

                {question.type === "long_text" && (
                  <Textarea
                    value={answers[index] || ""}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder={question.placeholder || ""}
                    rows={3}
                    required={question.required}
                  />
                )}

                {question.type === "multiple_choice" && (
                  <div className="space-y-2">
                    {(question.options || []).map((option: string, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="radio"
                          id={`${question.id}-option-${i}`}
                          name={`question-${index}`}
                          value={option}
                          checked={answers[index] === option}
                          onChange={() => handleAnswerChange(index, option)}
                          required={question.required && !answers[index]}
                        />
                        <Label htmlFor={`${question.id}-option-${i}`} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}

                {question.type === "checkbox" && (
                  <div className="space-y-2">
                    {(question.options || []).map((option: string, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`${question.id}-option-${i}`}
                          value={option}
                          checked={(answers[index] || []).includes(option)}
                          onChange={(e) => {
                            const currentAnswers = answers[index] || []
                            if (e.target.checked) {
                              handleAnswerChange(index, [...currentAnswers, option])
                            } else {
                              handleAnswerChange(
                                index,
                                currentAnswers.filter((a: string) => a !== option),
                              )
                            }
                          }}
                        />
                        <Label htmlFor={`${question.id}-option-${i}`} className="cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}

                {question.type === "dropdown" && (
                  <Select
                    value={answers[index] || ""}
                    onValueChange={(value) => handleAnswerChange(index, value)}
                    required={question.required}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      {(question.options || []).map((option: string, i: number) => (
                        <SelectItem key={i} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {question.type === "date" && (
                  <Input
                    type="date"
                    value={answers[index] || ""}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    required={question.required}
                  />
                )}

                {question.type === "number" && (
                  <Input
                    type="number"
                    value={answers[index] || ""}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder={question.placeholder || ""}
                    required={question.required}
                  />
                )}

                {question.type === "email" && (
                  <Input
                    type="email"
                    value={answers[index] || ""}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    placeholder={question.placeholder || ""}
                    required={question.required}
                  />
                )}
              </div>
            ))}
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

