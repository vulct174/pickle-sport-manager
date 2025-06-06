import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  phone: text("phone"),
  role: text("role").notNull(), // athlete, organizer, assessor, referee, club_owner, forum_admin
  clubId: integer("club_id"),
  skillLevel: decimal("skill_level", { precision: 2, scale: 1 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clubs = pgTable("clubs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  ownerId: integer("owner_id"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  registrationStartDate: timestamp("registration_start_date").notNull(),
  registrationEndDate: timestamp("registration_end_date").notNull(),
  maxParticipants: integer("max_participants").default(100),
  currentParticipants: integer("current_participants").default(0),
  status: text("status").notNull(), // upcoming, registration, active, completed
  categories: text("categories").array(), // singles_men, singles_women, doubles_men, doubles_women, mixed_doubles
  organizerId: integer("organizer_id").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").notNull(),
  athleteId: integer("athlete_id").notNull(),
  category: text("category").notNull(),
  partnerId: integer("partner_id"), // for doubles categories
  status: text("status").notNull(), // pending, approved, rejected
  skillLevel: decimal("skill_level", { precision: 2, scale: 1 }).notNull(),
  notes: text("notes"),
  registeredAt: timestamp("registered_at").defaultNow(),
  approvedAt: timestamp("approved_at"),
  approvedBy: integer("approved_by"),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").notNull(),
  category: text("category").notNull(),
  round: text("round").notNull(), // round_of_16, quarterfinals, semifinals, finals
  player1Id: integer("player1_id").notNull(),
  player2Id: integer("player2_id"),
  partner1Id: integer("partner1_id"), // for doubles
  partner2Id: integer("partner2_id"), // for doubles
  court: text("court"),
  scheduledTime: timestamp("scheduled_time"),
  status: text("status").notNull(), // scheduled, in_progress, completed, cancelled
  score: jsonb("score"), // {sets: [{player1: 11, player2: 9}, {player1: 8, player2: 11}], winner: 1}
  winnerId: integer("winner_id"),
  refereeId: integer("referee_id"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  athleteId: integer("athlete_id").notNull(),
  tournamentId: integer("tournament_id").notNull(),
  category: text("category").notNull(),
  position: integer("position").notNull(), // 1 for winner, 2 for runner-up, etc.
  points: integer("points").default(0),
  awardedAt: timestamp("awarded_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
}).extend({
  confirmPassword: z.string().min(1, "Xác nhận mật khẩu là bắt buộc"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu không khớp",
  path: ["confirmPassword"],
});

export const insertClubSchema = createInsertSchema(clubs).omit({
  id: true,
  createdAt: true,
});

export const insertTournamentSchema = createInsertSchema(tournaments).omit({
  id: true,
  createdAt: true,
  currentParticipants: true,
});

export const insertRegistrationSchema = createInsertSchema(registrations).omit({
  id: true,
  registeredAt: true,
  approvedAt: true,
  approvedBy: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateScoreSchema = z.object({
  matchId: z.number(),
  score: z.object({
    sets: z.array(z.object({
      player1: z.number().min(0).max(11),
      player2: z.number().min(0).max(11),
    })),
    winner: z.number().optional(),
  }),
  status: z.enum(["in_progress", "completed"]),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Club = typeof clubs.$inferSelect;
export type InsertClub = z.infer<typeof insertClubSchema>;
export type Tournament = typeof tournaments.$inferSelect;
export type InsertTournament = z.infer<typeof insertTournamentSchema>;
export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type UpdateScore = z.infer<typeof updateScoreSchema>;

// Enums for reference
export const UserRoles = {
  ATHLETE: "athlete",
  ORGANIZER: "organizer", 
  ASSESSOR: "assessor",
  REFEREE: "referee",
  CLUB_OWNER: "club_owner",
  FORUM_ADMIN: "forum_admin",
} as const;

export const TournamentStatus = {
  UPCOMING: "upcoming",
  REGISTRATION: "registration",
  ACTIVE: "active",
  COMPLETED: "completed",
} as const;

export const RegistrationStatus = {
  PENDING: "pending",
  APPROVED: "approved", 
  REJECTED: "rejected",
} as const;

export const MatchStatus = {
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const Categories = {
  SINGLES_MEN: "singles_men",
  SINGLES_WOMEN: "singles_women", 
  DOUBLES_MEN: "doubles_men",
  DOUBLES_WOMEN: "doubles_women",
  MIXED_DOUBLES: "mixed_doubles",
} as const;

export const Rounds = {
  ROUND_OF_32: "round_of_32",
  ROUND_OF_16: "round_of_16",
  QUARTERFINALS: "quarterfinals",
  SEMIFINALS: "semifinals",
  FINALS: "finals",
} as const;
