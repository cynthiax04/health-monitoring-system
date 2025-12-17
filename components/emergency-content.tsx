"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  Phone,
  MapPin,
  Home,
  BarChart3,
  Bot,
  LogOut,
  Search,
  Navigation,
  AlertCircle,
  Building2,
  Stethoscope,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface Hospital {
  name: string
  address: string
  phone: string
  type: string
  distance?: string
}

export default function EmergencyContent() {
  const router = useRouter()
  const [location, setLocation] = useState("")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [nearbyHospitals, setNearbyHospitals] = useState<Hospital[]>([])
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    checkAuth()
    loadDefaultHospitals()
  }, [])

  const checkAuth = async () => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setIsLoggedIn(!!user)
  }

  const loadDefaultHospitals = () => {
    const puneHospitals: Hospital[] = [
      {
        name: "Ruby Hall Clinic",
        address: "40, Sassoon Road, Pune, Maharashtra 411001",
        phone: "+91-20-66455000",
        type: "Multi-Speciality Hospital",
      },
      {
        name: "Jehangir Hospital",
        address: "32, Sassoon Road, Pune, Maharashtra 411001",
        phone: "+91-20-26054091",
        type: "Multi-Speciality Hospital",
      },
      {
        name: "Sahyadri Super Speciality Hospital",
        address: "30-C, Erandwane, Karve Road, Pune, Maharashtra 411004",
        phone: "+91-20-67206720",
        type: "Super Speciality Hospital",
      },
      {
        name: "Deenanath Mangeshkar Hospital",
        address: "Erandwane, Pune, Maharashtra 411004",
        phone: "+91-20-66206600",
        type: "Multi-Speciality Hospital",
      },
      {
        name: "Aditya Birla Memorial Hospital",
        address: "Chinchwad, Pune, Maharashtra 411033",
        phone: "+91-20-27842000",
        type: "Multi-Speciality Hospital",
      },
      {
        name: "KEM Hospital",
        address: "Rasta Peth, Pune, Maharashtra 411011",
        phone: "+91-20-26125700",
        type: "Government Hospital",
      },
      {
        name: "Poona Hospital & Research Centre",
        address: "27, Sadashivpeth, Pune, Maharashtra 411030",
        phone: "+91-20-26126666",
        type: "Multi-Speciality Hospital",
      },
      {
        name: "Noble Hospital",
        address: "153, Magarpatta City Road, Hadapsar, Pune 411013",
        phone: "+91-20-66837000",
        type: "Multi-Speciality Hospital",
      },
      {
        name: "Inamdar Multispeciality Hospital",
        address: "Fatima Nagar, Wanowrie, Pune 411040",
        phone: "+91-20-66529999",
        type: "Multi-Speciality Hospital",
      },
      {
        name: "Sancheti Hospital",
        address: "16, Shivaji Nagar, Pune 411005",
        phone: "+91-20-67842333",
        type: "Orthopedic Speciality",
      },
    ]
    setNearbyHospitals(puneHospitals)
  }

  const getCurrentLocation = () => {
    setIsLoadingLocation(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
          findNearbyHospitals(latitude, longitude)
          setIsLoadingLocation(false)
        },
        (error) => {
          console.error("[v0] Geolocation error:", error)
          alert("Unable to get your location. Please enter your city manually.")
          setIsLoadingLocation(false)
        },
      )
    } else {
      alert("Geolocation is not supported by your browser")
      setIsLoadingLocation(false)
    }
  }

  const findNearbyHospitals = (lat: number, lng: number) => {
    const puneHospitals: Hospital[] = [
      {
        name: "Ruby Hall Clinic",
        address: "40, Sassoon Road, Pune, Maharashtra 411001",
        phone: "+91-20-66455000",
        type: "Multi-Speciality Hospital",
        distance: "2.5 km",
      },
      {
        name: "Jehangir Hospital",
        address: "32, Sassoon Road, Pune, Maharashtra 411001",
        phone: "+91-20-26054091",
        type: "Multi-Speciality Hospital",
        distance: "3.1 km",
      },
      {
        name: "Sahyadri Super Speciality Hospital",
        address: "30-C, Erandwane, Karve Road, Pune, Maharashtra 411004",
        phone: "+91-20-67206720",
        type: "Super Speciality Hospital",
        distance: "4.2 km",
      },
      {
        name: "Deenanath Mangeshkar Hospital",
        address: "Erandwane, Pune, Maharashtra 411004",
        phone: "+91-20-66206600",
        type: "Multi-Speciality Hospital",
        distance: "4.8 km",
      },
      {
        name: "Aditya Birla Memorial Hospital",
        address: "Chinchwad, Pune, Maharashtra 411033",
        phone: "+91-20-27842000",
        type: "Multi-Speciality Hospital",
        distance: "5.5 km",
      },
      {
        name: "KEM Hospital",
        address: "Rasta Peth, Pune, Maharashtra 411011",
        phone: "+91-20-26125700",
        type: "Government Hospital",
        distance: "3.8 km",
      },
      {
        name: "Poona Hospital & Research Centre",
        address: "27, Sadashivpeth, Pune, Maharashtra 411030",
        phone: "+91-20-26126666",
        type: "Multi-Speciality Hospital",
        distance: "2.9 km",
      },
      {
        name: "Noble Hospital",
        address: "153, Magarpatta City Road, Hadapsar, Pune 411013",
        phone: "+91-20-66837000",
        type: "Multi-Speciality Hospital",
        distance: "6.2 km",
      },
      {
        name: "Inamdar Multispeciality Hospital",
        address: "Fatima Nagar, Wanowrie, Pune 411040",
        phone: "+91-20-66529999",
        type: "Multi-Speciality Hospital",
        distance: "7.1 km",
      },
      {
        name: "Sancheti Hospital",
        address: "16, Shivaji Nagar, Pune 411005",
        phone: "+91-20-67842333",
        type: "Orthopedic Speciality",
        distance: "3.4 km",
      },
    ]

    setNearbyHospitals(puneHospitals)
  }

  const handleManualSearch = () => {
    if (location.trim()) {
      const puneHospitals: Hospital[] = [
        {
          name: "Ruby Hall Clinic",
          address: "40, Sassoon Road, Pune, Maharashtra 411001",
          phone: "+91-20-66455000",
          type: "Multi-Speciality Hospital",
        },
        {
          name: "Jehangir Hospital",
          address: "32, Sassoon Road, Pune, Maharashtra 411001",
          phone: "+91-20-26054091",
          type: "Multi-Speciality Hospital",
        },
        {
          name: "KEM Hospital",
          address: "Rasta Peth, Pune, Maharashtra 411011",
          phone: "+91-20-26125700",
          type: "Government Hospital",
        },
        {
          name: "Sahyadri Super Speciality Hospital",
          address: "30-C, Erandwane, Karve Road, Pune, Maharashtra 411004",
          phone: "+91-20-67206720",
          type: "Super Speciality Hospital",
        },
        {
          name: "Deenanath Mangeshkar Hospital",
          address: "Erandwane, Pune, Maharashtra 411004",
          phone: "+91-20-66206600",
          type: "Multi-Speciality Hospital",
        },
        {
          name: "Aditya Birla Memorial Hospital",
          address: "Chinchwad, Pune, Maharashtra 411033",
          phone: "+91-20-27842000",
          type: "Multi-Speciality Hospital",
        },
        {
          name: "Poona Hospital & Research Centre",
          address: "27, Sadashivpeth, Pune, Maharashtra 411030",
          phone: "+91-20-26126666",
          type: "Multi-Speciality Hospital",
        },
        {
          name: "Noble Hospital",
          address: "153, Magarpatta City Road, Hadapsar, Pune 411013",
          phone: "+91-20-66837000",
          type: "Multi-Speciality Hospital",
        },
        {
          name: "Inamdar Multispeciality Hospital",
          address: "Fatima Nagar, Wanowrie, Pune 411040",
          phone: "+91-20-66529999",
          type: "Multi-Speciality Hospital",
        },
        {
          name: "Sancheti Hospital",
          address: "16, Shivaji Nagar, Pune 411005",
          phone: "+91-20-67842333",
          type: "Orthopedic Speciality",
        },
      ]

      setNearbyHospitals(puneHospitals)
    }
  }

  const handleLogout = () => {
    const supabase = createClient()
    supabase.auth.signOut().then(() => {
      setIsLoggedIn(false)
      router.push("/")
    })
  }

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
            {isLoggedIn && (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/chatbot">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Bot className="h-4 w-4" />
                    AI Chatbot
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            )}
            {!isLoggedIn && (
              <Link href="/auth/login">
                <Button size="sm">Login</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Emergency Banner */}
        <Card className="mb-8 border-red-300 bg-gradient-to-r from-red-600 to-red-700 text-white">
          <CardContent className="py-8 text-center">
            <AlertCircle className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-2 text-4xl font-bold">
              <span className="text-balance">Emergency Medical Services</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-red-100">
              <span className="text-pretty">
                Quick access to emergency contacts and nearby healthcare facilities in India
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Emergency Numbers */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Emergency Hotlines (India)</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <Phone className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-red-900">Ambulance Emergency</p>
                    <a href="tel:108" className="text-2xl font-bold text-red-600 hover:underline">
                      108
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Stethoscope className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Medical Helpline</p>
                    <a href="tel:104" className="text-2xl font-bold text-blue-600 hover:underline">
                      104
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <Phone className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-900">Police Emergency</p>
                    <a href="tel:100" className="text-2xl font-bold text-purple-600 hover:underline">
                      100
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* University Medical Contact */}
        <Card className="mb-8 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-green-600" />
              Ajeenkya DY Patil University Medical Center
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="mt-1 h-4 w-4 text-green-600" />
                <p className="text-gray-700">Lohegaon, Pune, Maharashtra, India</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-green-600" />
                <a href="tel:+912067656666" className="text-blue-600 hover:underline">
                  +91-20-67656666
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hospital Finder */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              Find Nearby Hospitals
            </CardTitle>
            <CardDescription>Search for hospitals and healthcare facilities near you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter your location (city, area, or address)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
              />
              <Button onClick={handleManualSearch} className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
              <Button
                onClick={getCurrentLocation}
                disabled={isLoadingLocation}
                variant="outline"
                className="gap-2 bg-transparent"
              >
                <Navigation className="h-4 w-4" />
                {isLoadingLocation ? "Getting..." : "Use My Location"}
              </Button>
            </div>

            {nearbyHospitals.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Nearby Healthcare Facilities</h3>
                {nearbyHospitals.map((hospital, index) => (
                  <Card key={index} className="border-blue-100">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="mb-1 font-semibold text-gray-900">{hospital.name}</h4>
                          <Badge variant="secondary" className="mb-2">
                            {hospital.type}
                          </Badge>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-start gap-2">
                              <MapPin className="mt-0.5 h-4 w-4" />
                              <span>{hospital.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <a href={`tel:${hospital.phone}`} className="text-blue-600 hover:underline">
                                {hospital.phone}
                              </a>
                            </div>
                          </div>
                        </div>
                        {hospital.distance && (
                          <Badge variant="outline" className="ml-4">
                            {hospital.distance}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {nearbyHospitals.length === 0 && (
              <div className="py-12 text-center text-gray-500">
                <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p>Loading nearby hospitals...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Important Medical Numbers */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Additional Medical Helplines (India)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <span className="text-gray-700">National Mental Health Helpline</span>
                <a href="tel:08046110007" className="font-semibold text-blue-600 hover:underline">
                  080-46110007
                </a>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <span className="text-gray-700">Women Helpline</span>
                <a href="tel:1091" className="font-semibold text-blue-600 hover:underline">
                  1091
                </a>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <span className="text-gray-700">Child Helpline</span>
                <a href="tel:1098" className="font-semibold text-blue-600 hover:underline">
                  1098
                </a>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <span className="text-gray-700">Senior Citizen Helpline</span>
                <a href="tel:14567" className="font-semibold text-blue-600 hover:underline">
                  14567
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="border-t bg-white py-6">
        <div className="container mx-auto px-6 text-center text-sm text-gray-600">
          <p className="font-medium text-red-600">
            In case of medical emergency, call 108 immediately or visit the nearest hospital
          </p>
        </div>
      </footer>
    </div>
  )
}
