/** Analytics / features illustration */
export function CartoonAnalyticsDashboard({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <ellipse cx="160" cy="242" rx="90" ry="12" fill="#B8E0D2" opacity="0.5" />
      <rect x="56" y="40" width="208" height="150" rx="18" fill="#fff" stroke="#D1FAE5" strokeWidth="2" />
      <text x="80" y="72" fontSize="14" fontWeight="700" fill="#0F766E">
        Hiring analytics
      </text>
      <rect x="72" y="88" width="48" height="72" rx="6" fill="#5EEAD4" />
      <rect x="128" y="108" width="48" height="52" rx="6" fill="#38BDF8" />
      <rect x="184" y="96" width="48" height="64" rx="6" fill="#A78BFA" />
      <path d="M72 200 Q120 170 168 185 T248 175" stroke="#0D9488" strokeWidth="3" fill="none" strokeLinecap="round" />

      <circle cx="248" cy="68" r="28" fill="#FFDBAC" />
      <path d="M224 58c6-14 22-18 36-10 12 6 16 20 10 32" fill="#4B5563" />
      <ellipse cx="240" cy="70" rx="3" ry="4" fill="#1E293B" />
      <ellipse cx="256" cy="70" rx="3" ry="4" fill="#1E293B" />
      <path
        d="M220 200c-6 20 4 36 24 40"
        stroke="#FFDBAC"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <rect x="200" y="168" width="56" height="40" rx="6" fill="#334155" />
      <rect x="206" y="174" width="44" height="28" rx="3" fill="#14B8A6" />
    </svg>
  );
}
