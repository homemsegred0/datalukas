import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  UserCredential
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db, getUserEmail, getUsernameFromEmail } from '../services/firebase';
import { userDirectory } from '../data/constants';
import type { AuthUser, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert Firebase user to AuthUser
  const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<AuthUser> => {
    const username = getUsernameFromEmail(firebaseUser.email!);
    const userData = userDirectory.find(u => u.username === username);
    
    if (!userData) {
      throw new Error(`User data not found for username: ${username}`);
    }

    // Get custom claims from Firestore or token
    const tokenResult = await firebaseUser.getIdTokenResult();
    const customClaims = tokenResult.claims;

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      username: userData.username,
      role: userData.role,
      employeeName: userData.employeeName,
      customClaims: {
        admin: customClaims.admin === true,
        employee: customClaims.employee === true,
      }
    };
  };

  // Sign in function
  const signIn = async (username: string, password: string): Promise<void> => {
    try {
      setError(null);
      setLoading(true);
      
      const email = getUserEmail(username);
      const credential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const authUser = await convertFirebaseUser(credential.user);
      setUser(authUser);
    } catch (err: any) {
      console.error('Sign in error:', err);
      
      // Handle specific Firebase auth errors
      let errorMessage = 'Erro ao fazer login';
      if (err.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde';
      } else if (err.message?.includes('No email mapping')) {
        errorMessage = 'Usuário não autorizado';
      }
      
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async (): Promise<void> => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      setUser(null);
    } catch (err: any) {
      console.error('Sign out error:', err);
      setError('Erro ao sair');
      throw err;
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const authUser = await convertFirebaseUser(firebaseUser);
          setUser(authUser);
        } else {
          setUser(null);
        }
      } catch (err: any) {
        console.error('Auth state change error:', err);
        setError('Erro ao verificar autenticação');
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    error,
    signIn,
    signOut,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}