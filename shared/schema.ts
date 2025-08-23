import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const tournaments = pgTable("tournaments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  type: text("type").notNull(), // "solo", "duo", "squad"
  format: text("format").notNull(), // "BR Solo", "BR Duo", "BR Squad"
  prizePool: integer("prize_pool").notNull(),
  entryFee: integer("entry_fee").notNull(),
  maxPlayers: integer("max_players").notNull(),
  registeredPlayers: integer("registered_players").notNull().default(0),
  status: text("status").notNull().default("open"), // "open", "starting", "live", "completed"
  startTime: timestamp("start_time").notNull(),
  registrationDeadline: timestamp("registration_deadline").notNull(),
  organizerId: varchar("organizer_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const tournamentRegistrations = pgTable("tournament_registrations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tournamentId: varchar("tournament_id").references(() => tournaments.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  teamName: text("team_name"),
  playerNames: text("player_names").array(),
  registeredAt: timestamp("registered_at").default(sql`now()`).notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTournamentSchema = createInsertSchema(tournaments).omit({
  id: true,
  registeredPlayers: true,
  createdAt: true,
});

export const insertTournamentRegistrationSchema = createInsertSchema(tournamentRegistrations).omit({
  id: true,
  registeredAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type Tournament = typeof tournaments.$inferSelect;
export type InsertTournamentRegistration = z.infer<typeof insertTournamentRegistrationSchema>;
export type TournamentRegistration = typeof tournamentRegistrations.$inferSelect;
