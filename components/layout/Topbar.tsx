import { Bell, Search, UserCircle2 } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <h2 className="text-2xl font-semibold">Dashboard</h2>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2">
          <Search size={18} className="text-slate-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent outline-none text-sm"
          />
        </div>

        <button className="relative p-2 rounded-lg hover:bg-slate-100">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-2 cursor-pointer">
          <UserCircle2 size={34} />
          <div>
            <p className="font-medium">Emir</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}