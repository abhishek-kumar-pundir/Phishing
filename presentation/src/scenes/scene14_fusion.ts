import { gsap } from "gsap";
import { SceneInstance } from "./types";
import { computeFusionProbability } from "../data/metrics";

export function createScene14(): SceneInstance {
  const el = document.createElement("section");
  el.className = "scene-stage scene-light";
  el.id = "scene-fusion-math";

  el.innerHTML = `
    <header class="scene-header">
      <span class="scene-index">14</span>
      <span class="scene-category">14 · LATE-FUSION META-ESTIMATOR · MATHEMATICAL PROOF</span>
    </header>

    <div class="scene-content" style="display: flex; flex-direction: column; justify-content: space-between;">
      <!-- Title & Concept Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 32px;">
        <div>
          <span class="meta-label" style="color: var(--c-slate);">Calibrated Decision Ensemble</span>
          <h2 style="margin-top: 6px;">The Chief Officer & Real Learned Weights</h2>
          <p class="lead subtle-text" style="max-width: 820px; margin-top: 8px; font-size: 21px;">
            Outputs from the 4 models are stacked through a fitted Logistic Regression meta-estimator. Line thickness corresponds directly to empirical feature weights.
          </p>
        </div>

        <!-- Formula Display Box -->
        <div style="background: rgba(42, 41, 38, 0.06); border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); border-radius: 4px; padding: 14px 20px; font-family: var(--font-mono); font-size: 13px; line-height: 1.6; color: var(--c-ink); shrink: 0;">
          <div style="color: var(--c-slate); font-weight: 600; font-size: 11px; text-transform: uppercase; margin-bottom: 4px;">LEARNED LOGIT FORMULA</div>
          <div>z = -6.2590 + 3.5985·P_url + 2.6307·P_html</div>
          <div style="padding-left: 18px;">+ 4.9169·P_text + 1.2024·P_vis</div>
          <div style="margin-top: 4px; color: #55705A; font-weight: 600;">P(phishing) = 1 / (1 + e^-z)</div>
        </div>
      </div>

      <!-- Main Stage: Left Diagram (SVG), Right Interactive Calculator -->
      <div style="display: grid; grid-template-columns: 1.05fr 1.15fr; gap: clamp(24px, 3vw, 44px); align-items: center; margin: 12px 0;">
        
        <!-- SVG: 4 Inspector Nodes Feeding Chief Officer -->
        <div style="background: #E2DBD0; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); border-radius: 4px; padding: 20px;">
          <svg viewBox="0 0 460 300" width="100%" height="auto" style="overflow: visible;">
            <!-- Connector Lines with real relative stroke width -->
            <!-- URL (w=3.60 -> stroke 6px) -->
            <path id="path-url" d="M 120 45 C 220 45, 240 150, 340 150" fill="none" stroke="#2A2926" stroke-width="5.5" stroke-linecap="round" />
            <!-- HTML (w=2.63 -> stroke 4.2px) -->
            <path id="path-html" d="M 120 115 C 210 115, 240 150, 340 150" fill="none" stroke="#2A2926" stroke-width="4.2" stroke-linecap="round" />
            <!-- TEXT (w=4.92 -> stroke 7.8px - thickest!) -->
            <path id="path-text" d="M 120 185 C 210 185, 240 150, 340 150" fill="none" stroke="#4A5C70" stroke-width="7.8" stroke-linecap="round" />
            <!-- VISION (w=1.20 -> stroke 2px - thinnest!) -->
            <path id="path-vis" d="M 120 255 C 220 255, 240 150, 340 150" fill="none" stroke="#8F897A" stroke-width="2.2" stroke-linecap="round" />

            <!-- Weight Annotations -->
            <text x="180" y="40" font-family="IBM Plex Mono" font-size="10" fill="#2A2926">w_url = +3.60 (29%)</text>
            <text x="170" y="105" font-family="IBM Plex Mono" font-size="10" fill="#2A2926">w_html = +2.63 (21%)</text>
            <text x="170" y="200" font-family="IBM Plex Mono" font-size="10" fill="#4A5C70" font-weight="bold">w_text = +4.92 (40%)</text>
            <text x="180" y="270" font-family="IBM Plex Mono" font-size="10" fill="#8F897A">w_vis = +1.20 (10%)</text>

            <!-- 4 Inspector Nodes -->
            <!-- URL Node -->
            <g transform="translate(10, 25)">
              <rect width="110" height="40" rx="3" fill="#14130F" />
              <text x="12" y="24" font-family="IBM Plex Mono" font-size="11" fill="#E8E2D4" font-weight="bold">URL INSPECTOR</text>
            </g>

            <!-- HTML Node -->
            <g transform="translate(10, 95)">
              <rect width="110" height="40" rx="3" fill="#14130F" />
              <text x="10" y="24" font-family="IBM Plex Mono" font-size="11" fill="#E8E2D4" font-weight="bold">DOM INSPECTOR</text>
            </g>

            <!-- TEXT Node -->
            <g transform="translate(10, 165)">
              <rect width="110" height="40" rx="3" fill="#4A5C70" />
              <text x="10" y="24" font-family="IBM Plex Mono" font-size="11" fill="#E8E2D4" font-weight="bold">TEXT SEMANTIC</text>
            </g>

            <!-- VISION Node -->
            <g transform="translate(10, 235)">
              <rect width="110" height="40" rx="3" fill="#14130F" />
              <text x="6" y="24" font-family="IBM Plex Mono" font-size="11" fill="#E8E2D4" font-weight="bold">VISION LAYOUT</text>
            </g>

            <!-- Chief Officer Meta-Classifier Core -->
            <g transform="translate(340, 105)">
              <rect width="105" height="90" rx="5" fill="#14130F" stroke="#A88B50" stroke-width="2.5" />
              <text x="10" y="28" font-family="IBM Plex Mono" font-size="10" fill="#A88B50" font-weight="bold">CHIEF OFFICER</text>
              <text x="10" y="48" font-family="Fraunces" font-size="15" fill="#E8E2D4">Decision Core</text>
              <text x="10" y="72" font-family="IBM Plex Mono" font-size="10" fill="#8F897A">w₀ = -6.2590</text>
            </g>
          </svg>
        </div>

        <!-- Right Side: Interactive Probability Sliders & Live Real Math Output -->
        <div style="background: #ECE5D8; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.25); border-radius: 4px; padding: clamp(18px, 2.2vw, 28px);">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 14px;">
            <span class="meta-label" style="color: var(--c-ink);">Live Fusion Probability Calculator</span>
            <div style="display: flex; gap: 6px;">
              <button class="calc-preset key-badge" data-preset="clean" style="cursor: pointer;">CLEAN SITE</button>
              <button class="calc-preset key-badge" data-preset="phish" style="cursor: pointer;">PHISHING LURE</button>
              <button class="calc-preset key-badge" data-preset="visual-shift" style="cursor: pointer;">VISUAL DRIFT</button>
            </div>
          </div>

          <!-- 4 Sliders -->
          <div style="display: flex; flex-direction: column; gap: 10px; font-family: var(--font-mono); font-size: 12px;">
            <!-- URL -->
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span>URL Model Probability (P_url)</span>
                <span id="val-url" class="tabular" style="font-weight: 600;">0.85</span>
              </div>
              <input type="range" id="slider-url" min="0" max="1" step="0.01" value="0.85" style="width: 100%; accent-color: var(--c-ink);" />
            </div>

            <!-- DOM -->
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span>DOM Model Probability (P_html)</span>
                <span id="val-html" class="tabular" style="font-weight: 600;">0.90</span>
              </div>
              <input type="range" id="slider-html" min="0" max="1" step="0.01" value="0.90" style="width: 100%; accent-color: var(--c-ink);" />
            </div>

            <!-- Text -->
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span style="color: var(--c-slate); font-weight: 600;">Text Model Probability (P_text, highest wt)</span>
                <span id="val-text" class="tabular" style="font-weight: 600; color: var(--c-slate);">0.95</span>
              </div>
              <input type="range" id="slider-text" min="0" max="1" step="0.01" value="0.95" style="width: 100%; accent-color: var(--c-slate);" />
            </div>

            <!-- Vision -->
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
                <span>Vision Model Probability (P_vis)</span>
                <span id="val-vis" class="tabular" style="font-weight: 600;">0.40</span>
              </div>
              <input type="range" id="slider-vis" min="0" max="1" step="0.01" value="0.40" style="width: 100%; accent-color: var(--c-ink);" />
            </div>
          </div>

          <!-- Real Mathematical Result Box -->
          <div style="margin-top: 16px; padding: 14px; background: var(--c-ink); color: var(--c-bone); border-radius: 4px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span class="meta-label" style="color: var(--c-stone);">CALCULATED VERDICT</span>
              <div id="verdict-label" style="font-family: var(--font-display); font-size: 24px; font-weight: 600; color: var(--c-oxide); margin-top: 2px;">
                CRITICAL PHISHING
              </div>
              <div id="logit-z-display" class="font-mono" style="font-size: 11px; color: var(--c-stone); margin-top: 2px;">
                Logit z = +4.321 · Threshold = 0.45
              </div>
            </div>

            <div style="text-align: right;">
              <span class="meta-label" style="color: var(--c-stone);">FUSED POSTERIOR</span>
              <div id="prob-percentage" class="font-mono tabular" style="font-size: 38px; font-weight: 700; color: var(--c-oxide); line-height: 1;">
                98.7%
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer Insight -->
      <div style="display: flex; justify-content: space-between; align-items: baseline; border-top: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding-top: 14px;">
        <span class="subtle-text" style="font-size: 15px;">
          Note: Text carries 39.8% relative weight share due to the consistency of social-engineering lures across attacks.
        </span>
        <span class="font-mono tabular" style="font-size: 13px; color: var(--c-ink); font-weight: 600;">
          INTERCEPT w₀ = -6.2590 (Strong Legitimate Prior)
        </span>
      </div>
    </div>
  `;

  // Calculator logic with real math
  function updateMath() {
    const pUrl = parseFloat((el.querySelector("#slider-url") as HTMLInputElement).value);
    const pHtml = parseFloat((el.querySelector("#slider-html") as HTMLInputElement).value);
    const pText = parseFloat((el.querySelector("#slider-text") as HTMLInputElement).value);
    const pVis = parseFloat((el.querySelector("#slider-vis") as HTMLInputElement).value);

    (el.querySelector("#val-url") as HTMLElement).textContent = pUrl.toFixed(2);
    (el.querySelector("#val-html") as HTMLElement).textContent = pHtml.toFixed(2);
    (el.querySelector("#val-text") as HTMLElement).textContent = pText.toFixed(2);
    (el.querySelector("#val-vis") as HTMLElement).textContent = pVis.toFixed(2);

    const { z, probability } = computeFusionProbability(pUrl, pHtml, pText, pVis);

    const probPctEl = el.querySelector("#prob-percentage") as HTMLElement;
    const verdictEl = el.querySelector("#verdict-label") as HTMLElement;
    const logitEl = el.querySelector("#logit-z-display") as HTMLElement;

    const pctStr = (probability * 100).toFixed(1) + "%";
    probPctEl.textContent = pctStr;
    logitEl.textContent = `Logit z = ${z >= 0 ? "+" + z.toFixed(3) : z.toFixed(3)} · Threshold τ = 0.45`;

    if (probability >= 0.55) {
      verdictEl.textContent = "CRITICAL PHISHING";
      verdictEl.style.color = "var(--c-oxide)";
      probPctEl.style.color = "var(--c-oxide)";
    } else if (probability >= 0.35) {
      verdictEl.textContent = "HUMAN REVIEW BAND";
      verdictEl.style.color = "var(--c-brass)";
      probPctEl.style.color = "var(--c-brass)";
    } else {
      verdictEl.textContent = "LEGITIMATE (CLEAN)";
      verdictEl.style.color = "var(--c-moss)";
      probPctEl.style.color = "var(--c-moss)";
    }
  }

  // Hook input events
  ["url", "html", "text", "vis"].forEach((id) => {
    el.querySelector(`#slider-${id}`)?.addEventListener("input", updateMath);
  });

  // Presets
  el.querySelectorAll(".calc-preset").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-preset");
      const sUrl = el.querySelector("#slider-url") as HTMLInputElement;
      const sHtml = el.querySelector("#slider-html") as HTMLInputElement;
      const sText = el.querySelector("#slider-text") as HTMLInputElement;
      const sVis = el.querySelector("#slider-vis") as HTMLInputElement;

      if (type === "clean") {
        sUrl.value = "0.05";
        sHtml.value = "0.02";
        sText.value = "0.04";
        sVis.value = "0.10";
      } else if (type === "phish") {
        sUrl.value = "0.85";
        sHtml.value = "0.90";
        sText.value = "0.95";
        sVis.value = "0.40";
      } else if (type === "visual-shift") {
        // High vision false alarm on offline render, but DOM and Text clean
        sUrl.value = "0.08";
        sHtml.value = "0.05";
        sText.value = "0.02";
        sVis.value = "0.92"; // Broken offline render mimics phishing
      }
      updateMath();
    });
  });

  return {
    index: 14,
    id: "scene-fusion-math",
    element: el,

    enter: () => {
      updateMath();
      gsap.fromTo(
        el.querySelectorAll("#path-url, #path-html, #path-text, #path-vis"),
        { strokeDasharray: 400, strokeDashoffset: 400 },
        { strokeDashoffset: 0, duration: 1.0, stagger: 0.12, ease: "power3.out" }
      );
    },
  };
}
