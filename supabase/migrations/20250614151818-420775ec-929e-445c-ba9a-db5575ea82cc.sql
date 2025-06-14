
-- Drop the existing followers table since we're replacing it with connection requests
DROP TABLE IF EXISTS followers CASCADE;

-- Update connection_requests table to have proper structure
ALTER TABLE connection_requests DROP CONSTRAINT IF EXISTS connection_requests_receiver_id_fkey;
ALTER TABLE connection_requests DROP CONSTRAINT IF EXISTS connection_requests_sender_id_fkey;

-- Add proper foreign key constraints to profiles table
ALTER TABLE connection_requests 
ADD CONSTRAINT connection_requests_sender_id_fkey 
FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE connection_requests 
ADD CONSTRAINT connection_requests_receiver_id_fkey 
FOREIGN KEY (receiver_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Ensure connection_requests has all needed columns
ALTER TABLE connection_requests 
ADD COLUMN IF NOT EXISTS message TEXT;

-- Update connections table to use profiles references
ALTER TABLE connections DROP CONSTRAINT IF EXISTS connections_user1_id_fkey;
ALTER TABLE connections DROP CONSTRAINT IF EXISTS connections_user2_id_fkey;

ALTER TABLE connections 
ADD CONSTRAINT connections_user1_id_fkey 
FOREIGN KEY (user1_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE connections 
ADD CONSTRAINT connections_user2_id_fkey 
FOREIGN KEY (user2_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Add RLS policies for connection_requests
ALTER TABLE connection_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own connection requests" ON connection_requests;
CREATE POLICY "Users can view their own connection requests"
    ON connection_requests FOR SELECT
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can create connection requests" ON connection_requests;
CREATE POLICY "Users can create connection requests"
    ON connection_requests FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

DROP POLICY IF EXISTS "Users can update their own connection requests" ON connection_requests;
CREATE POLICY "Users can update their own connection requests"
    ON connection_requests FOR UPDATE
    USING (auth.uid() = receiver_id OR auth.uid() = sender_id);

-- Add RLS policies for connections
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own connections" ON connections;
CREATE POLICY "Users can view their own connections"
    ON connections FOR SELECT
    USING (auth.uid() = user1_id OR auth.uid() = user2_id);

DROP POLICY IF EXISTS "Users can create connections" ON connections;
CREATE POLICY "Users can create connections"
    ON connections FOR INSERT
    WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

DROP POLICY IF EXISTS "Users can delete their own connections" ON connections;
CREATE POLICY "Users can delete their own connections"
    ON connections FOR DELETE
    USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Update the trigger function to create connections when requests are accepted
CREATE OR REPLACE FUNCTION handle_connection_request_acceptance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
        -- Create connection (ensure user1_id < user2_id for consistency)
        INSERT INTO connections (user1_id, user2_id)
        VALUES (
            CASE WHEN NEW.sender_id < NEW.receiver_id THEN NEW.sender_id ELSE NEW.receiver_id END,
            CASE WHEN NEW.sender_id < NEW.receiver_id THEN NEW.receiver_id ELSE NEW.sender_id END
        )
        ON CONFLICT DO NOTHING;
        
        -- Create notification for sender
        INSERT INTO notifications (user_id, type, actor_id, created_at, read)
        VALUES (NEW.sender_id, 'connection_accepted', NEW.receiver_id, NOW(), false);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS on_connection_request_accepted ON connection_requests;
CREATE TRIGGER on_connection_request_accepted
    AFTER UPDATE ON connection_requests
    FOR EACH ROW
    EXECUTE FUNCTION handle_connection_request_acceptance();

-- Create message limits table for non-connected users
CREATE TABLE IF NOT EXISTS message_limits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    message_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(sender_id, receiver_id)
);

-- Enable RLS on message_limits
ALTER TABLE message_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own message limits" ON message_limits;
CREATE POLICY "Users can view their own message limits"
    ON message_limits FOR SELECT
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

DROP POLICY IF EXISTS "Users can update their own message limits" ON message_limits;
CREATE POLICY "Users can update their own message limits"
    ON message_limits FOR ALL
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_connection_requests_sender ON connection_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_connection_requests_receiver ON connection_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_connection_requests_status ON connection_requests(status);
CREATE INDEX IF NOT EXISTS idx_connections_user1 ON connections(user1_id);
CREATE INDEX IF NOT EXISTS idx_connections_user2 ON connections(user2_id);
CREATE INDEX IF NOT EXISTS idx_message_limits_sender_receiver ON message_limits(sender_id, receiver_id);
