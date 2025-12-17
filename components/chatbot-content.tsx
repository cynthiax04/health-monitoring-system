"use client"
import { useRouter } from "next/navigation"
import type React from "react"
import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Activity, Bot, Send, Home, BarChart3, Phone, LogOut, Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface ChatbotContentProps {
  user: User
}

export default function ChatbotContent({ user }: ChatbotContentProps) {
  const router = useRouter()
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const quickSymptoms = [
    "I have a fever and headache",
    "Chest pain and shortness of breath",
    "Persistent cough for 2 weeks",
    "Severe abdominal pain",
    "Dizziness and nausea",
  ]

  const handleQuickSymptom = (symptom: string) => {
    setInputValue(symptom)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: inputValue,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const assistantMessage = await response.json()
      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "I apologize, but I'm having trouble processing your request. Please try again or contact emergency services if this is urgent. Call 108 for emergencies.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">HealthMonitor</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
            <Link href="/emergency">
              <Button variant="ghost" size="sm" className="gap-2">
                <Phone className="h-4 w-4" />
                Emergency
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-6 py-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-6">
            <h1 className="mb-2 flex items-center gap-2 text-3xl font-bold text-gray-900">
              <Bot className="h-8 w-8 text-purple-600" />
              AI Health Assistant
            </h1>
            <p className="text-gray-600">
              Describe your symptoms to get AI-powered health insights and recommendations
            </p>
          </div>

          {/* Alert */}
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="flex items-start gap-3 pt-6">
              <AlertCircle className="mt-0.5 h-5 w-5 text-amber-600" />
              <div>
                <p className="font-medium text-amber-900">Medical Disclaimer</p>
                <p className="text-sm text-amber-800">
                  This AI assistant provides general health information only. For medical emergencies, call 108
                  immediately. Always consult a qualified healthcare professional for proper diagnosis and treatment.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="flex h-[600px] flex-col">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-purple-600" />
                Symptom Analysis Chat
              </CardTitle>
              <CardDescription>Share your symptoms and health concerns with our AI assistant</CardDescription>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 space-y-4 overflow-y-auto p-6">
              {messages.length === 0 && (
                <div className="space-y-4">
                  <p className="text-center text-gray-600">
                    Start by describing your symptoms or select a quick option below:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {quickSymptoms.map((symptom, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-purple-50"
                        onClick={() => handleQuickSymptom(symptom)}
                      >
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="whitespace-pre-wrap leading-relaxed space-y-2">
                      {message.content.split("\n").map((line: string, i: number) => {
                        // Highlight emergency headers
                        if (line.includes("🚨 **URGENT")) {
                          return (
                            <div
                              key={i}
                              className="font-bold text-red-600 text-lg border-l-4 border-red-600 pl-3 py-2 bg-red-50 rounded"
                            >
                              {line}
                            </div>
                          )
                        }
                        // Highlight hospital section header
                        if (line.includes("RECOMMENDED HOSPITALS")) {
                          return (
                            <div key={i} className="font-bold text-blue-600 text-base mt-3 mb-2">
                              {line}
                            </div>
                          )
                        }
                        // Make phone numbers clickable
                        if (line.includes("☎️") || line.includes("🚨 Emergency:")) {
                          const phoneMatch = line.match(/(\+91-\d{2,3}-\d{8})/)
                          if (phoneMatch) {
                            const phone = phoneMatch[1]
                            const beforePhone = line.substring(0, line.indexOf(phone))
                            const afterPhone = line.substring(line.indexOf(phone) + phone.length)
                            return (
                              <div key={i}>
                                {beforePhone}
                                <a
                                  href={`tel:${phone.replace(/[^0-9+]/g, "")}`}
                                  className="text-blue-600 hover:text-blue-800 underline font-semibold"
                                >
                                  {phone}
                                </a>
                                {afterPhone}
                              </div>
                            )
                          }
                        }
                        return <div key={i}>{line}</div>
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-3 text-gray-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing symptoms...</span>
                  </div>
                </div>
              )}
            </CardContent>

            {/* Input */}
            <div className="border-t p-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Textarea
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Describe your symptoms in detail... (e.g., 'I have had a fever of 102°F for 3 days with body aches')"
                  className="min-h-[60px] flex-1 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e as any)
                    }
                  }}
                />
                <Button type="submit" disabled={!inputValue || !inputValue.trim() || isLoading} className="gap-2">
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </form>
              <p className="mt-2 text-xs text-gray-500">Press Enter to send, Shift+Enter for new line</p>
            </div>
          </Card>

          {/* Emergency Contact Card */}
          <Card className="mt-6 border-red-200 bg-red-50">
            <CardContent className="py-4">
              <p className="text-center text-sm font-medium text-red-900">
                Emergency? Call 108 (Ambulance) or 104 (Medical Helpline) immediately
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
