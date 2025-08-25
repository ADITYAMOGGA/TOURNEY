import { type User, type InsertUser, type Tournament, type InsertTournament, type TournamentRegistration, type InsertTournamentRegistration, users, tournaments, tournamentRegistrations } from "@shared/schema";
import { createClient } from "@supabase/supabase-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY are required");
}

// Create Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// For now, use Supabase client with mock database storage until connection is resolved
const db = null; // We'll implement proper connection after you run the SQL queries

// Mock storage implementation for development
const mockTournaments: Tournament[] = [];
const mockUsers: User[] = [];
const mockRegistrations: TournamentRegistration[] = [];

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getTournament(id: string): Promise<Tournament | undefined>;
  getAllTournaments(): Promise<Tournament[]>;
  getTournamentsByStatus(status: string): Promise<Tournament[]>;
  createTournament(tournament: InsertTournament): Promise<Tournament>;
  updateTournament(id: string, updates: Partial<Tournament>): Promise<Tournament | undefined>;
  
  getTournamentRegistrations(tournamentId: string): Promise<TournamentRegistration[]>;
  createTournamentRegistration(registration: InsertTournamentRegistration): Promise<TournamentRegistration>;
  getUserTournamentRegistrations(userId: string): Promise<TournamentRegistration[]>;
}


export class DbStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    // Use Supabase client for now
    const { data } = await supabase.from('users').select('*').eq('id', id).single();
    return data as User | undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data } = await supabase.from('users').select('*').eq('username', username).single();
    return data as User | undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data } = await supabase.from('users').insert(insertUser).select().single();
    return data as User;
  }

  async getTournament(id: string): Promise<Tournament | undefined> {
    const { data } = await supabase.from('tournaments').select('*').eq('id', id).single();
    return data as Tournament | undefined;
  }

  async getAllTournaments(): Promise<Tournament[]> {
    const { data } = await supabase.from('tournaments').select('*').order('created_at', { ascending: false });
    if (!data) return [];
    
    // Transform snake_case to camelCase
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      gameMode: item.game_mode,
      type: item.type,
      format: item.format,
      prizePool: item.prize_pool,
      slotPrice: item.slot_price,
      slots: item.slots,
      registeredPlayers: item.registered_players,
      matchCount: item.match_count,
      killPoints: item.kill_points,
      positionPoints: item.position_points,
      csGameVariant: item.cs_game_variant,
      device: item.device,
      rules: item.rules,
      status: item.status,
      startTime: item.start_time,
      registrationDeadline: item.registration_deadline,
      organizerId: item.organizer_id,
      createdAt: item.created_at,
    })) as Tournament[];
  }

  async getTournamentsByStatus(status: string): Promise<Tournament[]> {
    const { data } = await supabase.from('tournaments').select('*').eq('status', status).order('created_at', { ascending: false });
    return (data as Tournament[]) || [];
  }

  async createTournament(insertTournament: InsertTournament): Promise<Tournament> {
    // Transform camelCase to snake_case for Supabase
    const transformedData = {
      name: insertTournament.name,
      description: insertTournament.description,
      game_mode: insertTournament.gameMode,
      type: insertTournament.type,
      format: insertTournament.format,
      prize_pool: insertTournament.prizePool,
      slot_price: insertTournament.slotPrice,
      slots: insertTournament.slots,
      registered_players: 0, // Default value for new tournaments
      match_count: insertTournament.matchCount,
      kill_points: insertTournament.killPoints,
      position_points: insertTournament.positionPoints,
      cs_game_variant: insertTournament.csGameVariant,
      device: insertTournament.device,
      rules: insertTournament.rules,
      status: insertTournament.status || 'open',
      start_time: insertTournament.startTime,
      registration_deadline: insertTournament.registrationDeadline,
      organizer_id: insertTournament.organizerId,
    };

    const { data, error } = await supabase.from('tournaments').insert(transformedData).select().single();
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    // Transform back to camelCase for response
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      gameMode: data.game_mode,
      type: data.type,
      format: data.format,
      prizePool: data.prize_pool,
      slotPrice: data.slot_price,
      slots: data.slots,
      registeredPlayers: data.registered_players,
      matchCount: data.match_count,
      killPoints: data.kill_points,
      positionPoints: data.position_points,
      csGameVariant: data.cs_game_variant,
      device: data.device,
      rules: data.rules,
      status: data.status,
      startTime: data.start_time,
      registrationDeadline: data.registration_deadline,
      organizerId: data.organizer_id,
      createdAt: data.created_at,
    } as Tournament;
  }

  async updateTournament(id: string, updates: Partial<Tournament>): Promise<Tournament | undefined> {
    const { data } = await supabase.from('tournaments').update(updates).eq('id', id).select().single();
    return data as Tournament | undefined;
  }

  async getTournamentRegistrations(tournamentId: string): Promise<TournamentRegistration[]> {
    const { data } = await supabase.from('tournament_registrations').select('*').eq('tournament_id', tournamentId);
    return (data as TournamentRegistration[]) || [];
  }

  async createTournamentRegistration(insertRegistration: InsertTournamentRegistration): Promise<TournamentRegistration> {
    const { data, error } = await supabase.from('tournament_registrations').insert(insertRegistration).select().single();
    if (error) throw error;
    
    // Update tournament registered players count
    const tournament = await this.getTournament(insertRegistration.tournamentId);
    if (tournament) {
      await supabase.from('tournaments')
        .update({ registered_players: tournament.registeredPlayers + 1 })
        .eq('id', insertRegistration.tournamentId);
    }
    
    return data as TournamentRegistration;
  }

  async getUserTournamentRegistrations(userId: string): Promise<TournamentRegistration[]> {
    const { data } = await supabase.from('tournament_registrations').select('*').eq('user_id', userId);
    return (data as TournamentRegistration[]) || [];
  }
}

export const storage = new DbStorage();
