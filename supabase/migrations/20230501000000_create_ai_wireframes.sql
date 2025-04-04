
CREATE TABLE IF NOT EXISTS public.ai_wireframes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT NOT NULL,
  prompt TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  generation_params JSONB,
  feedback TEXT,
  rating INTEGER,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_ai_wireframes_project_id ON public.ai_wireframes(project_id);
CREATE INDEX IF NOT EXISTS idx_ai_wireframes_created_at ON public.ai_wireframes(created_at);
