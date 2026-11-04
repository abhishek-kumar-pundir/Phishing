import { gsap } from "gsap";
import { SceneInstance } from "./types";
import { OPERATING_POINTS } from "../data/metrics";

export function createScene17(): SceneInstance {
  const el = document.createElement("section");
  el.className = "scene-stage scene-dark";
  el.id = "scene-threshold-tuning";

  let activeTimeline: gsap.core.Timeline | null = null;

  el.innerHTML = `
    <header class="scene-header">
      <span class="scene-index">17</span>
      <span class="scene-category">17 · DEPLOYMENT STRATEGY · CALIBRATED OPERATING POINTS</span>
    </header>

    <div class="scene-content" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <span class="meta-label" style="color: var(--c-brass);">Three Calibrated Operating Points</span>
        <h2 style="margin-top: 6px;">Calibrated Operating Points</h2>
        <p class="lead subtle-text" style="max-width: 900px; margin-top: 8px; font-size: 21px;">
          A single static 0.50 threshold fails to address operational trade-offs. We define three calibrated operating points with human-in-the-loop review bands.
        </p>
      </div>

      <!-- Interactive Threshold Cockpit -->
      <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 36px; align-items: center; padding: 20px 0;">
        <!-- Left: Interactive Threshold Selector & Slider -->
        <div style="background: var(--c-ink-soft); border: 1px solid var(--c-graphite-border); padding: 24px; border-radius: 4px;">
          <div class="font-mono" style="font-size: 11px; color: var(--c-stone); margin-bottom: 14px; text-transform: uppercase;">
            SELECT TARGET DEPLOYMENT POLICY
          </div>

          <!-- 3 Policy Radio Buttons -->
          <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
            <label id="opt-high-recall" class="thresh-opt" style="background: var(--c-graphite); border: 1px solid var(--c-graphite-border); padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; border-radius: 3px;">
              <div>
                <div style="font-size: 14px; font-weight: 600; color: var(--c-bone);">High Recall (Perimeter Gate)</div>
                <div class="font-mono" style="font-size: 11px; color: var(--c-stone);">Catch every potential credential harvest</div>
              </div>
              <span class="font-mono tabular-nums" style="font-size: 13px; font-weight: 700; color: var(--c-oxide);">τ = 0.20</span>
            </label>

            <label id="opt-balanced" class="thresh-opt selected" style="background: var(--c-graphite); border: 1px solid var(--c-brass); padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; border-radius: 3px;">
              <div>
                <div style="font-size: 14px; font-weight: 600; color: var(--c-bone);">Balanced (Production Standard)</div>
                <div class="font-mono" style="font-size: 11px; color: var(--c-stone);">Maximal empirical F1 score (0.9613)</div>
              </div>
              <span class="font-mono tabular-nums" style="font-size: 13px; font-weight: 700; color: var(--c-brass);">τ = 0.45</span>
            </label>

            <label id="opt-high-precision" class="thresh-opt" style="background: var(--c-graphite); border: 1px solid var(--c-graphite-border); padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; border-radius: 3px;">
              <div>
                <div style="font-size: 14px; font-weight: 600; color: var(--c-bone);">High Precision (Edge Auto-Block)</div>
                <div class="font-mono" style="font-size: 11px; color: var(--c-stone);">Zero false alarms across 1,499 clean sites</div>
              </div>
              <span class="font-mono tabular-nums" style="font-size: 13px; font-weight: 700; color: var(--c-moss);">τ = 0.90</span>
            </label>
          </div>

          <!-- Visual Slider Bar -->
          <div class="font-mono" style="font-size: 12px; color: var(--c-stone); margin-bottom: 6px;">
            DECISION THRESHOLD: <span id="thresh-display" style="color: var(--c-brass); font-weight: 700;">0.45</span>
          </div>
          <input id="thresh-slider" type="range" min="0.10" max="0.95" step="0.05" value="0.45" style="width: 100%; accent-color: var(--c-brass); cursor: pointer;" />
          <div style="display: flex; justify-content: space-between; margin-top: 4px;">
            <span class="font-mono" style="font-size: 10px; color: var(--c-stone);">0.10 (Aggressive Block)</span>
            <span class="font-mono" style="font-size: 10px; color: var(--c-stone);">0.95 (Ultra Conservative)</span>
          </div>
        </div>

        <!-- Right: Dynamic Empirical Metrics Card -->
        <div style="background: var(--c-ink-soft); border: 1px solid var(--c-graphite-border); padding: 28px; display: flex; flex-direction: column; justify-content: space-between; border-radius: 4px;">
          <div>
            <span class="font-mono" style="font-size: 11px; color: var(--c-stone); text-transform: uppercase;">
              EMPIRICAL TRADE-OFF VERIFICATION
            </span>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-top: 14px;">
              <div style="background: var(--c-graphite); padding: 12px; border-radius: 3px;">
                <span class="font-mono" style="font-size: 10px; color: var(--c-stone);">RECALL (ATTACKS CAUGHT)</span>
                <div id="stat-recall" class="font-mono tabular-nums" style="font-size: 26px; font-weight: 700; color: var(--c-moss); margin-top: 2px;">
                  94.61%
                </div>
                <div id="stat-tp" class="font-mono" style="font-size: 11px; color: var(--c-stone); margin-top: 2px;">
                  1,193 / 1,261
                </div>
              </div>

              <div style="background: var(--c-graphite); padding: 12px; border-radius: 3px;">
                <span class="font-mono" style="font-size: 10px; color: var(--c-stone);">FALSE POSITIVE RATE (FPR)</span>
                <div id="stat-fpr" class="font-mono tabular-nums" style="font-size: 26px; font-weight: 700; color: var(--c-bone); margin-top: 2px;">
                  1.87%
                </div>
                <div id="stat-fp" class="font-mono" style="font-size: 11px; color: var(--c-stone); margin-top: 2px;">
                  28 false alarms
                </div>
              </div>
            </div>

            <!-- Review Band Box -->
            <div id="review-band-box" style="margin-top: 16px; background: rgba(168, 139, 80, 0.08); border: 1px dashed var(--c-brass); padding: 14px; border-radius: 3px;">
              <div class="font-mono" style="font-size: 11px; color: var(--c-brass); font-weight: 600;">
                HUMAN-IN-THE-LOOP REVIEW BAND: <span id="stat-band">[0.35 – 0.55]</span>
              </div>
              <p style="font-size: 12px; color: var(--c-stone); margin: 4px 0 0 0; line-height: 1.4;">
                Samples with posterior risk between 0.35 and 0.55 are queued for human analyst inspection rather than automated disruption.
              </p>
            </div>
          </div>

          <!-- Zero-FP Proof Callout -->
          <div id="zero-fp-alert" style="margin-top: 16px; border-top: 1px solid var(--c-graphite-border); padding-top: 12px; opacity: 0.4;">
            <span class="font-mono" style="font-size: 11px; color: var(--c-moss); font-weight: 600;">
              ZERO-FP GUARANTEE AT τ = 0.90:
            </span>
            <span style="font-size: 12px; color: var(--c-stone); margin-left: 6px;">
              1,499 clean enterprise domains cleared with exactly 0 false positives.
            </span>
          </div>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div style="border-top: 1px solid var(--c-graphite-border); padding-top: 14px; display: flex; justify-content: space-between; align-items: baseline;">
        <div style="font-size: 15px; color: var(--c-stone);">
          <strong style="color: var(--c-bone);">ENGINEERING PRINCIPLE:</strong>
          Security thresholds are economic balance points between the cost of analyst fatigue and the liability of data breaches.
        </div>
        <div class="font-mono" style="font-size: 13px; color: var(--c-stone);">
          SPACE / ARROW → STEP 2 OF 3
        </div>
      </div>
    </div>
  `;

  // Helper wiring
  const slider = el.querySelector<HTMLInputElement>("#thresh-slider");
  const display = el.querySelector<HTMLElement>("#thresh-display");
  const statRecall = el.querySelector<HTMLElement>("#stat-recall");
  const statTp = el.querySelector<HTMLElement>("#stat-tp");
  const statFpr = el.querySelector<HTMLElement>("#stat-fpr");
  const statFp = el.querySelector<HTMLElement>("#stat-fp");
  const statBand = el.querySelector<HTMLElement>("#stat-band");
  const zeroFp = el.querySelector<HTMLElement>("#zero-fp-alert");

  function applyPoint(ptKey: "highRecall" | "balanced" | "highPrecision") {
    const pt = OPERATING_POINTS[ptKey];
    if (!pt) return;
    if (slider) slider.value = String(pt.threshold);
    if (display) display.textContent = pt.threshold.toFixed(2);
    if (statRecall) statRecall.textContent = `${(pt.testRecall * 100).toFixed(2)}%`;
    if (statTp) statTp.textContent = `${pt.tp} / 1,261`;
    if (statFpr) statFpr.textContent = `${(pt.testFpr * 100).toFixed(2)}%`;
    if (statFp) statFp.textContent = `${pt.fp} false alarms`;
    if (statBand && pt.reviewBand) statBand.textContent = `[${pt.reviewBand[0]} – ${pt.reviewBand[1]}]`;
    if (zeroFp) zeroFp.style.opacity = ptKey === "highPrecision" ? "1" : "0.3";

    el.querySelectorAll(".thresh-opt").forEach((item) => {
      (item as HTMLElement).style.borderColor = "var(--c-graphite-border)";
    });
    const activeLabel =
      ptKey === "highRecall"
        ? el.querySelector("#opt-high-recall")
        : ptKey === "balanced"
        ? el.querySelector("#opt-balanced")
        : el.querySelector("#opt-high-precision");
    if (activeLabel) (activeLabel as HTMLElement).style.borderColor = "var(--c-brass)";
  }

  el.querySelector("#opt-high-recall")?.addEventListener("click", () => applyPoint("highRecall"));
  el.querySelector("#opt-balanced")?.addEventListener("click", () => applyPoint("balanced"));
  el.querySelector("#opt-high-precision")?.addEventListener("click", () => applyPoint("highPrecision"));

  slider?.addEventListener("input", (e) => {
    const val = parseFloat((e.target as HTMLInputElement).value);
    if (display) display.textContent = val.toFixed(2);
    if (val < 0.3) applyPoint("highRecall");
    else if (val < 0.7) applyPoint("balanced");
    else applyPoint("highPrecision");
  });

  return {
    index: 17,
    id: "scene-threshold-tuning",
    element: el,

    enter(step: number) {
      activeTimeline = gsap.timeline();
      activeTimeline.from(el.querySelector(".scene-content"), {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
      });
      this.stepTo?.(step);
    },

    stepTo(step: number) {
      if (step === 0) {
        el.querySelector<HTMLElement>("#opt-balanced")?.click();
      } else if (step === 1) {
        el.querySelector<HTMLElement>("#opt-high-recall")?.click();
      } else if (step === 2) {
        el.querySelector<HTMLElement>("#opt-high-precision")?.click();
      }
    },

    leave() {
      if (activeTimeline) {
        activeTimeline.kill();
        activeTimeline = null;
      }
    },
  };
}
