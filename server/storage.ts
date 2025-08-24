import { type User, type InsertUser, type Tournament, type InsertTournament, type TournamentRegistration, type InsertTournamentRegistration, users, tournaments, tournamentRegistrations } from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

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

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private tournaments: Map<string, Tournament>;
  private tournamentRegistrations: Map<string, TournamentRegistration>;

  constructor() {
    this.users = new Map();
    this.tournaments = new Map();
    this.tournamentRegistrations = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTournament(id: string): Promise<Tournament | undefined> {
    return this.tournaments.get(id);
  }

  async getAllTournaments(): Promise<Tournament[]> {
    return Array.from(this.tournaments.values());
  }

  async getTournamentsByStatus(status: string): Promise<Tournament[]> {
    return Array.from(this.tournaments.values()).filter(
      tournament => tournament.status === status
    );
  }

  async createTournament(insertTournament: InsertTournament): Promise<Tournament> {
    const id = randomUUID();
    const tournament: Tournament = {
      ...insertTournament,
      id,
      description: insertTournament.description ?? null,
      status: insertTournament.status ?? "open",
      registeredPlayers: 0,
      createdAt: new Date(),
    };
    this.tournaments.set(id, tournament);
    return tournament;
  }

  async updateTournament(id: string, updates: Partial<Tournament>): Promise<Tournament | undefined> {
    const tournament = this.tournaments.get(id);
    if (!tournament) return undefined;
    
    const updatedTournament = { ...tournament, ...updates };
    this.tournaments.set(id, updatedTournament);
    return updatedTournament;
  }

  async getTournamentRegistrations(tournamentId: string): Promise<TournamentRegistration[]> {
    return Array.from(this.tournamentRegistrations.values()).filter(
      registration => registration.tournamentId === tournamentId
    );
  }

  async createTournamentRegistration(insertRegistration: InsertTournamentRegistration): Promise<TournamentRegistration> {
    const id = randomUUID();
    const registration: TournamentRegistration = {
      ...insertRegistration,
      id,
      teamName: insertRegistration.teamName ?? null,
      playerNames: insertRegistration.playerNames ?? null,
      registeredAt: new Date(),
    };
    this.tournamentRegistrations.set(id, registration);
    
    // Update tournament registered players count
    const tournament = await this.getTournament(insertRegistration.tournamentId);
    if (tournament) {
      await this.updateTournament(tournament.id, {
        registeredPlayers: tournament.registeredPlayers + 1
      });
    }
    
    return registration;
  }

  async getUserTournamentRegistrations(userId: string): Promise<TournamentRegistration[]> {
    return Array.from(this.tournamentRegistrations.values()).filter(
      registration => registration.userId === userId
    );
  }
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
    await db.update(tournaments)
      .set({ registeredPlayers: db.select({ count: tournaments.registeredPlayers }).from(tournaments).where(eq(tournaments.id, insertRegistration.tournamentId)) })
      .where(eq(tournaments.id, insertRegistration.tournamentId));
    
    return result[0];
  }

  async getUserTournamentRegistrations(userId: string): Promise<TournamentRegistration[]> {
    return await db.select().from(tournamentRegistrations).where(eq(tournamentRegistrations.userId, userId));
  }
}

export const storage = new DbStorage();
