import type { ChangeEvent } from "react";

interface StatusHeaderProps {
  location: string;
  deviceKey: string;
  rssi: number;
  connectionStatus: string;
  onRenameHeaderLocation: (newName: string) => void;
}

export default function StatusHeader({ 
  location, 
  deviceKey, 
  rssi, 
  connectionStatus, 
  onRenameHeaderLocation 
}: StatusHeaderProps) {
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
      
      <div className="flex space-x-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono">
        <div className="flex items-center space-x-2 border-r border-slate-800 pr-3">
          <span className="text-slate-500 font-semibold uppercase text-[10px]">Signal Link</span>
          <span className="font-bold text-slate-200">{rssi} dBm</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-slate-500 font-semibold uppercase text-[10px]">System Status</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${connectionStatus === "ONLINE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
            {connectionStatus}
          </span>
        </div>
      </div>
    </header>
  );
}