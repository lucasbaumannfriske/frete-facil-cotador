-- Create storage bucket for CTE files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cte-files', 'cte-files', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for CTE files
DO $$
BEGIN
  -- Drop existing policies if they exist
  DROP POLICY IF EXISTS "Users can view their own CTE files" ON storage.objects;
  DROP POLICY IF EXISTS "Users can upload their own CTE files" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their own CTE files" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their own CTE files" ON storage.objects;
END $$;

-- Create storage policies for CTE files
CREATE POLICY "Users can view their own CTE files" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'cte-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own CTE files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'cte-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own CTE files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'cte-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own CTE files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'cte-files' AND auth.uid()::text = (storage.foldername(name))[1]);