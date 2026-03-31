import { baseAttendants } from '../data/constants';

export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function scoreLevel(score: number): string {
  if (score >= 9) return 'Excelente';
  if (score >= 8) return 'Ótimo';
  if (score >= 7) return 'Bom';
  if (score >= 6) return 'Mediano';
  return 'Ruim';
}

export function formatCreatedAt(value: any): string {
  if (!value) return 'Agora';
  if (typeof value === 'string') return value;
  if (value?.toDate) {
    return value.toDate().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  }
  return 'Agora';
}

export function loginToEmail(login: string): string {
  return `${login.toLowerCase()}@datalukas.local`;
}

export function attendantByName(name: string) {
  return baseAttendants.find((a) => a.name === name);
}
