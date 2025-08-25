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
  gameMode: text("game_mode").notNull(), // "BR" or "CS"
  type: text("type").notNull(), // "solo", "duo", "squad" for BR; "1v1", "2v2", "3v3", "4v4" for CS
  format: text("format").notNull(), // "BR Solo", "BR Duo", "BR Squad", "CS 1v1", etc.
  prizePool: integer("prize_pool").notNull(),
  slotPrice: integer("slot_price").notNull(),
  slots: integer("slots").notNull(),
  registeredPlayers: integer("registered_players").notNull().default(0),
  matchCount: integer("match_count").default(1),
  killPoints: integer("kill_points").default(1),
  positionPoints: text("position_points").default("10,6,5,4,3,2,1"), // Points for positions 1,2,3,4,5,6,7+
  // CS-specific fields
  csGameVariant: text("cs_game_variant"), // "Limited", "Unlimited", "Contra", "StateWar"
  device: text("device"), // "PC", "Mobile", "Both"
  rules: text("rules"),
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
}).extend({
  startTime: z.string().transform((str) => new Date(str)),
  registrationDeadline: z.string().transform((str) => new Date(str)),
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
