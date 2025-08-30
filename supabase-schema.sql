-- GARENA x TOURNEY - Free Fire Tournament Platform
-- Supabase Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'player' CHECK (role IN ('player', 'organizer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced tournaments table for Free Fire
CREATE TABLE IF NOT EXISTS tournaments (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    game_mode TEXT NOT NULL CHECK (game_mode IN ('BR', 'CS')), -- BR/FULLMAP or CS/CLASH SQUAD
    type TEXT NOT NULL CHECK (type IN ('solo', 'duo', 'squad')), -- Team type
    format TEXT NOT NULL, -- "BR Solo", "BR Duo", "BR Squad", "CS Solo", etc.
    prize_pool INTEGER NOT NULL DEFAULT 0,
    slot_price INTEGER NOT NULL DEFAULT 0, -- Entry fee per slot
    slots INTEGER NOT NULL, -- Total number of slots/players
    registered_players INTEGER NOT NULL DEFAULT 0,
    match_count INTEGER NOT NULL DEFAULT 1, -- Number of matches in tournament
    kill_points INTEGER NOT NULL DEFAULT 1, -- Points awarded per kill
    position_points TEXT NOT NULL DEFAULT '10,6,5,4,3,2,1', -- Points for positions 1st,2nd,3rd,etc
    rules TEXT, -- Tournament rules and guidelines
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'starting', 'live', 'completed')),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    registration_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    organizer_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enhanced tournament registrations table
CREATE TABLE IF NOT EXISTS tournament_registrations (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    tournament_id VARCHAR NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
    user_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    team_name TEXT NOT NULL, -- Team name (required)
    igl_real_name TEXT NOT NULL, -- IGL (In-Game Leader) real name
    igl_ingame_id TEXT NOT NULL, -- IGL in-game ID
    player_names TEXT[], -- Array of player names for teams
    registration_fee INTEGER NOT NULL, -- Registration fee amount
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
    payment_method TEXT, -- Payment method used (fake_payment, upi, card, etc.)
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(tournament_id, user_id) -- Prevent duplicate registrations
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tournaments_game_mode ON tournaments(game_mode);
CREATE INDEX IF NOT EXISTS idx_tournaments_type ON tournaments(type);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_start_time ON tournaments(start_time);
CREATE INDEX IF NOT EXISTS idx_tournaments_organizer ON tournaments(organizer_id);
CREATE INDEX IF NOT EXISTS idx_registrations_tournament ON tournament_registrations(tournament_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON tournament_registrations(user_id);

-- Sample data for testing (optional)
-- INSERT INTO users (username, password, role) VALUES 
-- ('admin', 'hashed_password', 'organizer'),
-- ('player1', 'hashed_password', 'player');

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE tournament_registrations ENABLE ROW LEVEL SECURITY;

-- Users can view their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid()::text = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid()::text = id);

-- Anyone can view tournaments
CREATE POLICY "Anyone can view tournaments" ON tournaments
    FOR SELECT TO public USING (true);

-- Only organizers can create tournaments
CREATE POLICY "Organizers can create tournaments" ON tournaments
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid()::text 
            AND users.role = 'organizer'
        )
    );

-- Organizers can update their own tournaments
CREATE POLICY "Organizers can update own tournaments" ON tournaments
    FOR UPDATE USING (organizer_id = auth.uid()::text);

-- Anyone can view tournament registrations
CREATE POLICY "Anyone can view registrations" ON tournament_registrations
    FOR SELECT TO public USING (true);

-- Users can register for tournaments
CREATE POLICY "Users can register for tournaments" ON tournament_registrations
    FOR INSERT WITH CHECK (user_id = auth.uid()::text);

-- Users can update their own registrations
CREATE POLICY "Users can update own registrations" ON tournament_registrations
    FOR UPDATE USING (user_id = auth.uid()::text);