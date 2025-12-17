# HealthMonitor - IoT Health Monitoring System

A comprehensive IoT-enabled health monitoring platform built with Next.js, Supabase, and AI SDK. Monitor your health in real-time, get AI-powered health insights, and access emergency services instantly.

## Features

### 1. Smart Wearable Integration
- Connect smartwatches and fitness trackers
- Real-time vital signs monitoring (heart rate, blood pressure, oxygen saturation)
- Track sleep patterns, steps, and calories
- Automated risk score calculation
- Health alerts for abnormal metrics

### 2. AI Health Assistant Chatbot
- AI-powered symptom analysis using GPT-5
- Disease prediction based on symptoms
- Personalized health recommendations
- India-specific medical guidance
- Emergency contact suggestions for severe cases

### 3. Health Data Dashboard
- **CSV Upload Feature**: Upload health data in any CSV format
- Automatic risk prediction and scoring
- Visual health metrics trends with charts
- Device management system
- Health alerts and notifications

### 4. Emergency Services (India-focused)
- Quick access to emergency numbers (108, 104)
- Location-based hospital finder
- Ajeenkya DY Patil University Medical Center contact
- Additional helplines (mental health, women, child, senior citizen)

## Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI**: Tailwind CSS v4, shadcn/ui components
- **Database**: Supabase (PostgreSQL with RLS)
- **AI**: Vercel AI SDK v5 with OpenAI GPT-5
- **Charts**: Recharts
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Vercel account
- Supabase project (automatically configured in v0)

### Installation

1. The database schema is automatically set up via the SQL script in `scripts/001_create_health_tables.sql`
2. All environment variables are pre-configured through the Supabase integration
3. Deploy to Vercel or run locally using the v0 preview

### Database Schema

The system includes the following tables:
- `profiles` - User profile information
- `wearable_devices` - Connected smartwatch/tracker data
- `health_metrics` - Real-time health measurements with risk scores
- `symptom_chats` - AI chatbot conversation history
- `health_alerts` - Health risk notifications

All tables are protected with Row Level Security (RLS) policies.

### CSV Upload Format

Upload health data with any of these column headers:

```csv
heart_rate,blood_pressure_systolic,blood_pressure_diastolic,oxygen_saturation,temperature,steps,calories_burned,sleep_hours,stress_level
72,118,78,98.5,98.2,8500,350,7.5,4
85,125,82,97.2,98.6,6200,280,6.2,6
92,135,88,96.8,99.1,4500,210,5.8,8
```

The system automatically:
- Parses various CSV formats
- Calculates risk scores based on vital signs
- Generates health alerts for high-risk metrics
- Stores data securely in your database

## Risk Scoring System

The platform calculates health risk scores based on:

- **Heart Rate**: Normal range 60-100 bpm
- **Blood Pressure**: Normal <120/80 mmHg
- **Oxygen Saturation**: Normal >95%
- **Temperature**: Normal 97-99°F
- **Stress Level**: Scale of 1-10

Risk levels: **Low** (0-3 points), **Medium** (4-6 points), **High** (7+ points)

## AI Medical Assistant

The AI chatbot provides:
- Symptom analysis with follow-up questions
- Disease prediction with severity assessment
- India-specific medical recommendations
- Emergency service guidance
- Cultural sensitivity for Indian healthcare context

**Important**: The AI assistant is not a replacement for professional medical advice. Always consult qualified healthcare providers for proper diagnosis and treatment.

## Emergency Contacts (India)

- **Ambulance**: 108
- **Medical Helpline**: 104
- **Police**: 100
- **Mental Health**: 080-46110007
- **Women Helpline**: 1091
- **Child Helpline**: 1098
- **Senior Citizen Helpline**: 14567

## Security

- Row Level Security (RLS) enabled on all tables
- User authentication via Supabase Auth
- Secure password hashing
- Protected API routes
- HTTPS-only in production

## Contributing

This is a v0-generated project. To modify:
1. Use v0.app to make changes via AI
2. Download and customize locally
3. Deploy via Vercel

## License

Created with v0 by Vercel

## Support

For medical emergencies, call 108 immediately.

For technical support, visit vercel.com/help
