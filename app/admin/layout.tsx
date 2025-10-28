import Link from "next/link";

export const metadata = {
  title: "Admin"
};

type AdminLayoutProps = {
  children: React.ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  // Placeholder to ensure metadata is applied and consistent wrapper.
  return (
    <div className="min-h-screen bg-slate-950 pb-16">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="container flex items-center justify-between py-5">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-wide text-slate-500">Admin</p>
            <h1 className="text-2xl font-semibold text-slate-100">Project Management</h1>
          </div>
          <Link
            href="/"
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm text-slate-200 transition hover:border-sky-400 hover:text-sky-100"
          >
            View site
          </Link>
        </div>
      </header>
      <main className="container mt-10 space-y-10">{children}</main>
    </div>
  );
}
