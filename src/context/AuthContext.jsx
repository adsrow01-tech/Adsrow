import { createContext, useContext, useEffect, useRef, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { sendWelcomeEmail } from "../lib/welcomeEmail";

const AuthContext = createContext({ user: null, session: null, loading: true, signOut: async () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const authRevision = useRef(0);

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
      authRevision.current += 1;
      if (active) {
        setSession(session ?? null);
        setUser(session?.user ?? null);
        setLoading(false);
        if (session?.user?.email_confirmed_at) queueWelcomeEmail();
      }
    });
    const initialRevision = authRevision.current;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active || initialRevision !== authRevision.current) return;
      const restoredSession = error ? null : data.session ?? null;
      setSession(restoredSession);
      setUser(restoredSession?.user ?? null);
      setLoading(false);
      if (!error && data.session?.user?.email_confirmed_at) queueWelcomeEmail();
    }).catch(() => {
      if (active && initialRevision === authRevision.current) {
        setSession(null);
        setUser(null);
        setLoading(false);
      }
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, []);

  async function signOut() {
    authRevision.current += 1;
    setSession(null);
    setUser(null);
    setLoading(false);
    if (supabase) await supabase.auth.signOut({ scope: "local" });
  }

  return <AuthContext.Provider value={{ user, session, loading, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
