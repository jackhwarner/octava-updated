
-- Create the followers table only if it does not exist
CREATE TABLE IF NOT EXISTS public.followers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE (follower_id, following_id)
);

-- Enable RLS
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see who they follow and who follows them
CREATE POLICY "Users can view their own follower relationships"
  ON public.followers
  FOR SELECT
  USING (
    follower_id = auth.uid() OR following_id = auth.uid()
  );

-- Policy: Users can follow others as themselves
CREATE POLICY "Users can follow as themselves"
  ON public.followers
  FOR INSERT
  WITH CHECK (
    follower_id = auth.uid()
  );

-- Policy: Users can unfollow/delete as themselves
CREATE POLICY "Users can unfollow as themselves"
  ON public.followers
  FOR DELETE
  USING (
    follower_id = auth.uid()
  );
