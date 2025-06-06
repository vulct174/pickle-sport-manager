import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertClubSchema,
  insertTournamentSchema,
  insertRegistrationSchema,
  insertMatchSchema,
  updateScoreSchema,
  UserRoles,
  RegistrationStatus,
} from "@shared/schema";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1, "Tên đăng nhập là bắt buộc"),
  password: z.string().min(1, "Mật khẩu là bắt buộc"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Tên đăng nhập hoặc mật khẩu không đúng" });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: "Tài khoản đã bị vô hiệu hóa" });
      }

      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });
      }

      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email đã được đăng ký" });
      }

      const { confirmPassword, ...userDataWithoutConfirm } = userData;
      const user = await storage.createUser(userDataWithoutConfirm);
      
      res.status(201).json({ user: { ...user, password: undefined } });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }
  });

  // User routes
  app.get("/api/users", async (req, res) => {
    try {
      const { role } = req.query;
      if (role && typeof role === "string") {
        const users = await storage.getUsersByRole(role);
        res.json(users.map(user => ({ ...user, password: undefined })));
      } else {
        // Return all users without passwords (for admin purposes)
        const users = await storage.getUsersByRole(UserRoles.ATHLETE);
        res.json(users.map(user => ({ ...user, password: undefined })));
      }
    } catch (error) {
      console.error("Get users error:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }

      res.json({ ...user, password: undefined });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  });

  // Club routes
  app.get("/api/clubs", async (req, res) => {
    try {
      const clubs = await storage.getClubs();
      res.json(clubs);
    } catch (error) {
      console.error("Get clubs error:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  });

  app.post("/api/clubs", async (req, res) => {
    try {
      const clubData = insertClubSchema.parse(req.body);
      const club = await storage.createClub(clubData);
      res.status(201).json(club);
    } catch (error) {
      console.error("Create club error:", error);
      res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }
  });

  // Tournament routes
  app.get("/api/tournaments", async (req, res) => {
    try {
      const { status } = req.query;
      if (status && typeof status === "string") {
        const tournaments = await storage.getTournamentsByStatus(status);
        res.json(tournaments);
      } else {
        const tournaments = await storage.getTournaments();
        res.json(tournaments);
      }
    } catch (error) {
      console.error("Get tournaments error:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  });

  app.get("/api/tournaments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tournament = await storage.getTournament(id);
      
      if (!tournament) {
        return res.status(404).json({ message: "Không tìm thấy giải đấu" });
      }

      res.json(tournament);
    } catch (error) {
      console.error("Get tournament error:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  });

  app.post("/api/tournaments", async (req, res) => {
    try {
      const tournamentData = insertTournamentSchema.parse(req.body);
      const tournament = await storage.createTournament(tournamentData);
      res.status(201).json(tournament);
    } catch (error) {
      console.error("Create tournament error:", error);
      res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }
  });

  // Registration routes
  app.get("/api/registrations", async (req, res) => {
    try {
      const { tournament_id, athlete_id, status } = req.query;
      
      if (tournament_id) {
        const registrations = await storage.getRegistrationsByTournament(parseInt(tournament_id as string));
        res.json(registrations);
      } else if (athlete_id) {
        const registrations = await storage.getRegistrationsByAthlete(parseInt(athlete_id as string));
        res.json(registrations);
      } else if (status === "pending") {
        const registrations = await storage.getPendingRegistrations();
        res.json(registrations);
      } else {
        const registrations = await storage.getPendingRegistrations();
        res.json(registrations);
      }
    } catch (error) {
      console.error("Get registrations error:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  });

  app.post("/api/registrations", async (req, res) => {
    try {
      const registrationData = insertRegistrationSchema.parse(req.body);
      const registration = await storage.createRegistration(registrationData);
      res.status(201).json(registration);
    } catch (error) {
      console.error("Create registration error:", error);
      res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }
  });

  app.patch("/api/registrations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      if (updates.status === RegistrationStatus.APPROVED) {
        updates.approvedAt = new Date();
        // In a real app, you'd get this from session/auth
        updates.approvedBy = 1;
      }

      const registration = await storage.updateRegistration(id, updates);
      
      if (!registration) {
        return res.status(404).json({ message: "Không tìm thấy đăng ký" });
      }

      res.json(registration);
    } catch (error) {
      console.error("Update registration error:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  });

  // Match routes
  app.get("/api/matches", async (req, res) => {
    try {
      const { tournament_id, live } = req.query;
      
      if (live === "true") {
        const matches = await storage.getLiveMatches();
        res.json(matches);
      } else if (tournament_id) {
        const matches = await storage.getMatchesByTournament(parseInt(tournament_id as string));
        res.json(matches);
      } else {
        const matches = await storage.getLiveMatches();
        res.json(matches);
      }
    } catch (error) {
      console.error("Get matches error:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  });

  app.post("/api/matches", async (req, res) => {
    try {
      const matchData = insertMatchSchema.parse(req.body);
      const match = await storage.createMatch(matchData);
      res.status(201).json(match);
    } catch (error) {
      console.error("Create match error:", error);
      res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }
  });

  app.patch("/api/matches/:id/score", async (req, res) => {
    try {
      const matchId = parseInt(req.params.id);
      const scoreData = updateScoreSchema.parse({ ...req.body, matchId });
      
      const match = await storage.updateMatchScore(scoreData);
      
      if (!match) {
        return res.status(404).json({ message: "Không tìm thấy trận đấu" });
      }

      res.json(match);
    } catch (error) {
      console.error("Update match score error:", error);
      res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }
  });

  // Leaderboard routes
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      console.error("Get leaderboard error:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  });

  // Statistics routes
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getStats();
      res.json(stats);
    } catch (error) {
      console.error("Get stats error:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  });

  // Achievements routes
  app.get("/api/achievements/:athleteId", async (req, res) => {
    try {
      const athleteId = parseInt(req.params.athleteId);
      const achievements = await storage.getAchievementsByAthlete(athleteId);
      res.json(achievements);
    } catch (error) {
      console.error("Get achievements error:", error);
      res.status(500).json({ message: "Lỗi server" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
