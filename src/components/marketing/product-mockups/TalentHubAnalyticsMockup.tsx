/** TalentHub hiring analytics dashboard — product UI mockup */
export function TalentHubAnalyticsMockup({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 440 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="440" height="320" rx="14" fill="#f0f7ff" />
      <rect x="12" y="12" width="416" height="36" rx="8" fill="#fff" stroke="#d4e2fc" />
      <circle cx="32" cy="30" r="6" fill="#f87171" />
      <circle cx="50" cy="30" r="6" fill="#fbbf24" />
      <circle cx="68" cy="30" r="6" fill="#4ade80" />
      <text x="200" y="34" textAnchor="middle" fontSize="11" fontWeight="600" fill="#0566CD">
        Ellure TalentHub · Analytics
      </text>

      <rect x="12" y="56" width="88" height="252" rx="10" fill="#fff" stroke="#d4e2fc" />
      {["Overview", "Pipeline", "Applicants", "Shortlists", "Reports"].map((label, i) => (
        <g key={label}>
          <rect
            x="20"
            y={88 + i * 32}
            width="72"
            height="26"
            rx="6"
            fill={i === 1 ? "#e0f0ff" : "#f8fafc"}
          />
          <text x="28" y={105 + i * 32} fontSize="9" fill={i === 1 ? "#0566CD" : "#64748b"}>
            {label}
          </text>
        </g>
      ))}

      <rect x="108" y="56" width="200" height="148" rx="12" fill="#fff" stroke="#93c5fd" strokeWidth="1.5" />
      <text x="124" y="82" fontSize="13" fontWeight="700" fill="#010c7d">
        Hiring pipeline
      </text>
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x={124 + i * 44}
          y={96}
          width="32"
          height={[72, 56, 80, 48][i]}
          rx="6"
          fill={["#bfdbfe", "#60a5fa", "#0566CD", "#010c7d"][i]}
        />
      ))}
      <path
        d="M124 188 Q168 160 212 172 T300 158"
        stroke="#1A9EB0"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      <text x="124" y="206" fontSize="9" fill="#64748b">
        Applicant flow (30 days)
      </text>

      <rect x="320" y="56" width="108" height="68" rx="12" fill="#fff" stroke="#a7f3d0" />
      <text x="336" y="78" fontSize="10" fontWeight="600" fill="#0f766e">
        Shortlist rate
      </text>
      <text x="336" y="104" fontSize="22" fontWeight="800" fill="#1A9EB0">
        94%
      </text>
      <rect x="336" y="110" width="76" height="6" rx="3" fill="#ccfbf1" />

      <rect x="320" y="136" width="108" height="68" rx="12" fill="#fff" stroke="#d4e2fc" />
      <text x="336" y="158" fontSize="10" fontWeight="600" fill="#0566CD">
        Active roles
      </text>
      <text x="336" y="184" fontSize="22" fontWeight="800" fill="#010c7d">
        28
      </text>

      <rect x="108" y="216" width="320" height="92" rx="12" fill="#fff" stroke="#d4e2fc" />
      <text x="124" y="240" fontSize="11" fontWeight="700" fill="#1e293b">
        Recent activity
      </text>
      {["12 profiles added · IT", "Shortlist sent · Product", "Interview scheduled · BFSI"].map(
        (line, i) => (
          <g key={line}>
            <circle cx="132" cy={258 + i * 18} r="4" fill="#0566CD" />
            <text x="144" y={262 + i * 18} fontSize="9" fill="#475569">
              {line}
            </text>
          </g>
        )
      )}
    </svg>
  );
}
