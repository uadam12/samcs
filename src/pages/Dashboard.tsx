import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { SystemDevices, SmartDevice, RelayChannel } from "../interfaces/rbac";
import { ref, onValue, update, query, orderByChild, equalTo } from "firebase/database";
import { db } from "../firebaseConfig";

import Sidebar from "../components/Dashboard/Sidebar";
import StatusHeader from "../components/Dashboard/StatusHeader";
import RelayCard from "../components/Dashboard/RelayCard";
import EmptyState from "../components/Dashboard/EmptyState";
import AdminPanel from "../components/Dashboard/AdminPanel";

interface StatusEvaluation {
  status: "ONLINE" | "OFFLINE";
  color: "bg-emerald-500" | "bg-red-500";
}

export default function Dashboard() {
  const { currentUser, role, logout } = useAuth();
  const [devices, setDevices] = useState<SystemDevices>({});
  const [activeDeviceKey, setActiveDeviceKey] = useState<string | null>(null);

  const isAdmin = role === "admin";

  // Stream listening pipeline configuration
  useEffect(() => {
    if (!currentUser?.email) return;

    const userEmailNormalized = currentUser.email.toLowerCase();
    
    // 💡 FIX 1: Admins query the full registry root, regular users use the indexed email path
    const targetDatabaseRef = isAdmin 
      ? ref(db, 'devices')
      : query(ref(db, 'devices'), orderByChild('meta/assignedUser'), equalTo(userEmailNormalized));

    const unsubscribe = onValue(targetDatabaseRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as SystemDevices;
        setDevices(data);
      } else {
        setDevices({});
      }
    });

    return unsubscribe;
  }, [currentUser?.email, isAdmin]);

  // Handle active choice selection mapping safely
  useEffect(() => {
    const keys = Object.keys(devices);
    if (keys.length > 0) {
      if (!activeDeviceKey || !devices[activeDeviceKey]) {
        setActiveDeviceKey(keys[0]);
      }
    } else {
      setActiveDeviceKey(null);
    }
  }, [devices, activeDeviceKey]);

  function evaluateStatus(lastSeen: number | undefined): StatusEvaluation {
    if (!lastSeen) return { status: "OFFLINE", color: "bg-red-500" };
    const isLive = Date.now() - lastSeen < 25000;
    return isLive ? { status: "ONLINE", color: "bg-emerald-500" } : { status: "OFFLINE", color: "bg-red-500" };
  }

  function handleMutateProperty(deviceKey: string, pathSuffix: string, value: any): void {
    update(ref(db, `devices/${deviceKey}/${pathSuffix}`), value);
  }

  const selectedDevice: SmartDevice | undefined = activeDeviceKey ? devices[activeDeviceKey] : undefined;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col md:flex-row">
      
      <Sidebar 
        userEmail={currentUser?.email}
        role={role}
        devices={devices}
        activeDeviceKey={activeDeviceKey}
        setActiveDeviceKey={setActiveDeviceKey}
        // 💡 FIX 2: Write directly to "meta/location" primitive key instead of destructive object overwrites
        onRenameLocation={(key, name) => handleMutateProperty(key, "meta", { location: name })}
        evaluateStatus={evaluateStatus}
        onLogout={() => logout()}
        isAdmin={isAdmin}
      />

      <main className="flex-1 p-6 md:p-10 overflow-y-auto space-y-6">
        {isAdmin && <AdminPanel />}

        {activeDeviceKey && selectedDevice ? (
          <div className="space-y-6">
            
            <StatusHeader 
              // 💡 FIX 3: Force fallback empty string value ("") to prevent Controlled Input tracking crashes
              location={selectedDevice.meta?.location || ""}
              deviceKey={activeDeviceKey}
              rssi={selectedDevice.status?.rssi || 0}
              connectionStatus={evaluateStatus(selectedDevice.status?.last_seen).status}
              onRenameHeaderLocation={(newName) => handleMutateProperty(activeDeviceKey, "meta", { location: newName })}
            />

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, idx) => {
                const channelId = `relay_${idx + 1}`;
                const ch: RelayChannel = selectedDevice.controls?.[channelId] || { 
                  state: "OFF", 
                  buttonEnable: true, 
                  name: `Relay Channel ${idx + 1}` 
                };

                return (
                  <RelayCard 
                    key={channelId}
                    channelId={channelId}
                    channelIndex={idx + 1}
                    relayData={ch}
                    onToggleState={(id, currentData) => {
                      const nextStateValue = currentData.state === "ON" ? "OFF" : "ON";
                      handleMutateProperty(activeDeviceKey, `controls/${id}`, { state: nextStateValue });
                    }}
                    onToggleLockout={(id, currentData) => {
                      const nextLockoutValue = !currentData.buttonEnable;
                      handleMutateProperty(activeDeviceKey, `controls/${id}`, { buttonEnable: nextLockoutValue });
                    }}
                    onRenameAppliance={(id, _, newName) => {
                      handleMutateProperty(activeDeviceKey, `controls/${id}`, { name: newName });
                    }}
                  />
                );
              })}
            </section>
          </div>
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}