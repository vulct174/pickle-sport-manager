import {
  users,
  clubs,
  tournaments,
  registrations,
  matches,
  achievements,
  type User,
  type InsertUser,
  type Club,
  type InsertClub,
  type Tournament,
  type InsertTournament,
  type Registration,
  type InsertRegistration,
  type Match,
  type InsertMatch,
  type Achievement,
  type UpdateScore,
  UserRoles,
  TournamentStatus,
  RegistrationStatus,
  MatchStatus,
  Categories,
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  getUsersByRole(role: string): Promise<User[]>;

  // Clubs
  getClub(id: number): Promise<Club | undefined>;
  createClub(club: InsertClub): Promise<Club>;
  getClubs(): Promise<Club[]>;

  // Tournaments
  getTournament(id: number): Promise<Tournament | undefined>;
  createTournament(tournament: InsertTournament): Promise<Tournament>;
  getTournaments(): Promise<Tournament[]>;
  getTournamentsByStatus(status: string): Promise<Tournament[]>;
  updateTournament(id: number, updates: Partial<Tournament>): Promise<Tournament | undefined>;

  // Registrations
  getRegistration(id: number): Promise<Registration | undefined>;
  createRegistration(registration: InsertRegistration): Promise<Registration>;
  getRegistrationsByTournament(tournamentId: number): Promise<Registration[]>;
  getRegistrationsByAthlete(athleteId: number): Promise<Registration[]>;
  updateRegistration(id: number, updates: Partial<Registration>): Promise<Registration | undefined>;
  getPendingRegistrations(): Promise<Registration[]>;

  // Matches
  getMatch(id: number): Promise<Match | undefined>;
  createMatch(match: InsertMatch): Promise<Match>;
  getMatchesByTournament(tournamentId: number): Promise<Match[]>;
  getLiveMatches(): Promise<Match[]>;
  updateMatch(id: number, updates: Partial<Match>): Promise<Match | undefined>;
  updateMatchScore(scoreUpdate: UpdateScore): Promise<Match | undefined>;

  // Achievements
  getAchievement(id: number): Promise<Achievement | undefined>;
  createAchievement(achievement: Omit<Achievement, 'id'>): Promise<Achievement>;
  getAchievementsByAthlete(athleteId: number): Promise<Achievement[]>;
  getLeaderboard(): Promise<Array<User & { totalPoints: number; wins: number; winRate: number }>>;

  // Statistics
  getStats(): Promise<{
    activeTournaments: number;
    registeredAthletes: number;
    todayMatches: number;
    averageRating: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private clubs: Map<number, Club>;
  private tournaments: Map<number, Tournament>;
  private registrations: Map<number, Registration>;
  private matches: Map<number, Match>;
  private achievements: Map<number, Achievement>;
  private currentUserId: number;
  private currentClubId: number;
  private currentTournamentId: number;
  private currentRegistrationId: number;
  private currentMatchId: number;
  private currentAchievementId: number;

  constructor() {
    this.users = new Map();
    this.clubs = new Map();
    this.tournaments = new Map();
    this.registrations = new Map();
    this.matches = new Map();
    this.achievements = new Map();
    this.currentUserId = 1;
    this.currentClubId = 1;
    this.currentTournamentId = 1;
    this.currentRegistrationId = 1;
    this.currentMatchId = 1;
    this.currentAchievementId = 1;

    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default admin user
    const adminUser: User = {
      id: this.currentUserId++,
      username: "admin",
      password: "admin123",
      email: "admin@pickleballpro.vn",
      fullName: "Quản Trị Viên",
      phone: "0123456789",
      role: UserRoles.ORGANIZER,
      clubId: null,
      skillLevel: null,
      isActive: true,
      createdAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      id: this.currentUserId++,
      username: insertUser.username,
      password: insertUser.password,
      email: insertUser.email,
      fullName: insertUser.fullName,
      role: insertUser.role,
      phone: insertUser.phone ?? null,
      clubId: insertUser.clubId ?? null,
      skillLevel: insertUser.skillLevel ?? null,
      isActive: insertUser.isActive ?? null,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.role === role);
  }

  // Clubs
  async getClub(id: number): Promise<Club | undefined> {
    return this.clubs.get(id);
  }

  async createClub(insertClub: InsertClub): Promise<Club> {
    const club: Club = {
      id: this.currentClubId++,
      name: insertClub.name,
      description: insertClub.description ?? null,
      location: insertClub.location ?? null,
      contactEmail: insertClub.contactEmail ?? null,
      contactPhone: insertClub.contactPhone ?? null,
      ownerId: insertClub.ownerId ?? null,
      isActive: insertClub.isActive ?? null,
      createdAt: new Date(),
    };
    this.clubs.set(club.id, club);
    return club;
  }

  async getClubs(): Promise<Club[]> {
    return Array.from(this.clubs.values()).filter(club => club.isActive);
  }

  // Tournaments
  async getTournament(id: number): Promise<Tournament | undefined> {
    return this.tournaments.get(id);
  }

  async createTournament(insertTournament: InsertTournament): Promise<Tournament> {
    const tournament: Tournament = {
      id: this.currentTournamentId++,
      name: insertTournament.name,
      description: insertTournament.description ?? null,
      location: insertTournament.location,
      startDate: insertTournament.startDate,
      endDate: insertTournament.endDate,
      registrationStartDate: insertTournament.registrationStartDate,
      registrationEndDate: insertTournament.registrationEndDate,
      maxParticipants: insertTournament.maxParticipants ?? null,
      currentParticipants: 0,
      categories: insertTournament.categories ?? null,
      status: insertTournament.status,
      organizerId: insertTournament.organizerId,
      isActive: insertTournament.isActive ?? null,
      createdAt: new Date(),
    };
    this.tournaments.set(tournament.id, tournament);
    return tournament;
  }

  async getTournaments(): Promise<Tournament[]> {
    return Array.from(this.tournaments.values()).filter(tournament => tournament.isActive);
  }

  async getTournamentsByStatus(status: string): Promise<Tournament[]> {
    return Array.from(this.tournaments.values()).filter(
      tournament => tournament.status === status && tournament.isActive
    );
  }

  async updateTournament(id: number, updates: Partial<Tournament>): Promise<Tournament | undefined> {
    const tournament = this.tournaments.get(id);
    if (!tournament) return undefined;

    const updatedTournament = { ...tournament, ...updates };
    this.tournaments.set(id, updatedTournament);
    return updatedTournament;
  }

  // Registrations
  async getRegistration(id: number): Promise<Registration | undefined> {
    return this.registrations.get(id);
  }

  async createRegistration(insertRegistration: InsertRegistration): Promise<Registration> {
    const registration: Registration = {
      id: this.currentRegistrationId++,
      athleteId: insertRegistration.athleteId,
      tournamentId: insertRegistration.tournamentId,
      category: insertRegistration.category,
      skillLevel: insertRegistration.skillLevel,
      status: insertRegistration.status,
      partnerId: insertRegistration.partnerId ?? null,
      notes: insertRegistration.notes ?? null,
      registeredAt: new Date(),
      approvedAt: null,
      approvedBy: null,
    };
    this.registrations.set(registration.id, registration);
    return registration;
  }

  async getRegistrationsByTournament(tournamentId: number): Promise<Registration[]> {
    return Array.from(this.registrations.values()).filter(
      registration => registration.tournamentId === tournamentId
    );
  }

  async getRegistrationsByAthlete(athleteId: number): Promise<Registration[]> {
    return Array.from(this.registrations.values()).filter(
      registration => registration.athleteId === athleteId
    );
  }

  async updateRegistration(id: number, updates: Partial<Registration>): Promise<Registration | undefined> {
    const registration = this.registrations.get(id);
    if (!registration) return undefined;

    const updatedRegistration = { ...registration, ...updates };
    this.registrations.set(id, updatedRegistration);
    return updatedRegistration;
  }

  async getPendingRegistrations(): Promise<Registration[]> {
    return Array.from(this.registrations.values()).filter(
      registration => registration.status === RegistrationStatus.PENDING
    );
  }

  // Matches
  async getMatch(id: number): Promise<Match | undefined> {
    return this.matches.get(id);
  }

  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    const match: Match = {
      id: this.currentMatchId++,
      tournamentId: insertMatch.tournamentId,
      category: insertMatch.category,
      round: insertMatch.round,
      player1Id: insertMatch.player1Id,
      player2Id: insertMatch.player2Id ?? null,
      partner1Id: insertMatch.partner1Id ?? null,
      partner2Id: insertMatch.partner2Id ?? null,
      status: insertMatch.status,
      score: insertMatch.score ?? null,
      notes: insertMatch.notes ?? null,
      scheduledTime: insertMatch.scheduledTime ?? null,
      courtNumber: insertMatch.courtNumber ?? null,
      refereeId: insertMatch.refereeId ?? null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.matches.set(match.id, match);
    return match;
  }

  async getMatchesByTournament(tournamentId: number): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(
      match => match.tournamentId === tournamentId
    );
  }

  async getLiveMatches(): Promise<Match[]> {
    return Array.from(this.matches.values()).filter(
      match => match.status === MatchStatus.IN_PROGRESS
    );
  }

  async updateMatch(id: number, updates: Partial<Match>): Promise<Match | undefined> {
    const match = this.matches.get(id);
    if (!match) return undefined;

    const updatedMatch = { ...match, ...updates, updatedAt: new Date() };
    this.matches.set(id, updatedMatch);
    return updatedMatch;
  }

  async updateMatchScore(scoreUpdate: UpdateScore): Promise<Match | undefined> {
    const match = this.matches.get(scoreUpdate.matchId);
    if (!match) return undefined;

    const updatedMatch = {
      ...match,
      score: scoreUpdate.score,
      status: scoreUpdate.status,
      updatedAt: new Date(),
    };

    if (scoreUpdate.score.winner) {
      updatedMatch.winnerId = scoreUpdate.score.winner === 1 ? match.player1Id : match.player2Id;
    }

    this.matches.set(scoreUpdate.matchId, updatedMatch);
    return updatedMatch;
  }

  // Achievements
  async getAchievement(id: number): Promise<Achievement | undefined> {
    return this.achievements.get(id);
  }

  async createAchievement(achievement: Omit<Achievement, 'id'>): Promise<Achievement> {
    const newAchievement: Achievement = {
      ...achievement,
      id: this.currentAchievementId++,
    };
    this.achievements.set(newAchievement.id, newAchievement);
    return newAchievement;
  }

  async getAchievementsByAthlete(athleteId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(
      achievement => achievement.athleteId === athleteId
    );
  }

  async getLeaderboard(): Promise<Array<User & { totalPoints: number; wins: number; winRate: number }>> {
    const athletes = Array.from(this.users.values()).filter(user => user.role === UserRoles.ATHLETE);
    
    return athletes.map(athlete => {
      const achievements = Array.from(this.achievements.values()).filter(
        achievement => achievement.athleteId === athlete.id
      );
      
      const athleteMatches = Array.from(this.matches.values()).filter(
        match => match.player1Id === athlete.id || match.player2Id === athlete.id
      );
      
      const completedMatches = athleteMatches.filter(match => match.status === MatchStatus.COMPLETED);
      const wins = completedMatches.filter(match => match.winnerId === athlete.id).length;
      const totalMatches = completedMatches.length;
      const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;
      const totalPoints = achievements.reduce((sum, achievement) => sum + (achievement.points || 0), 0);

      return {
        ...athlete,
        totalPoints,
        wins,
        winRate,
      };
    }).sort((a, b) => b.totalPoints - a.totalPoints);
  }

  // Statistics
  async getStats(): Promise<{
    activeTournaments: number;
    registeredAthletes: number;
    todayMatches: number;
    averageRating: number;
  }> {
    const activeTournaments = Array.from(this.tournaments.values()).filter(
      tournament => tournament.status === TournamentStatus.ACTIVE
    ).length;

    const registeredAthletes = Array.from(this.users.values()).filter(
      user => user.role === UserRoles.ATHLETE && user.isActive
    ).length;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayMatches = Array.from(this.matches.values()).filter(
      match => match.scheduledTime && 
                match.scheduledTime >= today && 
                match.scheduledTime < tomorrow
    ).length;

    const athletes = Array.from(this.users.values()).filter(
      user => user.role === UserRoles.ATHLETE && user.skillLevel
    );
    const averageRating = athletes.length > 0 
      ? Number((athletes.reduce((sum, athlete) => sum + Number(athlete.skillLevel), 0) / athletes.length).toFixed(1))
      : 0;

    return {
      activeTournaments,
      registeredAthletes,
      todayMatches,
      averageRating,
    };
  }
}

export const storage = new MemStorage();
