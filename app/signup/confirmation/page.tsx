import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function SignUpConfirmation() {
  return (
    <div className="container flex items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl text-center">Check your email</CardTitle>
            <CardDescription className="text-center">
              We've sent you a confirmation link to verify your email address.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground">
              Please check your inbox and click the verification link to complete your registration. If you don't see
              the email, check your spam folder.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/login">
              <Button variant="outline">Go to login</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

