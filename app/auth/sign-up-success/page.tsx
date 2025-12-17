import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Mail } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white p-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">HealthMonitor</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Mail className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl">Check Your Email</CardTitle>
            <CardDescription className="text-center">
              We've sent you a confirmation link to verify your account
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6 text-sm leading-relaxed text-gray-600">
              Please check your email and click the confirmation link to activate your account. Once confirmed, you can
              sign in and start monitoring your health.
            </p>
            <Link href="/auth/login">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
