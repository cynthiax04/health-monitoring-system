import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Bot, Heart, Phone, Shield, TrendingUp, LogOut, User } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
    profile = data
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">HealthMonitor</span>
          </div>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <User className="h-4 w-4" />
                  <span>{profile?.full_name || user.email}</span>
                </div>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <form action="/auth/logout" method="post">
                  <Button variant="ghost" type="submit">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        {/* Hero Content */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900">
            <span className="text-balance">Your Personal Health Guardian</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-gray-600">
            <span className="text-pretty">
              Monitor your health in real-time, get AI-powered health insights, and access emergency services instantly.
              Your complete IoT health monitoring solution.
            </span>
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/auth/sign-up">
              <Button size="lg" className="gap-2">
                <Heart className="h-5 w-5" />
                Start Monitoring
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
          <div className="mx-auto mt-12 max-w-4xl">
            <img
              src="/health-monitoring-dashboard-with-heart-rate-graphs.jpg"
              alt="Health Monitoring Dashboard"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>

        {/* Feature Cards */}
        <div id="features" className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle>Smart Wearable Integration</CardTitle>
              <CardDescription>
                Connect your smartwatch and fitness trackers to monitor vital signs in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <img
                  src="/smartwatch-showing-heart-rate-monitoring-and-healt.jpg"
                  alt="Smart Wearable"
                  className="rounded-md"
                />
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  Heart rate monitoring
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  Blood pressure tracking
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  Sleep pattern analysis
                </li>
              </ul>
              <Link href="/dashboard">
                <Button className="mt-4 w-full bg-transparent" variant="outline">
                  View Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                <Bot className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle>AI Health Assistant</CardTitle>
              <CardDescription>
                Chat with our AI to analyze symptoms and get personalized health recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <img
                  src="/ai-health-chatbot-interface-with-medical-conversat.jpg"
                  alt="AI Health Assistant"
                  className="rounded-md"
                />
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-600" />
                  Symptom analysis
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-600" />
                  Disease prediction
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-purple-600" />
                  Health guidance
                </li>
              </ul>
              <Link href="/chatbot">
                <Button className="mt-4 w-full bg-transparent" variant="outline">
                  Chat Now
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-gradient-to-br from-red-50 to-white transition-all hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                <Phone className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Emergency Contacts</CardTitle>
              <CardDescription>
                Quick access to emergency services and nearby healthcare providers in India
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-600" />
                  108 Ambulance Service
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-600" />
                  Nearby hospitals
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-red-600" />
                  Doctor contacts
                </li>
              </ul>
              <Link href="/emergency">
                <Button className="mt-4 w-full bg-transparent" variant="outline">
                  Emergency Info
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mb-16 grid gap-6 md:grid-cols-3">
          <Card className="border-t-4 border-t-blue-600">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="mx-auto mb-2 h-8 w-8 text-blue-600" />
              <div className="mb-1 text-3xl font-bold text-gray-900">Real-Time</div>
              <p className="text-sm text-gray-600">Health Monitoring</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-purple-600">
            <CardContent className="pt-6 text-center">
              <Bot className="mx-auto mb-2 h-8 w-8 text-purple-600" />
              <div className="mb-1 text-3xl font-bold text-gray-900">AI-Powered</div>
              <p className="text-sm text-gray-600">Health Analysis</p>
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-red-600">
            <CardContent className="pt-6 text-center">
              <Phone className="mx-auto mb-2 h-8 w-8 text-red-600" />
              <div className="mb-1 text-3xl font-bold text-gray-900">24/7</div>
              <p className="text-sm text-gray-600">Emergency Access</p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="border-blue-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardContent className="py-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              <span className="text-balance">Ready to Take Control of Your Health?</span>
            </h2>
            <p className="mx-auto mb-6 max-w-xl text-lg leading-relaxed text-blue-100">
              <span className="text-pretty">
                Join thousands of users monitoring their health with our advanced IoT platform
              </span>
            </p>
            <Link href="/auth/sign-up">
              <Button size="lg" variant="secondary" className="gap-2">
                <Heart className="h-5 w-5" />
                Sign Up Free
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-6 text-center text-sm text-gray-600">
          <p>HealthMonitor - Your Personal Health Guardian</p>
          <p className="mt-2">Emergency Contact: 108 (India) | Medical Helpline: 104</p>
        </div>
      </footer>
    </div>
  )
}
