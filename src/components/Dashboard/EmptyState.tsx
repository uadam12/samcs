
export default function EmptyState() {
  return (
    <div className="text-center py-20 text-slate-600 border border-dashed border-slate-800 rounded-2xl p-6 max-w-xl mx-auto">
      <span className="text-4xl mb-3 block">🔌</span>
      <h3 className="text-sm font-semibold text-slate-400">No Active Device Stream Target Configured</h3>
      <p className="text-xs text-slate-500 mt-1">Your administrator hasn't linked a hardware signature key matching this account email profile routing matrix yet.</p>
    </div>
  );
}