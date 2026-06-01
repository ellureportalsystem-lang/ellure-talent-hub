/** Person on beanbag + laptop with floating profile cards (sky card visual) */
export function CartoonCandidateProfiles({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <ellipse cx="165" cy="258" rx="95" ry="14" fill="#B8C9E8" opacity="0.5" />

      {/* floating profile / theme cards */}
      <g>
        <rect x="28" y="36" width="72" height="88" rx="10" fill="#fff" stroke="#E2E8F0" strokeWidth="1.5" />
        <rect x="36" y="44" width="56" height="36" rx="6" fill="#DBEAFE" />
        <rect x="36" y="88" width="40" height="6" rx="3" fill="#E2E8F0" />
        <rect x="36" y="100" width="52" height="6" rx="3" fill="#E2E8F0" />

        <rect x="108" y="24" width="78" height="96" rx="10" fill="#fff" stroke="#E2E8F0" strokeWidth="1.5" />
        <rect x="116" y="32" width="62" height="40" rx="6" fill="#FDE68A" />
        <rect x="116" y="80" width="44" height="6" rx="3" fill="#E2E8F0" />
        <rect x="116" y="94" width="58" height="6" rx="3" fill="#E2E8F0" />

        <rect x="200" y="42" width="72" height="88" rx="10" fill="#fff" stroke="#E2E8F0" strokeWidth="1.5" />
        <rect x="208" y="50" width="56" height="36" rx="6" fill="#D1FAE5" />
        <rect x="208" y="94" width="40" height="6" rx="3" fill="#E2E8F0" />
        <rect x="208" y="106" width="52" height="6" rx="3" fill="#E2E8F0" />
      </g>

      {/* beanbag */}
      <ellipse cx="168" cy="210" rx="72" ry="48" fill="#F97316" />
      <ellipse cx="168" cy="200" rx="68" ry="40" fill="#FB923C" />

      {/* character */}
      <ellipse cx="168" cy="128" rx="34" ry="38" fill="#FFDBAC" />
      <path
        d="M134 118c6-24 28-36 52-32 20 4 32 22 28 44-2 12-8 20-18 24"
        fill="#78350F"
      />
      <ellipse cx="154" cy="130" rx="4.5" ry="5.5" fill="#1E293B" />
      <ellipse cx="182" cy="130" rx="4.5" ry="5.5" fill="#1E293B" />
      <path d="M158 144c6 5 14 5 20 0" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" fill="none" />

      <path d="M138 168c-8 18-4 36 8 48" stroke="#FFDBAC" strokeWidth="12" strokeLinecap="round" />
      <path d="M198 168c8 18 4 36-8 48" stroke="#FFDBAC" strokeWidth="12" strokeLinecap="round" />

      {/* laptop */}
      <path d="M128 175h80l8 12H120l8-12z" fill="#94A3B8" />
      <rect x="132" y="152" width="72" height="48" rx="4" fill="#334155" />
      <rect x="138" y="158" width="60" height="36" rx="2" fill="#38BDF8" />
      <rect x="144" y="164" width="28" height="4" rx="2" fill="#fff" opacity="0.7" />
      <rect x="144" y="172" width="44" height="3" rx="1.5" fill="#fff" opacity="0.45" />
      <rect x="144" y="180" width="36" height="3" rx="1.5" fill="#fff" opacity="0.45" />

      <path d="M148 148c-4-22 8-38 28-40 18-2 32 12 30 36" fill="#4B5563" />
    </svg>
  );
}
