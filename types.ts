
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface Player {
  id: string;
  name: string;
  username: string;
  password?: string;
  teamId: string;
  matchesPlayed: number;
  goals: number;
  assists: number;
  rating: number;
  profilePic?: string;
}

export interface Team {
  id: string;
  name: string;
  wins: number;
  losses: number;
  draws: number;
  points: number;
  logo?: string;
}

export interface Tournament {
  id: string; // Unique alphanumeric number
  name: string;
  year: number;
  active: boolean;
}

export interface Announcement {
  id: string;
  content: string;
  priority: Priority;
  date: string;
}

export interface Match {
  id: string;
  tournamentId: string;
  seasonYear: number;
  teamAId: string;
  teamBId: string;
  scoreA: number;
  scoreB: number;
  matchDate: string;
  stageTag: string; // Custom tag like "League Match", "Semi Final"
}

export interface UserSession {
  role: 'admin' | 'player' | 'public';
  id?: string;
  name?: string;
}
