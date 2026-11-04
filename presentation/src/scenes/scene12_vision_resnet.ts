import { gsap } from "gsap";
import { SceneInstance } from "./types";

export function createScene12(): SceneInstance {
  const el = document.createElement("section");
  el.className = "scene-stage scene-light";
  el.id = "scene-vision-resnet";

  let activeTimeline: gsap.core.Timeline | null = null;

  el.innerHTML = `
    <header class="scene-header">
      <span class="scene-index">12</span>
      <span class="scene-category">12 · COMPUTER VISION · SPATIAL REPRESENTATIONS</span>
    </header>

    <div class="scene-content" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <span class="meta-label" style="color: var(--c-slate);">ResNet-18 (512-d) · 85.43% Accuracy</span>
        <h2 style="margin-top: 6px;">Visual Layout & ResNet-18 Embeddings</h2>
        <p class="lead subtle-text" style="max-width: 900px; margin-top: 8px; font-size: 21px;">
          Attack kits that bypass lexical and text filters via obfuscated scripts or image-based login boxes are caught by spatial layout pattern recognition.
        </p>
      </div>

      <!-- ConvNet Architecture Flow Diagram -->
      <div style="flex: 1; display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 24px 0;">
        <!-- Stage 1: Viewport Capture -->
        <div class="vision-stage" style="flex: 1; background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 18px; text-align: center; border-radius: 4px;">
          <span class="font-mono" style="font-size: 11px; color: var(--c-stone); display: block; margin-bottom: 8px;">INPUT TENSOR</span>
          <div style="width: 120px; height: 120px; margin: 0 auto 10px auto; background: #FFFFFF; border: 1px solid #D5CEBF; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px;">
            <div style="width: 60%; height: 8px; background: #DDD; margin-bottom: 6px;"></div>
            <div style="width: 80%; height: 18px; border: 1px solid #CCC; margin-bottom: 6px;"></div>
            <div style="width: 50%; height: 14px; background: var(--c-slate);"></div>
          </div>
          <div class="font-mono tabular-nums" style="font-size: 12px; font-weight: 600; color: var(--c-ink);">224 × 224 × 3</div>
          <div style="font-size: 12px; color: var(--c-graphite); margin-top: 2px;">Normalized Viewport</div>
        </div>

        <!-- Arrow -->
        <div class="font-mono" style="font-size: 18px; color: var(--c-stone);">→</div>

        <!-- Stage 2: Frozen Backbone Layers -->
        <div class="vision-stage" style="flex: 2; background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 18px; border-radius: 4px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">BACKBONE (FROZEN WEIGHTS)</span>
            <span class="font-mono" style="font-size: 11px; color: var(--c-moss); border: 1px solid var(--c-moss); padding: 1px 6px; border-radius: 2px;">NO OVERFITTING</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 10px;">
            <div style="background: #EAE4D7; padding: 8px 4px; text-align: center; border-radius: 2px;">
              <span class="font-mono" style="font-size: 10px; color: var(--c-stone); display: block;">LAYER 1</span>
              <span class="font-mono" style="font-size: 11px; font-weight: 600; color: var(--c-ink);">64 ch</span>
            </div>
            <div style="background: #EAE4D7; padding: 8px 4px; text-align: center; border-radius: 2px;">
              <span class="font-mono" style="font-size: 10px; color: var(--c-stone); display: block;">LAYER 2</span>
              <span class="font-mono" style="font-size: 11px; font-weight: 600; color: var(--c-ink);">128 ch</span>
            </div>
            <div style="background: #EAE4D7; padding: 8px 4px; text-align: center; border-radius: 2px;">
              <span class="font-mono" style="font-size: 10px; color: var(--c-stone); display: block;">LAYER 3</span>
              <span class="font-mono" style="font-size: 11px; font-weight: 600; color: var(--c-ink);">256 ch</span>
            </div>
            <div style="background: #EAE4D7; padding: 8px 4px; text-align: center; border-radius: 2px;">
              <span class="font-mono" style="font-size: 10px; color: var(--c-stone); display: block;">LAYER 4</span>
              <span class="font-mono" style="font-size: 11px; font-weight: 600; color: var(--c-ink);">512 ch</span>
            </div>
          </div>
          <div style="font-size: 12px; color: var(--c-graphite); text-align: center;">
            Residual skip connections retain low-level logo geometry while abstracting high-level spatial structure.
          </div>
        </div>

        <!-- Arrow -->
        <div class="font-mono" style="font-size: 18px; color: var(--c-stone);">→</div>

        <!-- Stage 3: Embedding & Linear Head -->
        <div class="vision-stage" style="flex: 1.2; background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 18px; border-radius: 4px;">
          <span class="font-mono" style="font-size: 11px; color: var(--c-stone); display: block; margin-bottom: 6px;">DENSE REPRESENTATION</span>
          <div class="font-mono" style="font-size: 15px; font-weight: 600; color: var(--c-ink); margin-bottom: 6px;">
            512-D Latent Vector
          </div>
          <div style="display: flex; gap: 3px; height: 32px; align-items: flex-end; margin-bottom: 10px;">
            ${Array.from({ length: 24 })
              .map((_, i) => `<div style="flex: 1; background: var(--c-slate); height: ${20 + (i % 5) * 12}%; opacity: 0.85;"></div>`)
              .join("")}
          </div>
          <div style="border-top: 1px solid #D5CEBF; padding-top: 6px; display: flex; justify-content: space-between;">
            <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">CLASSIFIER HEAD</span>
            <span class="font-mono tabular-nums" style="font-size: 12px; font-weight: 600; color: var(--c-moss);">Linear Logistic</span>
          </div>
        </div>
      </div>

      <!-- Bottom Evaluation Card Strip -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; border-top: 1px solid rgba(42, 41, 38, 0.15); padding-top: 16px;">
        <div style="border-left: 2px solid var(--c-slate); padding-left: 16px;">
          <span class="font-mono" style="font-size: 12px; color: var(--c-stone);">ROC-AUC</span>
          <div class="font-mono tabular-nums" style="font-size: 24px; color: var(--c-ink); font-weight: 600; margin-top: 2px;">0.9304</div>
          <p style="font-size: 13px; color: var(--c-graphite); margin: 2px 0 0 0;">Captures general visual similarity to standard login paradigms.</p>
        </div>
        <div style="border-left: 2px solid var(--c-slate); padding-left: 16px;">
          <span class="font-mono" style="font-size: 12px; color: var(--c-stone);">TEST ACCURACY</span>
          <div class="font-mono tabular-nums" style="font-size: 24px; color: var(--c-ink); font-weight: 600; margin-top: 2px;">85.43%</div>
          <p style="font-size: 13px; color: var(--c-graphite); margin: 2px 0 0 0;">Evaluated over 2,760 held-out test screenshots.</p>
        </div>
        <div style="border-left: 2px solid var(--c-brass); padding-left: 16px;">
          <span class="font-mono" style="font-size: 12px; color: var(--c-stone);">FUSION WEIGHT</span>
          <div class="font-mono tabular-nums" style="font-size: 24px; color: var(--c-brass); font-weight: 600; margin-top: 2px;">+1.2024 (9.74%)</div>
          <p style="font-size: 13px; color: var(--c-graphite); margin: 2px 0 0 0;">Discounted by meta-classifier due to domain shift vulnerability.</p>
        </div>
      </div>
    </div>
  `;

  return {
    index: 12,
    id: "scene-vision-resnet",
    element: el,

    enter(step: number) {
      activeTimeline = gsap.timeline();
      activeTimeline.from(el.querySelectorAll(".vision-stage"), {
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.5,
        ease: "power2.out",
      });
      this.stepTo?.(step);
    },

    stepTo(step: number) {
      const stages = el.querySelectorAll<HTMLElement>(".vision-stage");
      if (step === 0) {
        gsap.to(stages[0], { scale: 1.03, duration: 0.3 });
        gsap.to(stages[1], { scale: 1.0, duration: 0.3 });
      } else if (step === 1) {
        gsap.to(stages[0], { scale: 1.0, duration: 0.3 });
        gsap.to(stages[1], { scale: 1.03, duration: 0.3 });
        gsap.to(stages[2], { scale: 1.03, duration: 0.3 });
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
