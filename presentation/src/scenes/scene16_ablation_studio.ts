import { gsap } from "gsap";
import { SceneInstance } from "./types";

export function createScene16(): SceneInstance {
  const el = document.createElement("section");
  el.className = "scene-stage scene-light";
  el.id = "scene-ablation-results";

  let activeTimeline: gsap.core.Timeline | null = null;

  el.innerHTML = `
    <header class="scene-header">
      <span class="scene-index">16</span>
      <span class="scene-category">16 · SCIENTIFIC VERIFICATION · ABLATION STUDY</span>
    </header>

    <div class="scene-content" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <span class="meta-label" style="color: var(--c-slate);">Controlled Modality Removal</span>
        <h2 style="margin-top: 6px;">Ablation Study: Quantifying Value</h2>
        <p class="lead subtle-text" style="max-width: 900px; margin-top: 8px; font-size: 21px;">
          By retraining the ensemble with individual channels withheld, we isolate the marginal empirical contribution of each modality on 2,760 test samples.
        </p>
      </div>

      <!-- Interactive Ablation Matrix Table -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 18px 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <div class="font-mono" style="font-size: 12px; color: var(--c-stone); text-transform: uppercase;">
            Ablation Test Performance Matrix
          </div>
          <!-- Interactive Switcher -->
          <div style="display: flex; gap: 8px;">
            <button class="abl-btn active" data-key="full" style="background: var(--c-graphite); color: #FFF; border: none; font-family: var(--font-mono); font-size: 12px; padding: 5px 12px; cursor: pointer; border-radius: 2px;">
              All 4 Modalities
            </button>
            <button class="abl-btn" data-key="drop_url" style="background: #EAE4D7; color: var(--c-ink); border: 1px solid #D5CEBF; font-family: var(--font-mono); font-size: 12px; padding: 5px 12px; cursor: pointer; border-radius: 2px;">
              Drop URL
            </button>
            <button class="abl-btn" data-key="drop_dom" style="background: #EAE4D7; color: var(--c-ink); border: 1px solid #D5CEBF; font-family: var(--font-mono); font-size: 12px; padding: 5px 12px; cursor: pointer; border-radius: 2px;">
              Drop DOM
            </button>
            <button class="abl-btn" data-key="drop_vision" style="background: #EAE4D7; color: var(--c-ink); border: 1px solid #D5CEBF; font-family: var(--font-mono); font-size: 12px; padding: 5px 12px; cursor: pointer; border-radius: 2px;">
              Drop Vision
            </button>
          </div>
        </div>

        <!-- Table Layout -->
        <div style="background: #FFFFFF; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); overflow: hidden; border-radius: 4px;">
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="background: #F4EFE6; border-bottom: 1px solid rgba(42, 41, 38, 0.15);">
                <th class="font-mono" style="padding: 12px 18px; font-size: 11px; color: var(--c-stone);">CONFIGURATION</th>
                <th class="font-mono" style="padding: 12px 18px; font-size: 11px; color: var(--c-stone); text-align: right;">ACCURACY</th>
                <th class="font-mono" style="padding: 12px 18px; font-size: 11px; color: var(--c-stone); text-align: right;">PRECISION</th>
                <th class="font-mono" style="padding: 12px 18px; font-size: 11px; color: var(--c-stone); text-align: right;">RECALL</th>
                <th class="font-mono" style="padding: 12px 18px; font-size: 11px; color: var(--c-stone); text-align: right;">F1 SCORE</th>
                <th class="font-mono" style="padding: 12px 18px; font-size: 11px; color: var(--c-stone); text-align: right;">ROC-AUC</th>
                <th class="font-mono" style="padding: 12px 18px; font-size: 11px; color: var(--c-stone); text-align: right;">RECALL PENALTY</th>
              </tr>
            </thead>
            <tbody id="ablation-tbody">
              <!-- Row 1: Full -->
              <tr id="row-full" style="border-bottom: 1px solid #EAE4D7; background: rgba(85, 112, 90, 0.08); font-weight: 600;">
                <td class="font-mono" style="padding: 14px 18px; color: var(--c-moss);">Full 4-Modality Ensemble</td>
                <td class="font-mono tabular-nums" style="padding: 14px 18px; text-align: right;">96.27%</td>
                <td class="font-mono tabular-nums" style="padding: 14px 18px; text-align: right;">97.93%</td>
                <td class="font-mono tabular-nums" style="padding: 14px 18px; text-align: right; color: var(--c-moss);">93.81%</td>
                <td class="font-mono tabular-nums" style="padding: 14px 18px; text-align: right;">0.9583</td>
                <td class="font-mono tabular-nums" style="padding: 14px 18px; text-align: right;">0.9949</td>
                <td class="font-mono tabular-nums" style="padding: 14px 18px; text-align: right; color: var(--c-moss);">Baseline</td>
              </tr>
              <!-- Row 2: Drop URL -->
              <tr id="row-drop_url" style="border-bottom: 1px solid #EAE4D7;">
                <td class="font-mono" style="padding: 12px 18px; color: var(--c-ink);">Ensemble without URL</td>
                <td class="font-mono tabular-nums" style="padding: 12px 18px; text-align: right;">94.82%</td>
                <td class="font-mono tabular-nums" style="padding: 12px 18px; text-align: right;">96.14%</td>
                <td class="font-mono tabular-nums" style="padding: 12px 18px; text-align: right; color: var(--c-oxide);">90.48%</td>
                <td class="font-mono tabular-nums" style="padding: 12px 18px; text-align: right;">0.9322</td>
                <td class="font-mono tabular-nums" style="padding: 12px 18px; text-align: right;">0.9882</td>
                <td class="font-mono tabular-nums" style="padding: 12px 18px; text-align: right; color: var(--c-oxide); font-weight: 600;">-3.33%</td>
              </tr>
              <!-- Row 3: Drop DOM -->
              <tr id="row-drop_dom" style="border-bottom: 1px solid #EAE4D7;">
                <td class="font-mono" style="padding: 12px 18px; color: var(--c-ink);">Ensemble without DOM</td>
                <td class="font-mono tabular-nums" style="padding: 12px 18px; text-align: right;">95.11%</td>
                <td class="font-mono tabular-nums" style="padding: 12px 18px; text-align: right;">96.55%</td>
                <td class="font-mono tabular-nums" style="padding: 12px 18px; text-align: right; color: var(--c-oxide);">91.83%</td>
                <td class="font-mono tabular-nums" style="padding: 12px 18px; text-align: right;">0.9413</td>
                <td class="font-mono tabular-nums" style="padding: 12px 18px; text-align: right;">0.9895</td>
                <td class="font-mono tabular-nums" style="padding: 12px 18px; text-align: right; color: var(--c-oxide); font-weight: 600;">-1.98%</td>
              </tr>
              <!-- Row 4: Drop Vision -->
              <tr id="row-drop_vision">
                <td class="font-mono" style="padding: 12px 18px; color: var(--c-ink);">Ensemble without Vision</td>
                <td class="font-mono tabular-nums" style="padding: 12px 18px; text-align: right;">96.23%</td>
                <td class="font-mono tabular-nums" style="padding: 12px 18px; text-align: right;">97.89%</td>
                <td class="font-mono tabular-nums" style="padding: 12px 18px; text-align: right; color: var(--c-stone);">93.66%</td>
                <td class="font-mono tabular-nums" style="padding: 12px 18px; text-align: right;">0.9573</td>
                <td class="font-mono tabular-nums" style="padding: 12px 18px; text-align: right;">0.9945</td>
                <td class="font-mono tabular-nums" style="padding: 12px 18px; text-align: right; color: var(--c-stone); font-weight: 600;">-0.15%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bottom Findings Strip -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; border-top: 1px solid rgba(42, 41, 38, 0.15); padding-top: 16px;">
        <div style="border-left: 2px solid var(--c-oxide); padding-left: 16px;">
          <span class="font-mono" style="font-size: 12px; color: var(--c-stone);">URL CRITICALITY</span>
          <div class="font-mono tabular-nums" style="font-size: 20px; color: var(--c-oxide); font-weight: 600; margin-top: 2px;">-3.33% Recall</div>
          <p style="font-size: 13px; color: var(--c-graphite); margin: 2px 0 0 0;">Dropping URL induces the highest single recall collapse.</p>
        </div>
        <div style="border-left: 2px solid var(--c-slate); padding-left: 16px;">
          <span class="font-mono" style="font-size: 12px; color: var(--c-stone);">DOM ROBUSTNESS</span>
          <div class="font-mono tabular-nums" style="font-size: 20px; color: var(--c-slate); font-weight: 600; margin-top: 2px;">-1.98% Recall</div>
          <p style="font-size: 13px; color: var(--c-graphite); margin: 2px 0 0 0;">DOM tags eliminate deceptive styling mimics.</p>
        </div>
        <div style="border-left: 2px solid var(--c-moss); padding-left: 16px;">
          <span class="font-mono" style="font-size: 12px; color: var(--c-stone);">VISION FALLBACK</span>
          <div class="font-mono tabular-nums" style="font-size: 20px; color: var(--c-moss); font-weight: 600; margin-top: 2px;">96.23% Intact</div>
          <p style="font-size: 13px; color: var(--c-graphite); margin: 2px 0 0 0;">Zero-network fallback performs within 0.04% of full ensemble.</p>
        </div>
      </div>
    </div>
  `;

  // Button interactivity
  const btns = el.querySelectorAll<HTMLButtonElement>(".abl-btn");
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btns.forEach((b) => {
        b.style.background = "#EAE4D7";
        b.style.color = "var(--c-ink)";
      });
      btn.style.background = "var(--c-graphite)";
      btn.style.color = "#FFF";

      const key = btn.dataset.key;
      const rows = el.querySelectorAll("tbody tr");
      rows.forEach((r) => ((r as HTMLElement).style.opacity = "0.4"));
      const targetRow = el.querySelector<HTMLElement>(`#row-${key}`);
      if (targetRow) {
        targetRow.style.opacity = "1";
        gsap.fromTo(targetRow, { scale: 0.99 }, { scale: 1, duration: 0.3 });
      }
    });
  });

  return {
    index: 16,
    id: "scene-ablation-results",
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
      const rows = el.querySelectorAll<HTMLElement>("tbody tr");
      rows.forEach((r) => (r.style.opacity = "1"));

      if (step === 0) {
        gsap.to(el.querySelector("#row-full"), { backgroundColor: "rgba(85, 112, 90, 0.15)", duration: 0.3 });
      } else if (step === 1) {
        rows.forEach((r) => (r.style.opacity = "0.4"));
        const rUrl = el.querySelector<HTMLElement>("#row-drop_url");
        if (rUrl) {
          rUrl.style.opacity = "1";
          gsap.fromTo(rUrl, { scale: 0.99 }, { scale: 1, duration: 0.3 });
        }
      } else if (step === 2) {
        rows.forEach((r) => (r.style.opacity = "0.4"));
        const rDom = el.querySelector<HTMLElement>("#row-drop_dom");
        if (rDom) {
          rDom.style.opacity = "1";
          gsap.fromTo(rDom, { scale: 0.99 }, { scale: 1, duration: 0.3 });
        }
      } else if (step === 3) {
        rows.forEach((r) => (r.style.opacity = "0.4"));
        const rVis = el.querySelector<HTMLElement>("#row-drop_vision");
        if (rVis) {
          rVis.style.opacity = "1";
          gsap.fromTo(rVis, { scale: 0.99 }, { scale: 1, duration: 0.3 });
        }
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
