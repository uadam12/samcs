import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth"; // Changed to Auth
import Dashboard from "./pages/Dashboard";

function AppRoutes() {
  const { currentUser, loading } = useAuth(); // TypeScript compiles successfully now

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-950 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Landing Interface */}
      <Route path="/" element={<Landing />} />

      {/* Auth Gateway Route - Refactored Target */}
      <Route 
        path="/auth" 
        element={!currentUser ? <Auth /> : <Navigate to="/dashboard" replace />} 
      />

      {/* Main Stream Monitoring Dashboard */}
      <Route 
        path="/dashboard" 
        element={currentUser ? <Dashboard /> : <Navigate to="/auth" replace />} 
      />

      {/* Catch-All Safe Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}