import { createContext, useContext, useEffect, useRef, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const AuthContext = createContext({ user: null, loading: true });

export function isVerifiedUser(user) {
  return Boolean(user?.email_confirmed_at || user?.confirmed_at);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const authEventVersion = useRef(0);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        authEventVersion.current += 1;
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  async function signOut() {
    if (!supabase) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function refreshSession() {
    if (!supabase) return null;
    const requestVersion = authEventVersion.current;
    try {
      const { data, error } = await supabase.auth.getSession();
      if (requestVersion !== authEventVersion.current) return null;
      const nextUser = error ? null : data.session?.user ?? null;
      setUser(nextUser);
      setLoading(false);
      return nextUser;
    } catch (error) {
      if (requestVersion === authEventVersion.current) {
        setUser(null);
        setLoading(false);
      }
      throw error;
    }
  }

  const verified = isVerifiedUser(user);
  return <AuthContext.Provider value={{ user, verified, loading, signOut, refreshSession }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
