import { ShieldCheck, MessageSquareWarning, Smile, Clock3, TimerReset, Brain, ClipboardList, Sparkles, BadgeDollarSign } from 'lucide-react';
import type { Attendant, User, Contest, Message, HistoryEntry, ScoreReason, Rule } from '../types';

export const baseAttendants: Attendant[] = [
  {
    id: 1,
    username: "andrade",
    password: "andrade",
    name: "Andrade",
    initials: "AN",
    score: 9.1,
    color: "from-emerald-400 to-green-500",
    soft: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
    level: "Excelente",
    reasons: [
      "Atendimento muito seguro e educado, sem soar robótico.",
      "Tempo de resposta rápido e constância boa durante o turno.",
      "Conhecimento técnico forte, resolve sem enrolação.",
      "Participa bem da resenha do dia sem perder a linha.",
      "Boa entrega em quantidade e ainda empurra mash quando cabe.",
    ],
  },
  {
    id: 2,
    username: "leo",
    password: "leo",
    name: "Leo",
    initials: "LE",
    score: 8.4,
    color: "from-sky-400 to-blue-500",
    soft: "bg-sky-500/10 text-sky-300 border-sky-500/20",
    level: "Ótimo",
    reasons: [
      "Atendimento bom e claro na maior parte do tempo.",
      "Tem boa leitura do problema e responde com agilidade.",
      "Pontualidade consistente, com poucos deslizes.",
      "Poderia vender mais mash e manter o ritmo em horários mais cheios.",
    ],
  },
  {
    id: 3,
    username: "rallyson",
    password: "rallyson",
    name: "Rallyson",
    initials: "RA",
    score: 7.7,
    color: "from-violet-400 to-fuchsia-500",
    soft: "bg-violet-500/10 text-violet-300 border-violet-500/20",
    level: "Bom",
    reasons: [
      "Atende bem, mas oscila entre momentos fortes e frios.",
      "Conhecimento aceitável, porém às vezes demora para fechar o atendimento.",
      "Pontualidade está ok, mas pode melhorar constância no ritmo.",
      "Boa margem para evoluir em escuta e em vendas de mash.",
    ],
  },
  {
    id: 4,
    username: "william",
    password: "william",
    name: "William",
    initials: "WI",
    score: 7.5,
    color: "from-indigo-400 to-violet-500",
    soft: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
    level: "Bom",
    reasons: [
      "Entrega regular e sem grandes quedas, mas ainda falta brilho.",
      "Atendimento às vezes fica seco e objetivo demais.",
      "Conhecimento resolve o básico, porém pode aprofundar mais.",
      "Precisa melhorar tempo de resposta e presença no computador.",
    ],
  },
  {
    id: 5,
    username: "helder",
    password: "helder",
    name: "Helder",
    initials: "HE",
    score: 7.2,
    color: "from-purple-400 to-indigo-500",
    soft: "bg-purple-500/10 text-purple-300 border-purple-500/20",
    level: "Bom",
    reasons: [
      "Atendimento tem potencial, mas ainda oscila bastante.",
      "Tempo de resposta e presença no posto precisam melhorar.",
      "Em alguns casos faltou escutar melhor antes de responder.",
      "Pode crescer bastante em conhecimento e abordagem mais quente.",
    ],
  },
];

export const userDirectory: User[] = [
  ...baseAttendants.map((a) => ({ username: a.username, password: a.password, role: "employee" as const, employeeName: a.name })),
  { username: "admin", password: "admin", role: "admin" as const, employeeName: null },
];

export const defaultHistoryMap: Record<string, HistoryEntry[]> = {
  Andrade: [{ id: 1, type: "info", text: "Nota inicial registrada em 9.1", date: "Hoje" }],
  Leo: [{ id: 2, type: "info", text: "Nota inicial registrada em 8.4", date: "Hoje" }],
  Rallyson: [{ id: 3, type: "info", text: "Nota inicial registrada em 7.7", date: "Hoje" }],
  William: [{ id: 4, type: "info", text: "Nota inicial registrada em 7.5", date: "Hoje" }],
  Helder: [{ id: 5, type: "info", text: "Nota inicial registrada em 7.2", date: "Hoje" }],
};

export const initialContestsFallback: Contest[] = [
  {
    id: 101,
    by: "Leo",
    target: "Andrade",
    type: "Baixar nota",
    delta: -0.3,
    text: "Tá voando, mas em dia cheio às vezes segura atendimento demais antes de repassar.",
    status: "Pendente",
    createdAt: "Hoje",
  },
  {
    id: 102,
    by: "Rallyson",
    target: "Helder",
    type: "Aumentar nota",
    delta: 0.4,
    text: "Melhorou bastante na postura com cliente e tá mais presente no turno nos últimos dias.",
    status: "Pendente",
    createdAt: "Hoje",
  },
];

export const initialMessagesFallback: Message[] = [
  {
    id: 301,
    to: "Helder",
    text: "Bora melhorar esse tempo de resposta porque tu aguenta mais do que tá mostrando.",
    createdAt: "Hoje",
    createdAtMs: 301,
    read: false,
  },
  {
    id: 302,
    to: "Andrade",
    text: "Tá bem demais, mas em horário de pico tenta repassar mais rápido quando travar o fluxo.",
    createdAt: "Hoje",
    createdAtMs: 302,
    read: false,
  },
];

export const scoreReasons: ScoreReason[] = [
  {
    title: "+ Pontos que sobem a nota",
    icon: <ShieldCheck className="h-4 w-4" />,
    items: ["Atendimento", "Pontualidade", "Tempo de resposta", "Conhecimento", "Quantidade", "Resenha e vendas de Mash"],
  },
  {
    title: "- Pontos que derrubam a nota",
    icon: <MessageSquareWarning className="h-4 w-4" />,
    items: ["Avacalhar", "Falta de conhecimento", "Atendimento frio", "Atraso", "Não escutar", "Pontualidade ruim", "Tempo fora do computador"],
  },
];

export const rules: Rule[] = [
  { icon: <Smile className="h-4 w-4" />, title: "Atendimento", desc: "Ser educado, resolver com clareza e tratar o cliente como gente, não como ticket ambulante." },
  { icon: <Clock3 className="h-4 w-4" />, title: "Pontualidade", desc: "Chegar no horário e manter presença durante o turno. Sumir toda hora pesa contra." },
  { icon: <TimerReset className="h-4 w-4" />, title: "Tempo de resposta", desc: "Responder rápido, sem deixar atendimento mofando na fila." },
  { icon: <Brain className="h-4 w-4" />, title: "Conhecimento", desc: "Entender do serviço, passar confiança e não ficar chutando solução no escuro." },
  { icon: <ClipboardList className="h-4 w-4" />, title: "Quantidade", desc: "Produzir bem no dia, atender com ritmo e manter constância." },
  { icon: <Sparkles className="h-4 w-4" />, title: "Resenha", desc: "Participar da resenha do dia." },
  { icon: <BadgeDollarSign className="h-4 w-4" />, title: "Vendas de Mash", desc: "Quando fizer sentido, oferecer e converter bem. Ajuda na nota." },
];
