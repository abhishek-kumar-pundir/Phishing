import { Modality } from "../../api/phish360";
import { UnifiedScanResult } from "../../lib/scanResult";
import { pct, riskTone } from "../../lib/format";
import { TONE_HEX } from "../../lib/tone";

interface Props {
  result: UnifiedScanResult;
  animate?: boolean;
  selectedModality?: Modality;
  onSelectModality?: (m: Modality) => void;
}

const MODALITY_NODES: {
  key: Modality;
  label: string;
  x: number;
  y: number;
  weight: number;
}[] = [
  { key: "url", label: "URL", x: 70, y: 70, weight: 3.5985 },
  { key: "html", label: "DOM", x: 70, y: 210, weight: 2.6307 },
  { key: "text", label: "TEXT", x: 410, y: 210, weight: 4.9169 },
  { key: "vision", label: "VISION", x: 410, y: 70, weight: 1.2024 },
];

const TOTAL_WEIGHT = 3.5985 + 2.6307 + 4.9169 + 1.2024; // 12.3485
const CORE_X = 240;
const CORE_Y = 140;

export function FusionDiagram({
  result,
  selectedModality = "url",
  onSelectModality,
}: Props) {
  const fusionTone = riskTone(result.fusion.probability);
  const revealed = result.fusion.probability != null && result.fusion.label != null;
  const coreColor = revealed ? TONE_HEX[fusionTone] : "#20242D";

  return (
    <div className="relative border border-surface-border bg-surface-canvas rounded-lg p-4 font-sans select-none min-w-0">
      <div className="flex items-center justify-between mb-3 text-[11px] font-mono text-mist-500">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand" />
          <span>2D PIPELINE TOPOLOGY (FALLBACK)</span>
        </div>
        <span>EDGE THICKNESS = LOGREG WEIGHT</span>
      </div>

      <svg
        viewBox="0 0 480 280"
        className="w-full h-auto max-h-[420px]"
        role="img"
        aria-label="Fusion Pipeline Diagram"
      >
        {/* Converging Weighted Edges (monolithic neutral with accent on selected) */}
        {MODALITY_NODES.map((node) => {
          const score = result.scores[node.key];
          const isSelected = selectedModality === node.key;
          const edgeColor = isSelected ? "#38C0E4" : score != null ? "#2E3544" : "#1A1E27";
          const normalizedWeight = node.weight / TOTAL_WEIGHT;
          const strokeWidth = 1.5 + normalizedWeight * 6; // 1.5px to 4px

          // Smooth Bezier path from node center to central core
          const path = `M ${node.x} ${node.y} Q ${(node.x + CORE_X) / 2} ${CORE_Y} ${CORE_X} ${CORE_Y}`;

          return (
            <g key={`edge-${node.key}`}>
              <path
                d={path}
                fill="none"
                stroke={edgeColor}
                strokeWidth={strokeWidth}
                strokeOpacity={score != null ? 0.75 : 0.3}
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* Central Fusion Core (resolves to verdict only upon fusion) */}
        <g transform={`translate(${CORE_X}, ${CORE_Y})`}>
          {/* Core Outer Ring */}
          <circle
            r={34}
            fill="#121419"
            stroke={coreColor}
            strokeWidth={revealed ? 2 : 1}
            strokeOpacity={revealed ? 0.9 : 0.4}
          />
          {revealed && (
            <circle
              r={38}
              fill="none"
              stroke={coreColor}
              strokeWidth={1}
              strokeOpacity={0.3}
              strokeDasharray="4 4"
            />
          )}

          {/* Core Labels */}
          <text
            y={revealed ? -6 : -2}
            textAnchor="middle"
            fill="#8E99AE"
            fontSize="9"
            fontFamily="Geist Mono, monospace"
            fontWeight="600"
            letterSpacing="0.08em"
          >
            FUSION
          </text>
          <text
            y={revealed ? 14 : 12}
            textAnchor="middle"
            fill={revealed ? coreColor : "#64748B"}
            fontSize={revealed ? "13" : "11"}
            fontFamily="Geist Mono, monospace"
            fontWeight="bold"
          >
            {revealed ? pct(result.fusion.probability, 0) : "STANDBY"}
          </text>
        </g>

        {/* 4 Modality Nodes */}
        {MODALITY_NODES.map((node) => {
          const score = result.scores[node.key];
          const skipReason = result.skipReasons[node.key];
          const isSelected = selectedModality === node.key;

          return (
            <g
              key={node.key}
              transform={`translate(${node.x}, ${node.y})`}
              onClick={() => onSelectModality?.(node.key)}
              className="cursor-pointer"
            >
              {/* Node Background Disc */}
              <circle
                r={26}
                fill="#121419"
                stroke={isSelected ? "#38C0E4" : "#242A36"}
                strokeWidth={isSelected ? 2 : 1.5}
              />

              {/* Radial Probability Arc (singular accent #38C0E4) */}
              {score != null && (
                <circle
                  r={29}
                  fill="none"
                  stroke="#38C0E4"
                  strokeWidth={2}
                  strokeDasharray={`${score * 182} 182`}
                  strokeLinecap="round"
                  transform="rotate(-90)"
                />
              )}

              {/* Node Title & Score Text */}
              <text
                y={-4}
                textAnchor="middle"
                fill="#CBD5E1"
                fontSize="9"
                fontFamily="Geist Mono, monospace"
                fontWeight="600"
                letterSpacing="0.06em"
              >
                {node.label}
              </text>
              <text
                y={12}
                textAnchor="middle"
                fill={score != null ? "#E2E8F0" : "#64748B"}
                fontSize="11"
                fontFamily="Geist Mono, monospace"
                fontWeight="bold"
              >
                {score != null ? pct(score, 0) : skipReason ? "SKIP" : "—"}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
