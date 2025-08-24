import { type User, type InsertUser, type Tournament, type InsertTournament, type TournamentRegistration, type InsertTournamentRegistration } from "@shared/schema";
import { randomUUID } from "crypto";

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

export const storage = new MemStorage();
