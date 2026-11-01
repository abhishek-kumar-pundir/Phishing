import { useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { Modality } from "../../../api/phish360";
import { pct, riskTone } from "../../../lib/format";
import { TONE_HEX, TONE_HEX_SOFT } from "../../../lib/tone";

interface Props {
  modality: Modality;
  position: [number, number, number];
  label: string;
  score: number | null | undefined;
  skipReason?: string;
  state: "idle" | "running" | "done";
  weight: number;
  totalWeight: number;
  isSelected: boolean;
  onClick: () => void;
  reducedMotion: boolean;
}

export function ModalityNode({
  modality,
  position,
  label,
  score,
  skipReason,
  state,
  weight,
  totalWeight,
  isSelected,
  onClick,
  reducedMotion,
}: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseMeshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Track pulse completion when transitioning to "done"
  const prevStateRef = useRef(state);
  const pulseStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (state === "done" && prevStateRef.current !== "done") {
      pulseStartTimeRef.current = performance.now();
    }
    prevStateRef.current = state;
  }, [state]);

  const tone = riskTone(score);
  const nodeColor = state === "done" ? TONE_HEX[tone] : state === "running" ? "#38C0E4" : "#20242D";
  const emissiveColor = state === "done" ? TONE_HEX_SOFT[tone] : state === "running" ? "#0E3A4B" : "#121419";

  // Quadratic curve connecting node to the central core (0, 0, 0)
  const curve = useMemo(() => {
    const start = new THREE.Vector3(...position);
    const end = new THREE.Vector3(0, 0, 0);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    mid.y += 0.45; // subtle arch toward the core
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [position]);

  // Real 3D tube geometry for edge thickness based on fusion logreg weight
  const normalizedWeight = totalWeight > 0 ? weight / totalWeight : 0.25;
  const tubeRadius = Math.max(0.015, normalizedWeight * 0.08);

  const tubeGeometry = useMemo(() => {
    return new THREE.TubeGeometry(curve, 32, tubeRadius, 8, false);
  }, [curve, tubeRadius]);

  useFrame((stateCtx, delta) => {
    const t = stateCtx.clock.getElapsedTime();

    // Node animation
    if (meshRef.current) {
      if (state === "running" && !reducedMotion) {
        // Subtle running pulse
        const s = 1.0 + Math.sin(t * 4) * 0.06;
        meshRef.current.scale.setScalar(s);
      } else {
        meshRef.current.scale.setScalar(isSelected ? 1.12 : 1.0);
      }
    }

    // Traveling pulse toward the core upon completion
    if (pulseMeshRef.current && pulseStartTimeRef.current != null) {
      const elapsed = (performance.now() - pulseStartTimeRef.current) / 1000;
      const pulseDuration = 0.75;
      if (elapsed < pulseDuration) {
        const progress = elapsed / pulseDuration;
        const pt = curve.getPoint(progress);
        pulseMeshRef.current.position.copy(pt);
        pulseMeshRef.current.visible = true;
      } else {
        pulseMeshRef.current.visible = false;
        pulseStartTimeRef.current = null;
      }
    } else if (pulseMeshRef.current) {
      pulseMeshRef.current.visible = false;
    }
  });

  const weightPercent = (normalizedWeight * 100).toFixed(1);
  const contribution = score != null ? (weight * score).toFixed(2) : "0.00";

  return (
    <group>
      {/* Real Edge Tube */}
      <mesh
        geometry={tubeGeometry}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={state === "done" ? nodeColor : hovered ? "#38C0E4" : "#20242D"}
          roughness={0.4}
          metalness={0.3}
          transparent
          opacity={state === "done" ? 0.75 : 0.35}
        />
      </mesh>

      {/* Edge Completion Pulse Particle */}
      <mesh ref={pulseMeshRef} visible={false}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshBasicMaterial color={nodeColor} />
      </mesh>

      {/* Modality Node Mesh */}
      <mesh
        ref={meshRef}
        position={position}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshStandardMaterial
          color={nodeColor}
          emissive={emissiveColor}
          emissiveIntensity={state === "done" ? 0.5 : state === "running" ? 0.4 : 0.15}
          roughness={0.25}
          metalness={0.3}
        />
      </mesh>

      {/* Radial Probability Ring (when scored) */}
      {state === "done" && score != null && (
        <group position={position} rotation={[Math.PI / 2, 0, 0]}>
          <mesh>
            <ringGeometry args={[0.44, 0.48, 32, 1, 0, score * Math.PI * 2]} />
            <meshBasicMaterial color={nodeColor} side={THREE.DoubleSide} />
          </mesh>
          <mesh>
            <ringGeometry args={[0.44, 0.48, 32, 1]} />
            <meshBasicMaterial color="#20242D" side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* Node HTML Label & Score */}
      <Html
        position={[position[0], position[1] - 0.65, position[2]]}
        center
        distanceFactor={8}
        zIndexRange={[10, 0]}
      >
        <button
          type="button"
          onClick={onClick}
          className={`flex flex-col items-center select-none font-mono transition-transform ${
            isSelected ? "scale-110" : ""
          }`}
        >
          <span className="text-[11px] font-semibold tracking-wider text-mist-200 uppercase">
            {label}
          </span>
          <span
            className="text-[11px] font-bold tabular px-1.5 py-0.5 rounded border border-surface-border bg-surface-card/90 mt-0.5"
            style={{ color: nodeColor }}
          >
            {score != null ? pct(score, 0) : state === "running" ? "RUN" : skipReason ? "SKIP" : "—"}
          </span>
        </button>
      </Html>

      {/* Hover Tooltip: Weight x Probability */}
      {hovered && (
        <Html
          position={[position[0], position[1] + 0.65, position[2]]}
          center
          distanceFactor={7}
          zIndexRange={[50, 10]}
        >
          <div className="pointer-events-none border border-surface-border bg-surface-canvas/95 px-3 py-2 rounded shadow-lg font-mono text-[10px] space-y-0.5 text-mist-200 whitespace-nowrap">
            <div className="text-brand font-semibold uppercase">{label} Modality</div>
            <div className="text-mist-400">
              Weight: <span className="text-mist-100">{weight.toFixed(2)} ({weightPercent}%)</span>
            </div>
            <div className="text-mist-400">
              Score: <span className="text-mist-100">{score != null ? pct(score, 1) : "unavailable"}</span>
            </div>
            <div className="text-mist-400 border-t border-surface-border pt-1 mt-1">
              Weight × Score: <span className="text-brand font-semibold">+{contribution}</span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
