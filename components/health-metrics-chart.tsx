"use client"

import { Line, LineChart, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Tooltip } from "recharts"

interface HealthMetricsChartProps {
  metrics: any[]
}

export default function HealthMetricsChart({ metrics }: HealthMetricsChartProps) {
  if (!metrics || metrics.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-gray-500">
        No health data available. Upload CSV data to see trends.
      </div>
    )
  }

  const chartData = metrics
    .slice(0, 10)
    .reverse()
    .map((metric, index) => ({
      name: `Entry ${index + 1}`,
      heartRate: metric.heart_rate || 0,
      systolic: metric.blood_pressure_systolic || 0,
      o2: metric.oxygen_saturation || 0,
    }))

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
          <XAxis dataKey="name" className="text-xs" />
          <YAxis className="text-xs" />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "8px 12px",
            }}
            labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="heartRate"
            stroke="#ef4444"
            strokeWidth={2}
            name="Heart Rate (bpm)"
            dot={{ fill: "#ef4444", r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="systolic"
            stroke="#3b82f6"
            strokeWidth={2}
            name="BP Systolic"
            dot={{ fill: "#3b82f6", r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="o2"
            stroke="#10b981"
            strokeWidth={2}
            name="O2 Saturation (%)"
            dot={{ fill: "#10b981", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
