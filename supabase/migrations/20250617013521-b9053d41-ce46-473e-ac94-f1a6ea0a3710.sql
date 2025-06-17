
-- Fix the RLS policy for notifications table
-- The connections table uses user1_id and user2_id, not connected_user_id

-- Drop the existing policy
DROP POLICY IF EXISTS "Users can create notifications" ON notifications;

-- Create the corrected policy
CREATE POLICY "Users can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (
    -- Allow users to create notifications for themselves
    user_id = auth.uid()
    OR
    -- Allow users to create notifications for users they are connected with
    EXISTS (
      SELECT 1 FROM connections
      WHERE ((user1_id = auth.uid() AND user2_id = notifications.user_id)
      OR (user2_id = auth.uid() AND user1_id = notifications.user_id))
    )
    OR
    -- Allow users to create notifications for users in the same thread
    EXISTS (
      SELECT 1 FROM thread_participants tp1
      JOIN thread_participants tp2 ON tp1.thread_id = tp2.thread_id
      WHERE tp1.user_id = auth.uid()
      AND tp2.user_id = notifications.user_id
      AND tp1.left_at IS NULL
      AND tp2.left_at IS NULL
    )
  );
