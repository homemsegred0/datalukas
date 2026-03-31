import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Star,
  ShieldCheck,
  MessageSquareWarning,
  ClipboardList,
  Clock3,
  BadgeDollarSign,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertCircle,
  User,
  Scale,
  Search,
  TimerReset,
  Brain,
  Smile,
  LogIn,
  LogOut,
  Lock,
  Edit3,
  History,
  Users,
  Mail,
  Send,
  Database,
} from "lucide-react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  doc,
  updateDoc,
  setDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzJuBiwOtvpV4aspVlK4NuCatY3HWe4fs",
  authDomain: "datalukas-57788.firebaseapp.com",
  projectId: "datalukas-57788",
  storageBucket: "datalukas-57788.firebasestorage.app",
  messagingSenderId: "280893306804",
  appId: "1:280893306804:web:fc58b7302c533def6624e1",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

const baseAttendants = [
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

const userDirectory = [
  ...baseAttendants.map((a) => ({ username: a.username, password: a.password, role: "employee", employeeName: a.name })),
  { username: "admin", password: "admin", role: "admin", employeeName: null },
];

const defaultHistoryMap = {
  Andrade: [{ id: 1, type: "info", text: "Nota inicial registrada em 9.1", date: "Hoje" }],
  Leo: [{ id: 2, type: "info", text: "Nota inicial registrada em 8.4", date: "Hoje" }],
  Rallyson: [{ id: 3, type: "info", text: "Nota inicial registrada em 7.7", date: "Hoje" }],
  William: [{ id: 4, type: "info", text: "Nota inicial registrada em 7.5", date: "Hoje" }],
  Helder: [{ id: 5, type: "info", text: "Nota inicial registrada em 7.2", date: "Hoje" }],
};

const initialContestsFallback = [
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

const initialMessagesFallback = [
  {
    id: 301,
    to: "Helder",
    text: "Bora melhorar esse tempo de resposta porque tu aguenta mais do que tá mostrando.",
    createdAt: "Hoje",
    read: false,
  },
  {
    id: 302,
    to: "Andrade",
    text: "Tá bem demais, mas em horário de pico tenta repassar mais rápido quando travar o fluxo.",
    createdAt: "Hoje",
    read: false,
  },
];

const scoreReasons = [
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

const rules = [
  { icon: <Smile className="h-4 w-4" />, title: "Atendimento", desc: "Ser educado, resolver com clareza e tratar o cliente como gente, não como ticket ambulante." },
  { icon: <Clock3 className="h-4 w-4" />, title: "Pontualidade", desc: "Chegar no horário e manter presença durante o turno. Sumir toda hora pesa contra." },
  { icon: <TimerReset className="h-4 w-4" />, title: "Tempo de resposta", desc: "Responder rápido, sem deixar atendimento mofando na fila." },
  { icon: <Brain className="h-4 w-4" />, title: "Conhecimento", desc: "Entender do serviço, passar confiança e não ficar chutando solução no escuro." },
  { icon: <ClipboardList className="h-4 w-4" />, title: "Quantidade", desc: "Produzir bem no dia, atender com ritmo e manter constância." },
  { icon: <Sparkles className="h-4 w-4" />, title: "Resenha", desc: "Participar da resenha do dia." },
  { icon: <BadgeDollarSign className="h-4 w-4" />, title: "Vendas de Mash", desc: "Quando fizer sentido, oferecer e converter bem. Ajuda na nota." },
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function scoreLevel(score) {
  if (score >= 9) return "Excelente";
  if (score >= 8) return "Ótimo";
  if (score >= 7) return "Bom";
  if (score >= 6) return "Mediano";
  return "Ruim";
}

function formatCreatedAt(value) {
  if (!value) return "Agora";
  if (typeof value === "string") return value;
  if (value?.toDate) {
    return value.toDate().toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  }
  return "Agora";
}

function loginToEmail(login) {
  return `${login.toLowerCase()}@datalukas.local`;
}

function attendantByName(name) {
  return baseAttendants.find((a) => a.name === name);
}

function ScoreBar({ item, index }) {
  const width = `${(item.score / 10) * 100}%`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 * index, duration: 0.4 }}
      className="group relative z-0 overflow-visible rounded-2xl border border-white/8 bg-white/[0.035] p-4 backdrop-blur-sm transition group-hover:z-30"
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r from-white/[0.03] to-transparent" />

      <div className="relative flex items-center gap-3 md:gap-4">
        <div className="w-8 text-center text-xs font-semibold text-zinc-500">
          {index === 0 ? <Star className="mx-auto h-4 w-4 text-amber-300" /> : `${index + 1}º`}
        </div>

        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl border text-xs font-bold", item.soft)}>
          {item.initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center justify-between gap-4">
            <div>
              <div className="font-semibold text-white">{item.name}</div>
              <div className="text-xs text-zinc-500">Passe o mouse para ver a explicação</div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-white">{item.score.toFixed(1)}</div>
              <div className="text-xs text-zinc-500">{scoreLevel(item.score)}</div>
            </div>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width }}
              transition={{ duration: 0.9, delay: 0.12 * index }}
              className={cn("h-full rounded-full bg-gradient-to-r", item.color)}
            />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-full left-4 right-4 z-40 mb-3 -translate-y-2 rounded-2xl border border-white/10 bg-zinc-950/97 p-4 opacity-0 shadow-2xl transition-all duration-250 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 md:left-16 md:right-24">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
          <Search className="h-4 w-4 text-zinc-400" />
          Motivos da nota de {item.name}
        </div>
        <ul className="space-y-2 text-sm text-zinc-300">
          {item.reasons.map((reason) => (
            <li key={reason} className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-zinc-500" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function PodiumCard({ item, place }) {
  const badge = {
    1: { label: "1º lugar", icon: <Crown className="h-5 w-5 text-amber-300" /> },
    2: { label: "2º lugar", icon: <Star className="h-4 w-4 text-slate-300" /> },
    3: { label: "3º lugar", icon: <Star className="h-4 w-4 text-orange-300" /> },
  }[place];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={cn(
        "relative overflow-hidden rounded-3xl border p-6 md:p-8",
        place === 1 ? "border-amber-400/25 bg-amber-400/[0.05]" : "border-white/8 bg-white/[0.03]"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
      <div className="relative flex min-h-[150px] flex-col items-center justify-center text-center">
        <div className="mb-2 text-zinc-400">{badge.label}</div>
        <div className="mb-3">{badge.icon}</div>
        <div className={cn("mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border text-sm font-bold", item.soft)}>
          {item.initials}
        </div>
        <div className="text-lg font-semibold text-white">{item.name}</div>
        <div className={cn("mt-1 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent", item.color)}>
          {item.score.toFixed(1)}
        </div>
      </div>
    </motion.div>
  );
}

function RankingView({ attendants }) {
  const podium = [attendants[1], attendants[0], attendants[2]].filter(Boolean);

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28 }}
      className="space-y-6"
    >
      <div>
        <div className="mb-3 text-xs uppercase tracking-[0.22em] text-zinc-500">Pódio</div>
        <div className="grid gap-4 lg:grid-cols-3">
          {podium[0] && <PodiumCard item={podium[0]} place={2} />}
          {podium[1] && <PodiumCard item={podium[1]} place={1} />}
          {podium[2] && <PodiumCard item={podium[2]} place={3} />}
        </div>
      </div>

      <div>
        <div className="mb-3 text-xs uppercase tracking-[0.22em] text-zinc-500">Classificação completa</div>
        <div className="space-y-3 pt-24 md:pt-28">
          {attendants.map((item, index) => (
            <ScoreBar key={item.username} item={item} index={index} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function RulesView() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.28 }}
      className="space-y-6"
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {scoreReasons.map((group) => (
          <div key={group.title} className="rounded-3xl border border-white/8 bg-white/[0.035] p-5 md:p-6">
            <div className="mb-4 flex items-center gap-2 text-white">
              {group.icon}
              <h2 className="text-lg font-semibold">{group.title}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <span key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-sm text-zinc-300">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-5 md:p-6">
        <div className="mb-5 flex items-center gap-2 text-white">
          <ClipboardList className="h-4 w-4 text-blue-300" />
          <h2 className="text-lg font-semibold">Como a nota é pensada</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rules.map((rule, index) => (
            <motion.div
              key={rule.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-white/8 bg-[#09101d] p-4"
            >
              <div className="mb-3 flex items-center gap-2 text-white">
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2 text-zinc-300">{rule.icon}</div>
                <h3 className="font-semibold">{rule.title}</h3>
              </div>
              <p className="text-sm leading-6 text-zinc-400">{rule.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function LoginScreen({ loginForm, setLoginForm, loginError, handleLogin, firebaseStatus }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid min-h-[72vh] place-items-center">
      <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#07101d]/95 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 ring-1 ring-blue-400/20">
            <LogIn className="h-5 w-5 text-blue-200" />
          </div>
          <div>
            <div className="text-xl font-semibold text-white">Entrar no DataLukas</div>
            <div className="text-sm text-zinc-500">Funcionário ou admin</div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block space-y-2 text-sm">
            <span className="text-zinc-400">Login</span>
            <input
              value={loginForm.username}
              onChange={(e) => setLoginForm((p) => ({ ...p, username: e.target.value }))}
              placeholder="ex: helder"
              className="w-full rounded-2xl border border-white/10 bg-[#0a1120] px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-400/40"
            />
          </label>

          <label className="block space-y-2 text-sm">
            <span className="text-zinc-400">Senha</span>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                placeholder="ex: helder"
                className="w-full rounded-2xl border border-white/10 bg-[#0a1120] py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-400/40"
              />
            </div>
          </label>

          {loginError && <div className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">{loginError}</div>}
          {firebaseStatus && <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-300">{firebaseStatus}</div>}

          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 font-medium text-white transition hover:brightness-110 active:scale-[0.99]"
          >
            Entrar
          </button>
        </form>

        <div className="mt-5 space-y-2 rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm text-zinc-400">
          <div><span className="font-medium text-zinc-200">Funcionário:</span> login e senha são o próprio nome em minúsculo.</div>
          <div><span className="font-medium text-zinc-200">Firebase por trás:</span> o sistema usa <code className="rounded bg-white/5 px-1 py-0.5">login@datalukas.local</code>.</div>
          <div><span className="font-medium text-zinc-200">Admin:</span> login <code className="rounded bg-white/5 px-1 py-0.5">admin</code> e senha <code className="rounded bg-white/5 px-1 py-0.5">admin</code>.</div>
        </div>
      </div>
    </motion.div>
  );
}

function EmployeeView({ currentUser, attendants, contests, historyMap, form, setForm, submitContest }) {
  const me = attendants.find((a) => a.name === currentUser.employeeName);
  const myContests = contests.filter((c) => c.by === currentUser.employeeName);
  const myHistory = historyMap[currentUser.employeeName] || [];

  if (!me) return null;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-5 md:p-6">
          <div className="mb-1 flex items-center gap-2 text-white">
            <User className="h-4 w-4 text-blue-300" />
            <h2 className="text-lg font-semibold">Seu painel</h2>
          </div>
          <p className="mb-5 text-sm text-zinc-500">Aqui você vê sua nota atual, seu histórico e envia contestação.</p>

          <div className="rounded-3xl border border-white/8 bg-[#09101d] p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl border text-sm font-bold", me.soft)}>{me.initials}</div>
              <div>
                <div className="text-lg font-semibold text-white">{me.name}</div>
                <div className="text-sm text-zinc-500">Sua nota atual</div>
              </div>
            </div>

            <div className="mb-3 flex items-end justify-between gap-4">
              <div className="text-4xl font-bold text-white">{me.score.toFixed(1)}</div>
              <div className="text-sm text-zinc-500">{scoreLevel(me.score)}</div>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/8">
              <div className={cn("h-full rounded-full bg-gradient-to-r", me.color)} style={{ width: `${(me.score / 10) * 100}%` }} />
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-3 flex items-center gap-2 text-white">
              <History className="h-4 w-4 text-violet-300" />
              <h3 className="font-semibold">Histórico da sua nota</h3>
            </div>
            <div className="space-y-3">
              {myHistory.map((entry) => (
                <div key={entry.id} className="rounded-2xl border border-white/8 bg-[#09101d] p-4">
                  <div className="mb-1 text-sm font-medium text-white">{entry.text}</div>
                  <div className="text-xs text-zinc-500">{entry.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-5 md:p-6">
          <div className="mb-1 flex items-center gap-2 text-white">
            <Scale className="h-4 w-4 text-emerald-300" />
            <h2 className="text-lg font-semibold">Nova contestação</h2>
          </div>
          <p className="mb-5 text-sm text-zinc-500">Você pode contestar sua nota ou falar do amiguinho. O admin decide se aprova.</p>

          <form onSubmit={submitContest} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span className="text-zinc-400">Quem está contestando</span>
                <input value={currentUser.employeeName} disabled className="w-full rounded-2xl border border-white/10 bg-[#0a1120] px-4 py-3 text-zinc-400 outline-none" />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-zinc-400">Alvo</span>
                <select
                  value={form.target}
                  onChange={(e) => setForm((p) => ({ ...p, target: e.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-[#0a1120] px-4 py-3 text-white outline-none transition focus:border-blue-400/40"
                >
                  {attendants.map((a) => (
                    <option key={a.username}>{a.name}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2 text-sm">
                <span className="text-zinc-400">Tipo</span>
                <select
                  value={form.type}
                  onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-[#0a1120] px-4 py-3 text-white outline-none transition focus:border-blue-400/40"
                >
                  <option>Aumentar nota</option>
                  <option>Baixar nota</option>
                </select>
              </label>

              <label className="space-y-2 text-sm">
                <span className="text-zinc-400">Ajuste sugerido</span>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="2"
                  value={form.delta}
                  onChange={(e) => setForm((p) => ({ ...p, delta: Number(e.target.value) }))}
                  className="w-full rounded-2xl border border-white/10 bg-[#0a1120] px-4 py-3 text-white outline-none transition focus:border-blue-400/40"
                />
              </label>
            </div>

            <label className="block space-y-2 text-sm">
              <span className="text-zinc-400">Justificativa</span>
              <textarea
                value={form.text}
                onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
                rows={5}
                placeholder="Ex: melhorei demais no turno, ou fulano atrasou, foi frio, sumiu do PC..."
                className="w-full resize-none rounded-2xl border border-white/10 bg-[#0a1120] px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-400/40"
              />
            </label>

            <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 font-medium text-white transition hover:brightness-110 active:scale-[0.99]">
              Enviar contestação
            </button>
          </form>

          <div className="mt-6">
            <div className="mb-3 flex items-center gap-2 text-white">
              <AlertCircle className="h-4 w-4 text-amber-300" />
              <h3 className="font-semibold">Suas contestações</h3>
            </div>
            <div className="space-y-3">
              {myContests.length === 0 ? (
                <div className="rounded-2xl border border-white/8 bg-[#09101d] p-4 text-sm text-zinc-500">Nenhuma contestação enviada ainda.</div>
              ) : (
                myContests.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-white/8 bg-[#09101d] p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="text-sm font-medium text-white">{c.target} • {c.type} {c.delta > 0 ? `+${c.delta.toFixed(1)}` : c.delta.toFixed(1)}</div>
                      <div className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium",
                        c.status === "Pendente" && "border-amber-400/20 bg-amber-400/10 text-amber-300",
                        c.status === "Aprovada" && "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
                        c.status === "Rejeitada" && "border-red-400/20 bg-red-400/10 text-red-300"
                      )}>{c.status}</div>
                    </div>
                    <p className="text-sm text-zinc-400">{c.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MailboxView({ currentUser, attendants, messages, composeMessage, setComposeMessage, submitMessage }) {
  const myMessages = messages.filter((m) => m.to === currentUser.employeeName).sort((a, b) => b.createdAtMs - a.createdAtMs);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
      <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-5 md:p-6">
        <div className="mb-1 flex items-center gap-2 text-white">
          <Send className="h-4 w-4 text-blue-300" />
          <h2 className="text-lg font-semibold">Mandar recado anônimo</h2>
        </div>
        <p className="mb-5 text-sm text-zinc-500">Escolha um funcionário e mande aquele recado sem assinatura. Vai pingar direto na caixinha dele.</p>

        <form onSubmit={submitMessage} className="space-y-4">
          <label className="block space-y-2 text-sm">
            <span className="text-zinc-400">Enviar para</span>
            <select
              value={composeMessage.to}
              onChange={(e) => setComposeMessage((p) => ({ ...p, to: e.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-[#0a1120] px-4 py-3 text-white outline-none transition focus:border-blue-400/40"
            >
              {attendants.filter((a) => a.name !== currentUser.employeeName).map((a) => (
                <option key={a.username}>{a.name}</option>
              ))}
            </select>
          </label>

          <label className="block space-y-2 text-sm">
            <span className="text-zinc-400">Mensagem</span>
            <textarea
              rows={6}
              value={composeMessage.text}
              onChange={(e) => setComposeMessage((p) => ({ ...p, text: e.target.value }))}
              placeholder="Ex: melhora a postura no suporte, tu tá indo bem, para de atrasar, vende mais mash..."
              className="w-full resize-none rounded-2xl border border-white/10 bg-[#0a1120] px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-400/40"
            />
          </label>

          <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-3 font-medium text-white transition hover:brightness-110 active:scale-[0.99]">
            Enviar recado
          </button>
        </form>
      </div>

      <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-5 md:p-6">
        <div className="mb-1 flex items-center gap-2 text-white">
          <Mail className="h-4 w-4 text-violet-300" />
          <h2 className="text-lg font-semibold">Sua Caixinha de Recado</h2>
        </div>
        <p className="mb-5 text-sm text-zinc-500">As mensagens chegam de forma anônima. Você vê o recado, mas não vê quem mandou.</p>

        <div className="space-y-4">
          {myMessages.length === 0 ? (
            <div className="rounded-2xl border border-white/8 bg-[#09101d] p-4 text-sm text-zinc-500">Nenhum recado chegou ainda.</div>
          ) : (
            myMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-2xl border p-4",
                  message.read ? "border-white/8 bg-[#09101d]" : "border-cyan-400/15 bg-cyan-400/5"
                )}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-white">Remetente anônimo</div>
                  <div className={cn(
                    "rounded-full border px-3 py-1 text-xs",
                    message.read ? "border-white/10 bg-white/[0.03] text-zinc-400" : "border-cyan-400/20 bg-cyan-400/10 text-cyan-300"
                  )}>
                    {message.read ? "Lido" : "Novo"}
                  </div>
                </div>
                <p className="mb-2 text-sm leading-6 text-zinc-300">{message.text}</p>
                <div className="text-xs text-zinc-500">{message.createdAt}</div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function AdminView({ attendants, contests, historyMap, approveContest, rejectContest, adminEdit, setAdminEdit, applyAdminEdit, seedDatabase, seeding }) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-cyan-400/10 bg-cyan-400/5 p-4 text-sm text-cyan-200">
        Se ainda for a primeira vez usando o Firebase, clique em <strong>Inicializar Firebase</strong> para jogar os atendentes padrão no banco.
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-2 text-white">
                <Users className="h-4 w-4 text-blue-300" />
                <h2 className="text-lg font-semibold">Fila do admin</h2>
              </div>
              <p className="text-sm text-zinc-500">Só você vê essa parte. Aprova, rejeita e muda nota manualmente.</p>
            </div>
            <button onClick={seedDatabase} disabled={seeding} className="inline-flex items-center gap-2 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300 transition hover:bg-cyan-400/15 disabled:opacity-50">
              <Database className="h-4 w-4" /> {seeding ? "Inicializando..." : "Inicializar Firebase"}
            </button>
          </div>

          <div className="space-y-4">
            {contests.map((c, index) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                className="rounded-2xl border border-white/8 bg-[#09101d] p-4"
              >
                <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-zinc-400">
                      <User className="h-4 w-4" />
                      {c.by} contestando {c.target}
                    </div>
                    <div className="text-base font-semibold text-white">
                      {c.type} <span className={c.delta > 0 ? "text-emerald-300" : "text-red-300"}>{c.delta > 0 ? `+${c.delta.toFixed(1)}` : c.delta.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium",
                    c.status === "Pendente" && "border-amber-400/20 bg-amber-400/10 text-amber-300",
                    c.status === "Aprovada" && "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
                    c.status === "Rejeitada" && "border-red-400/20 bg-red-400/10 text-red-300"
                  )}>{c.status}</div>
                </div>

                <p className="mb-4 text-sm leading-6 text-zinc-300">{c.text}</p>

                {c.status === "Pendente" ? (
                  <div className="flex flex-wrap gap-3">
                    <button onClick={() => approveContest(c.id)} className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-300 transition hover:bg-emerald-400/15">
                      <CheckCircle2 className="h-4 w-4" /> Aprovar
                    </button>
                    <button onClick={() => rejectContest(c.id)} className="inline-flex items-center gap-2 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2 text-sm text-red-300 transition hover:bg-red-400/15">
                      <XCircle className="h-4 w-4" /> Rejeitar
                    </button>
                  </div>
                ) : (
                  <div className="text-xs text-zinc-500">{c.status === "Aprovada" ? "Mudança aplicada ao ranking geral." : "Pedido negado. Nenhuma mudança aplicada."}</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-white/8 bg-white/[0.035] p-5 md:p-6">
          <div className="mb-1 flex items-center gap-2 text-white">
            <Edit3 className="h-4 w-4 text-violet-300" />
            <h2 className="text-lg font-semibold">Editar nota manualmente</h2>
          </div>
          <p className="mb-5 text-sm text-zinc-500">Ajuste direto no placar. Isso entra no histórico do funcionário.</p>

          <div className="space-y-4">
            <label className="block space-y-2 text-sm">
              <span className="text-zinc-400">Funcionário</span>
              <select value={adminEdit.target} onChange={(e) => setAdminEdit((p) => ({ ...p, target: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-[#0a1120] px-4 py-3 text-white outline-none transition focus:border-blue-400/40">
                {attendants.map((a) => <option key={a.username}>{a.name}</option>)}
              </select>
            </label>

            <label className="block space-y-2 text-sm">
              <span className="text-zinc-400">Nova nota</span>
              <input type="number" step="0.1" min="0" max="10" value={adminEdit.newScore} onChange={(e) => setAdminEdit((p) => ({ ...p, newScore: Number(e.target.value) }))} className="w-full rounded-2xl border border-white/10 bg-[#0a1120] px-4 py-3 text-white outline-none transition focus:border-blue-400/40" />
            </label>

            <label className="block space-y-2 text-sm">
              <span className="text-zinc-400">Motivo</span>
              <textarea value={adminEdit.reason} onChange={(e) => setAdminEdit((p) => ({ ...p, reason: e.target.value }))} rows={4} placeholder="Ex: atrasou, melhorou em atendimento, respondeu mais rápido, vendeu mais mash..." className="w-full resize-none rounded-2xl border border-white/10 bg-[#0a1120] px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-400/40" />
            </label>

            <button onClick={applyAdminEdit} className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3 font-medium text-white transition hover:brightness-110 active:scale-[0.99]">
              Aplicar edição
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {attendants.map((a) => (
              <div key={a.username} className="rounded-2xl border border-white/8 bg-[#09101d] p-4">
                <div className="mb-1 flex items-center justify-between gap-3">
                  <div className="font-medium text-white">{a.name}</div>
                  <div className="text-sm text-zinc-400">{a.score.toFixed(1)}</div>
                </div>
                <div className="text-xs text-zinc-500">Último registro: {(historyMap[a.name] || [])[0]?.text || "Sem histórico"}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DataLukasSite() {
  const [attendants, setAttendants] = useState(baseAttendants);
  const [contests, setContests] = useState(initialContestsFallback);
  const [historyMap, setHistoryMap] = useState(defaultHistoryMap);
  const [messages, setMessages] = useState(initialMessagesFallback);
  const [activeTab, setActiveTab] = useState("ranking");
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [firebaseStatus, setFirebaseStatus] = useState("Firebase ligado. Faça login com o formato helder / helder.");
  const [employeeForm, setEmployeeForm] = useState({ target: "Andrade", type: "Aumentar nota", delta: 0.2, text: "" });
  const [adminEdit, setAdminEdit] = useState({ target: "Andrade", newScore: 9.1, reason: "" });
  const [composeMessage, setComposeMessage] = useState({ to: "Andrade", text: "" });
  const [seeding, setSeeding] = useState(false);

  const ranking = useMemo(() => [...attendants].sort((a, b) => b.score - a.score), [attendants]);

  const unreadCount = useMemo(() => {
    if (!currentUser || currentUser.role !== "employee") return 0;
    return messages.filter((m) => m.to === currentUser.employeeName && !m.read).length;
  }, [messages, currentUser]);

  useEffect(() => {
    const unsubAttendants = onSnapshot(collection(db, "attendants"), (snapshot) => {
      if (snapshot.empty) {
        setAttendants(baseAttendants);
        return;
      }

      const firestoreAttendants = snapshot.docs.map((snap) => {
        const data = snap.data();
        const base = baseAttendants.find((a) => a.username === snap.id) || {};
        return {
          ...base,
          ...data,
          username: snap.id,
          score: typeof data.score === "number" ? data.score : base.score,
          reasons: Array.isArray(data.reasons) && data.reasons.length ? data.reasons : base.reasons,
          level: scoreLevel(typeof data.score === "number" ? data.score : base.score || 0),
        };
      });

      setAttendants(firestoreAttendants);
    });

    const unsubContests = onSnapshot(collection(db, "contests"), (snapshot) => {
      if (snapshot.empty) {
        setContests(initialContestsFallback);
        return;
      }

      const next = snapshot.docs.map((snap) => ({
        id: snap.id,
        ...snap.data(),
        createdAt: formatCreatedAt(snap.data().createdAt),
      }));
      setContests(next.sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0)));
    });

    const unsubHistory = onSnapshot(collection(db, "history"), (snapshot) => {
      if (snapshot.empty) {
        setHistoryMap(defaultHistoryMap);
        return;
      }

      const nextMap = {};
      snapshot.docs.forEach((snap) => {
        const data = snap.data();
        const employeeName = data.employeeName;
        if (!employeeName) return;
        if (!nextMap[employeeName]) nextMap[employeeName] = [];
        nextMap[employeeName].push({
          id: snap.id,
          text: data.text,
          date: formatCreatedAt(data.createdAt),
        });
      });

      Object.keys(nextMap).forEach((key) => {
        nextMap[key].sort((a, b) => 0);
      });

      setHistoryMap({ ...defaultHistoryMap, ...nextMap });
    });

    const unsubMessages = onSnapshot(collection(db, "messages"), (snapshot) => {
      if (snapshot.empty) {
        setMessages(initialMessagesFallback.map((m) => ({ ...m, createdAtMs: m.id })));
        return;
      }

      const next = snapshot.docs.map((snap) => {
        const data = snap.data();
        return {
          id: snap.id,
          ...data,
          createdAt: formatCreatedAt(data.createdAt),
          createdAtMs: data.createdAt?.toMillis ? data.createdAt.toMillis() : Date.now(),
        };
      });
      setMessages(next);
    });

    return () => {
      unsubAttendants();
      unsubContests();
      unsubHistory();
      unsubMessages();
    };
  }, []);

  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (currentUser?.role !== "employee" || activeTab !== "recados") return;
      const unread = messages.filter((m) => m.to === currentUser.employeeName && !m.read);
      for (const message of unread) {
        await updateDoc(doc(db, "messages", message.id), { read: true });
      }
    };

    markMessagesAsRead();
  }, [activeTab, currentUser, messages]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = loginForm.username.trim().toLowerCase();
    const password = loginForm.password.trim();

    if (username === "admin" && password === "admin") {
      setCurrentUser({ role: "admin", employeeName: null, username: "admin" });
      setLoginError("");
      setActiveTab("ranking");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, loginToEmail(username), password);
      const found = userDirectory.find((u) => u.username === username);
      if (!found) {
        setLoginError("Usuário não encontrado.");
        return;
      }

      setCurrentUser(found);
      setLoginError("");
      setActiveTab("ranking");
      setFirebaseStatus("Login feito pelo Firebase com sucesso.");

      if (found.role === "employee") {
        setEmployeeForm((p) => ({ ...p, target: found.employeeName }));
        const firstOther = baseAttendants.find((a) => a.name !== found.employeeName)?.name || found.employeeName;
        setComposeMessage({ to: firstOther, text: "" });
      }
    } catch (error) {
      setLoginError("Login ou senha inválidos no Firebase.");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {}
    setCurrentUser(null);
    setLoginForm({ username: "", password: "" });
    setLoginError("");
  };

  const addHistory = async (employeeName, text) => {
    await addDoc(collection(db, "history"), {
      employeeName,
      text,
      createdAt: serverTimestamp(),
    });
  };

  const updateEmployeeScore = async (targetName, newScore, text) => {
    const target = attendantByName(targetName);
    if (!target) return;

    await updateDoc(doc(db, "attendants", target.username), {
      score: Math.max(0, Math.min(10, Number(newScore.toFixed(1)))),
      level: scoreLevel(newScore),
    });

    await addHistory(targetName, text);
  };

  const submitContest = async (e) => {
    e.preventDefault();
    if (!employeeForm.text.trim() || !currentUser?.employeeName) return;

    await addDoc(collection(db, "contests"), {
      by: currentUser.employeeName,
      target: employeeForm.target,
      type: employeeForm.type,
      delta: Number(employeeForm.type === "Baixar nota" ? -Math.abs(employeeForm.delta) : Math.abs(employeeForm.delta)),
      text: employeeForm.text,
      status: "Pendente",
      createdAt: serverTimestamp(),
    });

    setEmployeeForm((p) => ({ ...p, text: "", delta: 0.2 }));
    await addHistory(currentUser.employeeName, `Você enviou uma contestação sobre ${employeeForm.target}.`);
  };

  const submitMessage = async (e) => {
    e.preventDefault();
    if (!composeMessage.text.trim() || !currentUser?.employeeName) return;

    await addDoc(collection(db, "messages"), {
      to: composeMessage.to,
      text: composeMessage.text,
      read: false,
      createdAt: serverTimestamp(),
    });

    setComposeMessage((p) => ({ ...p, text: "" }));
    await addHistory(currentUser.employeeName, `Você enviou um recado anônimo para ${composeMessage.to}.`);
  };

  const approveContest = async (id) => {
    const contest = contests.find((c) => c.id === id);
    if (!contest || contest.status !== "Pendente") return;

    const target = attendants.find((a) => a.name === contest.target);
    if (!target) return;

    const next = Math.max(0, Math.min(10, Number((target.score + contest.delta).toFixed(1))));
    await updateEmployeeScore(contest.target, next, `Sua nota foi alterada para ${next.toFixed(1)} após contestação aprovada de ${contest.by}.`);
    await updateDoc(doc(db, "contests", id), { status: "Aprovada" });
  };

  const rejectContest = async (id) => {
    const contest = contests.find((c) => c.id === id);
    if (!contest || contest.status !== "Pendente") return;
    await updateDoc(doc(db, "contests", id), { status: "Rejeitada" });
    await addHistory(contest.by, `Sua contestação contra ${contest.target} foi rejeitada pelo admin.`);
  };

  const applyAdminEdit = async () => {
    if (!adminEdit.reason.trim()) return;
    await updateEmployeeScore(adminEdit.target, adminEdit.newScore, `Admin ajustou sua nota para ${Number(adminEdit.newScore).toFixed(1)}. Motivo: ${adminEdit.reason}`);
    setAdminEdit((p) => ({ ...p, reason: "" }));
  };

  const seedDatabase = async () => {
    setSeeding(true);
    try {
      for (const attendant of baseAttendants) {
        await setDoc(doc(db, "attendants", attendant.username), {
          username: attendant.username,
          name: attendant.name,
          initials: attendant.initials,
          score: attendant.score,
          level: attendant.level,
          reasons: attendant.reasons,
        }, { merge: true });
      }

      setFirebaseStatus("Firebase inicializado com os atendentes padrão.");
    } finally {
      setSeeding(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#030814] text-zinc-100 selection:bg-white/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(48,104,255,0.14),_transparent_35%),radial-gradient(circle_at_80%_20%,_rgba(80,255,170,0.08),_transparent_25%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
          <header className="mb-8 flex items-center gap-3 border-b border-white/8 pb-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/20 ring-1 ring-blue-400/20">
              <span className="text-sm font-bold text-blue-200">D</span>
            </div>
            <div>
              <div className="text-xl font-semibold tracking-tight text-white">DataLukas</div>
              <div className="text-sm text-zinc-500">Internet UP</div>
            </div>
          </header>
          <LoginScreen loginForm={loginForm} setLoginForm={setLoginForm} loginError={loginError} handleLogin={handleLogin} firebaseStatus={firebaseStatus} />
        </div>
      </div>
    );
  }

  const visibleTabs = currentUser.role === "admin"
    ? [
        { id: "ranking", label: "Ranking" },
        { id: "admin", label: "Painel Admin" },
        { id: "regras", label: "Regras & Notas" },
      ]
    : [
        { id: "ranking", label: "Ranking" },
        { id: "employee", label: "Meu Painel" },
        { id: "recados", label: "Caixinha de Recado", badge: unreadCount },
        { id: "regras", label: "Regras & Notas" },
      ];

  return (
    <div className="min-h-screen bg-[#030814] text-zinc-100 selection:bg-white/20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(48,104,255,0.14),_transparent_35%),radial-gradient(circle_at_80%_20%,_rgba(80,255,170,0.08),_transparent_25%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-8">
        <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col gap-4 border-b border-white/8 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/20 ring-1 ring-blue-400/20">
                <span className="text-sm font-bold text-blue-200">D</span>
              </div>
              <div>
                <div className="text-xl font-semibold tracking-tight text-white">DataLukas</div>
                <div className="text-sm text-zinc-500">Internet UP</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-2 text-sm text-zinc-300">
                Logado como <span className="font-medium text-white">{currentUser.role === "admin" ? "Admin" : currentUser.employeeName}</span>
              </div>
              <button onClick={logout} className="inline-flex items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.06]">
                <LogOut className="h-4 w-4" /> Sair
              </button>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2 md:gap-6">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn("relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition", activeTab === tab.id ? "text-white" : "text-zinc-500 hover:text-zinc-300")}
              >
                {activeTab === tab.id && <motion.span layoutId="tabLine" className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-blue-400" />}
                <span>{tab.label}</span>
                {tab.badge > 0 && (
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-[11px] font-medium text-cyan-300">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </motion.header>

        <AnimatePresence mode="wait">
          {activeTab === "ranking" && <RankingView key="ranking" attendants={ranking} />}
          {activeTab === "regras" && <RulesView key="regras" />}
          {activeTab === "employee" && currentUser.role === "employee" && (
            <motion.section key="employee" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}>
              <EmployeeView
                currentUser={currentUser}
                attendants={ranking}
                contests={contests}
                historyMap={historyMap}
                form={employeeForm}
                setForm={setEmployeeForm}
                submitContest={submitContest}
              />
            </motion.section>
          )}
          {activeTab === "recados" && currentUser.role === "employee" && (
            <motion.section key="recados" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}>
              <MailboxView
                currentUser={currentUser}
                attendants={ranking}
                messages={messages}
                composeMessage={composeMessage}
                setComposeMessage={setComposeMessage}
                submitMessage={submitMessage}
              />
            </motion.section>
          )}
          {activeTab === "admin" && currentUser.role === "admin" && (
            <motion.section key="admin" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}>
              <AdminView
                attendants={ranking}
                contests={contests}
                historyMap={historyMap}
                approveContest={approveContest}
                rejectContest={rejectContest}
                adminEdit={adminEdit}
                setAdminEdit={setAdminEdit}
                applyAdminEdit={applyAdminEdit}
                seedDatabase={seedDatabase}
                seeding={seeding}
              />
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
