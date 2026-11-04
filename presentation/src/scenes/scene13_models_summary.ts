import { gsap } from "gsap";
import { SceneInstance } from "./types";

export function createScene13(): SceneInstance {
  const el = document.createElement("section");
  el.className = "scene-stage scene-dark";
  el.id = "scene-four-models-summary";

  let activeTimeline: gsap.core.Timeline | null = null;

  el.innerHTML = `
    <header class="scene-header">
      <span class="scene-index">13</span>
      <span class="scene-category">13 · MODEL ARCHITECTURE · BASE SPECIALIST MATRIX</span>
    </header>

    <div class="scene-content" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <span class="meta-label" style="color: var(--c-brass);">Four Base Specialists</span>
        <h2 style="margin-top: 6px;">Model Ensemble Matrix</h2>
        <p class="lead subtle-text" style="max-width: 900px; margin-top: 8px; font-size: 21px;">
          Each modality is evaluated by an algorithm matched to its data geometry. All four produce independent, calibrated posterior probabilities.
        </p>
      </div>

      <!-- 4 Model Cards Grid -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; flex: 1; align-items: stretch; padding: 24px 0;">
        <!-- URL Model Card -->
        <div id="model-card-0" class="model-summary-card" style="background: var(--c-ink-soft); border: 1px solid var(--c-graphite-border); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; border-radius: 4px;">
          <div>
            <span class="font-mono" style="font-size: 11px; color: var(--c-stone); display: block; margin-bottom: 6px;">MODALITY 01</span>
            <h3 style="font-family: var(--font-display); font-size: 24px; color: var(--c-bone); margin: 0 0 10px 0;">URL Lexical</h3>
            <div class="font-mono" style="font-size: 13px; color: var(--c-brass); margin-bottom: 14px;">
              Random Forest (100 Trees)
            </div>
            <div class="subtle-text" style="font-size: 13px; line-height: 1.5;">
              Trained on 16 lexical and statistical signals: Shannon entropy, token depth, IP detection, vowel ratios.
            </div>
          </div>
          <div style="border-top: 1px solid var(--c-graphite-border); padding-top: 14px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">TEST ACC</span>
              <span class="font-mono tabular-nums" style="font-size: 13px; font-weight: 600; color: var(--c-bone);">80.76%</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">OUTPUT</span>
              <span class="font-mono tabular-nums" style="font-size: 13px; font-weight: 600; color: var(--c-brass);">P(url) ∈ [0,1]</span>
            </div>
          </div>
        </div>

        <!-- DOM Model Card -->
        <div id="model-card-1" class="model-summary-card" style="background: var(--c-ink-soft); border: 1px solid var(--c-graphite-border); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; border-radius: 4px;">
          <div>
            <span class="font-mono" style="font-size: 11px; color: var(--c-stone); display: block; margin-bottom: 6px;">MODALITY 02</span>
            <h3 style="font-family: var(--font-display); font-size: 24px; color: var(--c-bone); margin: 0 0 10px 0;">DOM Structural</h3>
            <div class="font-mono" style="font-size: 13px; color: var(--c-brass); margin-bottom: 14px;">
              Random Forest (100 Trees)
            </div>
            <div class="subtle-text" style="font-size: 13px; line-height: 1.5;">
              Trained on 24 document tree heuristics: cross-origin action ratios, password tags, iframe counts, null anchors.
            </div>
          </div>
          <div style="border-top: 1px solid var(--c-graphite-border); padding-top: 14px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">TEST ACC</span>
              <span class="font-mono tabular-nums" style="font-size: 13px; font-weight: 600; color: var(--c-bone);">94.42%</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">OUTPUT</span>
              <span class="font-mono tabular-nums" style="font-size: 13px; font-weight: 600; color: var(--c-brass);">P(dom) ∈ [0,1]</span>
            </div>
          </div>
        </div>

        <!-- Text Model Card -->
        <div id="model-card-2" class="model-summary-card" style="background: var(--c-ink-soft); border: 1px solid var(--c-graphite-border); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; border-radius: 4px;">
          <div>
            <span class="font-mono" style="font-size: 11px; color: var(--c-stone); display: block; margin-bottom: 6px;">MODALITY 03</span>
            <h3 style="font-family: var(--font-display); font-size: 24px; color: var(--c-bone); margin: 0 0 10px 0;">Text Semantic</h3>
            <div class="font-mono" style="font-size: 13px; color: var(--c-brass); margin-bottom: 14px;">
              Linear TF-IDF SGD
            </div>
            <div class="subtle-text" style="font-size: 13px; line-height: 1.5;">
              Trained on sublinear unigram/bigram term frequencies: urgency vocabulary, account suspension, legal anchors.
            </div>
          </div>
          <div style="border-top: 1px solid var(--c-graphite-border); padding-top: 14px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">TEST ACC</span>
              <span class="font-mono tabular-nums" style="font-size: 13px; font-weight: 600; color: var(--c-bone);">87.90%</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">OUTPUT</span>
              <span class="font-mono tabular-nums" style="font-size: 13px; font-weight: 600; color: var(--c-brass);">P(text) ∈ [0,1]</span>
            </div>
          </div>
        </div>

        <!-- Vision Model Card -->
        <div id="model-card-3" class="model-summary-card" style="background: var(--c-ink-soft); border: 1px solid var(--c-graphite-border); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; border-radius: 4px;">
          <div>
            <span class="font-mono" style="font-size: 11px; color: var(--c-stone); display: block; margin-bottom: 6px;">MODALITY 04</span>
            <h3 style="font-family: var(--font-display); font-size: 24px; color: var(--c-bone); margin: 0 0 10px 0;">Vision Layout</h3>
            <div class="font-mono" style="font-size: 13px; color: var(--c-brass); margin-bottom: 14px;">
              ResNet-18 (512-d) + Head
            </div>
            <div class="subtle-text" style="font-size: 13px; line-height: 1.5;">
              Trained on 512-d global average pool embeddings from frozen ResNet backbone: layout, input fields, logo locations.
            </div>
          </div>
          <div style="border-top: 1px solid var(--c-graphite-border); padding-top: 14px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">TEST ACC</span>
              <span class="font-mono tabular-nums" style="font-size: 13px; font-weight: 600; color: var(--c-bone);">85.43%</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">OUTPUT</span>
              <span class="font-mono tabular-nums" style="font-size: 13px; font-weight: 600; color: var(--c-brass);">P(vis) ∈ [0,1]</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div style="border-top: 1px solid var(--c-graphite-border); padding-top: 14px; display: flex; justify-content: space-between; align-items: baseline;">
        <div style="font-size: 15px; color: var(--c-stone);">
          <strong style="color: var(--c-bone);">LATE-FUSION PIPELINE:</strong>
          The four probabilities form the 4-dimensional input vector for the Meta-Estimator Logistic Regression.
        </div>
        <div class="font-mono" style="font-size: 13px; color: var(--c-stone);">
          SPACE / ARROW → STEP 4 OF 4
        </div>
      </div>
    </div>
  `;

  return {
    index: 13,
    id: "scene-four-models-summary",
    element: el,

    enter(step: number) {
      activeTimeline = gsap.timeline();
      activeTimeline.from(el.querySelectorAll(".model-summary-card"), {
        opacity: 0,
        y: 25,
        stagger: 0.12,
        duration: 0.5,
        ease: "power2.out",
      });
      this.stepTo?.(step);
    },

    stepTo(step: number) {
      const cards = el.querySelectorAll<HTMLElement>(".model-summary-card");
      cards.forEach((card, idx) => {
        if (idx === step) {
          gsap.to(card, {
            scale: 1.03,
            borderColor: "var(--c-brass)",
            duration: 0.3,
          });
        } else {
          gsap.to(card, {
            scale: 1.0,
            borderColor: "var(--c-graphite-border)",
            duration: 0.3,
          });
        }
      });
    },

    leave() {
      if (activeTimeline) {
        activeTimeline.kill();
        activeTimeline = null;
      }
    },
  };
}
