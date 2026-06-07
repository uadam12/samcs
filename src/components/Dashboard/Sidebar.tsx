import type { ChangeEvent } from "react";
import type { SystemDevices } from "../../interfaces/rbac";

interface SidebarProps {
  userEmail: string | null | undefined;
  role: string | null;
  devices: SystemDevices;
  activeDeviceKey: string | null;
  setActiveDeviceKey: (key: string) => void;
  onRenameLocation: (key: string, name: string) => void;
  evaluateStatus: (lastSeen: number | undefined) => { status: string; color: string };
  onLogout: () => void;
  isAdmin: boolean;
}

export default function Sidebar({
  userEmail,
  role,
  devices,
  activeDeviceKey,
  setActiveDeviceKey,
  onRenameLocation,
  evaluateStatus,
  onLogout,
  isAdmin,
}: SidebarProps) {
  return (
    <aside className="w-full md:w-80 bg-slate-900 p-6 flex flex-col border-b md:border-b-0 md:border-r border-slate-800">
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-black tracking-wider text-blue-500 uppercase">SAMCS Control</h1>
          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${isAdmin ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
            {role}
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1 truncate">{userEmail}</p>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          {isAdmin ? "Global Registries" : "My Assigned Sockets"}
        </h3>
        
        <div className="space-y-2 flex-1 overflow-y-auto pr-1">
          {Object.keys(devices).length > 0 ? (
            Object.keys(devices).map((key) => {
              const dev = devices[key];
              const connection = evaluateStatus(dev.status?.last_seen);
              const isSelected = key === activeDeviceKey;
              
              return (
                <div 
                  key={key} 
                  onClick={() => setActiveDeviceKey(key)}
                  className={`p-3 rounded-xl cursor-pointer border transition flex flex-col ${isSelected ? 'bg-blue-600/10 border-blue-500' : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'}`}
                >
                  <div className="flex items-center justify-between">
                    <input 
                      type="text" 
                      name="new-device-location"
                      value={dev.meta?.location || "Smart Extension"} 
                      onChange={(e: ChangeEvent<HTMLInputElement>) => { 
                        e.stopPropagation(); 
                        onRenameLocation(key, e.target.value); 
                      }} 
                      className="bg-transparent text-sm font-semibold text-slate-200 focus:outline-none focus:border-b border-slate-600 w-44"
                      title="Click to rename location"
                    />
                    <span className={`w-2 h-2 rounded-full ${connection.color}`} />
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase mt-0.5 truncate">{key}</span>
                  {isAdmin && <span className="text-[9px] text-blue-400 font-medium truncate mt-0.5">👤 {dev.meta?.assignedUser}</span>}
                </div>
              );
            })
          ) : (
            <p className="text-xs text-slate-500 italic mt-2">No hardware modules assigned yet.</p>
          )}
        </div>
      </div>

      <button onClick={onLogout} className="mt-4 w-full bg-slate-950 border border-slate-800 hover:border-red-900/50 text-slate-400 hover:text-red-400 py-2 rounded-xl text-xs font-bold transition">
        Sign Out Center
      </button>
    </aside>
  );
}