import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  register: (email: string, password: string) => Promise<User | null>;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  // Registrar novo usuário com Supabase
  const register = async (email: string, password: string): Promise<User | null> => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      throw new Error(error.message);
    }
    return data.user;
  };

  // Login de usuário com Supabase
  const login = async (email: string, password: string): Promise<User | null> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      throw new Error(error.message);
    }
    return data.user;
  };

  // Logout de usuário com Supabase
  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
    setIsAdmin(false);
  };

  // Observar mudanças no estado de autenticação
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user ?? null;
        setCurrentUser(user);
        
        if (user) {
          // Simplificação: A lógica de admin será tratada por RLS e um serviço
          // Para fins de migração, vamos assumir que o status de admin será buscado
          // em um serviço separado ou via claims, mas por enquanto, simplificamos.
          // TODO: Implementar lógica de verificação de admin via Supabase RLS/Function
          
          // Exemplo de como buscar dados de perfil para verificar admin (será implementado em userService)
          // const { data: profile } = await supabase.from('users').select('is_admin').eq('id', user.id).single();
          // setIsAdmin(profile?.is_admin || false);
          
          // Por enquanto, apenas um placeholder:
          setIsAdmin(user.email === 'admin@luckyybet.com'); // Placeholder simples
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    isAdmin,
    loading,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
