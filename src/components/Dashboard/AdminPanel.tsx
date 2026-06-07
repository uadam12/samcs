import { useState } from "react";
import type { SubmitEvent } from "react";
import { getDatabase, ref, update } from "firebase/database";

export default function AdminPanel() {
  const [mac, setMac] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [location, setLocation] = useState("");
  const [statusMsg, setStatusMsg] = useState({ text: "", isError: false });
  const db = getDatabase();

  async function handleProvision(e: SubmitEvent) {
    e.preventDefault();
    setStatusMsg({ text: "", isError: false });

    const cleanMac = mac.replace(/:/g, "").toLowerCase().trim();
    if (cleanMac.length !== 12) {
      setStatusMsg({ text: "Invalid MAC length specification.", isError: true });
      return;
    }

    const deviceId = `samcs_${cleanMac}`;
    
    // Provision default structure to database tree
    const updates: { [key: string]: any } = {};
    updates[`devices/${deviceId}/meta`] = {
      assignedUser: userEmail.toLowerCase().trim(),
      installationDate: new Date().toISOString().split("T")[0],
      location: location.trim() || "Admin Provisioned Socket",
    };
    
    // Set up default channel parameters if uninitialized
    for (let i = 1; i <= 4; i++) {
      updates[`devices/${deviceId}/controls/relay_${i}/buttonEnable`] = true;
    }

    try {
      await update(ref(db), updates);
      setStatusMsg({ text: `Successfully mapped device ${deviceId} to ${userEmail}`, isError: false });
      setMac("");
      setUserEmail("");
      setLocation("");
    } catch (err: any) {
      setStatusMsg({ text: err.message, isError: true });
    }
  }

  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
      <div>
        <h3 className="text-lg font-black tracking-tight text-slate-100">Hardware Provisioning Domain Matrix</h3>
        <p className="text-xs text-slate-400">Map fresh physical extension nodes directly to client account profiles</p>
      </div>

      {statusMsg.text && (
        <div className={`p-3 text-xs rounded-xl border ${statusMsg.isError ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
          {statusMsg.text}
        </div>
      )}

      <form onSubmit={handleProvision} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="mac-address" className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Device MAC Fingerprint</label>
          <input id="mac-address" type="text" placeholder="e.g. 24:0A:C4:B8:58:A2" value={ mac} onChange={(e) => setMac(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500" required />
        </div>
        <div>
          <label htmlFor="owner-email" className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target Account Email</label>
          <input id="owner-email" type="email" placeholder="client@example.com" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500" required />
        </div>
        <div>
          <label htmlFor="device-location" className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Initial Location Placement</label>
          <input id="device-location" type="text" placeholder="e.g. Server Room Rack A" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-blue-500" required />
        </div>
        <div className="md:col-span-3 flex justify-end">
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 px-6 rounded-xl shadow-lg transition">
            Execute Provisioning Bind
          </button>
        </div>
      </form>
    </div>
  );
}