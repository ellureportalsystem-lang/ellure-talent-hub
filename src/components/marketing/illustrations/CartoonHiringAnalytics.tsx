/** Analytics / insights — recruiter with charts (homepage band) */
export function CartoonHiringAnalytics({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <ellipse cx="180" cy="278" rx="100" ry="14" fill="#ddd0f5" opacity="0.5" />

      <rect x="48" y="40" width="200" height="120" rx="14" fill="#fff" stroke="#ddd0f5" strokeWidth="2" />
      <text x="68" y="68" fontSize="12" fontWeight="700" fill="#6d28d9">
        Hiring pipeline
      </text>
      <rect x="68" y="80" width="36" height="56" rx="6" fill="#c4b5fd" />
      <rect x="112" y="96" width="36" height="40" rx="6" fill="#a78bfa" />
      <rect x="156" y="72" width="36" height="64" rx="6" fill="#8b5cf6" />
      <rect x="200" y="88" width="36" height="48" rx="6" fill="#7c3aed" />
      <path
        d="M72 148 Q120 120 168 130 T248 118"
        stroke="#0d9488"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      <rect x="220" y="52" width="96" height="72" rx="12" fill="#f3effe" stroke="#c4b5fd" strokeWidth="2" />
      <text x="236" y="76" fontSize="10" fontWeight="600" fill="#5b21b6">
        Shortlist rate
      </text>
      <text x="236" y="100" fontSize="22" fontWeight="800" fill="#7c3aed">
        94%
      </text>
      <rect x="236" y="108" width="64" height="6" rx="3" fill="#ddd6fe" />

      <circle cx="100" cy="210" r="28" fill="#FFDBAC" />
      <path d="M72 200c8-20 28-28 48-24" fill="#5c4033" />
      <ellipse cx="92" cy="214" rx="3" ry="4" fill="#1e293b" />
      <ellipse cx="108" cy="214" rx="3" ry="4" fill="#1e293b" />
      <path d="M88 228c8 4 16 4 24 0" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />
      <rect x="130" y="188" width="100" height="64" rx="10" fill="#1e293b" />
      <rect x="138" y="196" width="84" height="48" rx="6" fill="#4f46e5" />
      <rect x="148" y="208" width="28" height="24" rx="4" fill="#a78bfa" />
      <rect x="182" y="216" width="28" height="16" rx="4" fill="#c4b5fd" />
    </svg>
  );
}
