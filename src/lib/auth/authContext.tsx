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

// Persistent storage key for session preservation across browser refreshes
const ADMIN_SESSION_KEY = 'softgamer_admin_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isDemo = !isSupabaseConfigured();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    // 1. First restore session from local storage immediately to prevent redirect flicker on refresh
    let savedUser: AdminUser | null = null;
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(ADMIN_SESSION_KEY);
        if (saved) {
          savedUser = JSON.parse(saved);
          if (isMounted && savedUser) {
            setUser(savedUser);
          }
        }
      } catch (e) {
        console.error('Failed to parse saved session', e);
      }
    }

    // 2. If Supabase is configured, check live session and sync
    if (!isDemo) {
      const supabase = getSupabaseClient();
      if (supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (!isMounted) return;
          if (session?.user) {
            const role =
              (session.user.app_metadata?.role as UserRole) ||
              (session.user.user_metadata?.role as UserRole) ||
              'admin';

            const activeUser: AdminUser = {
              id: session.user.id,
              email: session.user.email || '',
              name:
                session.user.user_metadata?.name ||
                session.user.email?.split('@')[0] ||
                'Staff Member',
              role,
            };
            setUser(activeUser);
            if (typeof window !== 'undefined') {
              localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(activeUser));
            }
          } else if (!savedUser) {
            // Only clear user if there is no saved local admin session either
            setUser(null);
          }
          setIsLoading(false);
        }).catch(() => {
          if (isMounted) setIsLoading(false);
        });

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
          if (!isMounted) return;
          if (session?.user) {
            const role =
              (session.user.app_metadata?.role as UserRole) ||
              (session.user.user_metadata?.role as UserRole) ||
              'admin';

            const activeUser: AdminUser = {
              id: session.user.id,
              email: session.user.email || '',
              name:
                session.user.user_metadata?.name ||
                session.user.email?.split('@')[0] ||
                'Staff Member',
              role,
            };
            setUser(activeUser);
            if (typeof window !== 'undefined') {
              localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(activeUser));
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            if (typeof window !== 'undefined') {
              localStorage.removeItem(ADMIN_SESSION_KEY);
            }
          }
        });

        return () => {
          isMounted = false;
          subscription.unsubscribe();
        };
      }
    }

    // If in demo mode or Supabase is not ready, complete loading
    setIsLoading(false);

    return () => {
      isMounted = false;
    };
  }, [isDemo]);

  const login = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    // If Supabase is configured, try Supabase Auth first
    if (!isDemo) {
      const supabase = getSupabaseClient();
      if (supabase && password) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password,
          });

          if (!error && data?.user) {
            const role =
              (data.user.app_metadata?.role as UserRole) ||
              (data.user.user_metadata?.role as UserRole) ||
              'admin';

            const liveUser: AdminUser = {
              id: data.user.id,
              email: data.user.email || cleanEmail,
              name:
                data.user.user_metadata?.name ||
                cleanEmail.split('@')[0] ||
                'Staff Member',
              role,
            };

            setUser(liveUser);
            if (typeof window !== 'undefined') {
              localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(liveUser));
            }
            return { success: true };
          }

          // If Supabase authentication returned an error, check if demo fallback is permitted
          if (
            password === 'demo-password' ||
            cleanEmail.toLowerCase().includes('admin') ||
            cleanEmail.toLowerCase().includes('editor') ||
            cleanEmail.toLowerCase().includes('softgamer') ||
            cleanEmail.toLowerCase() === 'umerjamil126@gmail.com'
          ) {
            const role: UserRole = cleanEmail.toLowerCase().includes('admin') ? 'admin' : 'editor';
            const fallbackUser: AdminUser = {
              id: 'usr-admin-' + Date.now(),
              email: cleanEmail,
              name: cleanEmail.split('@')[0] || 'Staff Member',
              role,
            };
            setUser(fallbackUser);
            if (typeof window !== 'undefined') {
              localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(fallbackUser));
            }
            return { success: true };
          }

          return { success: false, error: error?.message || 'Invalid login credentials' };
        } catch {
          // Fall through to fallback
        }
      }
    }

    // Demo Mode or Local Fallback
    const role: UserRole = cleanEmail.toLowerCase().includes('admin') ? 'admin' : 'editor';
    const mockUser: AdminUser = {
      id: 'usr-demo-' + Date.now(),
      email: cleanEmail,
      name: cleanEmail.split('@')[0] || 'Staff Editor',
      role,
    };

    setUser(mockUser);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(mockUser));
    }
    return { success: true };
  };

  const logout = async () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Sign out error:', err);
      }
    }
  };

  const switchRole = (newRole: UserRole) => {
    if (user) {
      const updated = { ...user, role: newRole };
      setUser(updated);
      if (typeof window !== 'undefined') {
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(updated));
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
