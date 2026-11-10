import { createContext, useContext, useEffect, useRef, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { sendWelcomeEmail } from "../lib/welcomeEmail";
import LoadingScreen from "../components/LoadingScreen";

const AuthContext = createContext({ user: null, session: null, loading: true, signingOut: false, signOut: async () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [signingOut, setSigningOut] = useState(false);
  const authRevision = useRef(0);
  const signOutInFlight = useRef(null);

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
    if (signOutInFlight.current) return signOutInFlight.current;

    const request = (async () => {
      setSigningOut(true);
      try {
        if (supabase) {
          const { error } = await supabase.auth.signOut({ scope: "local" });
          if (error) throw error;
        }
        authRevision.current += 1;
        setSession(null);
        setUser(null);
        setLoading(false);
      } finally {
        setSigningOut(false);
      }
    })();

    signOutInFlight.current = request;
    try {
      await request;
    } finally {
      if (signOutInFlight.current === request) signOutInFlight.current = null;
    }
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signingOut, signOut }}>
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
