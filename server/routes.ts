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
      res.status(201).json(donation);
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

  const httpServer = createServer(app);

  return httpServer;
}
