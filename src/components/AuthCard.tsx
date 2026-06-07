import type { SubmitEvent } from "react";
import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";

type AuthMode = "LOGIN" | "SIGNUP" | "RESET";


export default function AuthCard() {
  const [mode, setMode] = useState<AuthMode>("LOGIN");
  const [error, setError] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const { login, signup, resetPassword } = useAuth();

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    if (!emailRef.current) return;

    try {
      if (mode === "LOGIN" && passwordRef.current) {
        await login(emailRef.current.value, passwordRef.current.value);
      } else if (mode === "SIGNUP" && passwordRef.current) {
        await signup(emailRef.current.value, passwordRef.current.value);
      } else if (mode === "RESET") {
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
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
        <h2 className="text-3xl font-extrabold text-white text-center tracking-tight mb-2">SAMCS Portal</h2>
        <p className="text-slate-400 text-sm text-center mb-6">
          {mode === "LOGIN" && "Sign in to manage smart automation channels"}
          {mode === "SIGNUP" && "Create an operator profile"}
          {mode === "RESET" && "Recover your portal authorization link"}
        </p>

        {error && <div className="p-3 mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-lg">{error}</div>}
        {message && <div className="p-3 mb-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-lg">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
            <input type="email" ref={emailRef} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition" required />
          </div>

          {mode !== "RESET" && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Password</label>
              <input type="password" ref={passwordRef} className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition" required />
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-600/20 text-sm transition duration-150 disabled:opacity-50">
            {loading ? "Processing..." : mode === "LOGIN" ? "Sign In" : mode === "SIGNUP" ? "Register" : "Send Reset Email"}
          </button>
        </form>

        <div className="mt-6 flex flex-col space-y-2 text-center text-xs text-slate-400">
          {mode === "LOGIN" && (
            <>
              <span onClick={() => setMode("RESET")} className="hover:text-blue-400 cursor-pointer transition">Forgot password?</span>
              <span>Don't have an account? <span onClick={() => setMode("SIGNUP")} className="text-blue-500 hover:underline cursor-pointer">Sign up</span></span>
            </>
          )}
          {mode === "SIGNUP" && <span onClick={() => setMode("LOGIN")} className="hover:text-blue-400 cursor-pointer transition">Already registered? Log in</span>}
          {mode === "RESET" && <span onClick={() => setMode("LOGIN")} className="hover:text-blue-400 cursor-pointer transition">Back to logging in</span>}
        </div>
      </div>
    </div>
  );
}