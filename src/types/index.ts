export type AppState = 'checkin' | 'loading' | 'results';

export interface GuestData {
  id?: string;
  name: string;
  chapter: string;
  company: string;
  title: string;
  industry: string;
  services: string;
  lookingFor: string;
  painPoints: string;
  contactInfo?: string;
  isWalkIn?: boolean;
}

export interface MatchData {
  id?: string;
  name: string;
  company: string;
  title: string;
  industry: string;
  chapter: string;
  services: string;
  matchReason: string;
  icebreaker: string;
}

export interface GridPerson {
  id?: string;
  position: number;
  name: string;
  company: string;
  title: string;
  industry: string;
  chapter: string;
  reason: string;
}
