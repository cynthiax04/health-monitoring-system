-- Health monitoring system tables

-- User profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  age INTEGER,
  gender TEXT,
  phone TEXT,
  emergency_contact TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wearable device connections
CREATE TABLE IF NOT EXISTS public.wearable_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_name TEXT NOT NULL,
  device_type TEXT NOT NULL,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_sync TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT TRUE
);

-- Health metrics from wearables
CREATE TABLE IF NOT EXISTS public.health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id UUID REFERENCES public.wearable_devices(id) ON DELETE SET NULL,
  heart_rate INTEGER,
  blood_pressure_systolic INTEGER,
  blood_pressure_diastolic INTEGER,
  oxygen_saturation DECIMAL(5,2),
  temperature DECIMAL(5,2),
  steps INTEGER,
  calories_burned INTEGER,
  sleep_hours DECIMAL(4,2),
  stress_level INTEGER,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  risk_score DECIMAL(5,2),
  risk_level TEXT
);

-- AI symptom checker conversations
CREATE TABLE IF NOT EXISTS public.symptom_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symptoms TEXT NOT NULL,
  ai_analysis TEXT,
  predicted_conditions TEXT[],
  severity_level TEXT,
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Health alerts and notifications
CREATE TABLE IF NOT EXISTS public.health_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  message TEXT NOT NULL,
  metric_value TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wearable_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.health_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can delete own profile" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- RLS Policies for wearable_devices
CREATE POLICY "Users can view own devices" ON public.wearable_devices FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own devices" ON public.wearable_devices FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own devices" ON public.wearable_devices FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own devices" ON public.wearable_devices FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for health_metrics
CREATE POLICY "Users can view own metrics" ON public.health_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own metrics" ON public.health_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own metrics" ON public.health_metrics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own metrics" ON public.health_metrics FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for symptom_chats
CREATE POLICY "Users can view own chats" ON public.symptom_chats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own chats" ON public.symptom_chats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own chats" ON public.symptom_chats FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for health_alerts
CREATE POLICY "Users can view own alerts" ON public.health_alerts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own alerts" ON public.health_alerts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own alerts" ON public.health_alerts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own alerts" ON public.health_alerts FOR DELETE USING (auth.uid() = user_id);

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
