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

    // 1. Restore session from localStorage to prevent redirect loop on page refresh
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

    setIsLoading(false);

    return () => {
      isMounted = false;
    };
  }, [isDemo]);

  const login = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password ? password.trim() : '';

    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email address.' };
    }

    if (!cleanPassword) {
      return { success: false, error: 'Please enter your password.' };
    }

    // Configured admin credentials
    const configuredAdminEmail = (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'umerch5491@gmail.com').toLowerCase().trim();
    const configuredAdminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '1122334455';

    // 1. If Supabase is configured, try Supabase Auth
    if (!isDemo) {
      const supabase = getSupabaseClient();
      if (supabase) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password: cleanPassword,
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
                'Admin',
              role,
            };

            setUser(liveUser);
            if (typeof window !== 'undefined') {
              localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(liveUser));
            }
            return { success: true };
          }
        } catch (err) {
          console.error('Supabase auth attempt error:', err);
        }
      }
    }

    // 2. Validate against Admin credentials
    const isEmailMatched =
      cleanEmail === configuredAdminEmail ||
      cleanEmail === 'umerch5491@gmail.com';

    const isPasswordMatched =
      cleanPassword === configuredAdminPassword ||
      cleanPassword === '1122334455';

    if (isEmailMatched && isPasswordMatched) {
      const adminUser: AdminUser = {
        id: 'usr-admin-' + Date.now(),
        email: cleanEmail,
        name: 'Admin',
        role: 'admin',
      };

      setUser(adminUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminUser));
      }
      return { success: true };
    }

    // If both Supabase and admin credentials fail, REJECT authentication
    return {
      success: false,
      error: 'Invalid email or password. Please verify your credentials.',
    };
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
