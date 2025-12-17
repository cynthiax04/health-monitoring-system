import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import ChatbotContent from "@/components/chatbot-content"

export default async function ChatbotPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  return <ChatbotContent user={user} />
}
