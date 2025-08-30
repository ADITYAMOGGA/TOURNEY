import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTournamentSchema, insertTournamentRegistrationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Tournament routes
  app.get("/api/tournaments", async (req, res) => {
    try {
      const { status, organizerId } = req.query;
      let tournaments;
      
      if (organizerId && typeof organizerId === 'string') {
        tournaments = await storage.getTournamentsByOrganizer(organizerId);
      } else if (status && typeof status === 'string') {
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
      console.log('Raw request body:', JSON.stringify(req.body, null, 2));
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
        if (!validatedData.matchCount) validatedData.matchCount = 1;
        if (!validatedData.killPoints) validatedData.killPoints = 1;
        if (!validatedData.positionPoints) validatedData.positionPoints = "10,6,5,4,3,2,1";
      } else if (validatedData.gameMode === 'CS') {
        // Set defaults for CS tournaments
        validatedData.matchCount = 1;
        validatedData.killPoints = 0;
        validatedData.positionPoints = "";
        if (!validatedData.csGameVariant) validatedData.csGameVariant = "Limited";
        if (!validatedData.device) validatedData.device = "Both";
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
      
      // Enhanced validation with new required fields
      const validatedData = insertTournamentRegistrationSchema.parse({
        tournamentId,
        userId: req.body.userId,
        teamName: req.body.teamName,
        iglRealName: req.body.iglRealName,
        iglIngameId: req.body.iglIngameId,
        playerNames: req.body.playerNames || null,
        registrationFee: tournament.slotPrice, // Use tournament slot price as registration fee
        paymentStatus: 'pending',
        paymentMethod: req.body.paymentMethod || 'fake_payment'
      });
      
      const registration = await storage.createTournamentRegistration(validatedData);
      res.status(201).json(registration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Registration validation errors:', error.errors);
        return res.status(400).json({ message: "Invalid registration data", errors: error.errors });
      }
      console.error('Registration error:', error);
      res.status(500).json({ message: "Failed to register for tournament" });
    }
  });

  // Fake payment processing endpoint
  app.post("/api/registrations/:id/payment", async (req, res) => {
    try {
      const registrationId = req.params.id;
      const { paymentMethod } = req.body;
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Fake payment success (90% success rate for demo)
      const paymentSuccess = Math.random() > 0.1;
      
      const paymentStatus = paymentSuccess ? 'completed' : 'failed';
      
      // In a real implementation, you would update the registration payment status
      // For now, we'll just return the payment result
      res.json({
        success: paymentSuccess,
        status: paymentStatus,
        paymentMethod,
        transactionId: `fake_txn_${Date.now()}`,
        message: paymentSuccess ? 'Payment completed successfully!' : 'Payment failed. Please try again.'
      });
    } catch (error) {
      res.status(500).json({ message: "Payment processing failed" });
    }
  });

  // Organizer dashboard endpoint to get all registrations for their tournaments
  app.get("/api/organizer/:organizerId/registrations", async (req, res) => {
    try {
      const organizerId = req.params.organizerId;
      
      // Get all tournaments by this organizer
      const tournaments = await storage.getTournamentsByOrganizer(organizerId);
      
      // Get registrations for all their tournaments
      const allRegistrations = [];
      for (const tournament of tournaments) {
        const registrations = await storage.getTournamentRegistrations(tournament.id);
        // Add tournament info to each registration
        const enrichedRegistrations = registrations.map(reg => ({
          ...reg,
          tournament: {
            id: tournament.id,
            name: tournament.name,
            gameMode: tournament.gameMode,
            type: tournament.type,
            prizePool: tournament.prizePool
          }
        }));
        allRegistrations.push(...enrichedRegistrations);
      }
      
      res.json(allRegistrations);
    } catch (error) {
      console.error('Organizer registrations error:', error);
      res.status(500).json({ message: "Failed to fetch organizer registrations" });
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

  // Tournament banner endpoint
  app.get("/api/tournament-banner/:id", async (req, res) => {
    try {
      const tournamentId = req.params.id;
      
      // Define banner mappings based on tournament characteristics
      const bannerImages = [
        "attached_assets/generated_images/Free_Fire_tournament_banner_e86d45aa.png",
        "attached_assets/generated_images/Cyberpunk_esports_tournament_banner_f9c856c1.png",
        "attached_assets/generated_images/Battle_royale_tournament_banner_e3dc8650.png"
      ];
      
      // Use hash of tournament ID to consistently select the same banner for each tournament
      const hash = tournamentId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const selectedBanner = bannerImages[hash % bannerImages.length];
      
      res.sendFile(selectedBanner, { root: process.cwd() });
    } catch (error) {
      console.error('Error serving tournament banner:', error);
      res.status(404).json({ message: "Banner not found" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
