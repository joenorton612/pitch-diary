import Link from "next/link";
import { LogoMark } from "./Logo";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-pitch-950 px-6 py-16">
      <div className="absolute inset-0 bg-pitch-lines opacity-30" />
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gold-500/10 blur-3xl" />

      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-8 flex justify-center">
          <LogoMark className="text-white" wordmarkClassName="text-lg text-white" />
        </Link>

        <div className="rounded-3xl bg-cream-100 p-8 shadow-2xl">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">
            {title}
          </h1>
          <p className="mt-1.5 text-sm text-ink/60">{subtitle}</p>

          <div className="mt-7">{children}</div>
        </div>

        {footer && (
          <p className="mt-6 text-center text-sm text-white/70">{footer}</p>
        )}
      </div>
    </div>
  );
}
