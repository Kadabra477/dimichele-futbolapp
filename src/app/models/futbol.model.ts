export interface Area {
  name: string;
  flag: string | null;
}

export interface Competition {
  id: number;
  name: string;
  code: string;
  emblem: string | null;
  area: Area;
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  tla: string;
  crest: string;
}

export interface ScoreDetails {
  home: number | null;
  away: number | null;
}

export interface Score {
  winner: string | null;
  duration: string;
  fullTime: ScoreDetails;
}

export interface Match {
  id: number;
  competition: Competition;
  utcDate: string;
  status: 'FINISHED' | 'LIVE' | 'TIMED' | 'IN_PLAY' | string;
  homeTeam: Team;
  awayTeam: Team;
  score: Score;
}

export interface RespuestaPartidos {
  count: number;
  filters: any;
  matches: Match[];
}