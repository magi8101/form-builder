import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="text-2xl font-bold">FormBuilder</div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-24 md:py-32">
          <div className="container flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Create and share forms <br className="hidden md:inline" />
              with ease
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-[600px]">
              Build custom forms, collect responses, and analyze data all in one place. No coding required.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/examples">
                <Button size="lg" variant="outline">
                  View Examples
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Create Your Form</h3>
                <p className="text-muted-foreground">
                  Design custom forms with our easy-to-use form builder. Add questions, customize fields, and set
                  validation rules.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Share With Anyone</h3>
                <p className="text-muted-foreground">
                  Share your form via a unique link. Collect responses from anyone, anywhere, on any device.
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm">
                <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Analyze Responses</h3>
                <p className="text-muted-foreground">
                  View and analyze responses in real-time. Export data for further analysis or integration.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">© 2025 FormBuilder. All rights reserved.</div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

