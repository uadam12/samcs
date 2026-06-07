import { Wifi, WifiOff } from "lucide-react";
import type { ChangeEvent } from "react";

interface StatusHeaderProps {
  location: string;
  deviceKey: string;
  rssi: number;
  connectionStatus: "ONLINE" | "OFFLINE";
  onRenameHeaderLocation: (newName: string) => void;
}

const parseRSSI = (dbm: number | undefined) => {
  if (dbm === undefined || dbm === 0) return { label: "No Signal", color: "text-gray-400", level: 0 };

  // Standard Wi-Fi RSSI signal quality mapping index
  if (dbm >= -50) return { label: "Excellent Connection", color: "text-green-500", level: 4 };
  if (dbm >= -67) return { label: "Good Connection", color: "text-emerald-400", level: 3 };
  if (dbm >= -70) return { label: "Fair Connection", color: "text-yellow-500", level: 2 };
  if (dbm >= -80) return { label: "Weak Signal", color: "text-orange-500", level: 1 };

  return { label: "Very Poor Connection", color: "text-red-500", level: 0 };
};

export default function StatusHeader({
  location,
  deviceKey,
  rssi,
  connectionStatus,
  onRenameHeaderLocation
}: StatusHeaderProps) {
  const WiFiStatus = parseRSSI(rssi);

  return (
    <header className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="w-full max-w-md">
        <input
          type="text"
          value={location}
          name="node-location-name"
          onChange={(e: ChangeEvent<HTMLInputElement>) => onRenameHeaderLocation(e.target.value)}
          className="bg-transparent text-2xl font-black text-slate-100 focus:outline-none focus:border-b border-slate-600 w-full"
          title="Click to rename node location"
        />
        <p className="text-xs text-slate-400 font-mono mt-1">Node Signature Key: <span className="text-blue-400 font-bold">{deviceKey}</span></p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 text-xs bg-slate-900/50 backdrop-blur-md p-3.5 rounded-xl border border-slate-800/80 font-mono shadow-inner">

        {/* Left Section: Wi-Fi Telemetry */}
        {
          connectionStatus === "ONLINE" &&
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-slate-950 border border-slate-800/60 shadow-md ${WiFiStatus.level === 0 ? 'animate-pulse' : ''}`}>
              {WiFiStatus.level === 0 ? (
                <WifiOff className="text-rose-500 h-5 w-5 stroke-2" />
              ) : (
                <Wifi className={`h-5 w-5 stroke-2 ${WiFiStatus.color}`} />
              )}
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Wi-Fi Signal</p>
              <p className="text-sm font-medium text-slate-200 tracking-tight">{WiFiStatus.label}</p>
            </div>
          </div>
        }

        {/* Right Section: Core System Lifeline Status */}
        <div className="flex items-center gap-2.5 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800/60 shadow-md">
          <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider">System Status</span>
          <span
            className={`px-2 py-0.5 rounded-md text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${connectionStatus === "ONLINE"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.1)]"
              : "bg-rose-500/10 text-rose-400 border border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.1)] animate-pulse"
              }`}
          >
            {connectionStatus}
          </span>
        </div>

      </div>
    </header>
  );
}