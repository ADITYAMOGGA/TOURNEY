-- Migration to add promotion features to tournaments table
-- Run these queries in your Supabase SQL editor

-- Add promotion columns to tournaments table
ALTER TABLE tournaments 
ADD COLUMN IF NOT EXISTS is_promoted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS promotion_paid BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS promotion_amount INTEGER DEFAULT 0;

-- Add device column for CS tournaments
ALTER TABLE tournaments 
ADD COLUMN IF NOT EXISTS device TEXT CHECK (device IN ('PC', 'Mobile', 'Both'));

-- Add CS game variant column
ALTER TABLE tournaments 
ADD COLUMN IF NOT EXISTS cs_game_variant TEXT CHECK (cs_game_variant IN ('Limited', 'Unlimited', 'Contra', 'StateWar'));

-- Create index for promoted tournaments for better performance
CREATE INDEX IF NOT EXISTS idx_tournaments_promoted ON tournaments(is_promoted, promotion_paid);

-- Update existing sample tournament to be promoted
UPDATE tournaments 
SET is_promoted = TRUE, promotion_paid = TRUE, promotion_amount = 100, device = 'Both'
WHERE name = 'ALPHA LEGENDS CHAMPIONSHIP';

-- Optional: Create a view for promoted tournaments
CREATE OR REPLACE VIEW promoted_tournaments AS
SELECT * FROM tournaments 
WHERE is_promoted = TRUE AND promotion_paid = TRUE
ORDER BY created_at DESC;

-- Grant access to the view
GRANT SELECT ON promoted_tournaments TO public;

-- Update RLS policies to allow promotion fields
CREATE POLICY "Organizers can promote tournaments" ON tournaments
    FOR UPDATE USING (organizer_id = auth.uid()::text);

-- Create function to get promoted tournaments (for API endpoint)
CREATE OR REPLACE FUNCTION get_promoted_tournaments()
RETURNS TABLE (
    id VARCHAR,
    name TEXT,
    description TEXT,
    game_mode TEXT,
    type TEXT,
    format TEXT,
    prize_pool INTEGER,
    slot_price INTEGER,
    slots INTEGER,
    registered_players INTEGER,
    match_count INTEGER,
    kill_points INTEGER,
    position_points TEXT,
    device TEXT,
    cs_game_variant TEXT,
    rules TEXT,
    status TEXT,
    start_time TIMESTAMP WITH TIME ZONE,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    organizer_id VARCHAR,
    created_at TIMESTAMP WITH TIME ZONE,
    is_promoted BOOLEAN,
    promotion_paid BOOLEAN,
    promotion_amount INTEGER
) 
LANGUAGE sql
AS $$
    SELECT * FROM tournaments 
    WHERE is_promoted = TRUE AND promotion_paid = TRUE
    ORDER BY created_at DESC;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION get_promoted_tournaments() TO public;