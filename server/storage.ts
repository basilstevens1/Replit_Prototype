import {
  users,
  donations,
  impactCalculations,
  userAchievements,
  userProgress,
  charityEffectiveness,
  type User,
  type UpsertUser,
  type Donation,
  type InsertDonation,
  type ImpactCalculation,
  type UserAchievement,
  type UserProgress,
  type CharityEffectiveness,
  type InsertUserAchievement,
  type InsertUserProgress,
  type InsertCharityEffectiveness,
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
    peopleImpacted: number;
    confidenceLevel: string;
  }>;
  
  // Gamification - User Progress
  getUserProgress(userId: string): Promise<UserProgress | undefined>;
  upsertUserProgress(userId: string, progress: Partial<InsertUserProgress>): Promise<UserProgress>;
  updateUserProgressAfterDonation(userId: string, donationAmount: number): Promise<UserProgress>;
  
  // Gamification - Achievements
  getUserAchievements(userId: string): Promise<UserAchievement[]>;
  unlockAchievement(userId: string, achievement: InsertUserAchievement): Promise<UserAchievement>;
  checkAndUnlockAchievements(userId: string): Promise<UserAchievement[]>;
  
  // Charity Effectiveness
  getCharityEffectiveness(charityKey: string): Promise<CharityEffectiveness | undefined>;
  getAllCharityEffectiveness(): Promise<CharityEffectiveness[]>;
  upsertCharityEffectiveness(data: InsertCharityEffectiveness): Promise<CharityEffectiveness>;
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

  // Impact calculations with enhanced metrics
  async getUserImpactStats(userId: string): Promise<{
    totalDonated: number;
    livesSaved: number;
    qualysGained: number;
    donationCount: number;
    peopleImpacted: number;
    confidenceLevel: string;
  }> {
    const userDonations = await this.getUserDonations(userId);
    const totalDonated = userDonations.reduce((sum, donation) => sum + parseFloat(donation.amount), 0);
    const donationCount = userDonations.length;
    
    let totalLivesSaved = 0;
    let totalQualysGained = 0;
    let totalPeopleImpacted = 0;
    let weightedConfidenceScore = 0;
    let totalWeight = 0;

    // Calculate impact based on charity-specific effectiveness data
    for (const donation of userDonations) {
      const amount = parseFloat(donation.amount);
      const effectiveness = await this.getCharityEffectiveness(donation.charity);
      
      if (effectiveness) {
        // Use charity-specific data
        if (effectiveness.costPerLifeSaved) {
          totalLivesSaved += amount / parseFloat(effectiveness.costPerLifeSaved);
        }
        if (effectiveness.costPerQaly) {
          totalQualysGained += amount / parseFloat(effectiveness.costPerQaly);
        }
        if (effectiveness.peopleHelpedPerDollar) {
          totalPeopleImpacted += amount * parseFloat(effectiveness.peopleHelpedPerDollar);
        }
        
        // Weight confidence score by donation amount
        const confidenceScore = effectiveness.confidenceLevel === 'high' ? 3 : 
                               effectiveness.confidenceLevel === 'medium' ? 2 : 1;
        weightedConfidenceScore += confidenceScore * amount;
        totalWeight += amount;
      } else {
        // Fallback to general estimates for unknown charities
        totalLivesSaved += amount / 5000; // $5,000 per life saved
        totalQualysGained += amount / 100; // $100 per QALY
        totalPeopleImpacted += amount / 50; // $50 per person helped
        
        weightedConfidenceScore += 2 * amount; // Medium confidence
        totalWeight += amount;
      }
    }

    const avgConfidenceScore = totalWeight > 0 ? weightedConfidenceScore / totalWeight : 2;
    const confidenceLevel = avgConfidenceScore >= 2.5 ? 'high' : 
                           avgConfidenceScore >= 1.5 ? 'medium' : 'low';

    return {
      totalDonated,
      livesSaved: totalLivesSaved,
      qualysGained: totalQualysGained,
      donationCount,
      peopleImpacted: totalPeopleImpacted,
      confidenceLevel,
    };
  }

  // Gamification - User Progress
  async getUserProgress(userId: string): Promise<UserProgress | undefined> {
    const [progress] = await db.select().from(userProgress).where(eq(userProgress.userId, userId));
    return progress;
  }

  async upsertUserProgress(userId: string, progressData: Partial<InsertUserProgress>): Promise<UserProgress> {
    const [progress] = await db
      .insert(userProgress)
      .values({
        userId,
        ...progressData,
      })
      .onConflictDoUpdate({
        target: userProgress.userId,
        set: {
          ...progressData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return progress;
  }

  async updateUserProgressAfterDonation(userId: string, donationAmount: number): Promise<UserProgress> {
    const currentProgress = await this.getUserProgress(userId);
    const userDonations = await this.getUserDonations(userId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Calculate streak
    let newStreak = 1;
    if (currentProgress?.lastDonationDate) {
      const lastDonation = new Date(currentProgress.lastDonationDate);
      lastDonation.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor((today.getTime() - lastDonation.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day
        newStreak = (currentProgress.currentStreak || 0) + 1;
      } else if (daysDiff === 0) {
        // Same day
        newStreak = currentProgress.currentStreak || 1;
      }
      // daysDiff > 1 means streak is broken, so newStreak stays 1
    }

    // Calculate experience points and level
    const baseXP = Math.floor(donationAmount / 10); // 1 XP per $10 donated
    const streakBonus = Math.min(newStreak * 5, 50); // Up to 50 XP bonus for streaks
    const newXP = (currentProgress?.experiencePoints || 0) + baseXP + streakBonus;
    const newLevel = Math.floor(newXP / 100) + 1; // Level up every 100 XP

    // Calculate impact score
    const impactScore = donationAmount / 100; // Simple impact scoring
    const newImpactScore = parseFloat(currentProgress?.totalImpactScore || "0") + impactScore;

    // Set next milestone
    const currentTotal = parseFloat(currentProgress?.nextMilestone || "100");
    const newMilestone = donationAmount >= currentTotal ? currentTotal * 2 : currentTotal;

    return await this.upsertUserProgress(userId, {
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, currentProgress?.longestStreak || 0),
      lastDonationDate: new Date(),
      totalDonations: userDonations.length,
      totalImpactScore: newImpactScore.toFixed(2),
      level: newLevel,
      experiencePoints: newXP,
      nextMilestone: newMilestone.toFixed(2),
    });
  }

  // Gamification - Achievements
  async getUserAchievements(userId: string): Promise<UserAchievement[]> {
    return await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, userId))
      .orderBy(desc(userAchievements.unlockedAt));
  }

  async unlockAchievement(userId: string, achievement: InsertUserAchievement): Promise<UserAchievement> {
    const [newAchievement] = await db
      .insert(userAchievements)
      .values({
        userId,
        ...achievement,
      })
      .returning();
    return newAchievement;
  }

  async completeOnboarding(userId: string): Promise<void> {
    await db
      .update(userProgress)
      .set({ onboardingCompleted: true, updatedAt: new Date() })
      .where(eq(userProgress.userId, userId));
  }

  async checkAndUnlockAchievements(userId: string): Promise<UserAchievement[]> {
    const progress = await this.getUserProgress(userId);
    const donations = await this.getUserDonations(userId);
    const existingAchievements = await this.getUserAchievements(userId);
    const unlockedTypes = new Set(existingAchievements.map(a => a.achievementType));
    const newAchievements: UserAchievement[] = [];

    if (!progress) return newAchievements;

    // First donation achievement
    if (donations.length >= 1 && !unlockedTypes.has('first_donation')) {
      const achievement = await this.unlockAchievement(userId, {
        achievementType: 'first_donation',
        title: 'First Impact',
        description: 'Made your first donation!',
        badgeIcon: 'Heart',
        badgeColor: 'red',
      });
      newAchievements.push(achievement);
    }

    // Streak achievements
    const streakMilestones = [3, 7, 14, 30, 100];
    for (const milestone of streakMilestones) {
      if ((progress.currentStreak || 0) >= milestone && !unlockedTypes.has(`streak_${milestone}`)) {
        const achievement = await this.unlockAchievement(userId, {
          achievementType: `streak_${milestone}`,
          title: `${milestone} Day Streak`,
          description: `Donated for ${milestone} consecutive days!`,
          badgeIcon: 'Flame',
          badgeColor: 'orange',
        });
        newAchievements.push(achievement);
      }
    }

    // Donation amount milestones
    const totalDonated = donations.reduce((sum, d) => sum + parseFloat(d.amount), 0);
    const amountMilestones = [100, 500, 1000, 5000, 10000];
    for (const milestone of amountMilestones) {
      if (totalDonated >= milestone && !unlockedTypes.has(`milestone_${milestone}`)) {
        const achievement = await this.unlockAchievement(userId, {
          achievementType: `milestone_${milestone}`,
          title: `$${milestone.toLocaleString()} Donated`,
          description: `Reached $${milestone.toLocaleString()} in total donations!`,
          badgeIcon: 'Trophy',
          badgeColor: 'gold',
        });
        newAchievements.push(achievement);
      }
    }

    // Level achievements
    const levelMilestones = [5, 10, 25, 50, 100];
    for (const milestone of levelMilestones) {
      if ((progress.level || 1) >= milestone && !unlockedTypes.has(`level_${milestone}`)) {
        const achievement = await this.unlockAchievement(userId, {
          achievementType: `level_${milestone}`,
          title: `Level ${milestone}`,
          description: `Reached level ${milestone}!`,
          badgeIcon: 'Star',
          badgeColor: 'purple',
        });
        newAchievements.push(achievement);
      }
    }

    return newAchievements;
  }

  // Charity Effectiveness
  async getCharityEffectiveness(charityKey: string): Promise<CharityEffectiveness | undefined> {
    const [effectiveness] = await db
      .select()
      .from(charityEffectiveness)
      .where(eq(charityEffectiveness.charityKey, charityKey));
    return effectiveness;
  }

  async getAllCharityEffectiveness(): Promise<CharityEffectiveness[]> {
    return await db.select().from(charityEffectiveness);
  }

  async upsertCharityEffectiveness(data: InsertCharityEffectiveness): Promise<CharityEffectiveness> {
    const [effectiveness] = await db
      .insert(charityEffectiveness)
      .values(data)
      .onConflictDoUpdate({
        target: charityEffectiveness.charityKey,
        set: {
          ...data,
          lastUpdated: new Date(),
        },
      })
      .returning();
    return effectiveness;
  }
}

export const storage = new DatabaseStorage();
