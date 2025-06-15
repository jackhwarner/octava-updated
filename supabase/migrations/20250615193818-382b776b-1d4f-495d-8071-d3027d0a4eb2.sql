
-- Enable RLS (row-level security) on the notifications table in case it isn't already enabled
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow users to insert notifications for themselves
DROP POLICY IF EXISTS "Users can create notifications" ON notifications;
CREATE POLICY "Users can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (user_id = auth.uid());

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

