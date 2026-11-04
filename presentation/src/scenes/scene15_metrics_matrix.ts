import { gsap } from "gsap";
import { SceneInstance } from "./types";
import { OPERATING_POINTS } from "../data/metrics";

export function createScene15(): SceneInstance {
  const el = document.createElement("section");
  el.className = "scene-stage scene-dark";
  el.id = "scene-confusion-metrics";

  let activeTimeline: gsap.core.Timeline | null = null;
  const def = OPERATING_POINTS.default;

  el.innerHTML = `
    <header class="scene-header">
      <span class="scene-index">15</span>
      <span class="scene-category">15 · PERFORMANCE EVALUATION · CONFUSION MATRIX</span>
    </header>

    <div class="scene-content" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <span class="meta-label" style="color: var(--c-brass);">2,760 Held-out Test Samples</span>
        <h2 style="margin-top: 6px;">Confusion Matrix & Empirical Trade-offs</h2>
        <p class="lead subtle-text" style="max-width: 900px; margin-top: 8px; font-size: 21px;">
          Security models cannot be evaluated on accuracy alone. Every classification error carries asymmetric real-world consequences.
        </p>
      </div>

      <!-- Confusion Matrix & Analogy Layout -->
      <div style="flex: 1; display: grid; grid-template-columns: 1.2fr 1fr; gap: 36px; align-items: center; padding: 20px 0;">
        <!-- 2x2 Empirical Confusion Matrix -->
        <div style="background: var(--c-ink-soft); border: 1px solid var(--c-graphite-border); padding: 24px; border-radius: 4px;">
          <div class="font-mono" style="font-size: 11px; color: var(--c-stone); margin-bottom: 16px; text-transform: uppercase;">
            EMPIRICAL 2×2 CONTINGENCY TABLE (τ = 0.50)
          </div>

          <div style="display: grid; grid-template-columns: 140px 1fr 1fr; gap: 12px; align-items: center;">
            <div></div>
            <div class="font-mono" style="font-size: 12px; color: var(--c-stone); text-align: center;">PREDICTED PHISH</div>
            <div class="font-mono" style="font-size: 12px; color: var(--c-stone); text-align: center;">PREDICTED LEGIT</div>

            <!-- Actual Phishing Row -->
            <div class="font-mono" style="font-size: 12px; color: var(--c-stone);">ACTUAL PHISH<br/><span style="font-size: 10px; opacity: 0.7;">(1,261 total)</span></div>
            
            <!-- TP -->
            <div id="cell-tp" style="background: rgba(85, 112, 90, 0.15); border: 1px solid var(--c-moss); padding: 18px; text-align: center; border-radius: 3px;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-moss); display: block;">TRUE POSITIVE (TP)</span>
              <div class="font-mono tabular-nums" style="font-family: var(--font-display); font-size: 38px; color: var(--c-moss); font-weight: 700; margin-top: 2px;">
                ${def.tp}
              </div>
              <div style="font-size: 11px; color: var(--c-stone); margin-top: 2px;">Attacks Blocked (93.8%)</div>
            </div>

            <!-- FN -->
            <div id="cell-fn" style="background: rgba(140, 63, 50, 0.15); border: 1px solid var(--c-oxide); padding: 18px; text-align: center; border-radius: 3px;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-oxide); display: block;">FALSE NEGATIVE (FN)</span>
              <div class="font-mono tabular-nums" style="font-family: var(--font-display); font-size: 38px; color: var(--c-oxide); font-weight: 700; margin-top: 2px;">
                ${def.fn}
              </div>
              <div style="font-size: 11px; color: var(--c-stone); margin-top: 2px;">Threats Missed (6.2%)</div>
            </div>

            <!-- Actual Legit Row -->
            <div class="font-mono" style="font-size: 12px; color: var(--c-stone);">ACTUAL LEGIT<br/><span style="font-size: 10px; opacity: 0.7;">(1,499 total)</span></div>
            
            <!-- FP -->
            <div id="cell-fp" style="background: rgba(168, 139, 80, 0.15); border: 1px solid var(--c-brass); padding: 18px; text-align: center; border-radius: 3px;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-brass); display: block;">FALSE POSITIVE (FP)</span>
              <div class="font-mono tabular-nums" style="font-family: var(--font-display); font-size: 38px; color: var(--c-brass); font-weight: 700; margin-top: 2px;">
                ${def.fp}
              </div>
              <div style="font-size: 11px; color: var(--c-stone); margin-top: 2px;">False Alarms (1.67%)</div>
            </div>

            <!-- TN -->
            <div id="cell-tn" style="background: var(--c-graphite); border: 1px solid var(--c-graphite-border); padding: 18px; text-align: center; border-radius: 3px;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-stone); display: block;">TRUE NEGATIVE (TN)</span>
              <div class="font-mono tabular-nums" style="font-family: var(--font-display); font-size: 38px; color: var(--c-bone); font-weight: 700; margin-top: 2px;">
                ${def.tn}
              </div>
              <div style="font-size: 11px; color: var(--c-stone); margin-top: 2px;">Clean Cleared (98.3%)</div>
            </div>
          </div>
        </div>

        <!-- Right: Corporate Mailroom Analogy & Asymmetry -->
        <div style="background: var(--c-ink-soft); border: 1px solid var(--c-graphite-border); padding: 28px; display: flex; flex-direction: column; justify-content: space-between; border-radius: 4px;">
          <div>
            <span class="font-mono" style="font-size: 12px; color: var(--c-brass); letter-spacing: 0.08em; text-transform: uppercase;">
              Operational Analogy
            </span>
            <h3 style="font-family: var(--font-display); font-size: 24px; color: var(--c-bone); margin: 6px 0 10px 0;">
              The Enterprise Mailroom
            </h3>
            <p class="subtle-text" style="font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
              Imagine an enterprise sorting 1,500 legitimate employee parcels. Our model causes only <strong>25 packages</strong> to be set aside for secondary inspection, while intercepting <strong>1,183 out of 1,261 contraband attacks</strong>.
            </p>
            <div style="background: var(--c-graphite); border-left: 3px solid var(--c-brass); padding: 12px 14px; border-radius: 2px;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-brass); font-weight: 600;">ASYMMETRIC RISK PROFILE</span>
              <p class="subtle-text" style="font-size: 12px; margin: 4px 0 0 0;">
                A false positive causes minor employee friction; a false negative results in compromised credentials and ransomware infection.
              </p>
            </div>
          </div>

          <!-- Quick Metrics Strip -->
          <div style="margin-top: 20px; border-top: 1px solid var(--c-graphite-border); padding-top: 14px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
            <div>
              <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">TEST PRECISION</span>
              <div class="font-mono tabular-nums" style="font-size: 20px; font-weight: 700; color: var(--c-bone);">97.93%</div>
            </div>
            <div>
              <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">TEST RECALL</span>
              <div class="font-mono tabular-nums" style="font-size: 20px; font-weight: 700; color: var(--c-bone);">93.81%</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div style="border-top: 1px solid var(--c-graphite-border); padding-top: 14px; display: flex; justify-content: space-between; align-items: baseline;">
        <div style="font-size: 15px; color: var(--c-stone);">
          <strong style="color: var(--c-bone);">SUMMARY:</strong>
          Overall Test Accuracy: 96.27% · F1 Score: 0.9583 · ROC-AUC: 0.9949 across 2,760 independent evaluations.
        </div>
        <div class="font-mono" style="font-size: 13px; color: var(--c-stone);">
          SPACE / ARROW → STEP 3 OF 3
        </div>
      </div>
    </div>
  `;

  return {
    index: 15,
    id: "scene-confusion-metrics",
    element: el,

    enter(step: number) {
      activeTimeline = gsap.timeline();
      activeTimeline.from(el.querySelectorAll("#cell-tp, #cell-fn, #cell-fp, #cell-tn"), {
        opacity: 0,
        scale: 0.9,
        stagger: 0.1,
        duration: 0.4,
        ease: "power2.out",
      });
      this.stepTo?.(step);
    },

    stepTo(step: number) {
      const tp = el.querySelector<HTMLElement>("#cell-tp");
      const tn = el.querySelector<HTMLElement>("#cell-tn");
      const fp = el.querySelector<HTMLElement>("#cell-fp");
      const fn = el.querySelector<HTMLElement>("#cell-fn");
      if (!tp || !tn || !fp || !fn) return;

      if (step === 0) {
        gsap.to([tp, tn], { scale: 1.0, duration: 0.3 });
      } else if (step === 1) {
        gsap.to(fp, { scale: 1.05, duration: 0.3, yoyo: true, repeat: 1 });
      } else if (step === 2) {
        gsap.to(fn, { scale: 1.05, duration: 0.3, yoyo: true, repeat: 1 });
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
