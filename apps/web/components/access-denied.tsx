'use client'

import { AlertCircle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

interface AccessDeniedProps {
  type: "access-denied" | "not-found"
  projectName?: string
}

export function AccessDeniedComponent({ type, projectName }: AccessDeniedProps) {
  const isAccessDenied = type === "access-denied"

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <Alert className="max-w-md w-full mb-6">
        {isAccessDenied ? (
          <Lock className="h-4 w-4" />
        ) : (
          <AlertCircle className="h-4 w-4" />
        )}
        <AlertTitle>
          {isAccessDenied ? "Access Denied" : "Project Not Found"}
        </AlertTitle>
        <AlertDescription>
          {isAccessDenied
            ? `You don't have permission to access ${
                projectName ? `the project "${projectName}"` : "this project"
              }.`
            : `The project ${
                projectName ? `"${projectName}"` : "you're looking for"
              } does not exist or has been deleted.`}
        </AlertDescription>
      </Alert>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild>
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/contact-support">Contact Support</Link>
        </Button>
      </div>
    </div>
  )
}