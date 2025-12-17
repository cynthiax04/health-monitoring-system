"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Upload, X, AlertTriangle, CheckCircle2, AlertCircle, Activity } from "lucide-react"

interface HealthMetrics {
  name?: string
  age?: number
  gender?: string
  height?: number
  weight?: number
  bmi?: number
  occupation?: string
  physical_activity?: number
  sleep_duration?: string
  sleep_quality?: number
  smoking?: string
  alcohol?: string
  water_intake?: string
  diet_type?: string
  junk_food_frequency?: string
  sugary_drinks?: string
  exercise?: string
  exercise_frequency?: string
  heart_rate?: number
  blood_pressure_systolic?: number
  blood_pressure_diastolic?: number
  blood_sugar?: number
  oxygen_saturation?: number
  step_count?: number
  temperature?: number
  chronic_diseases?: string
  recent_symptoms?: string
  family_history?: string
  medication?: string
  stress_frequency?: string
  anxiety_depression?: string
  mental_wellbeing?: number
  screen_time?: number
  riskScore?: number
  riskLevel?: string
  riskFactors?: string[]
}

export function CSVUploader({ onDataUploaded }: { onDataUploaded: (data: HealthMetrics[]) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [parsedData, setParsedData] = useState<HealthMetrics[]>([])

  const calculateRiskScore = (metrics: HealthMetrics) => {
    let riskScore = 0
    let riskLevel = "low"
    const riskFactors: string[] = []

    // Heart rate risk (normal: 60-100 bpm)
    if (metrics.heart_rate && metrics.heart_rate > 0 && metrics.heart_rate < 200) {
      if (metrics.heart_rate > 100 || metrics.heart_rate < 60) {
        riskScore += 2
        riskFactors.push(`Abnormal heart rate: ${metrics.heart_rate} bpm`)
      }
      if (metrics.heart_rate > 120 || metrics.heart_rate < 50) {
        riskScore += 3
        riskFactors.push(`Critical heart rate: ${metrics.heart_rate} bpm`)
      }
    }

    // Blood pressure risk (normal: <120/80)
    if (
      metrics.blood_pressure_systolic &&
      metrics.blood_pressure_diastolic &&
      metrics.blood_pressure_systolic < 200 &&
      metrics.blood_pressure_diastolic < 150
    ) {
      if (metrics.blood_pressure_systolic > 120 || metrics.blood_pressure_diastolic > 80) {
        riskScore += 2
        riskFactors.push(`Elevated BP: ${metrics.blood_pressure_systolic}/${metrics.blood_pressure_diastolic}`)
      }
      if (metrics.blood_pressure_systolic > 140 || metrics.blood_pressure_diastolic > 90) {
        riskScore += 3
        riskFactors.push(`High BP: ${metrics.blood_pressure_systolic}/${metrics.blood_pressure_diastolic}`)
      }
    }

    // Oxygen saturation risk (normal: >95%)
    if (metrics.oxygen_saturation && metrics.oxygen_saturation > 50 && metrics.oxygen_saturation <= 100) {
      if (metrics.oxygen_saturation < 95) {
        riskScore += 2
        riskFactors.push(`Low SpO2: ${metrics.oxygen_saturation}%`)
      }
      if (metrics.oxygen_saturation < 90) {
        riskScore += 4
        riskFactors.push(`Critical SpO2: ${metrics.oxygen_saturation}%`)
      }
    }

    // Temperature risk (normal: 36-37.5°C)
    if (metrics.temperature && metrics.temperature > 30 && metrics.temperature < 45) {
      if (metrics.temperature > 37.5 || metrics.temperature < 36) {
        riskScore += 1
        riskFactors.push(`Abnormal temperature: ${metrics.temperature}°C`)
      }
      if (metrics.temperature > 38.5) {
        riskScore += 3
        riskFactors.push(`High fever: ${metrics.temperature}°C`)
      }
    }

    // BMI analysis
    if (metrics.bmi && metrics.bmi > 10 && metrics.bmi < 60) {
      if (metrics.bmi < 18.5) {
        riskScore += 1.5
        riskFactors.push("Underweight (BMI < 18.5)")
      } else if (metrics.bmi >= 25 && metrics.bmi < 30) {
        riskScore += 1
        riskFactors.push("Overweight (BMI 25-30)")
      } else if (metrics.bmi >= 30) {
        riskScore += 2.5
        riskFactors.push("Obese (BMI ≥ 30)")
      }
    } else if (metrics.height && metrics.weight) {
      // Calculate BMI if not provided
      const heightM = metrics.height / 100
      const calculatedBMI = metrics.weight / (heightM * heightM)
      if (calculatedBMI < 18.5) {
        riskScore += 1.5
        riskFactors.push("Underweight (BMI < 18.5)")
      } else if (calculatedBMI >= 25 && calculatedBMI < 30) {
        riskScore += 1
        riskFactors.push("Overweight (BMI 25-30)")
      } else if (calculatedBMI >= 30) {
        riskScore += 2.5
        riskFactors.push("Obese (BMI ≥ 30)")
      }
    }

    // Sleep analysis
    if (metrics.sleep_duration) {
      const sleepText = metrics.sleep_duration.toLowerCase()
      if (sleepText.includes("<5") || sleepText.includes("less than 5")) {
        riskScore += 2
        riskFactors.push("Severe sleep deprivation (<5 hours)")
      } else if (sleepText.includes("5-6")) {
        riskScore += 1.5
        riskFactors.push("Insufficient sleep (5-6 hours)")
      }
    }

    // Physical activity analysis (1-5 scale)
    if (metrics.physical_activity) {
      if (metrics.physical_activity <= 2) {
        riskScore += 1.5
        riskFactors.push("Sedentary lifestyle")
      }
    }

    // Smoking risk
    if (metrics.smoking) {
      const smoking = metrics.smoking.toLowerCase()
      if (smoking.includes("yes") || smoking.includes("daily") || smoking.includes("occasionally")) {
        riskScore += 3
        riskFactors.push("Smoking habit")
      }
    }

    // Alcohol consumption
    if (metrics.alcohol) {
      const alcohol = metrics.alcohol.toLowerCase()
      if (alcohol.includes("daily") || alcohol.includes("weekly") || alcohol.includes("occasionally")) {
        riskScore += 1.5
        riskFactors.push("Regular alcohol consumption")
      }
    }

    // Water intake
    if (metrics.water_intake) {
      const water = metrics.water_intake.toLowerCase()
      if (water.includes("<1") || water.includes("less than 1")) {
        riskScore += 1
        riskFactors.push("Dehydration risk (low water intake)")
      }
    }

    // Chronic diseases
    if (metrics.chronic_diseases) {
      const diseases = metrics.chronic_diseases.toLowerCase()
      if (!diseases.includes("none") && diseases.trim() !== "") {
        if (diseases.includes("diabetes")) {
          riskScore += 2.5
          riskFactors.push("Diabetes")
        }
        if (diseases.includes("asthma")) {
          riskScore += 1.5
          riskFactors.push("Asthma")
        }
        if (diseases.includes("hypertension")) {
          riskScore += 2
          riskFactors.push("Hypertension")
        }
        if (diseases.includes("heart")) {
          riskScore += 3
          riskFactors.push("Heart disease")
        }
        if (diseases.includes("thyroid")) {
          riskScore += 1
          riskFactors.push("Thyroid disorder")
        }
      }
    }

    // Recent symptoms
    if (metrics.recent_symptoms) {
      const symptoms = metrics.recent_symptoms.toLowerCase()
      if (!symptoms.includes("none") && symptoms.trim() !== "") {
        if (symptoms.includes("chest pain")) {
          riskScore += 3
          riskFactors.push("Chest pain reported")
        }
        if (symptoms.includes("shortness of breath")) {
          riskScore += 2
          riskFactors.push("Breathing difficulties")
        }
        if (symptoms.includes("irregular heartbeat")) {
          riskScore += 2.5
          riskFactors.push("Irregular heartbeat")
        }
        if (symptoms.includes("fatigue")) {
          riskScore += 1
          riskFactors.push("Chronic fatigue")
        }
        if (symptoms.includes("sleep issues")) {
          riskScore += 0.5
          riskFactors.push("Sleep issues")
        }
      }
    }

    // Family history
    if (metrics.family_history) {
      const family = metrics.family_history.toLowerCase()
      if (!family.includes("none") && family.trim() !== "") {
        if (family.includes("diabetes")) {
          riskScore += 1.5
          riskFactors.push("Family history: Diabetes")
        }
        if (family.includes("heart")) {
          riskScore += 2
          riskFactors.push("Family history: Heart disease")
        }
        if (family.includes("hypertension")) {
          riskScore += 1.5
          riskFactors.push("Family history: Hypertension")
        }
        if (family.includes("thyroid")) {
          riskScore += 0.5
          riskFactors.push("Family history: Thyroid")
        }
      }
    }

    // Stress and mental health
    if (metrics.stress_frequency) {
      const stress = metrics.stress_frequency.toLowerCase()
      if (stress.includes("always")) {
        riskScore += 2
        riskFactors.push("Chronic stress (always)")
      } else if (stress.includes("often")) {
        riskScore += 1.5
        riskFactors.push("Frequent stress")
      }
    }

    if (metrics.anxiety_depression) {
      const mental = metrics.anxiety_depression.toLowerCase()
      if (mental.includes("yes")) {
        riskScore += 1.5
        riskFactors.push("Mental health concerns")
      }
    }

    // Diet and nutrition
    if (metrics.junk_food_frequency) {
      const junk = metrics.junk_food_frequency.toLowerCase()
      if (junk.includes("daily")) {
        riskScore += 1.5
        riskFactors.push("Daily junk food consumption")
      } else if (junk.includes("weekly")) {
        riskScore += 1
        riskFactors.push("Weekly junk food consumption")
      }
    }

    if (metrics.sugary_drinks) {
      const sugary = metrics.sugary_drinks.toLowerCase()
      if (sugary.includes("daily")) {
        riskScore += 1
        riskFactors.push("Daily sugary drink consumption")
      } else if (sugary.includes("weekly")) {
        riskScore += 0.5
        riskFactors.push("Weekly sugary drink consumption")
      }
    }

    // Exercise habits
    if (metrics.exercise) {
      const exercise = metrics.exercise.toLowerCase()
      if (exercise.includes("no")) {
        riskScore += 1.5
        riskFactors.push("Lack of regular exercise")
      }
    }

    // Step count (if available and valid)
    if (metrics.step_count && metrics.step_count > 0 && metrics.step_count < 50000) {
      if (metrics.step_count < 3000) {
        riskScore += 1.5
        riskFactors.push("Very low daily activity (<3000 steps)")
      } else if (metrics.step_count < 5000) {
        riskScore += 1
        riskFactors.push("Low daily activity (<5000 steps)")
      }
    }

    // Screen time
    if (metrics.screen_time && metrics.screen_time >= 6) {
      riskScore += 1
      riskFactors.push("Excessive screen time (≥6 hours)")
    }

    // Blood sugar level
    if (metrics.blood_sugar && metrics.blood_sugar > 50 && metrics.blood_sugar < 500) {
      if (metrics.blood_sugar > 140) {
        riskScore += 2.5
        riskFactors.push(`High blood sugar: ${metrics.blood_sugar} mg/dL`)
      } else if (metrics.blood_sugar > 100) {
        riskScore += 1
        riskFactors.push(`Elevated blood sugar: ${metrics.blood_sugar} mg/dL`)
      }
    }

    // Sleep quality (1-5 scale)
    if (metrics.sleep_quality && metrics.sleep_quality <= 2) {
      riskScore += 1
      riskFactors.push("Poor sleep quality")
    }

    // Mental wellbeing (1-5 scale, lower is worse)
    if (metrics.mental_wellbeing && metrics.mental_wellbeing <= 2) {
      riskScore += 1.5
      riskFactors.push("Poor mental wellbeing")
    }

    // Determine risk level based on comprehensive score
    if (riskScore >= 10) {
      riskLevel = "critical"
    } else if (riskScore >= 7) {
      riskLevel = "high"
    } else if (riskScore >= 4) {
      riskLevel = "medium"
    } else {
      riskLevel = "low"
    }

    return { riskScore: Number.parseFloat(riskScore.toFixed(1)), riskLevel, riskFactors }
  }

  const parseCSV = (text: string): HealthMetrics[] => {
    const lines = text.split("\n").filter((line) => line.trim())
    if (lines.length < 2) return []

    const headers = lines[0].split(",").map((h) => h.trim())
    const data: HealthMetrics[] = []

    const hasVitalSignsFormat = headers.some((h) =>
      ["heartRate", "bloodPressureSystolic", "oxygenSaturation"].includes(h),
    )
    const hasLifestyleFormat = headers.some(
      (h) => h.toLowerCase().includes("name") || h.toLowerCase().includes("age") || h.toLowerCase().includes("gender"),
    )

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map((v) => v.replace(/^"|"$/g, "").trim()) || []

      const row: HealthMetrics = {}

      headers.forEach((header, index) => {
        const value = values[index]?.trim()
        if (!value || value === "" || value === "Don't know") return

        const lowerHeader = header.toLowerCase()

        if (header === "heartRate") {
          const hr = Number.parseInt(value)
          if (hr >= 40 && hr <= 200) row.heart_rate = hr
        } else if (header === "bloodPressureSystolic") {
          const sys = Number.parseInt(value)
          if (sys >= 60 && sys <= 200) row.blood_pressure_systolic = sys
        } else if (header === "bloodPressureDiastolic") {
          const dia = Number.parseInt(value)
          if (dia >= 40 && dia <= 150) row.blood_pressure_diastolic = dia
        } else if (header === "oxygenSaturation") {
          const o2 = Number.parseFloat(value)
          if (o2 >= 50 && o2 <= 100) row.oxygen_saturation = o2
        } else if (header === "temperature") {
          const temp = Number.parseFloat(value)
          if (temp >= 30 && temp <= 45) row.temperature = temp
        } else if (header === "sleepQuality") {
          const quality = Number.parseInt(value)
          if (quality >= 1 && quality <= 100) row.sleep_quality = quality >= 70 ? 5 : quality >= 50 ? 3 : 1
        } else if (header === "stepCount") {
          const steps = Number.parseInt(value)
          if (steps > 0 && steps < 50000) row.step_count = steps
        } else if (header === "stressLevel") {
          const stress = Number.parseInt(value)
          if (stress >= 0 && stress <= 100) row.stress_level = stress
        } else if (header === "timestamp") {
          row.timestamp = value
        } else if (lowerHeader.includes("name") && index <= 1) {
          row.name = value
        } else if (lowerHeader.includes("age") && !lowerHeader.includes("average")) {
          const age = Number.parseInt(value)
          if (age > 0 && age < 150) row.age = age
        } else if (lowerHeader.includes("gender")) {
          row.gender = value
        } else if (lowerHeader.includes("height")) {
          const height = Number.parseFloat(value.replace(/[^0-9.]/g, ""))
          if (height > 50 && height < 250) row.height = height
        } else if (lowerHeader.includes("weight")) {
          const weight = Number.parseFloat(value.replace(/[^0-9.]/g, ""))
          if (weight > 20 && weight < 300) row.weight = weight
        } else if (lowerHeader.includes("bmi") && lowerHeader.includes("optional")) {
          const bmi = Number.parseFloat(value)
          if (bmi > 10 && bmi < 60) row.bmi = bmi
        } else if (lowerHeader.includes("occupation")) {
          row.occupation = value
        } else if (lowerHeader.includes("physical activity")) {
          const activity = Number.parseInt(value)
          if (activity >= 1 && activity <= 5) row.physical_activity = activity
        } else if (lowerHeader.includes("sleep duration")) {
          row.sleep_duration = value
        } else if (lowerHeader.includes("sleep quality") && !header.includes("sleepQuality")) {
          const quality = Number.parseInt(value)
          if (quality >= 1 && quality <= 5) row.sleep_quality = quality
        } else if (lowerHeader.includes("smoke")) {
          row.smoking = value
        } else if (lowerHeader.includes("alcohol")) {
          row.alcohol = value
        } else if (lowerHeader.includes("water intake")) {
          row.water_intake = value
        } else if (lowerHeader.includes("diet type")) {
          row.diet_type = value
        } else if (lowerHeader.includes("junk") || lowerHeader.includes("fast food")) {
          row.junk_food_frequency = value
        } else if (lowerHeader.includes("sugary drink")) {
          row.sugary_drinks = value
        } else if (lowerHeader.includes("exercise or sports")) {
          row.exercise = value
        } else if (lowerHeader.includes("how often do you exercise")) {
          row.exercise_frequency = value
        } else if (lowerHeader.includes("heart rate") && lowerHeader.includes("bpm")) {
          const hr = Number.parseInt(value.replace(/[^0-9]/g, ""))
          if (hr >= 40 && hr <= 200) row.heart_rate = hr
        } else if (lowerHeader.includes("blood pressure") && value.includes("/")) {
          const [sys, dia] = value.split("/").map((v) => Number.parseInt(v.trim()))
          if (sys >= 60 && sys <= 200 && dia >= 40 && dia <= 150) {
            row.blood_pressure_systolic = sys
            row.blood_pressure_diastolic = dia
          }
        } else if (lowerHeader.includes("blood sugar")) {
          const sugar = Number.parseInt(value.replace(/[^0-9]/g, ""))
          if (sugar >= 50 && sugar < 500) row.blood_sugar = sugar
        } else if (lowerHeader.includes("oxygen level") || lowerHeader.includes("spo")) {
          const o2 = Number.parseFloat(value.replace(/[^0-9.]/g, ""))
          if (o2 >= 50 && o2 <= 100) row.oxygen_saturation = o2
        } else if (lowerHeader.includes("step count") && !header.includes("stepCount")) {
          const steps = value.toLowerCase()
          if (steps.includes("k")) {
            const num = Number.parseFloat(steps.replace(/[^0-9.]/g, ""))
            row.step_count = num * 1000
          } else {
            const num = Number.parseInt(value.replace(/[^0-9]/g, ""))
            if (num > 0 && num < 50000) row.step_count = num
          }
        } else if (lowerHeader.includes("temperature") && lowerHeader.includes("optional")) {
          const temp = Number.parseFloat(value.replace(/[^0-9.]/g, ""))
          if (temp >= 30 && temp <= 45) row.temperature = temp
        } else if (lowerHeader.includes("chronic disease")) {
          row.chronic_diseases = value
        } else if (lowerHeader.includes("experienced any")) {
          row.recent_symptoms = value
        } else if (lowerHeader.includes("family history")) {
          row.family_history = value
        } else if (lowerHeader.includes("regular medication")) {
          row.medication = value
        } else if (lowerHeader.includes("feel stressed")) {
          row.stress_frequency = value
        } else if (lowerHeader.includes("anxious or depressed")) {
          row.anxiety_depression = value
        } else if (lowerHeader.includes("mental well-being")) {
          const wellbeing = Number.parseInt(value)
          if (wellbeing >= 1 && wellbeing <= 5) row.mental_wellbeing = wellbeing
        } else if (lowerHeader.includes("screen")) {
          const screen = Number.parseInt(value.replace(/[^0-9]/g, ""))
          if (screen >= 0 && screen <= 24) row.screen_time = screen
        }
      })

      if (hasVitalSignsFormat && !row.name) {
        row.name = `Patient ${i}`
      }

      // Only add row if it has meaningful data (reduced threshold for vital signs data)
      const minKeys = hasVitalSignsFormat ? 2 : 3
      if (Object.keys(row).length > minKeys) {
        const riskData = calculateRiskScore(row)
        row.riskScore = riskData.riskScore
        row.riskLevel = riskData.riskLevel
        row.riskFactors = riskData.riskFactors
        data.push(row)
      }
    }

    return data
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type === "text/csv" || selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile)
        setError(null)
        setSuccess(false)
      } else {
        setError("Please select a valid CSV file")
        setFile(null)
      }
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setError(null)
    setSuccess(false)
    setParsedData([])
    onDataUploaded([])
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError(null)
    setSuccess(false)

    try {
      const text = await file.text()
      const healthData = parseCSV(text)

      if (healthData.length === 0) {
        throw new Error("No valid data found in CSV file")
      }

      setParsedData(healthData)
      onDataUploaded(healthData)
      setSuccess(true)

      try {
        const { createClient } = await import("@/lib/supabase/client")
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          for (const metrics of healthData) {
            await supabase.from("health_metrics").insert({
              user_id: user.id,
              heart_rate: metrics.heart_rate,
              blood_pressure_systolic: metrics.blood_pressure_systolic,
              blood_pressure_diastolic: metrics.blood_pressure_diastolic,
              oxygen_saturation: metrics.oxygen_saturation,
              temperature: metrics.temperature,
              risk_score: metrics.riskScore,
              risk_level: metrics.riskLevel,
              age: metrics.age,
              gender: metrics.gender,
              bmi: metrics.bmi,
              sleep_duration: metrics.sleep_duration,
              physical_activity: metrics.physical_activity ? metrics.physical_activity.toString() : null,
              smoking: metrics.smoking,
              alcohol: metrics.alcohol,
              water_intake: metrics.water_intake,
              junk_food_frequency: metrics.junk_food_frequency,
              sugary_drinks: metrics.sugary_drinks,
              exercise: metrics.exercise,
              step_count: metrics.step_count,
              chronic_diseases: metrics.chronic_diseases,
              recent_symptoms: metrics.recent_symptoms,
              family_history: metrics.family_history,
              stress_frequency: metrics.stress_frequency,
              anxiety_depression: metrics.anxiety_depression,
            })
          }
        }
      } catch (dbError) {
        console.error("[v0] Database error (non-fatal):", dbError)
        // Continue - we still show the data even if DB fails
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse CSV file")
      setParsedData([])
    } finally {
      setUploading(false)
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "critical":
        return "text-red-600"
      case "high":
        return "text-orange-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const getRiskBadgeColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300"
      case "low":
        return "bg-green-100 text-green-800 border-green-300"
      default:
        return "bg-gray-100 text-gray-800 border-gray-300"
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Upload Health Data (CSV)</h3>

        <div className="space-y-4">
          {!file ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <span className="text-sm text-gray-600">Click to upload or drag and drop</span>
                <input id="csv-upload" type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
              </label>
              <p className="text-xs text-gray-500 mt-2">CSV files only</p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleRemoveFile} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {file && !success && (
            <Button onClick={handleUpload} disabled={uploading} className="w-full">
              {uploading ? "Analyzing..." : "Analyze Health Data"}
            </Button>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg text-sm">
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <p>Successfully analyzed {parsedData.length} health records</p>
            </div>
          )}
        </div>
      </Card>

      {parsedData.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Risk Assessment Results</h3>
          <div className="space-y-4">
            {parsedData.map((person, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-base">{person.name || `Person ${index + 1}`}</h4>
                    <p className="text-sm text-gray-600">
                      {person.age && `${person.age} years`}
                      {person.age && person.gender && " • "}
                      {person.gender}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getRiskColor(person.riskLevel || "low")}`}>
                      {person.riskScore?.toFixed(1) || "0.0"}
                    </div>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getRiskBadgeColor(person.riskLevel || "low")}`}
                    >
                      {person.riskLevel?.toUpperCase() || "LOW"} RISK
                    </span>
                  </div>
                </div>

                {person.riskFactors && person.riskFactors.length > 0 && (
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Risk Factors:
                    </p>
                    <ul className="space-y-1">
                      {person.riskFactors.map((factor, idx) => (
                        <li key={idx} className="text-sm text-gray-600 pl-6">
                          • {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {(person.heart_rate || person.blood_pressure_systolic || person.oxygen_saturation) && (
                  <div className="grid grid-cols-3 gap-3 pt-2 border-t text-center">
                    {person.heart_rate && (
                      <div>
                        <p className="text-xs text-gray-500">Heart Rate</p>
                        <p className="text-sm font-semibold">{person.heart_rate} bpm</p>
                      </div>
                    )}
                    {person.blood_pressure_systolic && (
                      <div>
                        <p className="text-xs text-gray-500">Blood Pressure</p>
                        <p className="text-sm font-semibold">
                          {person.blood_pressure_systolic}/{person.blood_pressure_diastolic}
                        </p>
                      </div>
                    )}
                    {person.oxygen_saturation && (
                      <div>
                        <p className="text-xs text-gray-500">SpO2</p>
                        <p className="text-sm font-semibold">{person.oxygen_saturation}%</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="text-xs text-gray-500">
        <p className="font-semibold mb-2">Supported CSV columns:</p>
        <p>
          Name, Age, Gender, Height, Weight, BMI, Physical Activity, Sleep Duration, Smoking, Alcohol, Water Intake,
          Diet Type, Junk Food, Exercise, Heart Rate, Blood Pressure, Blood Sugar, SpO2, Step Count, Temperature,
          Chronic Diseases, Recent Symptoms, Family History, Stress, Anxiety/Depression, and more lifestyle factors
        </p>
      </div>
    </div>
  )
}

export default CSVUploader
