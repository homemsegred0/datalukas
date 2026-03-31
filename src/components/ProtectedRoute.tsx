import React from 'react';
import { useAuth } from '../hooks/useAuth';
import Login from './Login';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'employee';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-primary text-zinc-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          <p className="text-sm text-zinc-400">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // User not authenticated
  if (!user) {
    return <LoginWrapper />;
  }

  // Check role requirements
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="min-h-screen bg-primary text-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Acesso Negado</h2>
          <p className="text-zinc-400 mb-4">Você não tem permissão para acessar esta página.</p>
          <p className="text-sm text-zinc-500">
            Área restrita para: <span className="font-medium">{requiredRole === 'admin' ? 'Administradores' : 'Funcionários'}</span>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Wrapper component for login to match original layout
function LoginWrapper() {
  return (
    <div className="min-h-screen bg-primary text-zinc-100">
      <div className="absolute inset-0 bg-gradient-radial" />
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
        
        <div className="grid min-h-[72vh] place-items-center">
          <Login />
        </div>
      </div>
    </div>
  );
}