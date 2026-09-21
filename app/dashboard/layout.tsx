import Link from "next/link";
import { requireUser, isAdmin } from "@/lib/session";
import { LogoMark } from "@/components/Logo";
import { DashboardNav } from "@/components/DashboardNav";
import { SignOutButton } from "@/components/SignOutButton";
import { ThemeToggle } from "@/components/ThemeToggle";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const admin = isAdmin(user);
  const initial = (user.full_name || user.email).charAt(0).toUpperCase();

  return (
    <div className="flex flex-1 flex-col bg-cream-200">
      <header className="border-b border-cream-300 bg-cream-100">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
          <Link href="/dashboard/overview">
            <LogoMark className="text-ink" wordmarkClassName="text-lg text-ink" />
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-ink">
                {user.full_name || user.email}
              </p>
              <p className="text-xs text-ink/50">
                {user.position ? `${user.position} · ` : ""}
                {user.team || ""}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pitch-900 text-sm font-bold text-gold-400">
              {initial}
            </div>
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
        <div className="mx-auto w-full max-w-6xl px-6 pb-4 sm:px-10">
          <DashboardNav isAdmin={admin} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 sm:px-10">
        {children}
      </main>
    </div>
  );
}
