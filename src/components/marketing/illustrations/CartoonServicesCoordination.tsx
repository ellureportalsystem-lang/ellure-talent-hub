/** Services page — coordination, screening, interviews */
export function CartoonServicesCoordination({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <ellipse cx="180" cy="278" rx="100" ry="14" fill="#c5ead8" opacity="0.5" />

      {/* Calendar card */}
      <rect x="28" y="36" width="88" height="96" rx="12" fill="#fff" stroke="#c5ead8" strokeWidth="2" />
      <rect x="28" y="36" width="88" height="24" rx="12" fill="#0d9488" />
      <rect x="28" y="48" width="88" height="12" fill="#0d9488" />
      <text x="72" y="52" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">
        Interviews
      </text>
      {[0, 1, 2].map((i) => (
        <rect key={i} x="40" y={72 + i * 18} width="64" height="12" rx="4" fill={i === 0 ? "#d1fae5" : "#f1f5f9"} />
      ))}

      {/* Checklist */}
      <rect x="244" y="48" width="92" height="108" rx="12" fill="#fff" stroke="#a7f3d0" strokeWidth="2" />
      <text x="258" y="72" fontSize="11" fontWeight="700" fill="#0f766e">
        Screening
      </text>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <circle cx="262" cy={88 + i * 16} r="5" fill="#10b981" />
          <path d="M259 88 l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="274" y={84 + i * 16} width="48" height="6" rx="3" fill="#e2e8f0" />
        </g>
      ))}

      {/* HR coordinator */}
      <ellipse cx="180" cy="248" rx="56" ry="36" fill="#14b8a6" />
      <ellipse cx="180" cy="238" rx="52" ry="32" fill="#2dd4bf" />
      <ellipse cx="180" cy="128" rx="36" ry="40" fill="#FFDBAC" />
      <path d="M144 118c6-26 30-38 56-34 24 4 38 24 34 48-2 12-10 22-22 26" fill="#5c4033" />
      <ellipse cx="168" cy="132" rx="4" ry="5" fill="#1e293b" />
      <ellipse cx="192" cy="132" rx="4" ry="5" fill="#1e293b" />
      <path d="M170 148c6 4 14 4 20 0" stroke="#e11d48" strokeWidth="2" strokeLinecap="round" />

      <path d="M148 188c-14 6-22 20-18 36" stroke="#FFDBAC" strokeWidth="12" strokeLinecap="round" />
      <path d="M212 188c14 6 22 20 18 36" stroke="#FFDBAC" strokeWidth="12" strokeLinecap="round" />

      {/* Clipboard */}
      <rect x="152" y="172" width="56" height="72" rx="6" fill="#fff" stroke="#94a3b8" strokeWidth="2" />
      <rect x="168" y="166" width="24" height="12" rx="4" fill="#64748b" />
      <rect x="162" y="188" width="36" height="5" rx="2" fill="#cbd5e1" />
      <rect x="162" y="200" width="44" height="5" rx="2" fill="#cbd5e1" />
      <rect x="162" y="212" width="28" height="5" rx="2" fill="#86efac" />

      {/* Handshake badge */}
      <circle cx="118" cy="200" r="26" fill="#fef3c7" stroke="#fcd34d" strokeWidth="2" />
      <path
        d="M108 202c4-6 12-8 18-4 4 2 6 8 2 12-4 4-12 2-16-4-4-4-2-10 2-14 4-4 10-2 14 2"
        fill="#f59e0b"
        opacity="0.9"
      />
    </svg>
  );
}
