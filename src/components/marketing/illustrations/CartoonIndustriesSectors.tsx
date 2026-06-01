/** Industries page — IT, BFSI, pharma, retail sectors */
export function CartoonIndustriesSectors({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <ellipse cx="180" cy="282" rx="110" ry="12" fill="#bfdbfe" opacity="0.45" />

      {/* IT tower */}
      <rect x="32" y="88" width="56" height="120" rx="6" fill="#dbeafe" stroke="#93c5fd" strokeWidth="2" />
      <rect x="40" y="72" width="40" height="20" rx="4" fill="#2563eb" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x="42" y={100 + i * 22} width="36" height="14" rx="2" fill="#fff" opacity="0.9" />
      ))}
      <text x="60" y="64" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1e40af">
        IT
      </text>

      {/* Pharma */}
      <rect x="108" y="108" width="64" height="100" rx="8" fill="#d1fae5" stroke="#6ee7b7" strokeWidth="2" />
      <circle cx="140" cy="92" r="18" fill="#10b981" />
      <path d="M140 82v20M130 92h20" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <rect x="118" y="128" width="44" height="36" rx="4" fill="#fff" />
      <text x="140" y="78" textAnchor="middle" fontSize="8" fontWeight="700" fill="#065f46">
        Pharma
      </text>

      {/* Retail / BFSI */}
      <rect x="188" y="96" width="72" height="112" rx="8" fill="#fef3c7" stroke="#fcd34d" strokeWidth="2" />
      <path d="M204 96h40l8 24H196l8-24z" fill="#f59e0b" />
      <rect x="200" y="132" width="48" height="8" rx="2" fill="#fff" />
      <rect x="200" y="148" width="48" height="8" rx="2" fill="#fff" />
      <text x="224" y="88" textAnchor="middle" fontSize="8" fontWeight="700" fill="#92400e">
        Retail
      </text>

      {/* Telecom */}
      <rect x="272" y="100" width="56" height="108" rx="8" fill="#f3e8ff" stroke="#c4b5fd" strokeWidth="2" />
      <circle cx="300" cy="88" r="14" fill="#8b5cf6" />
      <path
        d="M300 78c8 0 14 6 14 14s-6 14-14 14"
        stroke="#fff"
        strokeWidth="2"
        fill="none"
      />
      <text x="300" y="74" textAnchor="middle" fontSize="8" fontWeight="700" fill="#5b21b6">
        Telecom
      </text>

      {/* Professionals */}
      <circle cx="88" cy="228" r="22" fill="#FFDBAC" />
      <rect x="72" y="248" width="32" height="28" rx="6" fill="#3b82f6" />
      <circle cx="180" cy="220" r="24" fill="#FFDBAC" />
      <rect x="162" y="242" width="36" height="32" rx="6" fill="#0d9488" />
      <circle cx="272" cy="224" r="20" fill="#FFDBAC" />
      <rect x="258" y="242" width="28" height="30" rx="6" fill="#f97316" />
    </svg>
  );
}
