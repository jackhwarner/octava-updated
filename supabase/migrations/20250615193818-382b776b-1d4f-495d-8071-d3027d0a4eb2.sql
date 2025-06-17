-- Enable RLS (row-level security) on the notifications table in case it isn't already enabled
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow users to insert notifications for themselves or for users they have permission to notify
DROP POLICY IF EXISTS "Users can create notifications" ON notifications;
CREATE POLICY "Users can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (
    -- Allow users to create notifications for themselves
    user_id = auth.uid()
    OR
    -- Allow users to create notifications for users they are connected with
    EXISTS (
      SELECT 1 FROM connections
      WHERE (user_id = auth.uid() AND connected_user_id = notifications.user_id)
      OR (connected_user_id = auth.uid() AND user_id = notifications.user_id)
      AND status = 'accepted'
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

-- Allow users to select (view) their own notifications only
DROP POLICY IF EXISTS "Users can view their own notifications" ON notifications;
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Allow users to update (mark as read) their own notifications
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

