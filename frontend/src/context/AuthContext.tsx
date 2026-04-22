import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Usuario, Paciente, Medico, RolUsuario } from '../types';
import { authAPI } from '../api/services';

interface AuthContextType {
  usuario: Usuario | null;
  perfil: Paciente | Medico | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    rol: RolUsuario;
    nombre: string;
    edad?: number;
    alergias?: string[];
    especialidad?: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [perfil, setPerfil] = useState<Paciente | Medico | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const data = await authAPI.me();
          setUsuario(data.usuario);
          setPerfil(data.perfil);
        } catch {
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    const data = await authAPI.login(email, password);
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUsuario(data.usuario);
    setPerfil(data.perfil || null);
  };

  const register = async (data: any) => {
    const res = await authAPI.register(data);
    localStorage.setItem('token', res.token);
    setToken(res.token);
    setUsuario(res.usuario);
    setPerfil(res.perfil || null);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
    setPerfil(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, perfil, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
