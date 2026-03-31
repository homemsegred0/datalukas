import { motion } from 'framer-motion';
import { Users, Edit3, Database, User, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '../utils/helpers';
import type { Attendant, Contest, HistoryEntry, AdminEditForm } from '../types';

interface AdminPanelProps {
  attendants: Attendant[];
  contests: Contest[];
  historyMap: Record<string, HistoryEntry[]>;
  approveContest: (id: string | number) => void;
  rejectContest: (id: string | number) => void;
  adminEdit: AdminEditForm;
  setAdminEdit: React.Dispatch<React.SetStateAction<AdminEditForm>>;
  applyAdminEdit: () => void;
  seedDatabase: () => void;
  seeding: boolean;
}

export default function AdminPanel({
  attendants,
  contests,
  historyMap,
  approveContest,
  rejectContest,
  adminEdit,
  setAdminEdit,
  applyAdminEdit,
  seedDatabase,
  seeding,
}: AdminPanelProps) {
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
                className="rounded-2xl border border-white/8 bg-secondary p-4"
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
              <select value={adminEdit.target} onChange={(e) => setAdminEdit((p) => ({ ...p, target: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-tertiary px-4 py-3 text-white outline-none transition focus:border-blue-400/40">
                {attendants.map((a) => <option key={a.username}>{a.name}</option>)}
              </select>
            </label>

            <label className="block space-y-2 text-sm">
              <span className="text-zinc-400">Nova nota</span>
              <input type="number" step="0.1" min="0" max="10" value={adminEdit.newScore} onChange={(e) => setAdminEdit((p) => ({ ...p, newScore: Number(e.target.value) }))} className="w-full rounded-2xl border border-white/10 bg-tertiary px-4 py-3 text-white outline-none transition focus:border-blue-400/40" />
            </label>

            <label className="block space-y-2 text-sm">
              <span className="text-zinc-400">Motivo</span>
              <textarea value={adminEdit.reason} onChange={(e) => setAdminEdit((p) => ({ ...p, reason: e.target.value }))} rows={4} placeholder="Ex: atrasou, melhorou em atendimento, respondeu mais rápido, vendeu mais mash..." className="w-full resize-none rounded-2xl border border-white/10 bg-tertiary px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-400/40" />
            </label>

            <button onClick={applyAdminEdit} className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3 font-medium text-white transition hover:brightness-110 active:scale-[0.99]">
              Aplicar edição
            </button>
          </div>

          <div className="mt-6 space-y-3">
            {attendants.map((a) => (
              <div key={a.username} className="rounded-2xl border border-white/8 bg-secondary p-4">
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
