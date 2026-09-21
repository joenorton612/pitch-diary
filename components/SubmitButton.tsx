"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({
  children,
  pendingText = "Please wait…",
  className = "",
  variant = "default",
}: {
  children: React.ReactNode;
  pendingText?: string;
  className?: string;
  variant?: "default" | "danger";
}) {
  const { pending } = useFormStatus();
  const variantClass =
    variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : "bg-gold-500 text-pitch-950 hover:bg-gold-400";
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variantClass} ${className}`}
    >
      {pending ? pendingText : children}
    </button>
  );
}
