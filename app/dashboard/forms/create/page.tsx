"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Trash2, GripVertical, Plus, Save, Eye, ArrowLeft, Loader2 } from "lucide-react"

// Define question types
const questionTypes = [
  { id: "short_text", label: "Short Text" },
  { id: "long_text", label: "Long Text" },
  { id: "multiple_choice", label: "Multiple Choice" },
  { id: "checkbox", label: "Checkbox" },
  { id: "dropdown", label: "Dropdown" },
  { id: "date", label: "Date" },
  { id: "number", label: "Number" },
  { id: "email", label: "Email" },
]

// Define question interface
interface Question {
  id: string
  type: string
  title: string
  required: boolean
  options?: string[]
  placeholder?: string
}

export default function CreateForm() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [activeTab, setActiveTab] = useState("edit")
  const [title, setTitle] = useState("Untitled Form")
  const [description, setDescription] = useState("")
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "q1",
      type: "short_text",
      title: "What is your name?",
      required: true,
      placeholder: "Enter your name",
    },
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q${Date.now()}`,
      type: "short_text",
      title: "New Question",
      required: false,
      placeholder: "Enter your answer",
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)))
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const addOption = (questionId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId) {
          const options = q.options || []
          return { ...q, options: [...options, `Option ${options.length + 1}`] }
        }
        return q
      }),
    )
  }

  const updateOption = (questionId: string, index: number, value: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId && q.options) {
          const newOptions = [...q.options]
          newOptions[index] = value
          return { ...q, options: newOptions }
        }
        return q
      }),
    )
  }

  const removeOption = (questionId: string, index: number) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === questionId && q.options) {
          const newOptions = [...q.options]
          newOptions.splice(index, 1)
          return { ...q, options: newOptions }
        }
        return q
      }),
    )
  }

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(questions)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setQuestions(items)
  }

  const saveForm = async (publish = false) => {
    setLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("You must be logged in to create a form")
      }

      const formData = {
        title,
        description,
        questions,
        user_id: user.id,
        published: publish,
      }

      const { data, error } = await supabase.from("forms").insert([formData]).select()

      if (error) throw error

      if (data && data[0]) {
        router.push(`/dashboard/forms/${data[0].id}`)
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while saving the form")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Create Form</h1>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => saveForm(false)} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Save Draft
            </Button>
            <Button onClick={() => saveForm(true)} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              Publish
            </Button>
          </div>
        </div>

        <TabsContent value="edit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Form Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter form title"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter form description"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="questions">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {questions.map((question, index) => (
                    <Draggable key={question.id} draggableId={question.id} index={index}>
                      {(provided) => (
                        <Card ref={provided.innerRef} {...provided.draggableProps} className="relative">
                          <div
                            {...provided.dragHandleProps}
                            className="absolute left-4 top-4 cursor-move text-muted-foreground"
                          >
                            <GripVertical className="h-5 w-5" />
                          </div>
                          <CardHeader className="pl-12">
                            <div className="flex justify-between items-center">
                              <Input
                                value={question.title}
                                onChange={(e) => updateQuestion(question.id, "title", e.target.value)}
                                className="text-lg font-medium border-none p-0 focus-visible:ring-0"
                                placeholder="Question title"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeQuestion(question.id)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="flex gap-4">
                              <div className="w-1/2">
                                <Label htmlFor={`type-${question.id}`}>Question Type</Label>
                                <Select
                                  value={question.type}
                                  onValueChange={(value) => updateQuestion(question.id, "type", value)}
                                >
                                  <SelectTrigger id={`type-${question.id}`}>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {questionTypes.map((type) => (
                                      <SelectItem key={type.id} value={type.id}>
                                        {type.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-end gap-2">
                                <Label className="flex items-center gap-2 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={question.required}
                                    onChange={(e) => updateQuestion(question.id, "required", e.target.checked)}
                                    className="rounded border-gray-300"
                                  />
                                  Required
                                </Label>
                              </div>
                            </div>

                            {(question.type === "short_text" ||
                              question.type === "long_text" ||
                              question.type === "number" ||
                              question.type === "email") && (
                              <div>
                                <Label htmlFor={`placeholder-${question.id}`}>Placeholder</Label>
                                <Input
                                  id={`placeholder-${question.id}`}
                                  value={question.placeholder || ""}
                                  onChange={(e) => updateQuestion(question.id, "placeholder", e.target.value)}
                                  placeholder="Enter placeholder text"
                                />
                              </div>
                            )}

                            {(question.type === "multiple_choice" ||
                              question.type === "checkbox" ||
                              question.type === "dropdown") && (
                              <div className="space-y-2">
                                <Label>Options</Label>
                                <div className="space-y-2">
                                  {(question.options || []).map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center gap-2">
                                      <Input
                                        value={option}
                                        onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                                        placeholder={`Option ${optionIndex + 1}`}
                                      />
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeOption(question.id, optionIndex)}
                                        className="text-muted-foreground hover:text-destructive"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addOption(question.id)}
                                    className="mt-2"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Option
                                  </Button>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Button onClick={addQuestion} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{title || "Untitled Form"}</CardTitle>
              {description && <p className="text-muted-foreground">{description}</p>}
            </CardHeader>
            <CardContent className="space-y-6">
              {questions.map((question, index) => (
                <div key={question.id} className="space-y-2">
                  <Label className="text-base">
                    {question.title || `Question ${index + 1}`}
                    {question.required && <span className="text-destructive ml-1">*</span>}
                  </Label>

                  {question.type === "short_text" && <Input placeholder={question.placeholder || ""} />}

                  {question.type === "long_text" && <Textarea placeholder={question.placeholder || ""} rows={3} />}

                  {question.type === "multiple_choice" && (
                    <div className="space-y-2">
                      {(question.options || []).map((option, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input type="radio" id={`${question.id}-option-${i}`} name={question.id} />
                          <Label htmlFor={`${question.id}-option-${i}`} className="cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === "checkbox" && (
                    <div className="space-y-2">
                      {(question.options || []).map((option, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input type="checkbox" id={`${question.id}-option-${i}`} />
                          <Label htmlFor={`${question.id}-option-${i}`} className="cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === "dropdown" && (
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {(question.options || []).map((option, i) => (
                          <SelectItem key={i} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {question.type === "date" && <Input type="date" />}

                  {question.type === "number" && <Input type="number" placeholder={question.placeholder || ""} />}

                  {question.type === "email" && <Input type="email" placeholder={question.placeholder || ""} />}
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button className="w-full">Submit</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}

