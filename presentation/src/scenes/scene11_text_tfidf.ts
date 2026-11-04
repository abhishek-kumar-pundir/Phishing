import { gsap } from "gsap";
import { SceneInstance } from "./types";

export function createScene11(): SceneInstance {
  const el = document.createElement("section");
  el.className = "scene-stage scene-dark";
  el.id = "scene-text-tfidf";

  let activeTimeline: gsap.core.Timeline | null = null;

  el.innerHTML = `
    <header class="scene-header">
      <span class="scene-index">11</span>
      <span class="scene-category">11 · NATURAL LANGUAGE PROCESSING · TF-IDF LURES</span>
    </header>

    <div class="scene-content" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <span class="meta-label" style="color: var(--c-brass);">TF-IDF N-Gram Model · 96.87% Precision</span>
        <h2 style="margin-top: 6px;">Text Semantics & TF-IDF Lures</h2>
        <p class="lead subtle-text" style="max-width: 900px; margin-top: 8px; font-size: 21px;">
          Phishing text relies on social engineering urgency and mandatory credential verification. A sublinear TF-IDF linear classifier captures these semantic lures in 25ms.
        </p>
      </div>

      <!-- Vocabulary Constellation Display -->
      <div style="flex: 1; display: grid; grid-template-columns: 1.4fr 1fr; gap: 36px; align-items: center; padding: 20px 0;">
        <!-- Left: Handcrafted Semantic Matrix -->
        <div style="background: var(--c-ink-soft); border: 1px solid var(--c-graphite-border); padding: 24px; border-radius: 4px;">
          <div class="font-mono" style="font-size: 11px; color: var(--c-stone); margin-bottom: 16px; text-transform: uppercase;">
            Linear Model Feature Weights (Log-Odds Attribution)
          </div>

          <!-- Phishing Urgency Lures (Oxide) -->
          <div style="margin-bottom: 20px;">
            <div class="font-mono" style="font-size: 12px; color: var(--c-oxide); font-weight: 600; margin-bottom: 8px;">
              TOP ADVERSARIAL PHISHING N-GRAMS (+ WEIGHT)
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              <span class="token-phish font-mono tabular-nums" style="font-size: 17px; background: rgba(140, 63, 50, 0.15); border: 1px solid var(--c-oxide); color: var(--c-oxide); padding: 4px 10px; font-weight: 600; border-radius: 2px;">
                suspended (+2.61)
              </span>
              <span class="token-phish font-mono tabular-nums" style="font-size: 20px; background: rgba(140, 63, 50, 0.2); border: 1px solid var(--c-oxide); color: var(--c-oxide); padding: 5px 12px; font-weight: 700; border-radius: 2px;">
                verify account (+2.48)
              </span>
              <span class="token-phish font-mono tabular-nums" style="font-size: 16px; background: rgba(140, 63, 50, 0.12); border: 1px solid var(--c-oxide); color: var(--c-oxide); padding: 4px 8px; border-radius: 2px;">
                security alert (+2.35)
              </span>
              <span class="token-phish font-mono tabular-nums" style="font-size: 15px; background: rgba(140, 63, 50, 0.12); border: 1px solid var(--c-oxide); color: var(--c-oxide); padding: 4px 8px; border-radius: 2px;">
                unauthorized access (+2.19)
              </span>
              <span class="token-phish font-mono tabular-nums" style="font-size: 14px; background: rgba(140, 63, 50, 0.1); border: 1px solid var(--c-oxide); color: var(--c-oxide); padding: 4px 8px; border-radius: 2px;">
                billing update (+1.94)
              </span>
              <span class="token-phish font-mono tabular-nums" style="font-size: 13px; background: rgba(140, 63, 50, 0.1); border: 1px solid var(--c-oxide); color: var(--c-oxide); padding: 4px 8px; border-radius: 2px;">
                action required (+1.72)
              </span>
            </div>
          </div>

          <!-- Legitimate Anchors (Moss) -->
          <div>
            <div class="font-mono" style="font-size: 12px; color: var(--c-moss); font-weight: 600; margin-bottom: 8px;">
              TOP LEGITIMATE CORPORATE ANCHORS (- WEIGHT)
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              <span class="token-legit font-mono tabular-nums" style="font-size: 16px; background: rgba(85, 112, 90, 0.15); border: 1px solid var(--c-moss); color: var(--c-moss); padding: 4px 10px; font-weight: 600; border-radius: 2px;">
                rights reserved (-1.89)
              </span>
              <span class="token-legit font-mono tabular-nums" style="font-size: 15px; background: rgba(85, 112, 90, 0.12); border: 1px solid var(--c-moss); color: var(--c-moss); padding: 4px 8px; border-radius: 2px;">
                privacy policy (-1.65)
              </span>
              <span class="token-legit font-mono tabular-nums" style="font-size: 14px; background: rgba(85, 112, 90, 0.1); border: 1px solid var(--c-moss); color: var(--c-moss); padding: 4px 8px; border-radius: 2px;">
                investor relations (-1.42)
              </span>
              <span class="token-legit font-mono tabular-nums" style="font-size: 13px; background: rgba(85, 112, 90, 0.1); border: 1px solid var(--c-moss); color: var(--c-moss); padding: 4px 8px; border-radius: 2px;">
                careers (-1.27)
              </span>
            </div>
          </div>
        </div>

        <!-- Right: Performance Telemetry Card -->
        <div style="background: var(--c-ink-soft); border: 1px solid var(--c-graphite-border); padding: 28px; display: flex; flex-direction: column; justify-content: space-between; border-radius: 4px;">
          <div>
            <span class="font-mono" style="font-size: 12px; color: var(--c-stone); text-transform: uppercase;">
              Stand-alone Evaluation
            </span>
            <div style="margin-top: 12px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
              <div>
                <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">PRECISION</span>
                <div class="font-mono tabular-nums" style="font-family: var(--font-display); font-size: 38px; color: var(--c-bone); margin-top: 2px;">
                  96.87%
                </div>
              </div>
              <div>
                <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">RECALL</span>
                <div class="font-mono tabular-nums" style="font-family: var(--font-display); font-size: 38px; color: var(--c-bone); margin-top: 2px;">
                  75.97%
                </div>
              </div>
            </div>

            <p class="subtle-text" style="font-size: 14px; line-height: 1.5; margin: 16px 0 0 0;">
              When text triggers are detected, precision is exceptionally high (96.87%). However, phishing pages consisting solely of image maps yield low recall (75.97%), necessitating vision fusion.
            </p>
          </div>

          <div style="margin-top: 20px; border-top: 1px solid var(--c-graphite-border); padding-top: 14px;">
            <div class="font-mono" style="font-size: 12px; color: var(--c-brass); font-weight: 600;">
              FUSION CONTRIBUTION: 39.82% SHARE (+4.9169 WEIGHT)
            </div>
            <div class="subtle-text" style="font-size: 13px; margin-top: 4px;">
              Assigned the single highest positive coefficient in the final logistic meta-classifier.
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div style="border-top: 1px solid var(--c-graphite-border); padding-top: 14px; display: flex; justify-content: space-between; align-items: baseline;">
        <div style="font-size: 15px; color: var(--c-stone);">
          <strong style="color: var(--c-bone);">ARCHITECTURAL RATIONALE:</strong>
          Linear SGD on sublinear TF-IDF chosen over BERT to guarantee &lt; 25ms inference and minimal memory footprint on edge clients.
        </div>
        <div class="font-mono" style="font-size: 13px; color: var(--c-stone);">
          SPACE / ARROW → ADVANCE SUBSTEP
        </div>
      </div>
    </div>
  `;

  return {
    index: 11,
    id: "scene-text-tfidf",
    element: el,

    enter(step: number) {
      activeTimeline = gsap.timeline();
      activeTimeline.from(el.querySelectorAll(".token-phish, .token-legit"), {
        opacity: 0,
        scale: 0.8,
        stagger: 0.05,
        duration: 0.4,
        ease: "back.out(1.5)",
      });
      this.stepTo?.(step);
    },

    stepTo(step: number) {
      const phishTokens = el.querySelectorAll<HTMLElement>(".token-phish");
      const legitTokens = el.querySelectorAll<HTMLElement>(".token-legit");

      if (step === 0) {
        gsap.to([...phishTokens, ...legitTokens], { opacity: 1, duration: 0.3 });
      } else if (step === 1) {
        gsap.to(legitTokens, { opacity: 0.3, duration: 0.3 });
        gsap.to(phishTokens, { scale: 1.05, duration: 0.3, stagger: 0.04 });
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
