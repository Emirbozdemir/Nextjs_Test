import { Inbox } from "lucide-react";

type DataStateProps = {
  isLoading?: boolean;
  title?: string;
  description?: string;
  className?: string;
};

export default function DataState({
  isLoading = false,
  title = "No data available",
  description = "There is no data to display right now.",
  className = "",
}: DataStateProps) {
  if (isLoading) {
    return (
      <div
        aria-live="polite"
        className={`flex min-h-56 items-center justify-center ${className}`}
      >
        <div className="w-full max-w-md space-y-4">
          <div className="h-4 w-2/5 animate-pulse rounded bg-slate-200" />
          <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-3 w-4/5 animate-pulse rounded bg-slate-100" />
          <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-56 flex-col items-center justify-center px-6 text-center ${className}`}
    >
      <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
        <Inbox size={24} />
      </div>
      <h3 className="mt-4 font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}
