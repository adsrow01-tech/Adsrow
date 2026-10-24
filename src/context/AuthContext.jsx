import { createContext, useContext, useEffect, useRef, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const AuthContext = createContext({ user: null, session: null, loading: true, signOut: async () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const authRevision = useRef(0);

  useEffect(() => {
    if (!supabase) return;
    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      authRevision.current += 1;
      if (active) {
        setSession(session ?? null);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });
    const initialRevision = authRevision.current;
    supabase.auth.getSession().then(({ data, error }) => {
      if (!active || initialRevision !== authRevision.current) return;
      const restoredSession = error ? null : data.session ?? null;
      setSession(restoredSession);
      setUser(restoredSession?.user ?? null);
      setLoading(false);
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
