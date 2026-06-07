import { useState, useEffect } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import type { RelayChannel } from "../../interfaces/rbac";

interface RelayCardProps {
  channelId: string;
  channelIndex: number;
  relayData: RelayChannel;
  isOnline: boolean;
  onToggleState: (channelId: string, currentChannelData: RelayChannel) => void;
  onToggleLockout: (channelId: string, currentChannelData: RelayChannel) => void;
  onRenameAppliance: (channelId: string, currentChannelData: RelayChannel, newName: string) => void;
}

export default function RelayCard({
  channelId,
  channelIndex,
  relayData,
  isOnline,
  onToggleState,
  onToggleLockout,
  onRenameAppliance,
}: RelayCardProps) {
  const isOn = relayData.state === "ON";
  const isLocked = !relayData.buttonEnable;

  const [localName, setLocalName] = useState<string>(relayData.name);

  useEffect(() => {
    setLocalName(relayData.name);
  }, [relayData.name]);

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    setLocalName(e.target.value);
  }

  function handleBlur() {
    if (localName.trim() !== relayData.name) {
      onRenameAppliance(channelId, relayData, localName.trim());
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  }

  return (
    <div 
      className={`relative p-6 rounded-2xl border flex flex-col justify-between h-56 transition-all duration-300 group overflow-hidden ${
        isOn 
          ? 'bg-linear-to-br from-slate-900 via-slate-900 to-blue-950/40 border-blue-500 shadow-[0_0_25px_-5px_rgba(59,130,246,0.2)]' 
          : 'bg-linear-to-br from-slate-900 to-slate-950 border-slate-800/80 hover:border-slate-700 shadow-xl'
      }`}
    >
      {/* Top Header Deck */}
      <div className="space-y-1.5 relative z-10">
        <div className="flex items-center justify-between">
          <span className={`text-[9px] font-mono font-black tracking-widest uppercase px-2 py-0.5 rounded-md border ${
            isOn 
              ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
              : 'bg-slate-950 text-slate-500 border-slate-800'
          }`}>
            PIN 0{channelIndex}
          </span>

          {/* Animated Power Status Indicator */}
          <div className="flex items-center space-x-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isOn ? 'bg-blue-400 animate-pulse' : 'bg-slate-700'}`} />
            <span className={`text-[10px] font-mono font-bold ${isOn ? 'text-blue-400' : 'text-slate-500'}`}>
              {isOnline && isOn ? "LIVE" : "DISCONNECTED"}
            </span>
          </div>
        </div>

        {/* Appliance Custom Label Input */}
        <div className="pt-2">
          <input 
            type="text" 
            value={localName} 
            onChange={handleNameChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            name="relay-channel-name"
            className={`bg-transparent font-black text-base focus:outline-none focus:border-b border-blue-500 w-full transition-colors duration-150 truncate ${
              isOn ? 'text-white' : 'text-slate-300 group-hover:text-white'
            }`}
            placeholder={`Relay Channel ${channelIndex}`}
          />
        </div>
      </div>

      {/* Embedded Hardware Safety Lockout Module */}
      <div className={`relative z-10 p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-between ${
        isLocked 
          ? 'bg-red-950/20 border-red-900/30 text-red-400 shadow-sm' 
          : 'bg-slate-950/60 border-slate-800 text-slate-400'
      }`}>
        <div className="flex items-center space-x-2">
          <span className="text-xs">{isLocked ? "🔒" : "🔓"}</span>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-wide leading-none">Casing Switches</span>
            <span className="text-[9px] font-mono text-slate-500 mt-0.5">
              {isLocked ? "Manual override blocked" : "Manual override free"}
            </span>
          </div>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={isLocked} 
            name="relay-channel-state"
            onChange={() => onToggleLockout(channelId, relayData)}
            className="sr-only peer" 
          />
          <div className="w-7 h-4 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-red-600 peer-checked:after:bg-white"></div>
        </label>
      </div>

      {/* Main High-Current Switching Trigger Action */}
      <button 
        onClick={() => onToggleState(channelId, relayData)}
        className={`relative z-10 w-full py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all duration-200 active:scale-[0.98] ${
          isOn 
            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20' 
            : 'bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
      >
        {isOn ? "Off" : "On"}
      </button>

      {/* Subtle Background Circuit Accent Decor */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full transition-all duration-300 mix-blend-screen pointer-events-none opacity-20 filter blur-xl ${
        isOn ? 'bg-blue-500 group-hover:bg-blue-400' : 'bg-transparent'
      }`} />
    </div>
  );
}