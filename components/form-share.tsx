"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, Mail } from "lucide-react"

interface FormShareProps {
  formId: string
  formTitle: string
}

export default function FormShare({ formId, formTitle }: FormShareProps) {
  const [copied, setCopied] = useState(false)
  const [email, setEmail] = useState("")
  const [emailSent, setEmailSent] = useState(false)

  const formUrl = `${window.location.origin}/form/${formId}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send an email with the form link
    // For this demo, we'll just simulate it
    setEmailSent(true)
    setTimeout(() => {
      setEmailSent(false)
      setEmail("")
    }, 2000)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Share Link</CardTitle>
          <CardDescription>Copy and share this link with others to collect responses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input value={formUrl} readOnly onClick={(e) => e.currentTarget.select()} />
            <Button variant="outline" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Form</CardTitle>
          <CardDescription>Send the form link directly to someone's email</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={sendEmail} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                />
                <Button type="submit" variant="outline">
                  {emailSent ? <Check className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            {emailSent && <p className="text-sm text-green-500">Email sent successfully!</p>}
          </form>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Embed Form</CardTitle>
          <CardDescription>Embed this form on your website</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="embed-code">Embed Code</Label>
              <div className="flex gap-2">
                <Input
                  id="embed-code"
                  value={`<iframe src="${formUrl}" width="100%" height="500" frameborder="0"></iframe>`}
                  readOnly
                  onClick={(e) => e.currentTarget.select()}
                />
                <Button variant="outline" onClick={copyToClipboard}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

