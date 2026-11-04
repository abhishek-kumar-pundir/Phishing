import { gsap } from "gsap";
import { SceneInstance } from "./types";

export function createScene08(): SceneInstance {
  const el = document.createElement("section");
  el.className = "scene-stage scene-light";
  el.id = "scene-dataset-splits";

  let activeTimeline: gsap.core.Timeline | null = null;

  el.innerHTML = `
    <header class="scene-header">
      <span class="scene-index">08</span>
      <span class="scene-category">08 · EXPERIMENTAL RIGOR · DATASET INTEGRITY</span>
    </header>

    <div class="scene-content" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <span class="meta-label" style="color: var(--c-slate);">10,700 Total Samples</span>
        <h2 style="margin-top: 6px;">Dataset Integrity & Leakage Prevention</h2>
        <p class="lead subtle-text" style="max-width: 900px; margin-top: 8px; font-size: 21px;">
          Supervised evaluation is only meaningful when data leakage is strictly engineered out of the experimental protocol.
        </p>
      </div>

      <!-- Dataset Split Distribution Diagram -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 32px; padding: 20px 0;">
        <!-- Split Bar -->
        <div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span class="font-mono" style="font-size: 13px; color: var(--c-stone);">EMPIRICAL PARTITION DISTRIBUTION</span>
            <span class="font-mono tabular-nums" style="font-size: 13px; color: var(--c-ink); font-weight: 600;">10,700 WEBPAGES CRAWLED</span>
          </div>
          
          <div style="display: flex; height: 54px; width: 100%; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); overflow: hidden; background: #E8E2D4; border-radius: 4px;">
            <!-- Train Split (63.07%) -->
            <div id="split-train" style="width: 63.07%; background: var(--c-graphite); color: #FFF; display: flex; align-items: center; justify-content: center; padding: 0 16px;">
              <span class="font-mono tabular-nums" style="font-size: 14px; font-weight: 600;">TRAIN: 6,749 (63.1%)</span>
            </div>
            <!-- Val Split (11.13%) -->
            <div id="split-val" style="width: 11.13%; background: var(--c-slate); color: #FFF; display: flex; align-items: center; justify-content: center; padding: 0 8px;">
              <span class="font-mono tabular-nums" style="font-size: 12px; font-weight: 600;">VAL: 1,191</span>
            </div>
            <!-- Test Split (25.79%) -->
            <div id="split-test" style="width: 25.79%; background: #D5CEBF; color: var(--c-ink); display: flex; align-items: center; justify-content: center; padding: 0 16px; border-left: 3px solid var(--c-brass); position: relative;">
              <span class="font-mono tabular-nums" style="font-size: 14px; font-weight: 600;">TEST: 2,760 (25.8%)</span>
            </div>
          </div>
        </div>

        <!-- Protocol Pillars -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
          <!-- Pillar 1: Deduplication -->
          <div class="protocol-card" style="background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 24px; border-radius: 4px;">
            <div class="font-mono" style="font-size: 12px; color: var(--c-stone); margin-bottom: 6px;">PROTOCOL 01</div>
            <div style="font-size: 18px; font-weight: 600; color: var(--c-ink); margin-bottom: 8px;">Exact URL Stripping</div>
            <p style="font-size: 14px; color: var(--c-graphite); line-height: 1.5; margin: 0;">
              Raw URL strings and normalized canonical URLs were strictly hashed to eliminate repeated samples across all partitions.
            </p>
          </div>

          <!-- Pillar 2: Feature Isolation -->
          <div class="protocol-card" style="background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 24px; border-radius: 4px;">
            <div class="font-mono" style="font-size: 12px; color: var(--c-moss); margin-bottom: 6px;">PROTOCOL 02</div>
            <div style="font-size: 18px; font-weight: 600; color: var(--c-ink); margin-bottom: 8px;">Zero-Leakage Pipeline</div>
            <p style="font-size: 14px; color: var(--c-graphite); line-height: 1.5; margin: 0;">
              TF-IDF vectorizer vocabularies, standard scalers, and logistic thresholds fit exclusively on training data; never on test.
            </p>
          </div>

          <!-- Pillar 3: Test Split Breakdown -->
          <div class="protocol-card" style="background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 24px; border-radius: 4px;">
            <div class="font-mono" style="font-size: 12px; color: var(--c-brass); margin-bottom: 6px;">PROTOCOL 03</div>
            <div style="font-size: 18px; font-weight: 600; color: var(--c-ink); margin-bottom: 8px;">Balanced Verification</div>
            <p style="font-size: 14px; color: var(--c-graphite); line-height: 1.5; margin: 0;">
              Test set maintains 1,261 active phishing samples against 1,499 legitimate enterprise domains from the Tranco top list.
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom Audit Note -->
      <div style="border-top: 1px solid rgba(42, 41, 38, 0.15); padding-top: 14px; display: flex; justify-content: space-between; align-items: baseline;">
        <div style="font-size: 15px; color: var(--c-graphite);">
          <strong style="color: var(--c-ink);">HONEST LIMITATION NOTE:</strong>
          Exact URL deduplication was enforced. Multi-domain phishing kits reusing identical CSS templates were retained to simulate real campaigns.
        </div>
        <div class="font-mono" style="font-size: 13px; color: var(--c-stone);">
          SPACE / ARROW → ADVANCE SUBSTEP
        </div>
      </div>
    </div>
  `;

  return {
    index: 8,
    id: "scene-dataset-splits",
    element: el,

    enter(step: number) {
      activeTimeline = gsap.timeline();
      activeTimeline.from(el.querySelectorAll(".protocol-card"), {
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.5,
        ease: "power2.out",
      });
      this.stepTo?.(step);
    },

    stepTo(step: number) {
      const splitTest = el.querySelector<HTMLElement>("#split-test");
      const splitTrain = el.querySelector<HTMLElement>("#split-train");
      const splitVal = el.querySelector<HTMLElement>("#split-val");
      if (!splitTest || !splitTrain || !splitVal) return;

      if (step === 0) {
        gsap.to(splitTest, { scale: 1, duration: 0.3 });
      } else if (step === 1) {
        gsap.to([splitTrain, splitVal], { opacity: 0.6, duration: 0.3 });
        gsap.to(splitTest, { scale: 1.02, outline: "2px solid var(--c-brass)", duration: 0.3 });
      } else if (step === 2) {
        gsap.to([splitTrain, splitVal], { opacity: 1, duration: 0.3 });
        gsap.to(splitTest, { outline: "none", duration: 0.3 });
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
