-- ====================================
-- زهقان | Zawhan — Database Schema
-- ====================================
-- شغّل هذا الملف في Supabase SQL Editor
-- (Authentication → SQL Editor → New Query)
-- ====================================

-- جدول بيانات المستخدم
-- يحتوي كل ما يحفظه المستخدم في localStorage
CREATE TABLE IF NOT EXISTS public.user_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  completed_tasks JSONB DEFAULT '[]'::jsonb,
  total_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date TEXT DEFAULT '',
  unlocked_achievements JSONB DEFAULT '[]'::jsonb,
  preferred_categories JSONB DEFAULT '{}'::jsonb,
  sound_enabled BOOLEAN DEFAULT true,
  available_tools JSONB DEFAULT '[]'::jsonb,
  active_challenge TEXT,
  challenge_progress JSONB DEFAULT '{}'::jsonb,
  last_quiz_type TEXT,
  last_quiz_date TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) - كل مستخدم يرى بياناته فقط
ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;

-- سياسة: المستخدم يقدر يقرأ بياناته فقط
DROP POLICY IF EXISTS "Users can read own data" ON public.user_data;
CREATE POLICY "Users can read own data"
  ON public.user_data
  FOR SELECT
  USING (auth.uid() = user_id);

-- سياسة: المستخدم يقدر يُحدّث بياناته فقط
DROP POLICY IF EXISTS "Users can update own data" ON public.user_data;
CREATE POLICY "Users can update own data"
  ON public.user_data
  FOR UPDATE
  USING (auth.uid() = user_id);

-- سياسة: المستخدم يقدر يُنشئ بياناته
DROP POLICY IF EXISTS "Users can insert own data" ON public.user_data;
CREATE POLICY "Users can insert own data"
  ON public.user_data
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- تحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_data_updated_at ON public.user_data;
CREATE TRIGGER update_user_data_updated_at
  BEFORE UPDATE ON public.user_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ====================================
-- مكتمل! ✨
-- ====================================
