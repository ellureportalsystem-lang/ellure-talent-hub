/** Features / platform page — multi-module hiring suite */
export function CartoonPlatformFeatures({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <ellipse cx="180" cy="278" rx="95" ry="14" fill="#d4e2fc" opacity="0.5" />

      {/* Main dashboard */}
      <rect x="72" y="48" width="216" height="140" rx="16" fill="#fff" stroke="#93c5fd" strokeWidth="2" />
      <rect x="88" y="64" width="80" height="10" rx="5" fill="#e2e8f0" />
      <rect x="88" y="84" width="184" height="12" rx="6" fill="#dbeafe" />
      <rect x="88" y="104" width="120" height="8" rx="4" fill="#f1f5f9" />
      <rect x="88" y="120" width="140" height="8" rx="4" fill="#f1f5f9" />
      <rect x="88" y="140" width="80" height="32" rx="8" fill="#eff6ff" stroke="#bfdbfe" />
      <rect x="180" y="140" width="92" height="32" rx="8" fill="#ecfdf5" stroke="#a7f3d0" />

      {/* Floating modules */}
      <rect x="24" y="72" width="52" height="52" rx="12" fill="#fdf0e9" stroke="#f5ddd0" strokeWidth="2" />
      <circle cx="50" cy="92" r="12" fill="#3b82f6" />
      <rect x="38" y="108" width="24" height="4" rx="2" fill="#e2e8f0" />

      <rect x="284" y="64" width="56" height="56" rx="12" fill="#f3effe" stroke="#ddd0f5" strokeWidth="2" />
      <path d="M300 84h24M312 72v24" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" />
      <rect x="292" y="108" width="40" height="4" rx="2" fill="#e2e8f0" />

      <rect x="260" y="168" width="72" height="48" rx="10" fill="#e8f8f0" stroke="#c5ead8" strokeWidth="2" />
      <text x="296" y="196" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0f766e">
        Security
      </text>

      {/* Character with laptop */}
      <ellipse cx="180" cy="248" rx="48" ry="28" fill="#f97316" opacity="0.3" />
      <ellipse cx="180" cy="238" rx="34" ry="38" fill="#FFDBAC" />
      <path d="M146 228c8-22 28-32 50-28 20 4 32 22 28 42" fill="#78350f" />
      <rect x="130" y="218" width="100" height="56" rx="8" fill="#1e293b" />
      <rect x="138" y="226" width="84" height="40" rx="4" fill="#60a5fa" />
      <rect x="148" y="236" width="48" height="4" rx="2" fill="#fff" opacity="0.7" />
      <rect x="148" y="246" width="64" height="3" rx="1.5" fill="#fff" opacity="0.5" />
    </svg>
  );
}
