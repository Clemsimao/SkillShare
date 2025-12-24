"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  login as loginService, 
  register as registerService, 
  logout as logoutService, 
  getProfile,
  getCurrentUser
} from "@/integration/services/auth";
import { removeToken } from "@/integration/lib/token";
import type { LoginRequest, RegisterRequest, User } from "@/integration/types/api";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setTokenState] = useState<string | null>(null);

  // Charger l'utilisateur au démarrage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = typeof window !== 'undefined' ? localStorage.getItem('skillswap_token') : null;
        
        if (storedToken) {
            setTokenState(storedToken);
            const { user } = await getProfile();
            setUser(user);
        }
      } catch (err) {
        console.error("Erreur initialisation auth:", err);
        // Si le token est invalide, on le nettoie
        removeToken();
        setTokenState(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await loginService(data);
      setUser(response.user);
      setTokenState(response.token);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur de connexion");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await registerService(data);
      setUser(response.user);
      setTokenState(response.token);
    } catch (err: any) {
      setError(err.response?.data?.message || "Erreur d'inscription");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutService();
    } catch (err) {
      console.error("Erreur logout:", err);
    } finally {
        // Toujours nettoyer l'état local même si l'appel API échoue
      removeToken();
      setUser(null);
      setTokenState(null);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token,
        isLoading, 
        error, 
        login, 
        register, 
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
