export default function Avatar() {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-800 p-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 font-bold text-white">
        E
      </div>

      <div>
        <p className="font-medium text-white">
          Emir
        </p>

        <p className="text-xs text-slate-400">
          Administrator
        </p>
      </div>
    </div>
  );
}