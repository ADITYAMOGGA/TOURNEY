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

// Extract connection details from Supabase URL for direct PostgreSQL connection
const supabaseUrl = new URL(process.env.SUPABASE_URL);
const projectRef = supabaseUrl.hostname.split('.')[0];
const connectionString = `postgresql://postgres.${projectRef}:${process.env.SUPABASE_ANON_KEY}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;

const client = postgres(connectionString);
const db = drizzle(client);

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
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getTournament(id: string): Promise<Tournament | undefined> {
    const result = await db.select().from(tournaments).where(eq(tournaments.id, id));
    return result[0];
  }

  async getAllTournaments(): Promise<Tournament[]> {
    return await db.select().from(tournaments);
  }

  async getTournamentsByStatus(status: string): Promise<Tournament[]> {
    return await db.select().from(tournaments).where(eq(tournaments.status, status));
  }

  async createTournament(insertTournament: InsertTournament): Promise<Tournament> {
    const result = await db.insert(tournaments).values(insertTournament).returning();
    return result[0];
  }

  async updateTournament(id: string, updates: Partial<Tournament>): Promise<Tournament | undefined> {
    const result = await db.update(tournaments).set(updates).where(eq(tournaments.id, id)).returning();
    return result[0];
  }

  async getTournamentRegistrations(tournamentId: string): Promise<TournamentRegistration[]> {
    return await db.select().from(tournamentRegistrations).where(eq(tournamentRegistrations.tournamentId, tournamentId));
  }

  async createTournamentRegistration(insertRegistration: InsertTournamentRegistration): Promise<TournamentRegistration> {
    const result = await db.insert(tournamentRegistrations).values(insertRegistration).returning();
    
    // Update tournament registered players count
    const tournament = await this.getTournament(insertRegistration.tournamentId);
    if (tournament) {
      await db.update(tournaments)
        .set({ registeredPlayers: tournament.registeredPlayers + 1 })
        .where(eq(tournaments.id, insertRegistration.tournamentId));
    }
    
    return result[0];
  }

  async getUserTournamentRegistrations(userId: string): Promise<TournamentRegistration[]> {
    return await db.select().from(tournamentRegistrations).where(eq(tournamentRegistrations.userId, userId));
  }
}

export const storage = new DbStorage();
