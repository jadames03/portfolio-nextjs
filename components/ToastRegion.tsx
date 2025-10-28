"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Toast = {
  id: number;
  message: string;
  tone?: "default" | "error" | "success";
};

export function ToastRegion() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const pathname = usePathname();

  useEffect(() => {
    function handleToast(event: Event) {
      const detail = (event as CustomEvent<Toast>).detail;
      setToasts((prev) => [...prev, { ...detail, id: Date.now() }]);
    }

    document.addEventListener("app:toast", handleToast);
    return () => {
      document.removeEventListener("app:toast", handleToast);
    };
  }, []);

  useEffect(() => {
    setToasts([]);
  }, [pathname]);

  useEffect(() => {
    if (!toasts.length) {
      return;
    }

    const timers = toasts.map((toast) =>
      setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== toast.id));
      }, 4000)
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [toasts]);

  if (!toasts.length) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-4 flex justify-center px-4">
      <div className="flex w-full max-w-md flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`rounded-md border px-4 py-3 text-sm shadow-lg backdrop-blur transition ${
              toast.tone === "error"
                ? "border-red-400/40 bg-red-500/10 text-red-100"
                : toast.tone === "success"
                  ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-100"
                  : "border-slate-400/30 bg-slate-900/80 text-slate-100"
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
}
