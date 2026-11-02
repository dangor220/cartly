export default function Logo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 sm:gap-2 ${className ?? ''}`}>
      <svg
        viewBox="0 0 32 32"
        className="size-7 shrink-0 sm:size-8"
        aria-hidden="true"
        focusable="false">
        <rect width="32" height="32" rx="8" className="fill-indigo-600" />
        <path
          d="M21 11.5a6.5 6.5 0 1 0 0 9"
          className="fill-none stroke-white"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      <span className="text-lg font-bold tracking-tight sm:text-xl">Cartly</span>
    </span>
  );
}
