import { gsap } from "gsap";
import { SceneInstance } from "./types";

export function createScene04(): SceneInstance {
  const el = document.createElement("section");
  el.className = "scene-stage scene-light";
  el.id = "scene-real-vs-fake";

  let activeTimeline: gsap.core.Timeline | null = null;

  el.innerHTML = `
    <header class="scene-header">
      <span class="scene-index">04</span>
      <span class="scene-category">04 · ATTACK VECTORS · SIDE-BY-SIDE AUDIT</span>
    </header>

    <div class="scene-content" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <span class="meta-label" style="color: var(--c-slate);">Side-by-Side Verification</span>
        <h2 style="margin-top: 6px;">Surface Deception vs. Structural Reality</h2>
        <p class="lead subtle-text" style="max-width: 900px; margin-top: 8px; font-size: 21px;">
          To human eyes and unassisted vision, both interfaces appear identical. In the DOM and transport layer, their topologies are diametrically opposed.
        </p>
      </div>

      <!-- Comparative Split Layout -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; flex: 1; align-items: stretch; padding: 18px 0;">
        <!-- Authentic Left Card -->
        <div class="comparison-card" style="background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); border-top: 4px solid var(--c-moss); padding: 24px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span class="font-mono" style="font-size: 13px; font-weight: 600; color: var(--c-moss); letter-spacing: 0.08em;">
                AUTHENTIC REPOSITORY
              </span>
              <span class="font-mono" style="font-size: 11px; background: rgba(85, 112, 90, 0.15); color: var(--c-moss); padding: 2px 8px; border-radius: 2px;">
                GROUND TRUTH: LEGIT
              </span>
            </div>

            <!-- Simulated Chrome Address -->
            <div style="background: #E8E2D4; padding: 6px 12px; margin-bottom: 14px; border: 1px solid #D5CEBF; display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--c-moss);"></span>
              <span class="font-mono" style="font-size: 12px; color: var(--c-ink);">https://portal.examplebank.test/login</span>
            </div>

            <!-- Authentic Portal Preview -->
            <div style="background: #FFFFFF; border: 1px solid #DCD6C8; padding: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid #EEE; padding-bottom: 8px;">
                <div style="font-family: var(--font-display); font-size: 18px; font-weight: 600; color: #14130F;">EXAMPLE BANK</div>
                <div class="font-mono" style="font-size: 10px; color: #777;">SECURE SSO PORTAL</div>
              </div>
              <div style="font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #333;">Sign In to Your Workspace</div>
              <div style="height: 10px; width: 60px; background: #DDD; margin-bottom: 4px;"></div>
              <div style="height: 28px; border: 1px solid #CCC; background: #FAFAFA; margin-bottom: 10px;"></div>
              <div style="height: 10px; width: 80px; background: #DDD; margin-bottom: 4px;"></div>
              <div style="height: 28px; border: 1px solid #CCC; background: #FAFAFA; margin-bottom: 12px;"></div>
              <div style="height: 32px; background: var(--c-slate); color: #FFF; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600;">
                Continue
              </div>
            </div>
          </div>

          <!-- Structural Telemetry Overlay -->
          <div id="legit-telemetry" style="margin-top: 16px; border-top: 1px solid #DCD6C8; padding-top: 12px;">
            <div class="font-mono" style="font-size: 11px; color: var(--c-stone); text-transform: uppercase; margin-bottom: 6px;">
              Extracted Telemetry
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
              <div style="background: #EAE4D7; padding: 6px 10px;">
                <div class="font-mono" style="font-size: 10px; color: var(--c-stone);">FORM ACTION</div>
                <div class="font-mono" style="font-size: 12px; font-weight: 600; color: var(--c-moss);">/api/v1/auth (Relative)</div>
              </div>
              <div style="background: #EAE4D7; padding: 6px 10px;">
                <div class="font-mono" style="font-size: 10px; color: var(--c-stone);">INTERNAL LINKS</div>
                <div class="font-mono tabular-nums" style="font-size: 12px; font-weight: 600; color: var(--c-ink);">142 Navigable Targets</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Malicious Right Card -->
        <div class="comparison-card" style="background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); border-top: 4px solid var(--c-oxide); padding: 24px; display: flex; flex-direction: column; justify-content: space-between;">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span class="font-mono" style="font-size: 13px; font-weight: 600; color: var(--c-oxide); letter-spacing: 0.08em;">
                CLONED ADVERSARIAL REPLICA
              </span>
              <span class="font-mono" style="font-size: 11px; background: rgba(140, 63, 50, 0.15); color: var(--c-oxide); padding: 2px 8px; border-radius: 2px;">
                GROUND TRUTH: PHISHING
              </span>
            </div>

            <!-- Simulated Chrome Address -->
            <div style="background: #E8E2D4; padding: 6px 12px; margin-bottom: 14px; border: 1px solid #D5CEBF; display: flex; align-items: center; gap: 8px;">
              <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: var(--c-oxide);"></span>
              <span class="font-mono" style="font-size: 12px; color: var(--c-oxide); word-break: break-all;">
                https://sec-verify.examplebank.auth-flow.test/login
              </span>
            </div>

            <!-- Cloned Portal Preview -->
            <div style="background: #FFFFFF; border: 1px solid #DCD6C8; padding: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid #EEE; padding-bottom: 8px;">
                <div style="font-family: var(--font-display); font-size: 18px; font-weight: 600; color: #14130F;">EXAMPLE BANK</div>
                <div class="font-mono" style="font-size: 10px; color: #777;">SECURE SSO PORTAL</div>
              </div>
              <div style="font-size: 13px; font-weight: 600; margin-bottom: 6px; color: #333;">Sign In to Your Workspace</div>
              <div style="height: 10px; width: 60px; background: #DDD; margin-bottom: 4px;"></div>
              <div style="height: 28px; border: 1px solid #CCC; background: #FAFAFA; margin-bottom: 10px;"></div>
              <div style="height: 10px; width: 80px; background: #DDD; margin-bottom: 4px;"></div>
              <div style="height: 28px; border: 1px solid #CCC; background: #FAFAFA; margin-bottom: 12px;"></div>
              <div style="height: 32px; background: var(--c-slate); color: #FFF; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600;">
                Continue
              </div>
            </div>
          </div>

          <!-- Structural Discrepancy Overlay -->
          <div id="fake-telemetry" style="margin-top: 16px; border-top: 1px solid #DCD6C8; padding-top: 12px;">
            <div class="font-mono" style="font-size: 11px; color: var(--c-oxide); text-transform: uppercase; margin-bottom: 6px;">
              Structural Anomalies
            </div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
              <div style="background: rgba(140, 63, 50, 0.08); border: 1px solid var(--c-oxide); padding: 6px 10px;">
                <div class="font-mono" style="font-size: 10px; color: var(--c-oxide);">FORM ACTION</div>
                <div class="font-mono" style="font-size: 11px; font-weight: 600; color: var(--c-oxide); word-break: break-all;">
                  http://198.51.100.24/c.php
                </div>
              </div>
              <div style="background: rgba(140, 63, 50, 0.08); border: 1px solid var(--c-oxide); padding: 6px 10px;">
                <div class="font-mono" style="font-size: 10px; color: var(--c-oxide);">INTERNAL LINKS</div>
                <div class="font-mono tabular-nums" style="font-size: 12px; font-weight: 600; color: var(--c-oxide);">0 (8 Empty # Anchors)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Summary Bar -->
      <div style="border-top: 1px solid rgba(42, 41, 38, 0.15); padding-top: 14px; display: flex; justify-content: space-between; align-items: baseline;">
        <div style="font-size: 15px; color: var(--c-graphite);">
          <strong style="color: var(--c-ink);">KEY TAKEAWAY:</strong>
          Visual similarity is trivial to copy; synthesizing authentic enterprise DOM topography and link networks is operationally prohibitive.
        </div>
        <div class="font-mono" style="font-size: 13px; color: var(--c-stone);">
          SPACE / ARROW → ADVANCE SUBSTEP
        </div>
      </div>
    </div>
  `;

  return {
    index: 4,
    id: "scene-real-vs-fake",
    element: el,

    enter(step: number) {
      activeTimeline = gsap.timeline();
      activeTimeline.from(el.querySelectorAll(".comparison-card"), {
        opacity: 0,
        y: 25,
        stagger: 0.2,
        duration: 0.6,
        ease: "power2.out",
      });
      this.stepTo?.(step);
    },

    stepTo(step: number) {
      const legitTel = el.querySelector<HTMLElement>("#legit-telemetry");
      const fakeTel = el.querySelector<HTMLElement>("#fake-telemetry");
      if (!legitTel || !fakeTel) return;

      if (step === 0) {
        gsap.to([legitTel, fakeTel], { opacity: 0.35, duration: 0.3 });
      } else if (step === 1) {
        gsap.to([legitTel, fakeTel], { opacity: 1, duration: 0.4 });
      } else if (step === 2) {
        gsap.fromTo(
          fakeTel.querySelectorAll("div"),
          { scale: 0.95 },
          { scale: 1, stagger: 0.08, duration: 0.3, ease: "back.out(2)" }
        );
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
