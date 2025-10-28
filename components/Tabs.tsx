"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type TabOption = {
  label: string;
  value: string;
};

type TabsProps = {
  tabs: TabOption[];
  paramKey: string;
};

export function Tabs({ tabs, paramKey }: TabsProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const activeValue = searchParams.get(paramKey) ?? tabs[0]?.value;

  const handleSelect = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === tabs[0]?.value) {
        params.delete(paramKey);
      } else {
        params.set(paramKey, value);
      }
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [paramKey, pathname, router, searchParams, tabs]
  );

  return (
    <div role="tablist" aria-label="Project filters" className="flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = tab.value === activeValue;
        return (
          <button
            key={tab.value}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => handleSelect(tab.value)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
              isActive
                ? "border-sky-400 bg-sky-500/20 text-sky-100"
                : "border-slate-700 bg-slate-800/60 text-slate-200 hover:border-sky-400/60 hover:text-sky-100"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
