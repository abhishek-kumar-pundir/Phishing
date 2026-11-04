import { gsap } from "gsap";
import { SceneInstance } from "./types";

export function createScene19(): SceneInstance {
  const el = document.createElement("section");
  el.className = "scene-stage scene-dark";
  el.id = "scene-explainability-shap";

  let activeTimeline: gsap.core.Timeline | null = null;

  el.innerHTML = `
    <header class="scene-header">
      <span class="scene-index">19</span>
      <span class="scene-category">19 · MODEL TRANSPARENCY · TREESHAP ATTRIBUTION</span>
    </header>

    <div class="scene-content" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <span class="meta-label" style="color: var(--c-brass);">Exact Polynomial Shapley Values · &lt; 15ms</span>
        <h2 style="margin-top: 6px;">Explainable AI (TreeSHAP)</h2>
        <p class="lead subtle-text" style="max-width: 900px; margin-top: 8px; font-size: 21px;">
          Security analysts require explainability, not black boxes. TreeSHAP quantifies exactly how each feature pushed the model’s prediction toward or away from a phishing verdict.
        </p>
      </div>

      <!-- SHAP Diverging Attribution Visualization -->
      <div style="flex: 1; display: grid; grid-template-columns: 1.3fr 1fr; gap: 36px; align-items: center; padding: 18px 0;">
        <!-- Left: Diverging Bars -->
        <div style="background: var(--c-ink-soft); border: 1px solid var(--c-graphite-border); padding: 24px; border-radius: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 18px;">
            <span class="font-mono" style="font-size: 11px; color: var(--c-stone); text-transform: uppercase;">
              LOCAL ATTRIBUTION (SINGLE SCAN AUDIT)
            </span>
            <span class="font-mono" style="font-size: 10px; color: var(--c-moss);">← TOWARD LEGIT | TOWARD PHISH →</span>
          </div>

          <!-- Feature 1: external_action_ratio -->
          <div class="shap-row" style="margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 3px;">
              <span class="font-mono" style="color: var(--c-bone);">external_action_ratio = 1.0</span>
              <span class="font-mono tabular-nums" style="color: var(--c-oxide); font-weight: 600;">+0.42</span>
            </div>
            <div style="height: 16px; background: var(--c-graphite); position: relative; display: flex; border-radius: 2px; overflow: hidden;">
              <div style="width: 50%; border-right: 1px solid var(--c-stone);"></div>
              <div class="shap-bar" style="width: 42%; background: var(--c-oxide); height: 100%;"></div>
            </div>
          </div>

          <!-- Feature 2: shannon_entropy -->
          <div class="shap-row" style="margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 3px;">
              <span class="font-mono" style="color: var(--c-bone);">shannon_entropy = 4.12</span>
              <span class="font-mono tabular-nums" style="color: var(--c-oxide); font-weight: 600;">+0.31</span>
            </div>
            <div style="height: 16px; background: var(--c-graphite); position: relative; display: flex; border-radius: 2px; overflow: hidden;">
              <div style="width: 50%; border-right: 1px solid var(--c-stone);"></div>
              <div class="shap-bar" style="width: 31%; background: var(--c-oxide); height: 100%;"></div>
            </div>
          </div>

          <!-- Feature 3: has_https (Protective) -->
          <div class="shap-row" style="margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 3px;">
              <span class="font-mono" style="color: var(--c-bone);">has_valid_https = 1</span>
              <span class="font-mono tabular-nums" style="color: var(--c-moss); font-weight: 600;">-0.18</span>
            </div>
            <div style="height: 16px; background: var(--c-graphite); position: relative; display: flex; border-radius: 2px; overflow: hidden;">
              <div style="width: 50%; display: flex; justify-content: flex-end; border-right: 1px solid var(--c-stone);">
                <div class="shap-bar" style="width: 36%; background: var(--c-moss); height: 100%;"></div>
              </div>
              <div style="width: 50%;"></div>
            </div>
          </div>

          <!-- Feature 4: subdomain_depth -->
          <div class="shap-row" style="margin-bottom: 14px;">
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 3px;">
              <span class="font-mono" style="color: var(--c-bone);">subdomain_depth = 4</span>
              <span class="font-mono tabular-nums" style="color: var(--c-oxide); font-weight: 600;">+0.24</span>
            </div>
            <div style="height: 16px; background: var(--c-graphite); position: relative; display: flex; border-radius: 2px; overflow: hidden;">
              <div style="width: 50%; border-right: 1px solid var(--c-stone);"></div>
              <div class="shap-bar" style="width: 24%; background: var(--c-oxide); height: 100%;"></div>
            </div>
          </div>

          <!-- Feature 5: total_link_count -->
          <div class="shap-row">
            <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 3px;">
              <span class="font-mono" style="color: var(--c-bone);">total_link_count = 3 (Sparse)</span>
              <span class="font-mono tabular-nums" style="color: var(--c-oxide); font-weight: 600;">+0.15</span>
            </div>
            <div style="height: 16px; background: var(--c-graphite); position: relative; display: flex; border-radius: 2px; overflow: hidden;">
              <div style="width: 50%; border-right: 1px solid var(--c-stone);"></div>
              <div class="shap-bar" style="width: 15%; background: var(--c-oxide); height: 100%;"></div>
            </div>
          </div>
        </div>

        <!-- Right: Scientific Honesty Callout & Complexity -->
        <div style="background: var(--c-ink-soft); border: 1px solid var(--c-graphite-border); padding: 28px; display: flex; flex-direction: column; justify-content: space-between; border-radius: 4px;">
          <div>
            <span class="font-mono" style="font-size: 12px; color: var(--c-brass); letter-spacing: 0.08em; text-transform: uppercase;">
              SCIENTIFIC HONESTY IN UI
            </span>
            <h3 style="font-family: var(--font-display); font-size: 24px; color: var(--c-bone); margin: 6px 0 10px 0;">
              Model Attribution, Not Proof
            </h3>
            <p class="subtle-text" style="font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
              Shapley values reflect how the mathematical model weighted the extracted features. They represent <strong>model attribution</strong>, not absolute ground truth. We never claim "100% proof" or "guaranteed verdict" to analysts.
            </p>

            <div style="background: var(--c-graphite); padding: 12px 14px; border-left: 3px solid var(--c-moss); border-radius: 2px;">
              <div class="font-mono" style="font-size: 11px; color: var(--c-moss); font-weight: 600;">
                POLYNOMIAL TREESHAP EFFICIENCY
              </div>
              <p class="subtle-text" style="font-size: 12px; margin: 4px 0 0 0;">
                TreeSHAP evaluates in O(TLD²) where D is tree depth, computing exact attributions across 100 trees in 12ms—avoiding exponential KernelSHAP approximations.
              </p>
            </div>
          </div>

          <!-- Global Importance Ranking -->
          <div style="margin-top: 20px; border-top: 1px solid var(--c-graphite-border); padding-top: 14px;">
            <div class="font-mono" style="font-size: 11px; color: var(--c-stone); margin-bottom: 4px;">
              GLOBAL FEATURE IMPORTANCE LEADERS
            </div>
            <div class="font-mono" style="font-size: 12px; color: var(--c-bone);">
              1. external_action_ratio · 2. total_link_count · 3. shannon_entropy
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div style="border-top: 1px solid var(--c-graphite-border); padding-top: 14px; display: flex; justify-content: space-between; align-items: baseline;">
        <div style="font-size: 15px; color: var(--c-stone);">
          <strong style="color: var(--c-bone);">COMPLIANCE & AUDITING:</strong>
          Provides a verifiable audit trail for incident response compliance and forensic investigation.
        </div>
        <div class="font-mono" style="font-size: 13px; color: var(--c-stone);">
          SPACE / ARROW → STEP 3 OF 3
        </div>
      </div>
    </div>
  `;

  return {
    index: 19,
    id: "scene-explainability-shap",
    element: el,

    enter(step: number) {
      activeTimeline = gsap.timeline();
      activeTimeline.from(el.querySelectorAll(".shap-bar"), {
        scaleX: 0,
        transformOrigin: "left center",
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
      });
      this.stepTo?.(step);
    },

    stepTo(step: number) {
      const bars = el.querySelectorAll<HTMLElement>(".shap-bar");
      if (step === 0) {
        bars.forEach((b) => (b.style.opacity = "1"));
      } else if (step === 1) {
        bars.forEach((b) => {
          b.style.opacity = b.style.background.includes("oxide") ? "1" : "0.3";
        });
      } else if (step === 2) {
        bars.forEach((b) => (b.style.opacity = "1"));
        gsap.fromTo(el.querySelectorAll(".shap-row"), { x: -4 }, { x: 0, stagger: 0.05, duration: 0.2 });
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
