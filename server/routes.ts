import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTournamentSchema, insertTournamentRegistrationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Tournament routes
  app.get("/api/tournaments", async (req, res) => {
    try {
      const { status } = req.query;
      let tournaments;
      
      if (status && typeof status === 'string') {
        tournaments = await storage.getTournamentsByStatus(status);
      } else {
        tournaments = await storage.getAllTournaments();
      }
      
      res.json(tournaments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tournaments" });
    }
  });

  app.get("/api/tournaments/:id", async (req, res) => {
    try {
      const tournament = await storage.getTournament(req.params.id);
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      res.json(tournament);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tournament" });
    }
  });

  app.post("/api/tournaments", async (req, res) => {
    try {
      const validatedData = insertTournamentSchema.parse(req.body);
      
      // Auto-generate format based on gameMode and type
      if (!validatedData.format) {
        validatedData.format = `${validatedData.gameMode} ${validatedData.type.toUpperCase()}`;
      }
      
      // Auto-generate description if not provided
      if (!validatedData.description) {
        validatedData.description = `${validatedData.gameMode === 'BR' ? 'Battle Royale' : 'Clash Squad'} ${validatedData.type} tournament`;
      }
      
      // Set defaults based on game mode
      if (validatedData.gameMode === 'BR') {
        // Set defaults for BR tournaments
        validatedData.matchCount = validatedData.matchCount || 1;
        validatedData.killPoints = validatedData.killPoints || 1;
        validatedData.positionPoints = validatedData.positionPoints || "10,6,5,4,3,2,1";
        // Clear CS-specific fields
        validatedData.csGameVariant = undefined;
        validatedData.device = undefined;
      } else if (validatedData.gameMode === 'CS') {
        // Set defaults for CS tournaments
        validatedData.matchCount = 1;
        validatedData.killPoints = 0;
        validatedData.positionPoints = "";
        // Ensure CS-specific fields have values
        validatedData.csGameVariant = validatedData.csGameVariant || "Limited";
        validatedData.device = validatedData.device || "Both";
      }
      
      const tournament = await storage.createTournament(validatedData);
      res.status(201).json(tournament);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation errors:', error.errors);
        console.error('Request body:', req.body);
        return res.status(400).json({ message: "Invalid tournament data", errors: error.errors });
      }
      console.error('Tournament creation error:', error);
      res.status(500).json({ message: "Failed to create tournament", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.post("/api/tournaments/:id/register", async (req, res) => {
    try {
      const tournamentId = req.params.id;
      const tournament = await storage.getTournament(tournamentId);
      
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      
      if (tournament.registeredPlayers >= tournament.slots) {
        return res.status(400).json({ message: "Tournament is full" });
      }
      
      if (tournament.status !== "open") {
        return res.status(400).json({ message: "Tournament registration is closed" });
      }
      
      const validatedData = insertTournamentRegistrationSchema.parse({
        ...req.body,
        tournamentId
      });
      
      const registration = await storage.createTournamentRegistration(validatedData);
      res.status(201).json(registration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid registration data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register for tournament" });
    }
  });

  app.get("/api/tournaments/:id/registrations", async (req, res) => {
    try {
      const registrations = await storage.getTournamentRegistrations(req.params.id);
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tournament registrations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
