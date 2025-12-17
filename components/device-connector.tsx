"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Watch, Plus, Trash2, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface DeviceConnectorProps {
  userId: string
}

export default function DeviceConnector({ userId }: DeviceConnectorProps) {
  const [devices, setDevices] = useState<any[]>([])
  const [showAddDevice, setShowAddDevice] = useState(false)
  const [deviceName, setDeviceName] = useState("")
  const [deviceType, setDeviceType] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchDevices()
  }, [])

  const fetchDevices = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("wearable_devices")
      .select("*")
      .eq("user_id", userId)
      .order("connected_at", { ascending: false })

    if (data) {
      setDevices(data)
    }
  }

  const handleAddDevice = async () => {
    if (!deviceName || !deviceType) return

    setIsLoading(true)
    const supabase = createClient()

    const { error } = await supabase.from("wearable_devices").insert({
      user_id: userId,
      device_name: deviceName,
      device_type: deviceType,
      last_sync: new Date().toISOString(),
    })

    if (!error) {
      await fetchDevices()
      setDeviceName("")
      setDeviceType("")
      setShowAddDevice(false)
    }

    setIsLoading(false)
  }

  const handleRemoveDevice = async (deviceId: string) => {
    const supabase = createClient()
    const { error } = await supabase.from("wearable_devices").delete().eq("id", deviceId)

    if (!error) {
      await fetchDevices()
    }
  }

  return (
    <div className="space-y-4">
      {devices.length === 0 && !showAddDevice && (
        <div className="py-12 text-center">
          <Watch className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <p className="mb-4 text-gray-600">No devices connected yet</p>
          <Button onClick={() => setShowAddDevice(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Connect Device
          </Button>
        </div>
      )}

      {devices.map((device) => (
        <Card key={device.id}>
          <CardContent className="flex items-center justify-between pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                <Watch className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{device.device_name}</p>
                <p className="text-sm text-gray-600">{device.device_type}</p>
                {device.last_sync && (
                  <p className="text-xs text-gray-500">Last synced: {new Date(device.last_sync).toLocaleString()}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={device.is_active ? "default" : "secondary"} className="gap-1">
                {device.is_active && <CheckCircle className="h-3 w-3" />}
                {device.is_active ? "Active" : "Inactive"}
              </Badge>
              <Button variant="ghost" size="sm" onClick={() => handleRemoveDevice(device.id)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {showAddDevice && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="space-y-4 pt-6">
            <div>
              <Label htmlFor="deviceName">Device Name</Label>
              <Input
                id="deviceName"
                placeholder="e.g., Apple Watch Series 9"
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="deviceType">Device Type</Label>
              <Input
                id="deviceType"
                placeholder="e.g., Smartwatch, Fitness Tracker"
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddDevice} disabled={isLoading} className="gap-2">
                <Plus className="h-4 w-4" />
                {isLoading ? "Connecting..." : "Connect Device"}
              </Button>
              <Button variant="outline" onClick={() => setShowAddDevice(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {devices.length > 0 && !showAddDevice && (
        <Button onClick={() => setShowAddDevice(true)} variant="outline" className="w-full gap-2">
          <Plus className="h-4 w-4" />
          Add Another Device
        </Button>
      )}
    </div>
  )
}
