
-- Create function to increment message count
CREATE OR REPLACE FUNCTION increment_message_count(p_sender_id uuid, p_receiver_id uuid)
RETURNS void AS $$
BEGIN
  INSERT INTO message_limits (sender_id, receiver_id, message_count, created_at, updated_at)
  VALUES (p_sender_id, p_receiver_id, 1, now(), now())
  ON CONFLICT (sender_id, receiver_id)
  DO UPDATE SET 
    message_count = message_limits.message_count + 1,
    updated_at = now();
END;
$$ LANGUAGE plpgsql;
