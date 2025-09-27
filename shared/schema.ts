import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  decimal,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Donations table
export const donations = pgTable("donations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  charity: varchar("charity").notNull(),
  charityCategory: varchar("charity_category"),
  donationDate: timestamp("donation_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Impact calculations table
export const impactCalculations = pgTable("impact_calculations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  totalDonated: decimal("total_donated", { precision: 12, scale: 2 }).notNull(),
  livesSaved: decimal("lives_saved", { precision: 8, scale: 2 }).notNull(),
  qualysGained: decimal("qualys_gained", { precision: 10, scale: 2 }).notNull(),
  calculatedAt: timestamp("calculated_at").defaultNow(),
});

// User achievements and gamification tracking
export const userAchievements = pgTable("user_achievements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  achievementType: varchar("achievement_type").notNull(), // 'first_donation', 'milestone_100', 'streak_7', etc.
  title: varchar("title").notNull(),
  description: text("description"),
  badgeIcon: varchar("badge_icon"), // lucide icon name
  badgeColor: varchar("badge_color").default("blue"),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

// User progress and streaks
export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  lastDonationDate: timestamp("last_donation_date"),
  totalDonations: integer("total_donations").default(0),
  totalImpactScore: decimal("total_impact_score", { precision: 12, scale: 2 }).default("0"),
  // Impact-based targets (user-configurable)
  livesSavedTarget: decimal("lives_saved_target", { precision: 8, scale: 2 }).default("1.0"),
  qualysGainedTarget: decimal("qualys_gained_target", { precision: 10, scale: 2 }).default("10.0"),
  peopleHelpedTarget: integer("people_helped_target").default(100),
  totalDonatedTarget: decimal("total_donated_target", { precision: 10, scale: 2 }).default("1000.00"),
  // Target toggle settings
  trackLivesSaved: boolean("track_lives_saved").default(true),
  trackQualysGained: boolean("track_qualys_gained").default(true),
  trackPeopleHelped: boolean("track_people_helped").default(true),
  trackTotalDonated: boolean("track_total_donated").default(true),
  onboardingCompleted: boolean("onboarding_completed").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Charity effectiveness data for confidence meters
export const charityEffectiveness = pgTable("charity_effectiveness", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  charityKey: varchar("charity_key").notNull().unique(), // matches donation.charity
  charityName: varchar("charity_name").notNull(),
  category: varchar("category").notNull(),
  costPerLifeSaved: decimal("cost_per_life_saved", { precision: 10, scale: 2 }),
  costPerQaly: decimal("cost_per_qaly", { precision: 8, scale: 2 }),
  peopleHelpedPerDollar: decimal("people_helped_per_dollar", { precision: 6, scale: 4 }),
  confidenceLevel: varchar("confidence_level").notNull(), // 'high', 'medium', 'low'
  evidenceQuality: varchar("evidence_quality"), // 'randomized_trial', 'observational', 'proxy_estimate'
  dataSource: varchar("data_source"), // 'givewell', 'charity_evaluator', 'proxy'
  notes: text("notes"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertDonationSchema = createInsertSchema(donations).omit({
  id: true,
  userId: true,
  createdAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  userId: true,
  updatedAt: true,
});

export const updateTargetSettingsSchema = createInsertSchema(userProgress).pick({
  livesSavedTarget: true,
  qualysGainedTarget: true,
  peopleHelpedTarget: true,
  totalDonatedTarget: true,
  trackLivesSaved: true,
  trackQualysGained: true,
  trackPeopleHelped: true,
  trackTotalDonated: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  userId: true,
  unlockedAt: true,
});

export const insertCharityEffectivenessSchema = createInsertSchema(charityEffectiveness).omit({
  id: true,
  lastUpdated: true,
});

export type InsertDonation = z.infer<typeof insertDonationSchema>;
export type Donation = typeof donations.$inferSelect;
export type ImpactCalculation = typeof impactCalculations.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type CharityEffectiveness = typeof charityEffectiveness.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UpdateTargetSettings = z.infer<typeof updateTargetSettingsSchema>;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;
export type InsertCharityEffectiveness = z.infer<typeof insertCharityEffectivenessSchema>;
