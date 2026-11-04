import { gsap } from "gsap";
import { SceneInstance } from "./types";
import { MODALITY_METRICS, FUSION_MODEL } from "../data/metrics";

export function createScene07(): SceneInstance {
  const el = document.createElement("section");
  el.className = "scene-stage scene-dark";
  el.id = "scene-why-one-signal-fails";

  let activeTimeline: gsap.core.Timeline | null = null;

  el.innerHTML = `
    <header class="scene-header">
      <span class="scene-index">07</span>
      <span class="scene-category">07 · EMPIRICAL JUSTIFICATION · THE CEILING OF ISOLATED SIGNALS</span>
    </header>

    <div class="scene-content" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <span class="meta-label" style="color: var(--c-brass);">2,760 Held-out Test Samples</span>
        <h2 style="margin-top: 6px;">The Ceiling of Isolated Signals</h2>
        <p class="lead subtle-text" style="max-width: 900px; margin-top: 8px; font-size: 21px;">
          No single observation channel achieves sufficient precision and recall for automated blocking. Real test metrics prove each isolated channel's vulnerability.
        </p>
      </div>

      <!-- Comparative Performance Chart -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 20px; padding: 16px 0;">
        <!-- URL Row -->
        <div class="metric-row" style="display: grid; grid-template-columns: 240px 1fr 140px; align-items: center; gap: 24px;">
          <div>
            <div style="font-size: 18px; font-weight: 600; color: var(--c-bone);">URL Lexical</div>
            <div class="font-mono" style="font-size: 12px; color: var(--c-stone);">Random Forest · 16 features</div>
          </div>
          <div style="background: var(--c-graphite); height: 36px; border-left: 2px solid var(--c-stone); position: relative; overflow: hidden; border-radius: 2px;">
            <div id="bar-url" style="background: var(--c-slate); height: 100%; width: 0%; display: flex; align-items: center; justify-content: flex-end; padding-right: 12px;">
              <span class="font-mono tabular-nums" style="font-size: 13px; font-weight: 600; color: #FFF;">80.76%</span>
            </div>
          </div>
          <div class="font-mono tabular-nums" style="font-size: 14px; color: var(--c-stone); text-align: right;">
            AUC: <span style="color: var(--c-bone);">0.9053</span>
          </div>
        </div>

        <!-- Vision Row -->
        <div class="metric-row" style="display: grid; grid-template-columns: 240px 1fr 140px; align-items: center; gap: 24px;">
          <div>
            <div style="font-size: 18px; font-weight: 600; color: var(--c-bone);">Vision Layout</div>
            <div class="font-mono" style="font-size: 12px; color: var(--c-stone);">ResNet-18 · 512 embedding</div>
          </div>
          <div style="background: var(--c-graphite); height: 36px; border-left: 2px solid var(--c-stone); position: relative; overflow: hidden; border-radius: 2px;">
            <div id="bar-vision" style="background: var(--c-slate); height: 100%; width: 0%; display: flex; align-items: center; justify-content: flex-end; padding-right: 12px;">
              <span class="font-mono tabular-nums" style="font-size: 13px; font-weight: 600; color: #FFF;">85.43%</span>
            </div>
          </div>
          <div class="font-mono tabular-nums" style="font-size: 14px; color: var(--c-stone); text-align: right;">
            AUC: <span style="color: var(--c-bone);">0.9304</span>
          </div>
        </div>

        <!-- Text Row -->
        <div class="metric-row" style="display: grid; grid-template-columns: 240px 1fr 140px; align-items: center; gap: 24px;">
          <div>
            <div style="font-size: 18px; font-weight: 600; color: var(--c-bone);">Text Semantic</div>
            <div class="font-mono" style="font-size: 12px; color: var(--c-stone);">Linear TF-IDF · n-grams</div>
          </div>
          <div style="background: var(--c-graphite); height: 36px; border-left: 2px solid var(--c-stone); position: relative; overflow: hidden; border-radius: 2px;">
            <div id="bar-text" style="background: var(--c-slate); height: 100%; width: 0%; display: flex; align-items: center; justify-content: flex-end; padding-right: 12px;">
              <span class="font-mono tabular-nums" style="font-size: 13px; font-weight: 600; color: #FFF;">87.90%</span>
            </div>
          </div>
          <div class="font-mono tabular-nums" style="font-size: 14px; color: var(--c-stone); text-align: right;">
            AUC: <span style="color: var(--c-bone);">0.9705</span>
          </div>
        </div>

        <!-- DOM Row -->
        <div class="metric-row" style="display: grid; grid-template-columns: 240px 1fr 140px; align-items: center; gap: 24px;">
          <div>
            <div style="font-size: 18px; font-weight: 600; color: var(--c-bone);">DOM Structural</div>
            <div class="font-mono" style="font-size: 12px; color: var(--c-stone);">Random Forest · 24 features</div>
          </div>
          <div style="background: var(--c-graphite); height: 36px; border-left: 2px solid var(--c-stone); position: relative; overflow: hidden; border-radius: 2px;">
            <div id="bar-html" style="background: var(--c-slate); height: 100%; width: 0%; display: flex; align-items: center; justify-content: flex-end; padding-right: 12px;">
              <span class="font-mono tabular-nums" style="font-size: 13px; font-weight: 600; color: #FFF;">94.42%</span>
            </div>
          </div>
          <div class="font-mono tabular-nums" style="font-size: 14px; color: var(--c-stone); text-align: right;">
            AUC: <span style="color: var(--c-bone);">0.9854</span>
          </div>
        </div>

        <!-- FUSION ROW (Highlighted) -->
        <div id="row-fusion" class="metric-row" style="display: grid; grid-template-columns: 240px 1fr 140px; align-items: center; gap: 24px; margin-top: 8px; padding: 10px 14px; background: rgba(168, 139, 80, 0.08); border: 1px solid var(--c-brass); border-radius: 4px;">
          <div>
            <div style="font-size: 20px; font-weight: 700; color: var(--c-brass);">Late Fusion Meta</div>
            <div class="font-mono" style="font-size: 12px; color: var(--c-brass);">Calibrated Logistic Ensemble</div>
          </div>
          <div style="background: var(--c-graphite); height: 40px; border-left: 3px solid var(--c-brass); position: relative; overflow: hidden; border-radius: 2px;">
            <div id="bar-fusion" style="background: var(--c-brass); height: 100%; width: 0%; display: flex; align-items: center; justify-content: flex-end; padding-right: 16px;">
              <span class="font-mono tabular-nums" style="font-size: 15px; font-weight: 700; color: #14130F;">96.27%</span>
            </div>
          </div>
          <div class="font-mono tabular-nums" style="font-size: 14px; color: var(--c-brass); text-align: right; font-weight: 600;">
            AUC: 0.9949
          </div>
        </div>
      </div>

      <!-- Bottom Metric Legend & Error Breakdown -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; border-top: 1px solid var(--c-graphite-border); padding-top: 18px;">
        <div style="border-left: 2px solid var(--c-oxide); padding-left: 16px;">
          <span class="font-mono" style="font-size: 12px; color: var(--c-stone);">URL FALSE ALARM RATE</span>
          <div class="font-mono tabular-nums" style="font-size: 22px; color: var(--c-oxide); font-weight: 600; margin-top: 4px;">25.54% FP</div>
          <p class="subtle-text" style="font-size: 13px; margin: 4px 0 0 0;">Complex SaaS paths trigger lexical false positives.</p>
        </div>
        <div style="border-left: 2px solid var(--c-moss); padding-left: 16px;">
          <span class="font-mono" style="font-size: 12px; color: var(--c-stone);">FUSION PRECISION</span>
          <div class="font-mono tabular-nums" style="font-size: 22px; color: var(--c-moss); font-weight: 600; margin-top: 4px;">97.93% Prec</div>
          <p class="subtle-text" style="font-size: 13px; margin: 4px 0 0 0;">False positive rate slashed to only 1.67%.</p>
        </div>
        <div style="border-left: 2px solid var(--c-brass); padding-left: 16px;">
          <span class="font-mono" style="font-size: 12px; color: var(--c-stone);">ROC-AUC LEAP</span>
          <div class="font-mono tabular-nums" style="font-size: 22px; color: var(--c-brass); font-weight: 600; margin-top: 4px;">0.905 → 0.995</div>
          <p class="subtle-text" style="font-size: 13px; margin: 4px 0 0 0;">Supervised stacking eliminates individual blind spots.</p>
        </div>
      </div>
    </div>
  `;

  return {
    index: 7,
    id: "scene-why-one-signal-fails",
    element: el,

    enter(step: number) {
      activeTimeline = gsap.timeline();
      activeTimeline.to(el.querySelector("#bar-url"), { width: `${MODALITY_METRICS.url.testAccuracy * 100}%`, duration: 0.7, ease: "power2.out" })
        .to(el.querySelector("#bar-vision"), { width: `${MODALITY_METRICS.vision.testAccuracy * 100}%`, duration: 0.7, ease: "power2.out" }, "-=0.5")
        .to(el.querySelector("#bar-text"), { width: `${MODALITY_METRICS.text.testAccuracy * 100}%`, duration: 0.7, ease: "power2.out" }, "-=0.5")
        .to(el.querySelector("#bar-html"), { width: `${MODALITY_METRICS.html.testAccuracy * 100}%`, duration: 0.7, ease: "power2.out" }, "-=0.5");
      this.stepTo?.(step);
    },

    stepTo(step: number) {
      const barFusion = el.querySelector<HTMLElement>("#bar-fusion");
      const rowFusion = el.querySelector<HTMLElement>("#row-fusion");
      if (!barFusion || !rowFusion) return;

      if (step === 0) {
        gsap.to(barFusion, { width: "0%", duration: 0.3 });
        gsap.to(rowFusion, { opacity: 0.5, duration: 0.3 });
      } else if (step === 1) {
        gsap.to(rowFusion, { opacity: 1, duration: 0.3 });
        gsap.to(barFusion, {
          width: `${FUSION_MODEL.testAccuracy * 100}%`,
          duration: 0.8,
          ease: "power2.out",
        });
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
