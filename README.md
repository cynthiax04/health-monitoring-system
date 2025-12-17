🩺 HealthMonitor – Health Monitoring System

A comprehensive **IoT-enabled health monitoring platform** built using **Next.js**, **Supabase**, and **AI (GPT-5 via Vercel AI SDK)**. The system enables real-time health tracking, AI-powered medical insights, and instant access to **India-focused emergency services**.

> ⚠️ Disclaimer: This platform is for educational and informational purposes only. It is **not a substitute for professional medical advice, diagnosis, or treatment**.

---
🚀 Key Features

1️⃣ Smart Wearable Integration

* Connect smartwatches and fitness trackers
* Real-time monitoring of vital signs:

  * Heart rate
  * Blood pressure
  * Oxygen saturation (SpO₂)
  * Body temperature
* Tracks steps, calories, sleep patterns, and stress levels
* Automated **health risk score calculation**
* Alerts for abnormal health metrics

---

2️⃣ AI Health Assistant Chatbot

* AI-powered symptom analysis using **GPT-5**
* Disease prediction with severity estimation
* Personalized health recommendations
* India-specific medical guidance
* Emergency contact suggestions for critical symptoms

---

3️⃣ Health Data Dashboard

* 📂 **CSV Upload Support** (flexible format)
* Automatic parsing and validation of health data
* AI-based risk prediction and scoring
* Interactive charts and trend analysis
* Device management interface
* Health alerts and notifications

---

4️⃣ Emergency Services (India-Focused)

* One-tap access to emergency numbers
* Location-based hospital finder
* Ajeenkya DY Patil University Medical Center contact
* Additional national helplines (mental health, women, children, senior citizens)

---

🛠️ Technology Stack

| Layer          | Technology                       |
| -------------- | -------------------------------- |
| Frontend       | Next.js 16, React 19, TypeScript |
| UI             | Tailwind CSS v4, shadcn/ui       |
| Charts         | Recharts                         |
| Database       | Supabase (PostgreSQL + RLS)      |
| Authentication | Supabase Auth                    |
| AI             | Vercel AI SDK v5, OpenAI GPT-5   |
| Hosting        | Vercel                           |

---

⚙️ Getting Started

Prerequisites

* Node.js **18+**
* Vercel account
* Supabase project (auto-configured via v0)

---

Installation & Setup

1. Clone the repository:

```bash
git clone https://github.com/cynthiax04/v0-health-monitoring-system.git
cd v0-health-monitoring-system
```

2. Install dependencies:

```bash
npm install
```

3. Set up the database:

* SQL schema is available at:

  ```
  scripts/001_create_health_tables.sql
  ```
* Apply it in the Supabase SQL Editor

4. Environment variables:

* Supabase and AI keys are automatically configured when deployed via **v0 + Vercel**

5. Run locally:

```bash
npm run dev
```

6. Deploy:

* Deploy directly to **Vercel** (recommended)

---

🗄️ Database Schema

| Table            | Description                             |
| ---------------- | --------------------------------------- |
| profiles         | User profile information                |
| wearable_devices | Connected wearable devices              |
| health_metrics   | Health data with calculated risk scores |
| symptom_chats    | AI chatbot conversation history         |
| health_alerts    | Health risk notifications               |

🔐 Row Level Security (RLS) is enabled on all tables.

---

📊 CSV Upload Format (Example)

```csv
heart_rate,blood_pressure_systolic,blood_pressure_diastolic,oxygen_saturation,temperature,steps,calories_burned,sleep_hours,stress_level
72,118,78,98.5,98.2,8500,350,7.5,4
85,125,82,97.2,98.6,6200,280,6.2,6
92,135,88,96.8,99.1,4500,210,5.8,8
```

Automatic Processing Includes:

* Flexible CSV parsing
* Health risk score calculation
* Alert generation for high-risk metrics
* Secure storage in Supabase

---

📈 Risk Scoring System

| Metric            | Normal Range |
| ----------------- | ------------ |
| Heart Rate        | 60–100 bpm   |
| Blood Pressure    | <120/80 mmHg |
| Oxygen Saturation | >95%         |
| Temperature       | 97–99 °F     |
| Stress Level      | 1–10         |

### Risk Levels

* Low: 0–3 points
* Medium: 4–6 points
* High: 7+ points

---
🤖 AI Medical Assistant – Capabilities
Advantages

* Fast preliminary health insights
* Personalized recommendations
* 24/7 availability
* India-specific medical context

Disadvantages

* Not a replacement for doctors
* Predictions depend on input accuracy
* Limited clinical validation

Example Use Case

> User uploads CSV → System detects high BP → AI chatbot recommends medical consultation and emergency numbers

---

🚨 Emergency Contacts (India)

* **Ambulance**: 108
* **Medical Helpline**: 104
* **Police**: 100
* **Mental Health**: 080-46110007
* **Women Helpline**: 1091
* **Child Helpline**: 1098
* **Senior Citizen Helpline**: 14567

---

🔐 Security Features

Advantages

* Supabase Auth with secure password hashing
* Row Level Security (RLS)
* Protected API routes
* HTTPS-only in production

Limitations

* Requires correct Supabase policy configuration
* API key exposure risk if misconfigured

## 📄 License

This project is intended for **academic and demonstration purposes**.

---

⭐ If you find this project useful, consider giving it a star on GitHub!
