/** NexHire resume search & shortlist UI collage — detailed */
export function NexHireResumeSearchMockup({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 440 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="440" height="320" rx="14" fill="#f1f5f9" />
      {/* App chrome */}
      <rect x="12" y="12" width="416" height="36" rx="8" fill="#fff" stroke="#e2e8f0" />
      <circle cx="32" cy="30" r="6" fill="#f87171" />
      <circle cx="50" cy="30" r="6" fill="#fbbf24" />
      <circle cx="68" cy="30" r="6" fill="#4ade80" />
      <text x="200" y="34" textAnchor="middle" fontSize="11" fontWeight="600" fill="#64748b">
        app.ellurenexhire.com/recruiter/search
      </text>

      {/* Sidebar */}
      <rect x="12" y="56" width="88" height="252" rx="10" fill="#fff" stroke="#e2e8f0" />
      <text x="24" y="78" fontSize="9" fontWeight="700" fill="#94a3b8">
        MENU
      </text>
      {["Dashboard", "Resume search", "Shortlists", "Jobs", "Clients"].map((label, i) => (
        <g key={label}>
          <rect
            x="20"
            y={88 + i * 32}
            width="72"
            height="26"
            rx="6"
            fill={i === 1 ? "#dbeafe" : "#f8fafc"}
          />
          <text x="28" y={105 + i * 32} fontSize="9" fill={i === 1 ? "#1d4ed8" : "#475569"}>
            {label}
          </text>
        </g>
      ))}

      {/* Main panel */}
      <rect x="108" y="56" width="320" height="252" rx="12" fill="#fff" stroke="#d4e2fc" strokeWidth="1.5" />
      <text x="124" y="82" fontSize="14" fontWeight="700" fill="#1e3a8a">
        Resume search
      </text>
      <rect x="124" y="92" width="200" height="32" rx="8" fill="#f8fafc" stroke="#93c5fd" />
      <text x="136" y="112" fontSize="10" fill="#475569">
        Skills: React · Node · 3–6 yrs · Pune
      </text>
      <rect x="334" y="94" width="78" height="28" rx="14" fill="#2563eb" />
      <text x="352" y="112" fontSize="10" fontWeight="600" fill="#fff">
        Search
      </text>

      {/* Filters row */}
      {["Location", "Notice", "Match %", "Experience"].map((f, i) => (
        <rect
          key={f}
          x={124 + i * 72}
          y={132}
          width="64"
          height="22"
          rx="11"
          fill="#eff6ff"
          stroke="#bfdbfe"
        />
      ))}

      {/* Result cards */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect
            x="124"
            y={164 + i * 52}
            width="288"
            height="44"
            rx="10"
            fill={i === 0 ? "#eff6ff" : "#fff"}
            stroke="#e2e8f0"
          />
          <circle cx="144" cy={186 + i * 52} r="14" fill={["#93c5fd", "#fda4af", "#86efac"][i]} />
          <rect x="166" y={174 + i * 52} width="100" height="8" rx="4" fill="#1e293b" />
          <rect x="166" y={188 + i * 52} width="140" height="6" rx="3" fill="#94a3b8" />
          <rect x="360" y={176 + i * 52} width="40" height="20" rx="10" fill={i === 0 ? "#0d9488" : "#e2e8f0"} />
          <text
            x={368}
            y={190 + i * 52}
            fontSize="9"
            fontWeight="700"
            fill={i === 0 ? "#fff" : "#64748b"}
          >
            {["94%", "88%", "81%"][i]}
          </text>
        </g>
      ))}

      {/* Floating AI chip */}
      <rect x="300" y="24" width="120" height="36" rx="12" fill="#0d9488" filter="url(#shadow)" />
      <text x="312" y="42" fontSize="9" fontWeight="600" fill="#ccfbf1">
        AI shortlist ready
      </text>
      <text x="312" y="54" fontSize="11" fontWeight="700" fill="#fff">
        12 top matches
      </text>
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
        </filter>
      </defs>
    </svg>
  );
}
