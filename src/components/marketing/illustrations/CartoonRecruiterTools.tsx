/** 3D-style recruiter with tablet + floating hiring-tool icons (peach card visual) */
export function CartoonRecruiterTools({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <ellipse cx="160" cy="258" rx="88" ry="14" fill="#E8C4B0" opacity="0.45" />
      {/* floating icons */}
      <g opacity="0.95">
        <circle cx="52" cy="72" r="22" fill="#fff" stroke="#CBD5E1" strokeWidth="1.5" />
        <rect x="42" y="64" width="20" height="16" rx="3" fill="#dbeafe" stroke="#3b82f6" strokeWidth="1" />
        <circle cx="52" cy="70" r="4" fill="#2563eb" />
        <path d="M46 78h12" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M52 94 Q80 88 100 110" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />

        <circle cx="268" cy="58" r="20" fill="#25D366" />
        <path
          d="M258 58c0-5 4-9 10-9s10 4 10 9-4 9-10 9c-1 0-2 0-3-.3l-4 3 1-4"
          fill="#fff"
          opacity="0.9"
        />
        <path d="M248 78 Q220 95 195 118" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />

        <rect x="238" y="118" width="40" height="40" rx="10" fill="#fff" stroke="#E2E8F0" strokeWidth="1.5" />
        <path d="M252 138h12M252 132h12" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
        <path d="M210 145 Q185 155 170 175" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />

        <circle cx="78" cy="168" r="18" fill="#F59E0B" />
        <text x="78" y="173" textAnchor="middle" fontSize="14" fontWeight="800" fill="#fff">
          %
        </text>
        <path d="M96 168 Q120 155 145 148" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 3" fill="none" />
      </g>

      {/* character */}
      <g>
        <path
          d="M118 218c-8 28 12 42 42 42s52-14 44-42c-6-22-18-38-44-38s-38 16-42 38z"
          fill="#3B82F6"
        />
        <path d="M132 200c6-42 28-62 56-62s50 20 56 62" fill="#F97316" />
        <ellipse cx="188" cy="118" rx="38" ry="42" fill="#FFDBAC" />
        <path
          d="M150 108c8-28 32-42 56-38 22 4 36 26 32 52-2 14-10 24-22 28"
          fill="#FB923C"
        />
        <ellipse cx="172" cy="122" rx="5" ry="6" fill="#1E293B" />
        <ellipse cx="204" cy="122" rx="5" ry="6" fill="#1E293B" />
        <path d="M178 138c8 6 18 6 26 0" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <ellipse cx="188" cy="132" rx="4" ry="2.5" fill="#FDA4AF" opacity="0.6" />

        {/* arms + tablet */}
        <path d="M138 178c-18 8-28 24-24 40" stroke="#FFDBAC" strokeWidth="14" strokeLinecap="round" />
        <path d="M238 178c18 8 28 24 24 40" stroke="#FFDBAC" strokeWidth="14" strokeLinecap="round" />
        <rect x="148" y="168" width="80" height="58" rx="8" fill="#1E293B" />
        <rect x="154" y="174" width="68" height="44" rx="4" fill="#60A5FA" />
        <rect x="160" y="180" width="24" height="4" rx="2" fill="#fff" opacity="0.8" />
        <rect x="160" y="190" width="40" height="3" rx="1.5" fill="#fff" opacity="0.5" />
        <rect x="160" y="198" width="32" height="3" rx="1.5" fill="#fff" opacity="0.5" />
      </g>
    </svg>
  );
}
