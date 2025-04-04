
CREATE TABLE IF NOT EXISTS public.feedback_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_feedback TEXT NOT NULL,
  action_items JSONB NOT NULL,
  tone_analysis JSONB NOT NULL,
  summary TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_feedback_analysis_created_at ON public.feedback_analysis(created_at);

-- Enable Row Level Security
ALTER TABLE public.feedback_analysis ENABLE ROW LEVEL SECURITY;

-- Create policy to allow admins to see all feedback analysis
CREATE POLICY "Admins can see all feedback analysis" 
  ON public.feedback_analysis 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

-- Create policy to allow any authenticated user to create feedback analysis
CREATE POLICY "Users can create feedback analysis" 
  ON public.feedback_analysis 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);
