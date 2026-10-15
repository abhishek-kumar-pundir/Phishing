import { motion } from "framer-motion";
import { UnifiedScanResult } from "../../lib/scanResult";
import { useRevealDelay } from "../../hooks/useRevealDelay";
import { VerdictHero } from "./VerdictHero";
import { ModalityGrid } from "./ModalityGrid";
import { AgreementBars } from "./AgreementBars";
import { EvidenceTabs } from "./EvidenceTabs";
import { FusionScene3DLazy } from "./fusion3d/FusionScene3DLazy";

interface Props {
  result: UnifiedScanResult;
  /** Skip the built-in 3D scene -- used when a live ScanTheater above this
   * view is already showing it, so we don't render two Canvases. */
  hideFusionScene?: boolean;
  /** ms to wait before revealing, letting a just-finished 3D burst play out first. */
  revealDelayMs?: number;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
};

export function ScanResultView({ result, hideFusionScene = false, revealDelayMs = 0 }: Props) {
  const show = useRevealDelay(true, revealDelayMs);

  return (
    <div className="min-w-0 space-y-6">
      {!hideFusionScene && (
        <div className="surface min-w-0 px-4 py-6 sm:px-6">
          <FusionScene3DLazy result={result} running={false} />
        </div>
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate={show ? "show" : "hidden"}
        className="min-w-0 space-y-6"
      >
        <motion.div variants={item}>
          <VerdictHero result={result} />
        </motion.div>

        <motion.div variants={item}>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.07em] text-mist-500">Model analysis</p>
          <ModalityGrid result={result} />
        </motion.div>

        <motion.div variants={item}>
          <AgreementBars result={result} />
        </motion.div>

        <motion.div variants={item}>
          <EvidenceTabs result={result} />
        </motion.div>
      </motion.div>
    </div>
  );
}
