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
    return (data as Tournament[]) || [];
  }

  async getTournamentsByStatus(status: string): Promise<Tournament[]> {
    const { data } = await supabase.from('tournaments').select('*').eq('status', status).order('created_at', { ascending: false });
    return (data as Tournament[]) || [];
  }

  async createTournament(insertTournament: InsertTournament): Promise<Tournament> {
    const { data, error } = await supabase.from('tournaments').insert(insertTournament).select().single();
    if (error) throw error;
    return data as Tournament;
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
