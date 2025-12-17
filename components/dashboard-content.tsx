"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Heart,
  TrendingUp,
  AlertTriangle,
  Upload,
  Watch,
  BarChart3,
  LogOut,
  Home,
  Bot,
  Phone,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import CSVUploader from "@/components/csv-uploader"
import HealthMetricsChart from "@/components/health-metrics-chart"
import DeviceConnector from "@/components/device-connector"

interface DashboardContentProps {
  user: User
  profile: any
  initialMetrics: any[]
  alerts: any[]
}

export default function DashboardContent({ user, profile, initialMetrics, alerts }: DashboardContentProps) {
  const router = useRouter()
  const [metrics, setMetrics] = useState(initialMetrics)

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  const latestMetric = metrics[0]

  const hasVitalSigns =
    latestMetric &&
    (latestMetric.heart_rate ||
      latestMetric.blood_pressure_systolic ||
      latestMetric.oxygen_saturation ||
      latestMetric.temperature)

  const hasLifestyleData =
    latestMetric &&
    (latestMetric.age ||
      latestMetric.bmi ||
      latestMetric.sleep_duration ||
      latestMetric.physical_activity ||
      latestMetric.smoking ||
      latestMetric.chronic_diseases)

  return (
    <div className="min-h-screen bg-gray-50">
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
            <Link href="/chatbot">
              <Button variant="ghost" size="sm" className="gap-2">
                <Bot className="h-4 w-4" />
                AI Chatbot
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

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Welcome back, {profile?.full_name || user.email?.split("@")[0]}
          </h1>
          <p className="text-gray-600">Monitor your health metrics and stay informed about your wellbeing</p>
        </div>

        {/* Alerts Section */}
        {alerts && alerts.length > 0 && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-900">
                <AlertTriangle className="h-5 w-5" />
                Health Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 rounded-lg bg-white p-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-red-600" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{alert.message}</p>
                      <p className="text-sm text-gray-600">{new Date(alert.created_at).toLocaleString()}</p>
                    </div>
                    <Badge
                      variant={alert.severity === "critical" || alert.severity === "high" ? "destructive" : "secondary"}
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        {latestMetric && (
          <div className="mb-8 grid gap-6 md:grid-cols-4">
            {/* Always show risk score if available */}
            {latestMetric.risk_score !== undefined && (
              <Card className="md:col-span-1">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Risk Score</p>
                      <p className="text-2xl font-bold text-gray-900">{latestMetric.risk_score?.toFixed(1)}</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-purple-500" />
                  </div>
                  {latestMetric.risk_level && (
                    <Badge
                      variant={
                        latestMetric.risk_level === "critical"
                          ? "destructive"
                          : latestMetric.risk_level === "high"
                            ? "destructive"
                            : latestMetric.risk_level === "medium"
                              ? "secondary"
                              : "outline"
                      }
                      className="mt-2"
                    >
                      {latestMetric.risk_level}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Vital Signs Cards - only show if data exists */}
            {hasVitalSigns && (
              <>
                {latestMetric.heart_rate && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Heart Rate</p>
                          <p className="text-2xl font-bold text-gray-900">{latestMetric.heart_rate} bpm</p>
                        </div>
                        <Heart className="h-8 w-8 text-red-500" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {(latestMetric.blood_pressure_systolic || latestMetric.blood_pressure_diastolic) && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Blood Pressure</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {latestMetric.blood_pressure_systolic || "?"}/{latestMetric.blood_pressure_diastolic || "?"}
                          </p>
                        </div>
                        <Activity className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {latestMetric.oxygen_saturation && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">O2 Saturation</p>
                          <p className="text-2xl font-bold text-gray-900">{latestMetric.oxygen_saturation}%</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* Lifestyle Stats - show if available */}
            {hasLifestyleData && (
              <>
                {latestMetric.bmi && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">BMI</p>
                          <p className="text-2xl font-bold text-gray-900">{latestMetric.bmi}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {latestMetric.bmi < 18.5
                              ? "Underweight"
                              : latestMetric.bmi < 25
                                ? "Normal"
                                : latestMetric.bmi < 30
                                  ? "Overweight"
                                  : "Obese"}
                          </p>
                        </div>
                        <Activity className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {latestMetric.sleep_duration && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Sleep Duration</p>
                          <p className="text-lg font-bold text-gray-900">{latestMetric.sleep_duration}</p>
                        </div>
                        <Activity className="h-8 w-8 text-indigo-500" />
                      </div>
                    </CardContent>
                  </Card>
                )}

                {latestMetric.physical_activity && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Activity Level</p>
                          <p className="text-lg font-bold text-gray-900">{latestMetric.physical_activity}/5</p>
                        </div>
                        <Activity className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        )}

        {!latestMetric && (
          <Card className="mb-8">
            <CardContent className="py-12 text-center">
              <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No Health Data Yet</h3>
              <p className="mb-4 text-gray-600">
                Upload your CSV file with vital signs or lifestyle data to start monitoring your health
              </p>
              <p className="text-sm text-gray-500">Go to the "Upload Data" tab to get started</p>
            </CardContent>
          </Card>
        )}

        {latestMetric?.risk_factors && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-900">
                <AlertTriangle className="h-5 w-5" />
                Identified Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {latestMetric.risk_factors.split("; ").map((factor: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-sm text-orange-800">
                    <span className="mt-1">•</span>
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Health Metrics Trends</CardTitle>
                <CardDescription>Your health data over time</CardDescription>
              </CardHeader>
              <CardContent>
                {metrics && metrics.length > 0 ? (
                  <HealthMetricsChart metrics={metrics} />
                ) : (
                  <div className="py-12 text-center text-gray-500">
                    No data to display. Upload your health data to see trends.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Health Data
                </CardTitle>
                <CardDescription>
                  Upload a CSV file with your health data to analyze risk scores and predict potential health issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CSVUploader
                  onDataUploaded={(newMetrics) => {
                    // Convert the health metrics to the format expected by the dashboard
                    const formattedMetrics = newMetrics.map((m) => ({
                      ...m,
                      created_at: new Date().toISOString(),
                      user_id: user.id,
                    }))
                    setMetrics([...formattedMetrics, ...metrics])
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Watch className="h-5 w-5" />
                  Connected Devices
                </CardTitle>
                <CardDescription>Manage your smartwatch and wearable device connections</CardDescription>
              </CardHeader>
              <CardContent>
                <DeviceConnector userId={user.id} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
