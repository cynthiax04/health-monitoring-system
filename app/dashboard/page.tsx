import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import DashboardContent from "@/components/dashboard-content"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch recent health metrics
  const { data: metrics } = await supabase
    .from("health_metrics")
    .select("*")
    .eq("user_id", user.id)
    .order("recorded_at", { ascending: false })
    .limit(10)

  // Fetch health alerts
  const { data: alerts } = await supabase
    .from("health_alerts")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return <DashboardContent user={user} profile={profile} initialMetrics={metrics || []} alerts={alerts || []} />
}
