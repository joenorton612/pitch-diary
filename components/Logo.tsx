export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 20L16 8L28 20L22 26L16 20L10 26L4 20Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function LogoMark({
  className = "",
  wordmarkClassName = "",
}: {
  className?: string;
  wordmarkClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Logo className="h-6 w-6 text-gold-500" />
      <span className={`font-extrabold tracking-tight ${wordmarkClassName}`}>
        Pitch Diary
      </span>
    </span>
  );
}
