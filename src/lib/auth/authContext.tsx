'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AdminUser, UserRole } from '@/types/admin';
import { isSupabaseConfigured, getSupabaseClient } from '@/lib/supabase';

interface AuthContextType {
  user: AdminUser | null;
  role: UserRole | null;
  isLoading: boolean;
  isDemoMode: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  switchRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default development demo user for Phase 3 UI testing before live Supabase Auth is linked
const DEMO_ADMIN_USER: AdminUser = {
  id: 'usr-demo-001',
  email: 'editor@softgamer.dev',
  name: 'Elena Rostova',
  role: 'admin',
  avatar: '/images/articles/placeholder-tech.svg',
};

const DEMO_SESSION_KEY = 'softgamer_demo_auth_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isDemo = !isSupabaseConfigured();

  const [user, setUser] = useState<AdminUser | null>(() => {
    if (typeof window !== 'undefined' && !isSupabaseConfigured()) {
      const saved = localStorage.getItem(DEMO_SESSION_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return DEMO_ADMIN_USER;
        }
      }
      return DEMO_ADMIN_USER;
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && !isSupabaseConfigured()) {
      return false;
    }
    return isSupabaseConfigured();
  });

  useEffect(() => {
    if (isDemo) {
      if (typeof window !== 'undefined' && !localStorage.getItem(DEMO_SESSION_KEY)) {
        localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(DEMO_ADMIN_USER));
      }
      return;
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      if (session?.user) {
        const role = (session.user.app_metadata?.role as UserRole) || (session.user.user_metadata?.role as UserRole) || 'admin';
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Staff Member',
          role,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      if (session?.user) {
        const role = (session.user.app_metadata?.role as UserRole) || (session.user.user_metadata?.role as UserRole) || 'admin';
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Staff Member',
          role,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [isDemo]);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    if (isDemo) {
      // Demo validation - allows mock testing with simulated roles
      const role: UserRole = email.includes('admin') ? 'admin' : 'editor';
      const mockUser: AdminUser = {
        id: 'usr-demo-' + Date.now(),
        email: email || 'editor@softgamer.dev',
        name: email.split('@')[0] || 'Staff Editor',
        role,
      };
      setUser(mockUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(mockUser));
      }
      return { success: true };
    }

    const supabase = getSupabaseClient();
    if (!supabase) {
      return { success: false, error: 'Supabase client is not configured' };
    }

    if (!password) {
      return { success: false, error: 'Password is required for production authentication' };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const logout = async () => {
    if (isDemo) {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(DEMO_SESSION_KEY);
      }
      return;
    }

    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    if (user && isDemo) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(updated));
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isLoading,
        isDemoMode: isDemo,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
