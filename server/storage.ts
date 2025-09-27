import {
  users,
  donations,
  impactCalculations,
  type User,
  type UpsertUser,
  type Donation,
  type InsertDonation,
  type ImpactCalculation,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, sum, count } from "drizzle-orm";

export interface IStorage {
  // User operations for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Donation operations
  createDonation(userId: string, donation: InsertDonation): Promise<Donation>;
  getUserDonations(userId: string): Promise<Donation[]>;
  getDonationById(id: string): Promise<Donation | undefined>;
  updateDonation(id: string, donation: Partial<InsertDonation>): Promise<Donation>;
  deleteDonation(id: string): Promise<void>;
  
  // Impact calculations
  getUserImpactStats(userId: string): Promise<{
    totalDonated: number;
    livesSaved: number;
    qualysGained: number;
    donationCount: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Donation operations
  async createDonation(userId: string, donation: InsertDonation): Promise<Donation> {
    const [newDonation] = await db
      .insert(donations)
      .values({
        ...donation,
        userId,
      })
      .returning();
    return newDonation;
  }

  async getUserDonations(userId: string): Promise<Donation[]> {
    return await db
      .select()
      .from(donations)
      .where(eq(donations.userId, userId))
      .orderBy(desc(donations.donationDate));
  }

  async getDonationById(id: string): Promise<Donation | undefined> {
    const [donation] = await db.select().from(donations).where(eq(donations.id, id));
    return donation;
  }

  async updateDonation(id: string, donation: Partial<InsertDonation>): Promise<Donation> {
    const [updatedDonation] = await db
      .update(donations)
      .set(donation)
      .where(eq(donations.id, id))
      .returning();
    return updatedDonation;
  }

  async deleteDonation(id: string): Promise<void> {
    await db.delete(donations).where(eq(donations.id, id));
  }

  // Impact calculations
  async getUserImpactStats(userId: string): Promise<{
    totalDonated: number;
    livesSaved: number;
    qualysGained: number;
    donationCount: number;
  }> {
    const userDonations = await this.getUserDonations(userId);
    const totalDonated = userDonations.reduce((sum, donation) => sum + parseFloat(donation.amount), 0);
    const donationCount = userDonations.length;
    
    // Simple impact calculations based on research estimates
    // These are rough estimates based on GiveWell and other EA research
    const avgCostPerLifeSaved = 5000; // $5,000 per life saved (GiveWell estimate)
    const avgCostPerQUALY = 100; // $100 per QALY (varies by intervention)
    
    const livesSaved = totalDonated / avgCostPerLifeSaved;
    const qualysGained = totalDonated / avgCostPerQUALY;

    return {
      totalDonated,
      livesSaved,
      qualysGained,
      donationCount,
    };
  }
}

export const storage = new DatabaseStorage();
