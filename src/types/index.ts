export interface Attendant {
  id: number;
  username: string;
  password: string;
  name: string;
  initials: string;
  score: number;
  color: string;
  soft: string;
  level: string;
  reasons: string[];
}

export interface Contest {
  id: string | number;
  by: string;
  target: string;
  type: string;
  delta: number;
  text: string;
  status: 'Pendente' | 'Aprovada' | 'Rejeitada';
  createdAt: string;
  createdAtMs?: number;
}

export interface HistoryEntry {
  id: string | number;
  type?: string;
  text: string;
  date: string;
}

export interface Message {
  id: string | number;
  to: string;
  text: string;
  createdAt: string;
  createdAtMs: number;
  read: boolean;
}

export interface User {
  username: string;
  password: string;
  role: 'admin' | 'employee';
  employeeName: string | null;
}

export interface AuthUser {
  uid: string;
  email: string;
  username: string;
  role: 'admin' | 'employee';
  employeeName: string | null;
  customClaims?: {
    admin?: boolean;
    employee?: boolean;
  };
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface ContestForm {
  target: string;
  type: string;
  delta: number;
  text: string;
}

export interface AdminEditForm {
  target: string;
  newScore: number;
  reason: string;
}

export interface ComposeMessageForm {
  to: string;
  text: string;
}

export interface ScoreReason {
  title: string;
  icon: React.ReactNode;
  items: string[];
}

export interface Rule {
  icon: React.ReactNode;
  title: string;
  desc: string;
}
