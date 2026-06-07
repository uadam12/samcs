import type { ReactNode } from "react";
import type { User, UserCredential } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { 
  signInWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail, 
  onAuthStateChanged,
} from "firebase/auth";
import { ref, get } from "firebase/database";
import { auth, db } from "../firebaseConfig";
import type { UserRole } from "../interfaces/rbac";

interface AuthContextType {
  currentUser: User | null;
  role: UserRole | null;
  loading: boolean; // FIXED: Explicitly declared here so useAuth tracks it cleanly
  login: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const userSnap = await get(ref(db, `users/${user.uid}`));
          if (userSnap.exists()) {
            setRole(userSnap.val().role as UserRole);
          } else {
            setRole("user"); 
          }
        } catch {
          setRole("user");
        }
      } else {
        setCurrentUser(null);
        setRole(null);
      }
      setLoading(false);
    });
    
    return unsubscribe;
  }, []);

  const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);
  const resetPassword = (email: string) => sendPasswordResetEmail(auth, email);

  const value: AuthContextType = { currentUser, role, loading, login, logout, resetPassword };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be wrapped within an AuthProvider container.");
  return context;
};