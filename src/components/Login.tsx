import { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import type { LoginForm } from '../types';

export default function Login() {
  const { signIn, error, loading, clearError } = useAuth();
  const [loginForm, setLoginForm] = useState<LoginForm>({ username: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.username.trim() || !loginForm.password.trim()) {
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      await signIn(loginForm.username.trim().toLowerCase(), loginForm.password);
      // Success - context will handle navigation
    } catch (err) {
      // Error is already handled by the auth context
      console.error('Login failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-secondary p-6 shadow-2xl backdrop-blur-xl md:p-7">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 ring-1 ring-blue-400/20">
            <LogIn className="h-5 w-5 text-blue-200" />
          </div>
          <div>
            <div className="text-xl font-semibold text-white">Entrar no DataLukas</div>
            <div className="text-sm text-zinc-500">Sistema de Ranking</div>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <label className="block space-y-2 text-sm">
            <span className="text-zinc-400">Login</span>
            <input
              type="text"
              value={loginForm.username}
              onChange={(e) => setLoginForm((p) => ({ ...p, username: e.target.value }))}
              placeholder="ex: helder"
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-white/10 bg-tertiary px-4 py-3 text-white outline-none transition focus:border-blue-400/40 disabled:opacity-50"
              autoComplete="username"
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
                placeholder="sua senha"
                disabled={isSubmitting}
                className="w-full rounded-2xl border border-white/10 bg-tertiary py-3 pl-11 pr-4 text-white outline-none transition focus:border-blue-400/40 disabled:opacity-50"
                autoComplete="current-password"
              />
            </div>
          </label>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 flex items-center gap-3"
            >
              <AlertCircle className="h-4 w-4 text-red-300 shrink-0" />
              <span className="text-sm text-red-300">{error}</span>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !loginForm.username.trim() || !loginForm.password.trim()}
            className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 font-medium text-white transition hover:brightness-110 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Entrando...</span>
              </>
            ) : (
              <span>Entrar</span>
            )}
          </button>
        </form>

        <div className="mt-5 space-y-2 rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm text-zinc-400">
          <div><span className="font-medium text-zinc-200">Funcionário:</span> login e senha são o próprio nome em minúsculo.</div>
          <div><span className="font-medium text-zinc-200">Admin:</span> login <code className="rounded bg-white/5 px-1 py-0.5">admin</code> e senha <code className="rounded bg-white/5 px-1 py-0.5">admin</code>.</div>
          <div className="pt-2 border-t border-white/8">
            <span className="font-medium text-blue-200">Firebase Auth:</span> Sistema com autenticação real e segura.
          </div>
        </div>
      </div>
    </motion.div>
  );
}
