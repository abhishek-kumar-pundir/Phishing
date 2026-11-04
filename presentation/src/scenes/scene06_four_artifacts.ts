import { gsap } from "gsap";
import { SceneInstance } from "./types";

export function createScene06(): SceneInstance {
  const el = document.createElement("section");
  el.className = "scene-stage scene-light";
  el.id = "scene-four-artifacts";

  let activeTimeline: gsap.core.Timeline | null = null;

  el.innerHTML = `
    <header class="scene-header">
      <span class="scene-index">06</span>
      <span class="scene-category">06 · MODALITY DECOMPOSITION · ORTHOGONAL OBSERVABILITY</span>
    </header>

    <div class="scene-content" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <span class="meta-label" style="color: var(--c-slate);">Four Distinct Artifacts</span>
        <h2 style="margin-top: 6px;">One Webpage, Four Independent Artifacts</h2>
        <p class="lead subtle-text" style="max-width: 900px; margin-top: 8px; font-size: 21px;">
          Rather than collapsing the page into a single fragile vector, Phish360 deconstructs every target into four decoupled analytical representations.
        </p>
      </div>

      <!-- 4 Artifact Cards Grid -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; flex: 1; align-items: stretch; padding: 24px 0;">
        <!-- Artifact 1: URL -->
        <div id="art-card-0" class="artifact-card" style="background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; border-radius: 4px;">
          <div>
            <div class="font-mono" style="font-size: 11px; color: var(--c-stone); margin-bottom: 6px;">ARTIFACT 01 · LEXICAL</div>
            <h3 style="font-family: var(--font-display); font-size: 24px; color: var(--c-ink); margin: 0 0 8px 0;">URL String</h3>
            <p style="font-size: 13px; color: var(--c-graphite); line-height: 1.4; margin: 0 0 14px 0;">
              Raw uniform resource locator parsed into hostname, path, params. Zero network requests needed.
            </p>
            <div style="background: #EAE4D7; border: 1px solid #D5CEBF; padding: 8px 10px; margin-bottom: 14px;">
              <span class="font-mono" style="font-size: 10px; color: var(--c-stone); display: block; margin-bottom: 2px;">RAW INPUT:</span>
              <div class="font-mono" style="font-size: 11px; color: var(--c-ink); word-break: break-all;">
                https://auth.sec-update.test/login?id=829
              </div>
            </div>
          </div>
          <div style="border-top: 1px solid #D5CEBF; padding-top: 10px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">FEATURES</span>
              <span class="font-mono tabular-nums" style="font-size: 12px; font-weight: 600; color: var(--c-ink);">16 Lexical</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">LATENCY</span>
              <span class="font-mono tabular-nums" style="font-size: 12px; font-weight: 600; color: var(--c-moss);">&lt; 2 ms</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">CLASSIFIER</span>
              <span class="font-mono" style="font-size: 12px; font-weight: 600; color: var(--c-slate);">Random Forest</span>
            </div>
          </div>
        </div>

        <!-- Artifact 2: DOM -->
        <div id="art-card-1" class="artifact-card" style="background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; border-radius: 4px;">
          <div>
            <div class="font-mono" style="font-size: 11px; color: var(--c-stone); margin-bottom: 6px;">ARTIFACT 02 · STRUCTURAL</div>
            <h3 style="font-family: var(--font-display); font-size: 24px; color: var(--c-ink); margin: 0 0 8px 0;">DOM Hierarchy</h3>
            <p style="font-size: 13px; color: var(--c-graphite); line-height: 1.4; margin: 0 0 14px 0;">
              Parsed HTML document tree analyzing forms, input types, external scripts, anchor destinations.
            </p>
            <div style="background: #EAE4D7; border: 1px solid #D5CEBF; padding: 8px 10px; margin-bottom: 14px;">
              <span class="font-mono" style="font-size: 10px; color: var(--c-stone); display: block; margin-bottom: 2px;">RAW INPUT:</span>
              <div class="font-mono" style="font-size: 11px; color: var(--c-ink); white-space: pre-line;">
                &lt;form action="http://..."&gt;
                &nbsp;&nbsp;&lt;input type="password"&gt;
              </div>
            </div>
          </div>
          <div style="border-top: 1px solid #D5CEBF; padding-top: 10px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">FEATURES</span>
              <span class="font-mono tabular-nums" style="font-size: 12px; font-weight: 600; color: var(--c-ink);">24 Structural</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">LATENCY</span>
              <span class="font-mono tabular-nums" style="font-size: 12px; font-weight: 600; color: var(--c-moss);">~15 ms</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">CLASSIFIER</span>
              <span class="font-mono" style="font-size: 12px; font-weight: 600; color: var(--c-slate);">Random Forest</span>
            </div>
          </div>
        </div>

        <!-- Artifact 3: Text -->
        <div id="art-card-2" class="artifact-card" style="background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; border-radius: 4px;">
          <div>
            <div class="font-mono" style="font-size: 11px; color: var(--c-stone); margin-bottom: 6px;">ARTIFACT 03 · SEMANTIC</div>
            <h3 style="font-family: var(--font-display); font-size: 24px; color: var(--c-ink); margin: 0 0 8px 0;">Visible Text</h3>
            <p style="font-size: 13px; color: var(--c-graphite); line-height: 1.4; margin: 0 0 14px 0;">
              Sanitized text corpus stripped of HTML tags, tokenized for psychological urgency and coercion triggers.
            </p>
            <div style="background: #EAE4D7; border: 1px solid #D5CEBF; padding: 8px 10px; margin-bottom: 14px;">
              <span class="font-mono" style="font-size: 10px; color: var(--c-stone); display: block; margin-bottom: 2px;">RAW INPUT:</span>
              <div class="font-mono" style="font-size: 11px; color: var(--c-ink);">
                "Your account is locked. Verify identity now..."
              </div>
            </div>
          </div>
          <div style="border-top: 1px solid #D5CEBF; padding-top: 10px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">FEATURES</span>
              <span class="font-mono tabular-nums" style="font-size: 12px; font-weight: 600; color: var(--c-ink);">TF-IDF (1-2 gram)</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">LATENCY</span>
              <span class="font-mono tabular-nums" style="font-size: 12px; font-weight: 600; color: var(--c-moss);">~25 ms</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">CLASSIFIER</span>
              <span class="font-mono" style="font-size: 12px; font-weight: 600; color: var(--c-slate);">Linear SGD</span>
            </div>
          </div>
        </div>

        <!-- Artifact 4: Vision -->
        <div id="art-card-3" class="artifact-card" style="background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 24px; display: flex; flex-direction: column; justify-content: space-between; border-radius: 4px;">
          <div>
            <div class="font-mono" style="font-size: 11px; color: var(--c-stone); margin-bottom: 6px;">ARTIFACT 04 · PICTORIAL</div>
            <h3 style="font-family: var(--font-display); font-size: 24px; color: var(--c-ink); margin: 0 0 8px 0;">Viewport Image</h3>
            <p style="font-size: 13px; color: var(--c-graphite); line-height: 1.4; margin: 0 0 14px 0;">
              224×224 normalized raster representation capturing spatial hierarchy, logos, and UI layout.
            </p>
            <div style="background: #EAE4D7; border: 1px solid #D5CEBF; padding: 10px; margin-bottom: 14px; display: flex; align-items: center; justify-content: center; height: 48px;">
              <span class="font-mono" style="font-size: 10px; color: var(--c-stone);">[ 224 × 224 × 3 RGB TENSOR ]</span>
            </div>
          </div>
          <div style="border-top: 1px solid #D5CEBF; padding-top: 10px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">EMBEDDING</span>
              <span class="font-mono tabular-nums" style="font-size: 12px; font-weight: 600; color: var(--c-ink);">512-d (ResNet-18)</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">LATENCY</span>
              <span class="font-mono tabular-nums" style="font-size: 12px; font-weight: 600; color: var(--c-stone);">~80 ms</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span class="font-mono" style="font-size: 11px; color: var(--c-stone);">CLASSIFIER</span>
              <span class="font-mono" style="font-size: 12px; font-weight: 600; color: var(--c-slate);">Linear Head</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div style="border-top: 1px solid rgba(42, 41, 38, 0.15); padding-top: 14px; display: flex; justify-content: space-between; align-items: baseline;">
        <div style="font-size: 15px; color: var(--c-graphite);">
          <strong style="color: var(--c-ink);">GRACEFUL DEGRADATION:</strong>
          If viewport rendering fails or times out, the ensemble recalculates without vision with minimal loss of accuracy.
        </div>
        <div class="font-mono" style="font-size: 13px; color: var(--c-stone);">
          SPACE / ARROW → ADVANCE ARTIFACT
        </div>
      </div>
    </div>
  `;

  return {
    index: 6,
    id: "scene-four-artifacts",
    element: el,

    enter(step: number) {
      activeTimeline = gsap.timeline();
      activeTimeline.from(el.querySelectorAll(".artifact-card"), {
        opacity: 0,
        y: 30,
        stagger: 0.12,
        duration: 0.5,
        ease: "power2.out",
      });
      this.stepTo?.(step);
    },

    stepTo(step: number) {
      const cards = el.querySelectorAll<HTMLElement>(".artifact-card");
      cards.forEach((card, idx) => {
        if (idx === step) {
          gsap.to(card, {
            scale: 1.03,
            borderColor: "var(--c-slate)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            duration: 0.3,
          });
        } else {
          gsap.to(card, {
            scale: 1.0,
            borderColor: "rgba(42, 41, 38, 0.2)",
            boxShadow: "none",
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
