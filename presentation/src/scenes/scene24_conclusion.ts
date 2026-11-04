import { gsap } from "gsap";
import { SceneInstance } from "./types";

export function createScene24(): SceneInstance {
  const el = document.createElement("section");
  el.className = "scene-stage scene-light";
  el.id = "scene-conclusion";

  let activeTimeline: gsap.core.Timeline | null = null;

  el.innerHTML = `
    <header class="scene-header">
      <span class="scene-index">24</span>
      <span class="scene-category">24 · DEFENSE CONCLUSION · COMMITTEE Q&A</span>
    </header>

    <div class="scene-content" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <span class="meta-label" style="color: var(--c-moss);">Supervised Learning Project Defense</span>
        <h2 style="margin-top: 6px;">Key Contributions & Committee Q&A</h2>
        <p class="lead subtle-text" style="max-width: 900px; margin-top: 8px; font-size: 21px;">
          Supervised multimodal late-fusion delivers high discrimination, statistical reliability, and operational transparency against zero-day phishing.
        </p>
      </div>

      <!-- 4 Contributions Grid -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; flex: 1; align-items: stretch; padding: 20px 0;">
        <!-- Contribution 1 -->
        <div class="contrib-card" style="background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 22px; display: flex; flex-direction: column; justify-content: space-between; border-top: 4px solid var(--c-moss); border-radius: 4px;">
          <div>
            <span class="font-mono" style="font-size: 11px; color: var(--c-stone); margin-bottom: 6px;">CONTRIBUTION 01</span>
            <h3 style="font-family: var(--font-display); font-size: 20px; color: var(--c-ink); margin: 0 0 8px 0;">
              Orthogonal Multimodality
            </h3>
            <p style="font-size: 13px; color: var(--c-graphite); line-height: 1.5; margin: 0;">
              Fusing lexical, structural, semantic, and visual channels lifts test accuracy to <strong>96.27%</strong> and ROC-AUC to <strong>0.9949</strong>.
            </p>
          </div>
          <div class="font-mono tabular-nums" style="font-size: 20px; color: var(--c-moss); font-weight: 700; border-top: 1px solid #D5CEBF; padding-top: 10px;">
            +15.5% vs URL
          </div>
        </div>

        <!-- Contribution 2 -->
        <div class="contrib-card" style="background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 22px; display: flex; flex-direction: column; justify-content: space-between; border-top: 4px solid var(--c-slate); border-radius: 4px;">
          <div>
            <span class="font-mono" style="font-size: 11px; color: var(--c-stone); margin-bottom: 6px;">CONTRIBUTION 02</span>
            <h3 style="font-family: var(--font-display); font-size: 20px; color: var(--c-ink); margin: 0 0 8px 0;">
              Domain Shift Resilience
            </h3>
            <p style="font-size: 13px; color: var(--c-graphite); line-height: 1.5; margin: 0;">
              Late fusion mathematically insulates against rendering failures, preserving accuracy within 0.16% when vision degrades.
            </p>
          </div>
          <div class="font-mono tabular-nums" style="font-size: 20px; color: var(--c-slate); font-weight: 700; border-top: 1px solid #D5CEBF; padding-top: 10px;">
            0.17% Flip Rate
          </div>
        </div>

        <!-- Contribution 3 -->
        <div class="contrib-card" style="background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 22px; display: flex; flex-direction: column; justify-content: space-between; border-top: 4px solid var(--c-brass); border-radius: 4px;">
          <div>
            <span class="font-mono" style="font-size: 11px; color: var(--c-stone); margin-bottom: 6px;">CONTRIBUTION 03</span>
            <h3 style="font-family: var(--font-display); font-size: 20px; color: var(--c-ink); margin: 0 0 8px 0;">
              Calibrated Policy
            </h3>
            <p style="font-size: 13px; color: var(--c-graphite); line-height: 1.5; margin: 0;">
              Three named operating points (Balanced, High-Recall, High-Precision) plus review bands with verified 0.0400 ECE.
            </p>
          </div>
          <div class="font-mono tabular-nums" style="font-size: 20px; color: var(--c-brass); font-weight: 700; border-top: 1px solid #D5CEBF; padding-top: 10px;">
            0.00% FP at 0.90
          </div>
        </div>

        <!-- Contribution 4 -->
        <div class="contrib-card" style="background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 22px; display: flex; flex-direction: column; justify-content: space-between; border-top: 4px solid var(--c-ink); border-radius: 4px;">
          <div>
            <span class="font-mono" style="font-size: 11px; color: var(--c-stone); margin-bottom: 6px;">CONTRIBUTION 04</span>
            <h3 style="font-family: var(--font-display); font-size: 20px; color: var(--c-ink); margin: 0 0 8px 0;">
              Explainable Telemetry
            </h3>
            <p style="font-size: 13px; color: var(--c-graphite); line-height: 1.5; margin: 0;">
              Polynomial TreeSHAP explanations computed in under 15ms and streamed progressively over Server-Sent Events.
            </p>
          </div>
          <div class="font-mono tabular-nums" style="font-size: 20px; color: var(--c-ink); font-weight: 700; border-top: 1px solid #D5CEBF; padding-top: 10px;">
            &lt; 150ms End-to-End
          </div>
        </div>
      </div>

      <!-- Bottom Defense Sign-off / Q&A Prompt -->
      <div id="qa-card" style="background: #E8E2D4; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 20px 28px; display: flex; justify-content: space-between; align-items: center; border-radius: 4px;">
        <div>
          <span class="font-mono" style="font-size: 12px; color: var(--c-brass); font-weight: 600; text-transform: uppercase;">
            DEFENSE CONCLUDED
          </span>
          <div style="font-family: var(--font-display); font-size: 28px; color: var(--c-ink); margin-top: 2px;">
            Thank you for your consideration. The floor is open for Committee Questions.
          </div>
        </div>
        <div class="font-mono" style="font-size: 12px; color: var(--c-stone); text-align: right;">
          PRESS 'O' FOR 24-SCENE OVERVIEW<br/>
          PRESS 'N' FOR SPEAKER NOTES & VIVA Q&A
        </div>
      </div>
    </div>
  `;

  return {
    index: 24,
    id: "scene-conclusion",
    element: el,

    enter(step: number) {
      activeTimeline = gsap.timeline();
      activeTimeline.from(el.querySelectorAll(".contrib-card"), {
        opacity: 0,
        y: 20,
        stagger: 0.12,
        duration: 0.5,
        ease: "power2.out",
      });
      this.stepTo?.(step);
    },

    stepTo(step: number) {
      const cards = el.querySelectorAll<HTMLElement>(".contrib-card");
      if (step === 0) {
        cards.forEach((c) => (c.style.opacity = "1"));
      } else if (step === 1) {
        cards.forEach((c) => (c.style.opacity = "1"));
      } else if (step === 2) {
        gsap.to(el.querySelector("#qa-card"), { scale: 1.02, duration: 0.3, yoyo: true, repeat: 1 });
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
