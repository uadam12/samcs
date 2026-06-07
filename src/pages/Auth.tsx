import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { getDatabase, ref, set } from "firebase/database";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";

type AuthMode = "LOGIN" | "SIGNUP" | "RESET";

export default function Auth() {
  const [mode, setMode] = useState<AuthMode>("LOGIN");
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const { login, resetPassword } = useAuth();
  const db = getDatabase();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!emailRef.current) return;

    try {
      if (mode === "LOGIN" && passwordRef.current) {
        await login(emailRef.current.value, passwordRef.current.value);
      } 
      else if (mode === "SIGNUP" && passwordRef.current && confirmPasswordRef.current) {
        if (passwordRef.current.value !== confirmPasswordRef.current.value) {
          throw new Error("Password confirmation inputs do not match.");
        }
        
        const credential = await createUserWithEmailAndPassword(
          auth, 
          emailRef.current.value, 
          passwordRef.current.value
        );
        
        await set(ref(db, `users/${credential.user.uid}`), {
          email: credential.user.email?.toLowerCase(),
          role: "user"
        });

        setMessage("Account created successfully! Redirecting to tracking terminal...");
      } 
      else if (mode === "RESET") {
        await resetPassword(emailRef.current.value);
        setMessage("Check your inbox for password reset instructions.");
      }
    } catch (err: any) {
      setError(err.message ? err.message.replace("Firebase: ", "") : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 selection:bg-blue-500/30 selection:text-blue-400">
      <div className="max-w-md w-full bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-800/80">
        
        <div className="text-center mb-6">
          <h2 className="text-3xl font-black text-white tracking-tight">SAMCS Console</h2>
          <p className="text-slate-400 text-xs mt-1.5">
            {mode === "LOGIN" && "Sign in to manage automated smart channels"}
            {mode === "SIGNUP" && "Create a new hardware operator profile"}
            {mode === "RESET" && "Recover your portal access authorization link"}
          </p>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl">
            ⚠️ {error}
          </div>
        )}
        {message && (
          <div className="p-3 mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl">
            ✨ {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
            <input 
              type="email" 
              ref={emailRef} 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition duration-150" 
              placeholder="operator@example.com"
              required 
            />
          </div>

          {mode !== "RESET" && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
              <input 
                type="password" 
                ref={passwordRef} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition duration-150" 
                placeholder="••••••••"
                required 
              />
            </div>
          )}

          {mode === "SIGNUP" && (
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Confirm Password</label>
              <input 
                type="password" 
                ref={confirmPasswordRef} 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition duration-150" 
                placeholder="••••••••"
                required 
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-blue-600/10 text-xs uppercase tracking-wider transition duration-150 disabled:opacity-50"
          >
            {loading ? "Processing Sync..." : mode === "LOGIN" ? "Authorize Terminal" : mode === "SIGNUP" ? "Register Operator" : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 flex flex-col space-y-2 text-center text-xs text-slate-400">
          {mode === "LOGIN" && (
            <>
              <span onClick={() => setMode("RESET")} className="hover:text-blue-400 cursor-pointer transition underline decoration-slate-800 hover:decoration-blue-400">Forgot your password?</span>
              <span>Need access? <span onClick={() => setMode("SIGNUP")} className="text-blue-500 hover:underline cursor-pointer font-bold">Create an account</span></span>
            </>
          )}
          {mode === "SIGNUP" && (
            <span className="text-slate-400">
              Already have an operator profile?{" "}
              <span onClick={() => setMode("LOGIN")} className="text-blue-500 hover:underline cursor-pointer font-bold">Log in</span>
            </span>
          )}
          {mode === "RESET" && (
            <span onClick={() => setMode("LOGIN")} className="text-blue-500 hover:underline cursor-pointer font-bold">
              Return to terminal authorization screen
            </span>
          )}
        </div>

      </div>
    </div>
  );
}