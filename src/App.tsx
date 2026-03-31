import { useState, useMemo, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Ranking from './components/Ranking';
import Rules from './components/Rules';
import EmployeePanel from './components/EmployeePanel';
import Mailbox from './components/Mailbox';
import AdminPanel from './components/AdminPanel';
import { baseAttendants, defaultHistoryMap, initialContestsFallback, initialMessagesFallback } from './data/constants';
import { cn, scoreLevel } from './utils/helpers';
import type { Attendant, Contest, Message, HistoryEntry, ContestForm, AdminEditForm, ComposeMessageForm } from './types';

function AppContent() {
  const { user, signOut } = useAuth();
  const [attendants, setAttendants] = useState<Attendant[]>(baseAttendants);
  const [contests, setContests] = useState<Contest[]>(initialContestsFallback);
  const [historyMap, setHistoryMap] = useState<Record<string, HistoryEntry[]>>(defaultHistoryMap);
  const [messages, setMessages] = useState<Message[]>(initialMessagesFallback);
  const [activeTab, setActiveTab] = useState('ranking');
  const [employeeForm, setEmployeeForm] = useState<ContestForm>({ target: 'Andrade', type: 'Aumentar nota', delta: 0.2, text: '' });
  const [adminEdit, setAdminEdit] = useState<AdminEditForm>({ target: 'Andrade', newScore: 9.1, reason: '' });
  const [composeMessage, setComposeMessage] = useState<ComposeMessageForm>({ to: 'Andrade', text: '' });
  const [seeding, setSeeding] = useState(false);

  const ranking = useMemo(() => [...attendants].sort((a, b) => b.score - a.score), [attendants]);

  const unreadCount = useMemo(() => {
    if (!user || user.role !== 'employee') return 0;
    return messages.filter((m) => m.to === user.employeeName && !m.read).length;
  }, [messages, user]);

  useEffect(() => {
    if (user?.role === 'employee' && activeTab === 'recados') {
      setMessages((prev) =>
        prev.map((m) => (m.to === user.employeeName && !m.read ? { ...m, read: true } : m))
      );
    }
  }, [activeTab, user]);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const addHistory = (employeeName: string, text: string) => {
    const newEntry: HistoryEntry = {
      id: Date.now(),
      text,
      date: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
    };
    setHistoryMap((prev) => ({
      ...prev,
      [employeeName]: [newEntry, ...(prev[employeeName] || [])],
    }));
  };

  const updateEmployeeScore = (targetName: string, newScore: number, text: string) => {
    setAttendants((prev) =>
      prev.map((a) =>
        a.name === targetName
          ? { ...a, score: Math.max(0, Math.min(10, Number(newScore.toFixed(1)))), level: scoreLevel(newScore) }
          : a
      )
    );
    addHistory(targetName, text);
  };

  const submitContest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeForm.text.trim() || !user?.employeeName) return;

    const newContest: Contest = {
      id: Date.now(),
      by: user.employeeName,
      target: employeeForm.target,
      type: employeeForm.type,
      delta: Number(employeeForm.type === 'Baixar nota' ? -Math.abs(employeeForm.delta) : Math.abs(employeeForm.delta)),
      text: employeeForm.text,
      status: 'Pendente',
      createdAt: 'Agora',
      createdAtMs: Date.now(),
    };

    setContests((prev) => [newContest, ...prev]);
    setEmployeeForm((p) => ({ ...p, text: '', delta: 0.2 }));
    addHistory(user.employeeName, `Você enviou uma contestação sobre ${employeeForm.target}.`);
  };

  const submitMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeMessage.text.trim() || !user?.employeeName) return;

    const newMessage: Message = {
      id: Date.now(),
      to: composeMessage.to,
      text: composeMessage.text,
      read: false,
      createdAt: 'Agora',
      createdAtMs: Date.now(),
    };

    setMessages((prev) => [newMessage, ...prev]);
    setComposeMessage((p) => ({ ...p, text: '' }));
    addHistory(user.employeeName, `Você enviou um recado anônimo para ${composeMessage.to}.`);
  };

  const approveContest = (id: string | number) => {
    const contest = contests.find((c) => c.id === id);
    if (!contest || contest.status !== 'Pendente') return;

    const target = attendants.find((a) => a.name === contest.target);
    if (!target) return;

    const next = Math.max(0, Math.min(10, Number((target.score + contest.delta).toFixed(1))));
    updateEmployeeScore(contest.target, next, `Sua nota foi alterada para ${next.toFixed(1)} após contestação aprovada de ${contest.by}.`);
    setContests((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'Aprovada' as const } : c)));
  };

  const rejectContest = (id: string | number) => {
    const contest = contests.find((c) => c.id === id);
    if (!contest || contest.status !== 'Pendente') return;
    setContests((prev) => prev.map((c) => (c.id === id ? { ...c, status: 'Rejeitada' as const } : c)));
    addHistory(contest.by, `Sua contestação contra ${contest.target} foi rejeitada pelo admin.`);
  };

  const applyAdminEdit = () => {
    if (!adminEdit.reason.trim()) return;
    updateEmployeeScore(adminEdit.target, adminEdit.newScore, `Admin ajustou sua nota para ${Number(adminEdit.newScore).toFixed(1)}. Motivo: ${adminEdit.reason}`);
    setAdminEdit((p) => ({ ...p, reason: '' }));
  };

  const seedDatabase = () => {
    setSeeding(true);
    setTimeout(() => {
      setAttendants(baseAttendants);
      setSeeding(false);
    }, 1000);
  };

  // Initialize forms based on user
  useEffect(() => {
    if (user?.role === 'employee') {
      setEmployeeForm((p) => ({ ...p, target: user.employeeName! }));
      const firstOther = baseAttendants.find((a) => a.name !== user.employeeName)?.name || user.employeeName!;
      setComposeMessage({ to: firstOther, text: '' });
    }
  }, [user]);

  if (!user) {
    return null; // ProtectedRoute will handle this
  }

  const visibleTabs = user.role === 'admin'
    ? [
        { id: 'ranking', label: 'Ranking' },
        { id: 'admin', label: 'Painel Admin' },
        { id: 'regras', label: 'Regras & Notas' },
      ]
    : [
        { id: 'ranking', label: 'Ranking' },
        { id: 'employee', label: 'Meu Painel' },
        { id: 'recados', label: 'Caixinha de Recado', badge: unreadCount },
        { id: 'regras', label: 'Regras & Notas' },
      ];

  return (
    <div className="min-h-screen bg-primary text-zinc-100">
      <div className="absolute inset-0 bg-gradient-radial" />

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
                Logado como <span className="font-medium text-white">{user.role === 'admin' ? 'Admin' : user.employeeName}</span>
              </div>
              <button onClick={handleLogout} className="inline-flex items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-2 text-sm text-zinc-300 transition hover:bg-white/[0.06]">
                <LogOut className="h-4 w-4" /> Sair
              </button>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2 md:gap-6">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn('relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition', activeTab === tab.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-300')}
              >
                {activeTab === tab.id && <motion.span layoutId="tabLine" className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-blue-400" />}
                <span>{tab.label}</span>
                {tab.badge && tab.badge > 0 && (
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-[11px] font-medium text-cyan-300">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </motion.header>

        <AnimatePresence mode="wait">
          {activeTab === 'ranking' && <Ranking key="ranking" attendants={ranking} />}
          {activeTab === 'regras' && <Rules key="regras" />}
          {activeTab === 'employee' && user.role === 'employee' && (
            <motion.section key="employee" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}>
              <EmployeePanel
                currentUser={user}
                attendants={ranking}
                contests={contests}
                historyMap={historyMap}
                form={employeeForm}
                setForm={setEmployeeForm}
                submitContest={submitContest}
              />
            </motion.section>
          )}
          {activeTab === 'recados' && user.role === 'employee' && (
            <motion.section key="recados" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}>
              <Mailbox
                currentUser={user}
                attendants={ranking}
                messages={messages}
                composeMessage={composeMessage}
                setComposeMessage={setComposeMessage}
                submitMessage={submitMessage}
              />
            </motion.section>
          )}
          {activeTab === 'admin' && user.role === 'admin' && (
            <motion.section key="admin" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}>
              <AdminPanel
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

export default function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AppContent />
      </ProtectedRoute>
    </AuthProvider>
  );
}
