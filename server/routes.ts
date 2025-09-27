import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertDonationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Donation routes
  app.get('/api/donations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const donations = await storage.getUserDonations(userId);
      res.json(donations);
    } catch (error) {
      console.error("Error fetching donations:", error);
      res.status(500).json({ message: "Failed to fetch donations" });
    }
  });

  app.post('/api/donations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const donationData = insertDonationSchema.parse(req.body);
      const donation = await storage.createDonation(userId, donationData);
      
      // Trigger gamification features
      const donationAmount = parseFloat(donation.amount);
      const updatedProgress = await storage.updateUserProgressAfterDonation(userId, donationAmount);
      const newAchievements = await storage.checkAndUnlockAchievements(userId);
      
      res.status(201).json({
        donation,
        progress: updatedProgress,
        newAchievements,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid donation data", errors: error.errors });
      } else {
        console.error("Error creating donation:", error);
        res.status(500).json({ message: "Failed to create donation" });
      }
    }
  });

  app.put('/api/donations/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const donationData = insertDonationSchema.partial().parse(req.body);
      const donation = await storage.updateDonation(id, donationData);
      res.json(donation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid donation data", errors: error.errors });
      } else {
        console.error("Error updating donation:", error);
        res.status(500).json({ message: "Failed to update donation" });
      }
    }
  });

  app.delete('/api/donations/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteDonation(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting donation:", error);
      res.status(500).json({ message: "Failed to delete donation" });
    }
  });

  // Impact stats route
  app.get('/api/impact', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const impactStats = await storage.getUserImpactStats(userId);
      res.json(impactStats);
    } catch (error) {
      console.error("Error fetching impact stats:", error);
      res.status(500).json({ message: "Failed to fetch impact stats" });
    }
  });

  // Gamification - User Progress
  app.get('/api/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getUserProgress(userId);
      if (!progress) {
        // Initialize progress for new users
        const newProgress = await storage.upsertUserProgress(userId, {});
        res.json(newProgress);
      } else {
        res.json(progress);
      }
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ message: "Failed to fetch user progress" });
    }
  });

  // Gamification - User Achievements
  app.get('/api/achievements', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const achievements = await storage.getUserAchievements(userId);
      res.json(achievements);
    } catch (error) {
      console.error("Error fetching achievements:", error);
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  // Check for new achievements after donation
  app.post('/api/achievements/check', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const newAchievements = await storage.checkAndUnlockAchievements(userId);
      res.json(newAchievements);
    } catch (error) {
      console.error("Error checking achievements:", error);
      res.status(500).json({ message: "Failed to check achievements" });
    }
  });

  // Charity Effectiveness
  app.get('/api/charities', async (req, res) => {
    try {
      const charities = await storage.getAllCharityEffectiveness();
      res.json(charities);
    } catch (error) {
      console.error("Error fetching charity data:", error);
      res.status(500).json({ message: "Failed to fetch charity data" });
    }
  });

  app.get('/api/charities/:charityKey', async (req, res) => {
    try {
      const { charityKey } = req.params;
      const charity = await storage.getCharityEffectiveness(charityKey);
      if (!charity) {
        res.status(404).json({ message: "Charity not found" });
        return;
      }
      res.json(charity);
    } catch (error) {
      console.error("Error fetching charity:", error);
      res.status(500).json({ message: "Failed to fetch charity" });
    }
  });

  // Initialize charity effectiveness data
  app.post('/api/init-charity-data', async (req, res) => {
    try {
      const charityData = [
        {
          charityKey: 'givewell',
          charityName: 'GiveWell',
          category: 'Global Health',
          costPerLifeSaved: '5000',
          costPerQaly: '100',
          peopleHelpedPerDollar: '0.02',
          confidenceLevel: 'high',
          evidenceQuality: 'randomized_trial',
          dataSource: 'givewell',
          notes: 'Based on GiveWell top charity analysis with strong RCT evidence'
        },
        {
          charityKey: 'charity-water',
          charityName: 'charity: water',
          category: 'Water & Sanitation',
          costPerLifeSaved: '7500',
          costPerQaly: '150',
          peopleHelpedPerDollar: '0.015',
          confidenceLevel: 'medium',
          evidenceQuality: 'observational',
          dataSource: 'charity_evaluator',
          notes: 'Clean water access impact estimates based on WHO studies'
        },
        {
          charityKey: 'malala-fund',
          charityName: 'Malala Fund',
          category: 'Education',
          costPerLifeSaved: '12000',
          costPerQaly: '200',
          peopleHelpedPerDollar: '0.012',
          confidenceLevel: 'medium',
          evidenceQuality: 'observational',
          dataSource: 'proxy',
          notes: 'Education impact estimates based on long-term outcome studies'
        },
        {
          charityKey: 'partners-in-health',
          charityName: 'Partners In Health',
          category: 'Healthcare',
          costPerLifeSaved: '4500',
          costPerQaly: '90',
          peopleHelpedPerDollar: '0.025',
          confidenceLevel: 'high',
          evidenceQuality: 'randomized_trial',
          dataSource: 'givewell',
          notes: 'Strong evidence for healthcare interventions in developing countries'
        },
        {
          charityKey: 'against-malaria',
          charityName: 'Against Malaria Foundation',
          category: 'Disease Prevention',
          costPerLifeSaved: '4000',
          costPerQaly: '80',
          peopleHelpedPerDollar: '0.03',
          confidenceLevel: 'high',
          evidenceQuality: 'randomized_trial',
          dataSource: 'givewell',
          notes: 'Top-rated by GiveWell with excellent cost-effectiveness for bed nets'
        }
      ];

      for (const charity of charityData) {
        await storage.upsertCharityEffectiveness(charity);
      }

      res.json({ message: "Charity effectiveness data initialized successfully", count: charityData.length });
    } catch (error) {
      console.error("Error initializing charity data:", error);
      res.status(500).json({ message: "Failed to initialize charity data" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
