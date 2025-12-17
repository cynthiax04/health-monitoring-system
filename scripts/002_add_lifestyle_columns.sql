-- Add lifestyle and demographic columns to health_metrics table
-- This migration adds comprehensive lifestyle data columns to support 
-- risk prediction based on daily habits and health behaviors

ALTER TABLE public.health_metrics 
ADD COLUMN IF NOT EXISTS age INTEGER,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS bmi DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS sleep_duration TEXT,
ADD COLUMN IF NOT EXISTS physical_activity TEXT,
ADD COLUMN IF NOT EXISTS smoking TEXT,
ADD COLUMN IF NOT EXISTS alcohol TEXT,
ADD COLUMN IF NOT EXISTS water_intake TEXT,
ADD COLUMN IF NOT EXISTS chronic_diseases TEXT,
ADD COLUMN IF NOT EXISTS recent_symptoms TEXT,
ADD COLUMN IF NOT EXISTS family_history TEXT,
ADD COLUMN IF NOT EXISTS stress_frequency TEXT,
ADD COLUMN IF NOT EXISTS anxiety_depression TEXT,
ADD COLUMN IF NOT EXISTS junk_food_frequency TEXT,
ADD COLUMN IF NOT EXISTS sugary_drinks TEXT,
ADD COLUMN IF NOT EXISTS exercise TEXT,
ADD COLUMN IF NOT EXISTS step_count TEXT,
ADD COLUMN IF NOT EXISTS screen_time TEXT,
ADD COLUMN IF NOT EXISTS blood_sugar INTEGER,
ADD COLUMN IF NOT EXISTS risk_factors TEXT;

-- Create index for faster queries on risk level
CREATE INDEX IF NOT EXISTS idx_health_metrics_risk_level ON public.health_metrics(risk_level);
CREATE INDEX IF NOT EXISTS idx_health_metrics_user_recorded ON public.health_metrics(user_id, recorded_at DESC);
