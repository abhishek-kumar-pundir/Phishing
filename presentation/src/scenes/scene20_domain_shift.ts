import { gsap } from "gsap";
import { SceneInstance } from "./types";

export function createScene20(): SceneInstance {
  const el = document.createElement("section");
  el.className = "scene-stage scene-light";
  el.id = "scene-domain-shift";

  let activeTimeline: gsap.core.Timeline | null = null;

  el.innerHTML = `
    <header class="scene-header">
      <span class="scene-index">20</span>
      <span class="scene-category">20 · EMPIRICAL STRESS TESTING · DOMAIN SHIFT</span>
    </header>

    <div class="scene-content" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <span class="meta-label" style="color: var(--c-oxide);">600 Samples Stress-Tested</span>
        <h2 style="margin-top: 6px;">Domain Shift: Viewport vs. Offline Render</h2>
        <p class="lead subtle-text" style="max-width: 900px; margin-top: 8px; font-size: 21px;">
          When headless crawlers cannot load external CDN stylesheets, page appearances collapse. Standalone vision models fail catastrophically; multimodal fusion remains resilient.
        </p>
      </div>

      <!-- Split Visualizer & Data Matrix -->
      <div style="flex: 1; display: grid; grid-template-columns: 1.2fr 1fr; gap: 36px; align-items: center; padding: 18px 0;">
        <!-- Left: Side-by-side Viewport Comparison -->
        <div style="background: #FFFFFF; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 20px; border-radius: 4px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <!-- Condition A: Live Viewport -->
            <div style="border: 1px solid #D5CEBF; padding: 10px; background: #FDFDFD; border-radius: 2px;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-moss); font-weight: 600; display: block; margin-bottom: 6px;">
                LIVE EXTENSION CAPTURE
              </span>
              <div style="height: 160px; background: #F4EFE6; border: 1px solid #E8E2D4; padding: 14px; display: flex; flex-direction: column; justify-content: space-between;">
                <div style="font-family: var(--font-display); font-size: 15px; color: #14130F;">Bank Portal SSO</div>
                <div style="height: 22px; background: #FFF; border: 1px solid #CCC;"></div>
                <div style="height: 22px; background: #FFF; border: 1px solid #CCC;"></div>
                <div style="height: 26px; background: var(--c-slate); color: #FFF; font-size: 11px; display: flex; align-items: center; justify-content: center;">
                  Sign In
                </div>
              </div>
              <div class="font-mono" style="font-size: 11px; color: var(--c-stone); margin-top: 6px;">
                FPR: <span class="tabular-nums" style="color: var(--c-moss); font-weight: 600;">14.3%</span>
              </div>
            </div>

            <!-- Condition B: Headless Offline Render (No CSS) -->
            <div style="border: 1px solid var(--c-oxide); padding: 10px; background: #FFF5F5; border-radius: 2px;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-oxide); font-weight: 600; display: block; margin-bottom: 6px;">
                OFFLINE HEADLESS (NO CSS)
              </span>
              <div style="height: 160px; background: #FFFFFF; border: 1px solid #DDD; padding: 10px; font-family: serif; font-size: 11px; color: #000; line-height: 1.3;">
                <div style="border: 1px solid #999; display: inline-block; padding: 1px 3px; margin-bottom: 3px; font-size: 9px; color: #666;">
                  [Broken Image]
                </div>
                <div>Bank Portal SSO</div>
                <div style="margin-top: 4px;">Username: [_______]</div>
                <div>Password: [_______]</div>
                <div style="margin-top: 4px;">[Submit Query]</div>
              </div>
              <div class="font-mono" style="font-size: 11px; color: var(--c-stone); margin-top: 6px;">
                FPR: <span class="tabular-nums" style="color: var(--c-oxide); font-weight: 700;">82.7% (Surge!)</span>
              </div>
            </div>
          </div>

          <div class="font-mono" style="font-size: 11px; color: var(--c-stone); margin-top: 14px; text-align: center;">
            Unstyled serif fonts and broken asset frames mimic crude phishing kit layouts.
          </div>
        </div>

        <!-- Right: Empirical Stress Numbers -->
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <!-- Vision Drop Card -->
          <div style="background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 18px; border-left: 4px solid var(--c-oxide); border-radius: 4px;">
            <span class="font-mono" style="font-size: 11px; color: var(--c-oxide); font-weight: 600; text-transform: uppercase;">
              STANDALONE VISION DEGRADATION
            </span>
            <div class="font-mono tabular-nums" style="font-family: var(--font-display); font-size: 34px; color: var(--c-oxide); margin-top: 2px;">
              -26.34% Acc
            </div>
            <p style="font-size: 13px; color: var(--c-graphite); margin: 4px 0 0 0;">
              False positive rate surges by +68.34%. A standalone computer vision classifier is unsafe in offline crawler environments.
            </p>
          </div>

          <!-- Fusion Resilience Card -->
          <div style="background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 18px; border-left: 4px solid var(--c-moss); border-radius: 4px;">
            <span class="font-mono" style="font-size: 11px; color: var(--c-moss); font-weight: 600; text-transform: uppercase;">
              MULTIMODAL FUSION RESILIENCE
            </span>
            <div class="font-mono tabular-nums" style="font-family: var(--font-display); font-size: 34px; color: var(--c-moss); margin-top: 2px;">
              -0.16% Delta
            </div>
            <p style="font-size: 13px; color: var(--c-graphite); margin: 4px 0 0 0;">
              Flip rate at default threshold is only 0.17% (1 site out of 600). The meta-classifier learned to lean on DOM and Text channels.
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div style="border-top: 1px solid rgba(42, 41, 38, 0.15); padding-top: 14px; display: flex; justify-content: space-between; align-items: baseline;">
        <div style="font-size: 15px; color: var(--c-graphite);">
          <strong style="color: var(--c-ink);">SCIENTIFIC LESSON:</strong>
          Single-modality vision models are brittle to rendering environmental shift. Multimodal late-fusion provides mathematical insulation.
        </div>
        <div class="font-mono" style="font-size: 13px; color: var(--c-stone);">
          SPACE / ARROW → STEP 3 OF 3
        </div>
      </div>
    </div>
  `;

  return {
    index: 20,
    id: "scene-domain-shift",
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
      if (step === 0) {
        gsap.to(el.querySelector(".scene-content"), { opacity: 1, duration: 0.3 });
      } else if (step === 1) {
        gsap.fromTo(el.querySelectorAll(".font-mono.tabular-nums"), { scale: 0.96 }, { scale: 1, duration: 0.3 });
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
