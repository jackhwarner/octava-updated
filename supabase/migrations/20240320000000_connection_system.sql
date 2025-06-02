-- Create connection_requests table
CREATE TABLE IF NOT EXISTS connection_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    message TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(sender_id, receiver_id, status)
);

-- Create connections table
CREATE TABLE IF NOT EXISTS connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    user2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user1_id, user2_id)
);

-- Add RLS policies for connection_requests
ALTER TABLE connection_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own connection requests"
    ON connection_requests FOR SELECT
    USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create connection requests"
    ON connection_requests FOR INSERT
    WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their own connection requests"
    ON connection_requests FOR UPDATE
    USING (auth.uid() = receiver_id);

-- Add RLS policies for connections
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own connections"
    ON connections FOR SELECT
    USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create connections"
    ON connections FOR INSERT
    WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can delete their own connections"
    ON connections FOR DELETE
    USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Create function to handle connection request acceptance
CREATE OR REPLACE FUNCTION handle_connection_request_acceptance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'accepted' AND OLD.status = 'pending' THEN
        -- Create connection
        INSERT INTO connections (user1_id, user2_id)
        VALUES (NEW.sender_id, NEW.receiver_id);
        
        -- Create notification for sender
        INSERT INTO notifications (user_id, type, actor_id, created_at, read)
        VALUES (NEW.sender_id, 'connection_accepted', NEW.receiver_id, NOW(), false);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for connection request acceptance
CREATE TRIGGER on_connection_request_accepted
    AFTER UPDATE ON connection_requests
    FOR EACH ROW
    EXECUTE FUNCTION handle_connection_request_acceptance();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_connection_requests_sender ON connection_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_connection_requests_receiver ON connection_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_connection_requests_status ON connection_requests(status);
CREATE INDEX IF NOT EXISTS idx_connections_user1 ON connections(user1_id);
CREATE INDEX IF NOT EXISTS idx_connections_user2 ON connections(user2_id); 