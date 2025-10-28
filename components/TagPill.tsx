type TagPillProps = {
  tag: {
    id: string;
    name: string;
    slug: string;
  };
};

export function TagPill({ tag }: TagPillProps) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide text-slate-200">
      {tag.name}
    </span>
  );
}
