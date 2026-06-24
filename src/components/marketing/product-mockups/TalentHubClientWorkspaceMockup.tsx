/** TalentHub client workspace — detailed jobs, shortlists, messages */
export function TalentHubClientWorkspaceMockup({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 440 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <rect width="440" height="320" rx="14" fill="#fffbf7" />
      <rect x="12" y="12" width="416" height="36" rx="8" fill="#fff" stroke="#f5ddd0" />
      <text x="28" y="34" fontSize="12" fontWeight="700" fill="#9a3412">
        Ellure TalentHub · Client workspace
      </text>
      <rect x="340" y="20" width="76" height="22" rx="11" fill="#fdf0e9" stroke="#f5ddd0" />
      <text x="352" y="34" fontSize="9" fill="#c2410c">
        Acme Corp
      </text>

      <rect x="12" y="56" width="100" height="252" rx="10" fill="#fff" stroke="#f5ddd0" />
      {["Overview", "Shortlists", "Open jobs", "Messages", "Reports"].map((label, i) => (
        <g key={label}>
          <rect x="20" y={72 + i * 38} width="84" height="30" rx="8" fill={i === 1 ? "#fdf0e9" : "#fafafa"} />
          <text x="30" y={91 + i * 38} fontSize="10" fill={i === 1 ? "#c2410c" : "#64748b"}>
            {label}
          </text>
        </g>
      ))}

      <rect x="124" y="56" width="188" height="148" rx="12" fill="#fff" stroke="#d4e2fc" />
      <text x="140" y="80" fontSize="12" fontWeight="700" fill="#010c7d">
        Senior Product Designer
      </text>
      <rect x="140" y="88" width="80" height="20" rx="10" fill="#dbeafe" />
      <text x="150" y="102" fontSize="9" fill="#0566CD">
        12 in pipeline
      </text>
      <rect x="140" y="118" width="156" height="8" rx="4" fill="#e2e8f0" />
      <rect x="140" y="134" width="130" height="8" rx="4" fill="#e2e8f0" />
      <rect x="140" y="150" width="100" height="8" rx="4" fill="#c5ead8" />
      <rect x="140" y="170" width="156" height="24" rx="8" fill="#eff6ff" />
      <text x="150" y="186" fontSize="9" fill="#475569">
        Stage: Client review
      </text>

      <rect x="324" y="56" width="104" height="148" rx="12" fill="#0566CD" />
      <text x="338" y="84" fontSize="10" fontWeight="600" fill="#fff">
        New feedback
      </text>
      <rect x="338" y="96" width="76" height="36" rx="8" fill="#fff" fillOpacity="0.15" />
      <text x="346" y="114" fontSize="8" fill="#bfdbfe">
        “Strong UX portfolio”
      </text>
      <text x="346" y="126" fontSize="8" fill="#bfdbfe">
        — Hiring manager
      </text>
      <circle cx="376" cy="168" r="22" fill="#fff" fillOpacity="0.2" />

      <rect x="124" y="216" width="304" height="92" rx="12" fill="#fff" stroke="#c5ead8" />
      <text x="140" y="240" fontSize="11" fontWeight="600" fill="#0f766e">
        Shared shortlist · 5 candidates
      </text>
      {[0, 1, 2, 3, 4].map((i) => (
        <circle key={i} cx={150 + i * 36} cy={268} r="14" fill={["#93c5fd", "#fda4af", "#86efac", "#fcd34d", "#60a5fa"][i]} />
      ))}
      <rect x="300" y="252" width="108" height="28" rx="14" fill="#1A9EB0" />
      <text x="318" y="270" fontSize="10" fontWeight="600" fill="#fff">
        Approve shortlist
      </text>
    </svg>
  );
}
