import { gsap } from "gsap";
import { SceneInstance } from "./types";
import { CALIBRATION_DATA } from "../data/metrics";

export function createScene18(): SceneInstance {
  const el = document.createElement("section");
  el.className = "scene-stage scene-light";
  el.id = "scene-probability-calibration";

  let activeTimeline: gsap.core.Timeline | null = null;

  const DECILLES = [
    { pred: 0.03, emp: 0.02 },
    { pred: 0.14, emp: 0.12 },
    { pred: 0.26, emp: 0.28 },
    { pred: 0.35, emp: 0.33 },
    { pred: 0.46, emp: 0.44 },
    { pred: 0.54, emp: 0.57 },
    { pred: 0.65, emp: 0.68 },
    { pred: 0.76, emp: 0.74 },
    { pred: 0.85, emp: 0.88 },
    { pred: 0.97, emp: 0.98 },
  ];

  const pointsSvg = DECILLES.map((d) => {
    const x = 50 + d.pred * 300;
    const y = 350 - d.emp * 300;
    return `${x},${y}`;
  }).join(" ");

  el.innerHTML = `
    <header class="scene-header">
      <span class="scene-index">18</span>
      <span class="scene-category">18 · STATISTICAL CALIBRATION · RELIABILITY CURVE</span>
    </header>

    <div class="scene-content" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <span class="meta-label" style="color: var(--c-moss);">ECE: 4.00% · Brier: 0.0288</span>
        <h2 style="margin-top: 6px;">Probability Calibration & Reliability</h2>
        <p class="lead subtle-text" style="max-width: 900px; margin-top: 8px; font-size: 21px;">
          Security analysts require truthful probabilities: when the model outputs 0.80, exactly 8 out of 10 sites must be ground-truth phishing.
        </p>
      </div>

      <!-- Calibration Plot & Empirical Cards -->
      <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; padding: 18px 0;">
        <!-- Left: Hand-coded SVG Reliability Curve -->
        <div style="background: #FFFFFF; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 20px; display: flex; justify-content: center; border-radius: 4px;">
          <svg viewBox="0 0 420 420" style="width: 100%; max-width: 400px; height: auto;">
            <!-- Axes -->
            <line x1="50" y1="350" x2="370" y2="350" stroke="#8F897A" stroke-width="1.5" />
            <line x1="50" y1="50" x2="50" y2="350" stroke="#8F897A" stroke-width="1.5" />

            <!-- Grid lines and labels -->
            <line x1="50" y1="200" x2="370" y2="200" stroke="#EAE4D7" stroke-width="1" stroke-dasharray="2 2" />
            <line x1="200" y1="50" x2="200" y2="350" stroke="#EAE4D7" stroke-width="1" stroke-dasharray="2 2" />
            <text x="40" y="354" fill="#8F897A" font-family="var(--font-mono)" font-size="11" text-anchor="end">0.0</text>
            <text x="40" y="204" fill="#8F897A" font-family="var(--font-mono)" font-size="11" text-anchor="end">0.5</text>
            <text x="40" y="54" fill="#8F897A" font-family="var(--font-mono)" font-size="11" text-anchor="end">1.0</text>
            <text x="50" y="372" fill="#8F897A" font-family="var(--font-mono)" font-size="11" text-anchor="middle">0.0</text>
            <text x="200" y="372" fill="#8F897A" font-family="var(--font-mono)" font-size="11" text-anchor="middle">0.5</text>
            <text x="350" y="372" fill="#8F897A" font-family="var(--font-mono)" font-size="11" text-anchor="middle">1.0</text>
            <text x="200" y="398" fill="#14130F" font-family="var(--font-mono)" font-size="12" text-anchor="middle">Mean Predicted Probability</text>
            <text x="20" y="200" fill="#14130F" font-family="var(--font-mono)" font-size="12" text-anchor="middle" transform="rotate(-90 20 200)">Empirical Fraction Phishing</text>

            <!-- Perfect Diagonal y = x -->
            <line x1="50" y1="350" x2="350" y2="50" stroke="#8F897A" stroke-width="1.5" stroke-dasharray="4 4" />
            <text x="310" y="80" fill="#8F897A" font-family="var(--font-mono)" font-size="11">Perfect Calibration (y = x)</text>

            <!-- Empirical Line -->
            <polyline id="calib-line" points="${pointsSvg}" fill="none" stroke="#55705A" stroke-width="2.5" />

            <!-- Decile Points -->
            ${DECILLES.map((d) => {
              const x = 50 + d.pred * 300;
              const y = 350 - d.emp * 300;
              return `<circle cx="${x}" cy="${y}" r="4.5" fill="#55705A" stroke="#FFFFFF" stroke-width="1.5" />`;
            }).join("")}
          </svg>
        </div>

        <!-- Right: Calibration Metrics & Explanation -->
        <div style="display: flex; flex-direction: column; gap: 18px;">
          <div style="background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 22px; border-radius: 4px;">
            <span class="font-mono" style="font-size: 11px; color: var(--c-stone); text-transform: uppercase;">
              METRIC 01 · BRIER SCORE
            </span>
            <div class="font-mono tabular-nums" style="font-family: var(--font-display); font-size: 40px; color: var(--c-ink); margin-top: 2px;">
              ${CALIBRATION_DATA.brierScore.toFixed(5)}
            </div>
            <p style="font-size: 13px; color: var(--c-graphite); margin: 6px 0 0 0; line-height: 1.5;">
              Measures the mean squared difference between predicted probabilities and actual outcomes. A score of 0.0288 represents near-optimal probabilistic accuracy (reference baseline: 0.25).
            </p>
          </div>

          <div style="background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 22px; border-radius: 4px;">
            <span class="font-mono" style="font-size: 11px; color: var(--c-stone); text-transform: uppercase;">
              METRIC 02 · EXPECTED CALIBRATION ERROR (ECE)
            </span>
            <div class="font-mono tabular-nums" style="font-family: var(--font-display); font-size: 40px; color: var(--c-moss); margin-top: 2px;">
              4.00%
            </div>
            <p style="font-size: 13px; color: var(--c-graphite); margin: 6px 0 0 0; line-height: 1.5;">
              The weighted average discrepancy between confidence and empirical reality across all 10 probability bins is just 4 percentage points.
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div style="border-top: 1px solid rgba(42, 41, 38, 0.15); padding-top: 14px; display: flex; justify-content: space-between; align-items: baseline;">
        <div style="font-size: 15px; color: var(--c-graphite);">
          <strong style="color: var(--c-ink);">PRACTICAL BENEFIT:</strong>
          Enables downstream Security Orchestration (SOAR) playbooks to automate responses dynamically based on real probability thresholds.
        </div>
        <div class="font-mono" style="font-size: 13px; color: var(--c-stone);">
          SPACE / ARROW → STEP 2 OF 2
        </div>
      </div>
    </div>
  `;

  return {
    index: 18,
    id: "scene-probability-calibration",
    element: el,

    enter(step: number) {
      activeTimeline = gsap.timeline();
      activeTimeline.from(el.querySelector(".scene-content"), {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
      });
      activeTimeline.from(
        el.querySelector("#calib-line"),
        {
          strokeDashoffset: 1000,
          strokeDasharray: 1000,
          duration: 1.2,
          ease: "power2.out",
        },
        "-=0.3"
      );
      this.stepTo?.(step);
    },

    stepTo(step: number) {
      const line = el.querySelector<SVGPolylineElement>("#calib-line");
      if (!line) return;
      if (step === 0) {
        gsap.to(line, { stroke: "#55705A", duration: 0.3 });
      } else if (step === 1) {
        gsap.to(line, { stroke: "#A88B50", duration: 0.3 });
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
