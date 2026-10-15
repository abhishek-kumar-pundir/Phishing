import { Modality } from "../../api/phish360";
import { UnifiedScanResult } from "../../lib/scanResult";
import { pct, riskTone } from "../../lib/format";

const NODE_COLOR: Record<string, string> = {
  safe: "#2BB673",
  warn: "#E0B84B",
  danger: "#E2661C",
  idle: "#3A4459",
};

const SOURCES: { key: Modality; label: string; y: number }[] = [
  { key: "url", label: "URL", y: 36 },
  { key: "html", label: "DOM", y: 92 },
  { key: "text", label: "TEXT", y: 148 },
  { key: "vision", label: "VISION", y: 204 },
];

export function FusionDiagram({ result, animate = false }: { result: UnifiedScanResult; animate?: boolean }) {
  const fusionTone = riskTone(result.fusion.probability);
  const fusionColor = NODE_COLOR[fusionTone];

  return (
    <div className="surface min-w-0 px-5 py-5">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.07em] text-mist-500">Multimodal fusion</p>
      <svg viewBox="0 0 560 240" className="h-auto w-full" role="img" aria-label="Fusion architecture diagram">
        {SOURCES.map((s, i) => {
          const score = result.scores[s.key];
          const color = NODE_COLOR[riskTone(score)];
          const path = `M96,${s.y} C220,${s.y} 220,120 320,120`;
          return (
            <g key={s.key}>
              <path
                d={path}
                fill="none"
                stroke={score != null ? color : "#2A3348"}
                strokeWidth={score != null ? 1.75 : 1}
                strokeOpacity={score != null ? 0.55 : 0.35}
                strokeDasharray={animate ? "500" : undefined}
                strokeDashoffset={animate ? "500" : undefined}
                style={animate ? { animation: `dash 0.9s ease-out ${i * 0.12}s forwards` } : undefined}
              />
              <rect x="8" y={s.y - 18} width="88" height="36" rx="9" fill="#0D1322" stroke={score != null ? color : "#2A3348"} strokeOpacity="0.5" />
              <text x="52" y={s.y - 3} textAnchor="middle" fontSize="10" fill="#A9B3C7" fontFamily="Space Grotesk, sans-serif">
                {s.label}
              </text>
              <text x="52" y={s.y + 11} textAnchor="middle" fontSize="11" fontWeight={600} fill={score != null ? color : "#6B7690"}>
                {score != null ? pct(score, 0) : "—"}
              </text>
            </g>
          );
        })}

        <circle cx="320" cy="120" r="34" fill="#0D1322" stroke={fusionColor} strokeOpacity="0.6" strokeWidth="1.75" />
        <text x="320" y="115" textAnchor="middle" fontSize="9" fill="#A9B3C7" fontFamily="Space Grotesk, sans-serif">
          FUSION
        </text>
        <text x="320" y="130" textAnchor="middle" fontSize="13" fontWeight={700} fill={fusionColor}>
          {pct(result.fusion.probability, 0)}
        </text>

        <path
          d="M354,120 L470,120"
          fill="none"
          stroke={fusionColor}
          strokeOpacity="0.55"
          strokeWidth="1.75"
          strokeDasharray={animate ? "200" : undefined}
          strokeDashoffset={animate ? "200" : undefined}
          style={animate ? { animation: "dash 0.6s ease-out 0.55s forwards" } : undefined}
        />
        <polygon points="470,115 480,120 470,125" fill={fusionColor} fillOpacity="0.7" />

        <rect x="486" y="98" width="66" height="44" rx="10" fill="#0D1322" stroke={fusionColor} strokeOpacity="0.6" strokeWidth="1.5" />
        <text x="519" y="116" textAnchor="middle" fontSize="9" fill="#A9B3C7" fontFamily="Space Grotesk, sans-serif">
          VERDICT
        </text>
        <text x="519" y="132" textAnchor="middle" fontSize="12" fontWeight={700} fill={fusionColor}>
          {result.fusion.label === "phishing" ? "RISK" : result.fusion.label === "legitimate" ? "SAFE" : "—"}
        </text>
      </svg>
      <p className="mt-1 text-[11px] text-mist-500">
        Strategy: {result.fusion.strategy ?? "—"} · threshold {pct(result.fusion.threshold, 0)}
      </p>
    </div>
  );
}
