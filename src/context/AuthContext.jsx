import { createContext, useContext, useEffect, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { sendWelcomeEmail } from "../lib/welcomeEmail";

const AuthContext = createContext({ user: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const queueWelcomeEmail = () => {
      window.setTimeout(() => {
        void sendWelcomeEmail().catch(() => {
          // Welcome email delivery is retried on the next authenticated session.
        });
      }, 0);
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) {
        setUser(session?.user ?? null);
        setLoading(false);
        if (session?.user?.email_confirmed_at) queueWelcomeEmail();
      }
    });
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active) return;
      setUser(error ? null : data.session?.user ?? null);
      setLoading(false);
      if (!error && data.session?.user?.email_confirmed_at) queueWelcomeEmail();
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
