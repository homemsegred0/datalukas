import { User, History, Scale, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../utils/helpers';
import type { AuthUser, Attendant, Contest, HistoryEntry, ContestForm } from '../types';

interface EmployeePanelProps {
  currentUser: AuthUser;
  attendants: Attendant[];
  contests: Contest[];
  historyMap: Record<string, HistoryEntry[]>;
  form: ContestForm;
  setForm: React.Dispatch<React.SetStateAction<ContestForm>>;
  submitContest: (e: React.FormEvent) => void;
}

export default function EmployeePanel({ 
  currentUser, 
  attendants, 
  contests, 
  historyMap, 
  form, 
  setForm, 
  submitContest 
}: EmployeePanelProps) {
  const me = attendants.find((a) => a.name === currentUser.employeeName);
  const myContests = contests.filter((c) => c.by === currentUser.employeeName);
  const myHistory = historyMap[currentUser.employeeName!] || [];

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

          <div className="rounded-3xl border border-white/8 bg-secondary p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl border text-sm font-bold", me.soft)}>{me.initials}</div>
              <div>
                <div className="text-lg font-semibold text-white">{me.name}</div>
                <div className="text-sm text-zinc-500">Sua nota atual</div>
              </div>
            </div>

            <div className="mb-3 flex items-end justify-between gap-4">
              <div className="text-4xl font-bold text-white">{me.score.toFixed(1)}</div>
              <div className="text-sm text-zinc-500">{me.level}</div>
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
                <div key={entry.id} className="rounded-2xl border border-white/8 bg-secondary p-4">
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
                <input value={currentUser.employeeName || ''} disabled className="w-full rounded-2xl border border-white/10 bg-tertiary px-4 py-3 text-zinc-400 outline-none" />
              </label>
              <label className="space-y-2 text-sm">
                <span className="text-zinc-400">Alvo</span>
                <select
                  value={form.target}
                  onChange={(e) => setForm((p) => ({ ...p, target: e.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-tertiary px-4 py-3 text-white outline-none transition focus:border-blue-400/40"
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
                  className="w-full rounded-2xl border border-white/10 bg-tertiary px-4 py-3 text-white outline-none transition focus:border-blue-400/40"
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
                  className="w-full rounded-2xl border border-white/10 bg-tertiary px-4 py-3 text-white outline-none transition focus:border-blue-400/40"
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
                className="w-full resize-none rounded-2xl border border-white/10 bg-tertiary px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-400/40"
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
                <div className="rounded-2xl border border-white/8 bg-secondary p-4 text-sm text-zinc-500">Nenhuma contestação enviada ainda.</div>
              ) : (
                myContests.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-white/8 bg-secondary p-4">
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
