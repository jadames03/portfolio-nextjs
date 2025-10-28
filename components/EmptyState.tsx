import { Box } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 px-8 py-12 text-center">
      <Box className="h-10 w-10 text-slate-600" aria-hidden="true" />
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        {description ? (
          <p className="text-sm text-slate-400">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
