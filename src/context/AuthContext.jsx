import { createContext, useContext, useEffect, useRef, useState } from "react";
import { isSupabaseConfigured } from "../lib/supabaseConfig";

const AuthContext = createContext({ user: null, session: null, loading: true, signingOut: false, signOut: async () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [signingOut, setSigningOut] = useState(false);
  const authRevision = useRef(0);
  const signOutInFlight = useRef(null);
  const supabaseRef = useRef(null);

  useEffect(() => {
    let active = true;
    let subscription;
    let sessionRevision = authRevision.current;
    const queueWelcomeEmail = () => {
      window.setTimeout(() => {
        void import("../lib/welcomeEmail").then(({ sendWelcomeEmail }) => sendWelcomeEmail()).catch(() => {
          // Welcome email delivery is retried on the next authenticated session.
        });
      }, 0);
    };
    if (!isSupabaseConfigured) {
      setLoading(false);
      return () => { active = false; };
    }

    import("../lib/supabase").then(({ supabase }) => {
      if (!active) return;
      supabaseRef.current = supabase;
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        authRevision.current += 1;
        if (active) {
          setSession(nextSession ?? null);
          setUser(nextSession?.user ?? null);
          setLoading(false);
          if (nextSession?.user?.email_confirmed_at) queueWelcomeEmail();
        }
      });
      subscription = authSubscription;
      sessionRevision = authRevision.current;
      return supabase.auth.getSession().then(({ data, error }) => {
        if (!active || sessionRevision !== authRevision.current) return;
        const restoredSession = error ? null : data.session ?? null;
        setSession(restoredSession);
        setUser(restoredSession?.user ?? null);
        setLoading(false);
        if (!error && data.session?.user?.email_confirmed_at) queueWelcomeEmail();
      });
    }).catch(() => {
      if (active && sessionRevision === authRevision.current) {
        setSession(null);
        setUser(null);
        setLoading(false);
      }
    });
    return () => {
      active = false;
      subscription?.unsubscribe();
      supabaseRef.current = null;
    };
  }, []);

  async function signOut() {
    if (signOutInFlight.current) return signOutInFlight.current;

    const request = (async () => {
      setSigningOut(true);
      try {
        if (supabaseRef.current) {
          const { error } = await supabaseRef.current.auth.signOut({ scope: "local" });
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
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
