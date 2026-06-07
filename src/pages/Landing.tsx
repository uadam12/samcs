import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30 selection:text-blue-400">
      
      {/* 🧭 NAVIGATION HEADER */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-black tracking-wider text-blue-500">SAMCS</span>
          </div>
          
          <Link 
            to="/auth" 
            className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 px-5 py-2 rounded-xl text-xs font-bold transition duration-200 shadow-sm"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* 🚀 HERO SECTION */}
      <header className="max-w-5xl mx-auto px-6 pt-20 pb-16 text-center space-y-6">
        <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>IoT Hardware Framework Active</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-linear-to-b from-white to-slate-400 max-w-3xl mx-auto leading-tight">
          Smart Applicance Monitoring and Control System
        </h1>
        
        <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          An embedded industrial IoT platform engineered for real-time electrical appliance coordination, manual hardware lockouts, and safety automation over secure infrastructure channels.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            to="/auth" 
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-8 py-3.5 rounded-xl shadow-lg shadow-blue-600/20 transition duration-150 tracking-wider uppercase"
          >
            Get Started
          </Link>
          <a 
            href="#technical-specs" 
            className="w-full sm:w-auto bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800/80 px-8 py-3.5 rounded-xl text-xs font-bold transition duration-150"
          >
            Core Specifications
          </a>
        </div>
      </header>

      {/* 📊 CORE TELEMETRY STATUS RIBBON */}
      <section className="max-w-7xl mx-auto px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-900/40 border border-slate-900 rounded-2xl p-6 backdrop-blur-sm text-center">
          <div>
            <p className="text-2xl font-black text-blue-500 font-mono">4</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Isolated Channels</p>
          </div>
          <div>
            <p className="text-2xl font-black text-blue-500 font-mono">&lt; 250ms</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Control Latency</p>
          </div>
          <div>
            <p className="text-2xl font-black text-blue-500 font-mono">100%</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Remote Lockout Link</p>
          </div>
          <div>
            <p className="text-2xl font-black text-blue-500 font-mono">ESP32</p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Core Architecture</p>
          </div>
        </div>
      </section>

      {/* 🛠️ TECHNICAL FEATURE GRID */}
      <section id="technical-specs" className="max-w-7xl mx-auto px-6 py-20 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-100">System Capability Framework</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">Hardware security and fluid remote-state execution optimized for clean resource management.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1 */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between h-56 hover:border-slate-700 transition duration-200">
            <div className="space-y-2">
              <span className="text-2xl">⚡</span>
              <h3 className="text-base font-bold text-slate-200">Asynchronous Relay Switching</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Independently actuate and isolate up to four physical high-current power points simultaneously over low-overhead WebSockets.
              </p>
            </div>
            <span className="text-[9px] font-mono text-blue-500 bg-blue-500/5 px-2 py-1 rounded w-max border border-blue-500/10">Active Multiplexing</span>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between h-56 hover:border-slate-700 transition duration-200">
            <div className="space-y-2">
              <span className="text-2xl">🔒</span>
              <h3 className="text-base font-bold text-slate-200">Physical Button Lockout</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Disable the extension's manual tactical switches right from your phone. Perfect for child safety, hardware protection, and preventing unwanted manual overrides.
              </p>
            </div>
            <span className="text-[9px] font-mono text-blue-500 bg-blue-500/5 px-2 py-1 rounded w-max border border-blue-500/10">User Overrides Allowed</span>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800/80 flex flex-col justify-between h-56 hover:border-slate-700 transition duration-200">
            <div className="space-y-2">
              <span className="text-2xl">🎛️</span>
              <h3 className="text-base font-bold text-slate-200">Zero-Config Assignment</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Devices are pre-provisioned securely by system administrators during setup, completely eliminating complex manual registration steps for users.
              </p>
            </div>
            <span className="text-[9px] font-mono text-blue-500 bg-blue-500/5 px-2 py-1 rounded w-max border border-blue-500/10">RBAC Enforced</span>
          </div>

        </div>
      </section>

      {/* 📋 FOOTER REVENUE SEGMENT */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-500">
        <p>© 2026 SAMCS Platform Project. Structured to Academic IEEE Engineering Specs.</p>
      </footer>
    </div>
  );
}