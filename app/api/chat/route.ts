export const maxDuration = 30

interface Message {
  role: "user" | "assistant"
  content: string
}

// Comprehensive medical knowledge base for symptom analysis
const SYMPTOM_DATABASE = {
  fever: {
    keywords: ["fever", "temperature", "hot", "burning", "chills", "shivering"],
    conditions: [
      {
        name: "Common Cold/Flu",
        severity: "Mild to Moderate",
        symptoms: ["fever", "cough", "runny nose", "body aches", "fatigue"],
        recommendations:
          "Rest, drink plenty of fluids, take paracetamol (Crocin/Dolo 650mg). Usually resolves in 5-7 days.",
        whenToSeek: "If fever persists beyond 3 days or exceeds 103°F",
        critical: false,
      },
      {
        name: "Dengue Fever",
        severity: "Moderate to Severe",
        symptoms: ["high fever", "severe headache", "pain behind eyes", "joint pain", "rash", "bleeding"],
        recommendations: "Immediate medical attention required. Get CBC test. Stay hydrated with ORS/coconut water.",
        whenToSeek: "Immediately - dengue requires medical monitoring",
        critical: false,
      },
      {
        name: "Typhoid",
        severity: "Moderate to Severe",
        symptoms: ["sustained fever", "weakness", "stomach pain", "headache", "loss of appetite"],
        recommendations: "Consult doctor for Widal test. Requires antibiotic treatment.",
        whenToSeek: "If fever persists for more than 2-3 days with stomach symptoms",
        critical: false,
      },
    ],
  },
  chest: {
    keywords: ["chest pain", "chest", "heart pain", "chest pressure", "chest tightness"],
    conditions: [
      {
        name: "Heart Attack (Myocardial Infarction)",
        severity: "CRITICAL EMERGENCY",
        symptoms: ["severe chest pain", "pain radiating to arm/jaw", "shortness of breath", "sweating", "nausea"],
        recommendations: "CALL 108 IMMEDIATELY. Chew aspirin if available. Do not drive yourself.",
        whenToSeek: "IMMEDIATE EMERGENCY - Call 108 now",
        emergency: true,
        critical: true,
      },
      {
        name: "Acid Reflux/GERD",
        severity: "Mild",
        symptoms: ["burning chest pain", "worse after eating", "sour taste", "bloating"],
        recommendations: "Take antacids (Digene/ENO). Avoid spicy food. Eat small meals. Consult doctor if persistent.",
        whenToSeek: "If pain is severe or different from usual heartburn",
        critical: false,
      },
      {
        name: "Anxiety/Panic Attack",
        severity: "Moderate",
        symptoms: ["chest tightness", "rapid heartbeat", "sweating", "fear", "shortness of breath"],
        recommendations:
          "Practice deep breathing. Sit calmly. Usually resolves in 10-20 minutes. Consider counseling if frequent.",
        whenToSeek: "If first episode or symptoms don't match anxiety",
        critical: false,
      },
    ],
  },
  cough: {
    keywords: ["cough", "coughing", "phlegm", "mucus", "throat"],
    conditions: [
      {
        name: "Tuberculosis (TB)",
        severity: "Serious",
        symptoms: ["persistent cough >2 weeks", "blood in sputum", "night sweats", "weight loss", "fever"],
        recommendations: "Get chest X-ray and sputum test immediately. TB is curable with proper treatment.",
        whenToSeek: "Cough lasting more than 2 weeks requires medical evaluation",
        critical: false,
      },
      {
        name: "Bronchitis",
        severity: "Moderate",
        symptoms: ["persistent cough", "mucus production", "chest discomfort", "mild fever"],
        recommendations: "Rest, fluids, steam inhalation. Cough syrup (Alex/Benadryl). Avoid smoking/pollution.",
        whenToSeek: "If cough persists beyond 2 weeks or worsens",
        critical: false,
      },
    ],
  },
  stomach: {
    keywords: ["stomach pain", "abdominal pain", "belly pain", "stomach ache", "cramps"],
    conditions: [
      {
        name: "Appendicitis",
        severity: "SURGICAL EMERGENCY",
        symptoms: [
          "pain starting near navel, moving to lower right",
          "nausea",
          "vomiting",
          "fever",
          "loss of appetite",
        ],
        recommendations: "CALL 108 IMMEDIATELY. Do not eat or drink. Requires emergency surgery.",
        whenToSeek: "IMMEDIATE EMERGENCY if pain in lower right abdomen",
        emergency: true,
        critical: true,
      },
      {
        name: "Gastroenteritis (Food Poisoning)",
        severity: "Mild to Moderate",
        symptoms: ["stomach cramps", "diarrhea", "vomiting", "nausea"],
        recommendations:
          "Stay hydrated with ORS. Avoid solid food for few hours. Take probiotics. Usually resolves in 24-48 hours.",
        whenToSeek: "If severe dehydration, blood in stool, or symptoms persist beyond 2 days",
        critical: false,
      },
    ],
  },
  headache: {
    keywords: ["headache", "head pain", "migraine", "head ache"],
    conditions: [
      {
        name: "Tension Headache",
        severity: "Mild",
        symptoms: ["dull aching head pain", "tightness around forehead", "muscle tenderness"],
        recommendations: "Rest in quiet dark room. Take paracetamol. Apply cold compress. Reduce stress.",
        whenToSeek: "If headache is sudden, severe, or different from usual",
        critical: false,
      },
      {
        name: "Migraine",
        severity: "Moderate",
        symptoms: ["throbbing pain", "sensitivity to light", "nausea", "visual disturbances"],
        recommendations: "Rest in dark quiet room. Take prescribed migraine medication. Avoid triggers.",
        whenToSeek: "If first migraine or pattern changes",
        critical: false,
      },
      {
        name: "Stroke",
        severity: "CRITICAL EMERGENCY",
        symptoms: ["sudden severe headache", "confusion", "trouble speaking", "facial drooping", "weakness one side"],
        recommendations: "CALL 108 IMMEDIATELY. Note the time symptoms started. Do not give food or water.",
        whenToSeek: "IMMEDIATE EMERGENCY - every minute counts",
        emergency: true,
        critical: true,
      },
    ],
  },
  breathing: {
    keywords: ["shortness of breath", "breathless", "difficulty breathing", "can't breathe", "breathing problem"],
    conditions: [
      {
        name: "Severe Asthma Attack",
        severity: "CRITICAL EMERGENCY",
        symptoms: [
          "severe wheezing",
          "chest tightness",
          "inability to speak",
          "blue lips",
          "extreme difficulty breathing",
        ],
        recommendations: "Use inhaler immediately. Call 108. Sit upright. This is a medical emergency.",
        whenToSeek: "IMMEDIATE EMERGENCY if inhaler doesn't help or breathing severely compromised",
        emergency: true,
        critical: true,
      },
      {
        name: "Mild Asthma",
        severity: "Moderate",
        symptoms: ["wheezing", "chest tightness", "difficulty breathing", "cough"],
        recommendations: "Use inhaler. Rest. Avoid triggers. Monitor symptoms.",
        whenToSeek: "If symptoms worsen or inhaler doesn't provide relief",
        critical: false,
      },
      {
        name: "COVID-19 (Severe)",
        severity: "Serious",
        symptoms: ["shortness of breath", "chest pain", "low oxygen", "confusion"],
        recommendations: "Check oxygen saturation. If below 94%, seek immediate medical care. Call 108 if critical.",
        whenToSeek: "Immediately if breathing difficulty or oxygen low",
        emergency: true,
        critical: true,
      },
    ],
  },
  diabetes: {
    keywords: ["sugar", "diabetes", "frequent urination", "excessive thirst", "high blood sugar"],
    conditions: [
      {
        name: "Uncontrolled Diabetes",
        severity: "Moderate to Serious",
        symptoms: ["frequent urination", "excessive thirst", "fatigue", "blurred vision", "slow healing wounds"],
        recommendations:
          "Check blood sugar. Consult endocrinologist. May need medication adjustment. Follow diabetic diet.",
        whenToSeek: "If blood sugar consistently high or symptoms worsen",
        critical: false,
      },
    ],
  },
  vomiting: {
    keywords: ["vomiting", "throwing up", "nausea", "vomit"],
    conditions: [
      {
        name: "Gastroenteritis",
        severity: "Mild to Moderate",
        symptoms: ["vomiting", "nausea", "diarrhea", "stomach cramps"],
        recommendations: "Stay hydrated with ORS. Rest. Small sips of water. Usually resolves in 24-48 hours.",
        whenToSeek: "If unable to keep fluids down, signs of dehydration, or blood in vomit",
        critical: false,
      },
    ],
  },
}

const EMERGENCY_CONTACTS = `
🚨 **EMERGENCY CONTACTS (INDIA)**
- 🚑 **Ambulance:** 108
- 🏥 **Medical Helpline:** 104
- 📞 **Ajeenkya DY Patil University Medical Center**
  Address: Lohegaon, Pune, Maharashtra
  Contact: Available 24/7 for students
`

const PUNE_HOSPITALS = [
  {
    name: "Ruby Hall Clinic",
    specialties: "Cardiac Care, Emergency Services",
    address: "40, Sassoon Road, Pune - 411001",
    phone: "+91-20-26163636",
    emergency: "+91-20-66990008",
  },
  {
    name: "Jehangir Hospital",
    specialties: "Multi-specialty, Cardiac ICU",
    address: "32, Sassoon Road, Pune - 411001",
    phone: "+91-20-26054091",
    emergency: "+91-20-66907777",
  },
  {
    name: "KEM Hospital",
    specialties: "Government Hospital, Emergency",
    address: "489, Rasta Peth, Pune - 411011",
    phone: "+91-20-26123234",
    emergency: "+91-20-26163456",
  },
  {
    name: "Sahyadri Super Specialty Hospital",
    specialties: "Cardiac Care, Emergency ICU",
    address: "30-C, Erandwane, Karve Road, Pune - 411004",
    phone: "+91-20-67206720",
    emergency: "+91-20-67206789",
  },
  {
    name: "Deenanath Mangeshkar Hospital",
    specialties: "Multi-specialty, Heart Care",
    address: "Erandwane, Pune - 411004",
    phone: "+91-20-66206622",
    emergency: "+91-20-66206699",
  },
]

function analyzeSymptoms(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase()
  const matchedConditions: any[] = []
  let hasCriticalEmergency = false

  // Check each symptom category
  for (const [category, data] of Object.entries(SYMPTOM_DATABASE)) {
    const hasKeyword = data.keywords.some((keyword) => lowerMessage.includes(keyword))

    if (hasKeyword) {
      for (const condition of data.conditions) {
        const symptomMatches = condition.symptoms.filter((symptom) =>
          lowerMessage.includes(symptom.toLowerCase()),
        ).length

        matchedConditions.push({
          ...condition,
          matchScore: symptomMatches,
        })

        if (condition.critical) {
          hasCriticalEmergency = true
        }
      }
    }
  }

  // Sort by match score
  matchedConditions.sort((a, b) => b.matchScore - a.matchScore)

  // Generate response
  if (matchedConditions.length === 0) {
    return `I understand you're experiencing health concerns. While I couldn't identify specific conditions from your description, I recommend:

**General Advice:**
- Monitor your symptoms carefully
- Keep track of when symptoms started and any changes
- Note any triggers or patterns
- Stay hydrated and get adequate rest

**When to Seek Help:**
- If symptoms persist or worsen
- If you develop new concerning symptoms
- If you're worried about your condition

**Consult a Doctor if:**
- Symptoms are severe or unusual for you
- You have underlying health conditions
- You're taking medications that might interact

${EMERGENCY_CONTACTS}

**Important:** This is general guidance. For accurate diagnosis, please consult a qualified healthcare professional.`
  }

  let response = "Based on your symptoms, here's my analysis:\n\n"

  if (hasCriticalEmergency) {
    response += `🚨 **URGENT: Your symptoms may indicate a medical emergency!**\n\n${EMERGENCY_CONTACTS}\n\n`
    response += `**🏥 RECOMMENDED HOSPITALS IN PUNE (CALL BEFORE VISITING):**\n\n`

    PUNE_HOSPITALS.forEach((hospital, index) => {
      response += `${index + 1}. **${hospital.name}**\n`
      response += `   📍 ${hospital.address}\n`
      response += `   ☎️ Main: ${hospital.phone}\n`
      response += `   🚨 Emergency: ${hospital.emergency}\n`
      response += `   🏥 Specialties: ${hospital.specialties}\n\n`
    })

    response +=
      "**⚠️ IMPORTANT:** Call the hospital emergency number before visiting to ensure they can accommodate your case.\n\n"
  }

  // List possible conditions
  response += "**Possible Conditions:**\n\n"
  matchedConditions.slice(0, 3).forEach((condition, index) => {
    response += `${index + 1}. **${condition.name}** (${condition.severity})\n`
    response += `   - Common symptoms: ${condition.symptoms.join(", ")}\n`
    response += `   - Recommendations: ${condition.recommendations}\n`
    response += `   - When to seek help: ${condition.whenToSeek}\n\n`
  })

  // Add general recommendations
  response += "\n**General Recommendations:**\n"
  response += "- Keep track of your symptoms and their progression\n"
  response += "- Stay hydrated and get adequate rest\n"
  response += "- Avoid self-medication without professional advice\n"
  response += "- Consider consulting a doctor for proper diagnosis\n\n"

  if (!hasCriticalEmergency) {
    response += "**Need Help?**\n"
    response += "- 🚑 Emergency: Call 108\n"
    response += "- 🏥 Medical Helpline: 104\n"
    response += "- 📞 University Medical Center: Available 24/7\n\n"
  }

  response +=
    "**Medical Disclaimer:** This AI analysis provides general information based on symptom patterns. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for accurate diagnosis and personalized treatment."

  return response
}

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json()

    if (!messages || messages.length === 0) {
      return new Response("No messages provided", { status: 400 })
    }

    const lastUserMessage = messages[messages.length - 1]

    if (lastUserMessage.role !== "user") {
      return new Response("Last message must be from user", { status: 400 })
    }

    // Analyze symptoms and generate response
    const assistantResponse = analyzeSymptoms(lastUserMessage.content)

    // Create response in the expected format
    const responseMessage = {
      id: crypto.randomUUID(),
      role: "assistant" as const,
      content: assistantResponse,
      parts: [
        {
          type: "text",
          text: assistantResponse,
        },
      ],
    }

    // Return as JSON
    return new Response(JSON.stringify(responseMessage), {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
