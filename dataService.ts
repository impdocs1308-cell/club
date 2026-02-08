
import { Player, Team, Tournament, Announcement, Match } from './types';

/**
 * GOOGLE SHEETS INTEGRATION
 * To sync with Google Sheets:
 * 1. Create a Google Apps Script Web App.
 * 2. Paste the URL into API_ENDPOINT below.
 * 3. The service will then attempt to fetch/push data to your sheet.
 */
const API_ENDPOINT = ''; // PLACEHOLDER: Put your Google Apps Script Web App URL here

const STORAGE_KEY = 'ETP_DATA_STORE';

interface AppData {
  players: Player[];
  teams: Team[];
  tournaments: Tournament[];
  announcements: Announcement[];
  matches: Match[];
}

const INITIAL_DATA: AppData = {
  players: [
    { id: 'p1', name: 'Ravi Kumar', username: 'ravi', password: '123', teamId: 't1', matchesPlayed: 10, goals: 12, assists: 5, rating: 8.5 },
    { id: 'p2', name: 'John Doe', username: 'john', password: '123', teamId: 't2', matchesPlayed: 8, goals: 5, assists: 8, rating: 7.9 },
  ],
  teams: [
    { id: 't1', name: 'Blue Warriors', wins: 5, losses: 2, draws: 3, points: 18 },
    { id: 't2', name: 'Red Dragons', wins: 7, losses: 1, draws: 2, points: 23 },
  ],
  tournaments: [
    { id: 'TRN2024A', name: 'Summer Cup', year: 2024, active: true },
    { id: 'TRN2023X', name: 'Winter League', year: 2023, active: false },
  ],
  announcements: [
    { id: 'a1', content: 'Finals will be held at Stadium X on Sunday!', priority: 'HIGH' as any, date: '2024-05-20' },
    { id: 'a2', content: 'Registrations for next season are now open.', priority: 'MEDIUM' as any, date: '2024-05-15' },
  ],
  matches: [
    { id: 'm1', tournamentId: 'TRN2024A', seasonYear: 2024, teamAId: 't1', teamBId: 't2', scoreA: 2, scoreB: 1, matchDate: '2024-06-01T15:00:00', stageTag: 'Semi Final' },
    { id: 'm2', tournamentId: 'TRN2024A', seasonYear: 2024, teamAId: 't2', teamBId: 't1', scoreA: 0, scoreB: 0, matchDate: '2024-05-25T18:30:00', stageTag: 'League Match' },
  ]
};

class DataService {
  private data: AppData;

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY);
    this.data = saved ? JSON.parse(saved) : INITIAL_DATA;
    this.syncWithCloud();
  }

  private async syncWithCloud() {
    if (!API_ENDPOINT) return;
    try {
      const response = await fetch(API_ENDPOINT);
      const cloudData = await response.json();
      if (cloudData) {
        this.data = cloudData;
        this.saveLocally();
      }
    } catch (e) {
      console.warn("Cloud sync failed, using local storage", e);
    }
  }

  private async pushToCloud() {
    if (!API_ENDPOINT) return;
    try {
      await fetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify(this.data),
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (e) {
      console.error("Failed to push to Google Sheets", e);
    }
  }

  private saveLocally() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  private save() {
    this.saveLocally();
    this.pushToCloud();
  }

  getPlayers = () => this.data.players;
  getTeams = () => this.data.teams;
  getTournaments = () => this.data.tournaments;
  getAnnouncements = () => this.data.announcements;
  getMatches = () => this.data.matches;

  // Player Ops
  addPlayer = (player: Player) => { this.data.players.push(player); this.save(); };
  deletePlayer = (id: string) => { this.data.players = this.data.players.filter(p => p.id !== id); this.save(); };
  updatePlayer = (updated: Player) => {
    this.data.players = this.data.players.map(p => p.id === updated.id ? updated : p);
    this.save();
  };

  // Match Ops
  addMatch = (match: Match) => { this.data.matches.push(match); this.save(); };
  updateMatch = (updated: Match) => {
    this.data.matches = this.data.matches.map(m => m.id === updated.id ? updated : m);
    this.save();
  };
  deleteMatch = (id: string) => { this.data.matches = this.data.matches.filter(m => m.id !== id); this.save(); };

  // Announcement Ops
  addAnnouncement = (ann: Announcement) => { this.data.announcements.push(ann); this.save(); };
  deleteAnnouncement = (id: string) => { this.data.announcements = this.data.announcements.filter(a => a.id !== id); this.save(); };

  // Tournament Ops
  addTournament = (tr: Tournament) => { this.data.tournaments.push(tr); this.save(); };
  deleteTournament = (id: string) => { this.data.tournaments = this.data.tournaments.filter(t => t.id !== id); this.save(); };
}

export const db = new DataService();
