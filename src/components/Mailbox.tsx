import { motion } from 'framer-motion';
import { Send, Mail } from 'lucide-react';
import { cn } from '../utils/helpers';
import type { AuthUser, Attendant, Message, ComposeMessageForm } from '../types';

interface MailboxProps {
  currentUser: AuthUser;
  attendants: Attendant[];
  messages: Message[];
  composeMessage: ComposeMessageForm;
  setComposeMessage: React.Dispatch<React.SetStateAction<ComposeMessageForm>>;
  submitMessage: (e: React.FormEvent) => void;
}

export default function Mailbox({ 
  currentUser, 
  attendants, 
  messages, 
  composeMessage, 
  setComposeMessage, 
  submitMessage 
}: MailboxProps) {
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
              className="w-full rounded-2xl border border-white/10 bg-tertiary px-4 py-3 text-white outline-none transition focus:border-blue-400/40"
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
              className="w-full resize-none rounded-2xl border border-white/10 bg-tertiary px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-400/40"
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
            <div className="rounded-2xl border border-white/8 bg-secondary p-4 text-sm text-zinc-500">Nenhum recado chegou ainda.</div>
          ) : (
            myMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "rounded-2xl border p-4",
                  message.read ? "border-white/8 bg-secondary" : "border-cyan-400/15 bg-cyan-400/5"
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
