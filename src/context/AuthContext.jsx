import { createContext, useContext, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const AuthContext = createContext({ user: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      setUser(error ? null : data.session?.user ?? null);
      setLoading(false);
    }).catch(() => {
      if (active) {
        setUser(null);
        setLoading(false);
      }
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
