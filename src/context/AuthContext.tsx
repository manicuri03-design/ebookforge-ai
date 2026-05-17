"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface UserMetadata {
  name?: string;
  avatar_url?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata?: UserMetadata;
  email_confirmed_at?: string | null;
  plan?: "free" | "premium_monthly" | "premium_yearly";
  ebooks_used?: number;
  ebooks_limit?: number;
  assists_used?: number;
  assists_limit?: number;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isMocked: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null; needsVerification: boolean }>;
  signup: (name: string, email: string, password: string) => Promise<{ error: string | null; needsVerification: boolean }>;
  logout: () => Promise<{ error: string | null }>;
  loginWithGoogle: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  resendVerificationEmail: (email: string) => Promise<{ error: string | null }>;
  confirmMockEmail: (email: string) => Promise<void>;
  upgradePlan: (plan: "free" | "premium_monthly" | "premium_yearly") => Promise<void>;
  incrementAssists: () => Promise<void>;
  syncEbooksUsedCount: (count: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      
      // 1. Sync session with real Supabase Auth
      const getInitialSession = async () => {
        try {
          const { data: { session } } = await client.auth.getSession();
          if (session?.user) {
            // Check if email is confirmed
            if (session.user.email_confirmed_at) {
              setUser({
                id: session.user.id,
                email: session.user.email || "",
                user_metadata: {
                  name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || "",
                  avatar_url: session.user.user_metadata?.avatar_url || ""
                },
                email_confirmed_at: session.user.email_confirmed_at,
                plan: session.user.user_metadata?.plan || "free",
                ebooks_used: session.user.user_metadata?.ebooks_used || 0,
                ebooks_limit: session.user.user_metadata?.ebooks_limit || 3,
                assists_used: session.user.user_metadata?.assists_used || 0,
                assists_limit: session.user.user_metadata?.assists_limit || 5
              });
            } else {
              // Sign out if not confirmed to prevent route access
              await client.auth.signOut();
              setUser(null);
            }
          }
        } catch (error) {
          console.error("Erro ao obter sessão Supabase:", error);
        } finally {
          setLoading(false);
        }
      };

      getInitialSession();

      const { data: { subscription } } = client.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          if (session.user.email_confirmed_at) {
            setUser({
              id: session.user.id,
              email: session.user.email || "",
              user_metadata: {
                name: session.user.user_metadata?.name || session.user.user_metadata?.full_name || "",
                avatar_url: session.user.user_metadata?.avatar_url || ""
              },
              email_confirmed_at: session.user.email_confirmed_at,
              plan: session.user.user_metadata?.plan || "free",
              ebooks_used: session.user.user_metadata?.ebooks_used || 0,
              ebooks_limit: session.user.user_metadata?.ebooks_limit || 3,
              assists_used: session.user.user_metadata?.assists_used || 0,
              assists_limit: session.user.user_metadata?.assists_limit || 5
            });
          } else {
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      // 2. Sync session with Local Storage Mock Auth
      const mockSession = localStorage.getItem("ebookforge_session");
      if (mockSession) {
        try {
          const parsed = JSON.parse(mockSession);
          setTimeout(() => {
            setUser(parsed);
            setLoading(false);
          }, 0);
          return;
        } catch (e) {
          console.error("Erro ao carregar sessão mockada:", e);
        }
      }
      setTimeout(() => {
        setLoading(false);
      }, 0);
    }
  }, []);

  // Real or Mock Login
  const login = async (email: string, password: string) => {
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      
      if (error) {
        if (error.message.toLowerCase().includes("email not confirmed") || error.message.toLowerCase().includes("confirmar seu email")) {
          return { error: "Por favor, confirme seu e-mail antes de fazer login.", needsVerification: true };
        }
        return { error: error.message, needsVerification: false };
      }
      
      if (data?.user) {
        if (!data.user.email_confirmed_at) {
          await client.auth.signOut();
          return { error: "Por favor, confirme seu e-mail antes de fazer login.", needsVerification: true };
        }

        setUser({
          id: data.user.id,
          email: data.user.email || "",
          user_metadata: {
            name: data.user.user_metadata?.name || data.user.user_metadata?.full_name || "",
            avatar_url: data.user.user_metadata?.avatar_url || ""
          },
          email_confirmed_at: data.user.email_confirmed_at,
          plan: data.user.user_metadata?.plan || "free",
          ebooks_used: data.user.user_metadata?.ebooks_used || 0,
          ebooks_limit: data.user.user_metadata?.ebooks_limit || 3,
          assists_used: data.user.user_metadata?.assists_used || 0,
          assists_limit: data.user.user_metadata?.assists_limit || 5
        });
      }
      return { error: null, needsVerification: false };
    } else {
      // Mock Login
      const users = JSON.parse(localStorage.getItem("ebookforge_mock_users") || "[]");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (!foundUser) {
        return { error: "E-mail ou senha incorretos.", needsVerification: false };
      }

      if (!foundUser.email_confirmed) {
        return { error: "Por favor, confirme seu e-mail antes de fazer login.", needsVerification: true };
      }

      const activeSession: AuthUser = {
        id: foundUser.id,
        email: foundUser.email,
        user_metadata: { name: foundUser.name },
        plan: foundUser.plan || "free",
        ebooks_used: foundUser.ebooks_used || 0,
        ebooks_limit: foundUser.ebooks_limit || 3,
        assists_used: foundUser.assists_used || 0,
        assists_limit: foundUser.assists_limit || 5
      };

      localStorage.setItem("ebookforge_session", JSON.stringify(activeSession));
      setUser(activeSession);
      return { error: null, needsVerification: false };
    }
  };

  // Real or Mock Signup
  const signup = async (name: string, email: string, password: string) => {
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: { 
            name,
            plan: "free",
            ebooks_used: 0,
            ebooks_limit: 3,
            assists_used: 0,
            assists_limit: 5
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) return { error: error.message, needsVerification: false };
      
      // Default: if email confirmation is required, session is empty, and user is present
      const needsVerification = data.user && !data.session;
      
      if (needsVerification) {
        return { error: null, needsVerification: true };
      }

      if (data?.user) {
        setUser({
          id: data.user.id,
          email: data.user.email || "",
          user_metadata: { name },
          plan: "free",
          ebooks_used: 0,
          ebooks_limit: 3,
          assists_used: 0,
          assists_limit: 5
        });
      }
      return { error: null, needsVerification: false };
    } else {
      // Mock Signup
      const users = JSON.parse(localStorage.getItem("ebookforge_mock_users") || "[]");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userExists = users.some((u: any) => u.email === email);

      if (userExists) {
        return { error: "Este e-mail já está em uso.", needsVerification: false };
      }

      const newUser = { 
        id: Math.random().toString(), 
        name, 
        email, 
        password, 
        email_confirmed: false,
        plan: "free",
        ebooks_used: 0,
        ebooks_limit: 3,
        assists_used: 0,
        assists_limit: 5
      };
      users.push(newUser);
      localStorage.setItem("ebookforge_mock_users", JSON.stringify(users));

      // Always require email verification in mock mode to test the verify card flow
      return { error: null, needsVerification: true };
    }
  };

  // Real or Mock Logout
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const { error } = await client.auth.signOut();
      if (error) return { error: error.message };
      setUser(null);
      return { error: null };
    } else {
      localStorage.removeItem("ebookforge_session");
      setUser(null);
      return { error: null };
    }
  };

  // Real or Mock Google OAuth Login
  const loginWithGoogle = async () => {
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const { error } = await client.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) return { error: error.message };
      return { error: null };
    } else {
      // Mock Google Login (Google OAuth users are pre-confirmed!)
      const googleUser: AuthUser = {
        id: "google-mock-id",
        email: "google.user@gmail.com",
        user_metadata: {
          name: "Google Account",
          avatar_url: ""
        },
        plan: "free",
        ebooks_used: 0,
        ebooks_limit: 3,
        assists_used: 0,
        assists_limit: 5
      };
      localStorage.setItem("ebookforge_session", JSON.stringify(googleUser));
      setUser(googleUser);
      router.push("/dashboard");
      return { error: null };
    }
  };

  // Real or Mock Password Recovery
  const resetPassword = async (email: string) => {
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const { error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`
      });
      if (error) return { error: error.message };
      return { error: null };
    } else {
      // Mock Password Recovery
      const users = JSON.parse(localStorage.getItem("ebookforge_mock_users") || "[]");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const userExists = users.some((u: any) => u.email === email);
      if (!userExists && email !== "google.user@gmail.com") {
        return { error: "E-mail não cadastrado." };
      }
      return { error: null };
    }
  };

  // Real or Mock Resend Verification Email
  const resendVerificationEmail = async (email: string) => {
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      const { error } = await client.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) return { error: error.message };
      return { error: null };
    } else {
      // Mock Resend
      return { error: null };
    }
  };

  // Bypass Email Confirmation in development simulation mode
  const confirmMockEmail = async (email: string) => {
    if (!isSupabaseConfigured) {
      const users = JSON.parse(localStorage.getItem("ebookforge_mock_users") || "[]");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatedUsers = users.map((u: any) => 
        u.email === email ? { ...u, email_confirmed: true } : u
      );
      localStorage.setItem("ebookforge_mock_users", JSON.stringify(updatedUsers));
    }
  };

  // SaaS Monetization: Upgrade Plan
  const upgradePlan = async (plan: "free" | "premium_monthly" | "premium_yearly") => {
    const isPremium = plan !== "free";
    const ebooksLimit = isPremium ? 999999 : 3;
    const assistsLimit = isPremium ? 999999 : 5;

    if (isSupabaseConfigured && supabase && user) {
      const client = supabase;
      const { error } = await client.auth.updateUser({
        data: {
          plan,
          ebooks_limit: ebooksLimit,
          assists_limit: assistsLimit
        }
      });
      if (!error) {
        setUser((prev) => prev ? {
          ...prev,
          plan,
          ebooks_limit: ebooksLimit,
          assists_limit: assistsLimit
        } : null);
      }
    } else if (user) {
      // Mock mode
      const updated: AuthUser = {
        ...user,
        plan,
        ebooks_limit: ebooksLimit,
        assists_limit: assistsLimit
      };
      localStorage.setItem("ebookforge_session", JSON.stringify(updated));
      setUser(updated);

      // Also update in mock users database
      const users = JSON.parse(localStorage.getItem("ebookforge_mock_users") || "[]");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updatedUsers = users.map((u: any) =>
        u.email === user.email ? { ...u, plan, ebooks_limit: ebooksLimit, assists_limit: assistsLimit } : u
      );
      localStorage.setItem("ebookforge_mock_users", JSON.stringify(updatedUsers));
    }
  };

  // SaaS Monetization: Increment Assists Counter
  const incrementAssists = async () => {
    if (user) {
      const currentAssists = (user.assists_used || 0) + 1;
      if (isSupabaseConfigured && supabase) {
        const client = supabase;
        const { error } = await client.auth.updateUser({
          data: { assists_used: currentAssists }
        });
        if (!error) {
          setUser((prev) => prev ? { ...prev, assists_used: currentAssists } : null);
        }
      } else {
        const updated: AuthUser = { ...user, assists_used: currentAssists };
        localStorage.setItem("ebookforge_session", JSON.stringify(updated));
        setUser(updated);

        const users = JSON.parse(localStorage.getItem("ebookforge_mock_users") || "[]");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updatedUsers = users.map((u: any) =>
          u.email === user.email ? { ...u, assists_used: currentAssists } : u
        );
        localStorage.setItem("ebookforge_mock_users", JSON.stringify(updatedUsers));
      }
    }
  };

  // SaaS Monetization: Sync Ebooks Used Count
  const syncEbooksUsedCount = async (count: number) => {
    if (user && user.ebooks_used !== count) {
      if (isSupabaseConfigured && supabase) {
        const client = supabase;
        const { error } = await client.auth.updateUser({
          data: { ebooks_used: count }
        });
        if (!error) {
          setUser((prev) => prev ? { ...prev, ebooks_used: count } : null);
        }
      } else {
        const updated: AuthUser = { ...user, ebooks_used: count };
        localStorage.setItem("ebookforge_session", JSON.stringify(updated));
        setUser(updated);

        const users = JSON.parse(localStorage.getItem("ebookforge_mock_users") || "[]");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const updatedUsers = users.map((u: any) =>
          u.email === user.email ? { ...u, ebooks_used: count } : u
        );
        localStorage.setItem("ebookforge_mock_users", JSON.stringify(updatedUsers));
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isMocked: !isSupabaseConfigured,
      login,
      signup,
      logout,
      loginWithGoogle,
      resetPassword,
      resendVerificationEmail,
      confirmMockEmail,
      upgradePlan,
      incrementAssists,
      syncEbooksUsedCount
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
