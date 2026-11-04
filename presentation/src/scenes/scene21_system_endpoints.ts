import { gsap } from "gsap";
import { SceneInstance } from "./types";

export function createScene21(): SceneInstance {
  const el = document.createElement("section");
  el.className = "scene-stage scene-dark";
  el.id = "scene-system-endpoints";

  let activeTimeline: gsap.core.Timeline | null = null;

  el.innerHTML = `
    <header class="scene-header">
      <span class="scene-index">21</span>
      <span class="scene-category">21 · IMPLEMENTATION · SYSTEM ARCHITECTURE</span>
    </header>

    <div class="scene-content" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <span class="meta-label" style="color: var(--c-brass);">FastAPI · SSE Streaming · Manifest V3</span>
        <h2 style="margin-top: 6px;">System Architecture & API Endpoints</h2>
        <p class="lead subtle-text" style="max-width: 900px; margin-top: 8px; font-size: 21px;">
          Production deployment integrates a high-performance Python inference engine, reactive event streaming, and an edge browser client.
        </p>
      </div>

      <!-- Architecture & Endpoints Grid -->
      <div style="flex: 1; display: grid; grid-template-columns: 1fr 1.3fr; gap: 36px; align-items: center; padding: 18px 0;">
        <!-- Left: 3 Core Components -->
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div class="sys-comp" style="background: var(--c-ink-soft); border: 1px solid var(--c-graphite-border); padding: 18px; border-left: 3px solid var(--c-brass); border-radius: 3px;">
            <div class="font-mono" style="font-size: 11px; color: var(--c-brass); margin-bottom: 2px;">ENGINE</div>
            <div style="font-size: 16px; font-weight: 600; color: var(--c-bone);">FastAPI Microservice</div>
            <p class="subtle-text" style="font-size: 12px; margin: 4px 0 0 0;">
              Asynchronous Python engine hosting scikit-learn and PyTorch inference pipelines with SQLite persistent scan store.
            </p>
          </div>

          <div class="sys-comp" style="background: var(--c-ink-soft); border: 1px solid var(--c-graphite-border); padding: 18px; border-left: 3px solid var(--c-slate); border-radius: 3px;">
            <div class="font-mono" style="font-size: 11px; color: var(--c-slate); margin-bottom: 2px;">UI COCKPIT</div>
            <div style="font-size: 16px; font-weight: 600; color: var(--c-bone);">React 18 & Three.js Dashboard</div>
            <p class="subtle-text" style="font-size: 12px; margin: 4px 0 0 0;">
              Real-time 3D multimodal constellation, TreeSHAP explanation inspector, and forensic timeline replay scrubber.
            </p>
          </div>

          <div class="sys-comp" style="background: var(--c-ink-soft); border: 1px solid var(--c-graphite-border); padding: 18px; border-left: 3px solid var(--c-moss); border-radius: 3px;">
            <div class="font-mono" style="font-size: 11px; color: var(--c-moss); margin-bottom: 2px;">EDGE CLIENT</div>
            <div style="font-size: 16px; font-weight: 600; color: var(--c-bone);">Manifest V3 Browser Extension</div>
            <p class="subtle-text" style="font-size: 12px; margin: 4px 0 0 0;">
              Live tab auditor extracting DOM trees, capturing normalized viewports, and blocking malicious navigations.
            </p>
          </div>
        </div>

        <!-- Right: Exact API Endpoints & SSE Flow -->
        <div style="background: var(--c-ink-soft); border: 1px solid var(--c-graphite-border); padding: 22px; border-radius: 4px;">
          <div class="font-mono" style="font-size: 11px; color: var(--c-stone); text-transform: uppercase; margin-bottom: 10px;">
            REST & SSE ENDPOINT CONTRACTS
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <div style="background: var(--c-graphite); padding: 9px 12px; display: flex; justify-content: space-between; align-items: center; border-radius: 2px;">
              <div class="font-mono" style="font-size: 12px; color: var(--c-bone); font-weight: 600;">
                <span style="color: var(--c-brass);">GET</span> /predict/stream
              </div>
              <span class="font-mono" style="font-size: 10px; color: var(--c-stone);">SSE: url → html → text → vision → fusion</span>
            </div>

            <div style="background: var(--c-graphite); padding: 9px 12px; display: flex; justify-content: space-between; align-items: center; border-radius: 2px;">
              <div class="font-mono" style="font-size: 12px; color: var(--c-bone); font-weight: 600;">
                <span style="color: var(--c-moss);">POST</span> /predict
              </div>
              <span class="font-mono" style="font-size: 10px; color: var(--c-stone);">Synchronous scan + SHAP local attributions</span>
            </div>

            <div style="background: var(--c-graphite); padding: 9px 12px; display: flex; justify-content: space-between; align-items: center; border-radius: 2px;">
              <div class="font-mono" style="font-size: 12px; color: var(--c-bone); font-weight: 600;">
                <span style="color: var(--c-slate);">GET</span> /threshold-analysis
              </div>
              <span class="font-mono" style="font-size: 10px; color: var(--c-stone);">ROC/PR curves & 3 calibrated operating points</span>
            </div>

            <div style="background: var(--c-graphite); padding: 9px 12px; display: flex; justify-content: space-between; align-items: center; border-radius: 2px;">
              <div class="font-mono" style="font-size: 12px; color: var(--c-bone); font-weight: 600;">
                <span style="color: var(--c-slate);">GET</span> /model-info
              </div>
              <span class="font-mono" style="font-size: 10px; color: var(--c-stone);">Weights, intercept, domain shift data, global SHAP</span>
            </div>

            <div style="background: var(--c-graphite); padding: 9px 12px; display: flex; justify-content: space-between; align-items: center; border-radius: 2px;">
              <div class="font-mono" style="font-size: 12px; color: var(--c-bone); font-weight: 600;">
                <span style="color: var(--c-slate);">GET</span> /scans/{id}
              </div>
              <span class="font-mono" style="font-size: 10px; color: var(--c-stone);">Historical scan details & serialized replay payload</span>
            </div>
          </div>

          <!-- SSE Streaming Event Flow -->
          <div style="margin-top: 14px; border-top: 1px solid var(--c-graphite-border); padding-top: 10px;">
            <div class="font-mono" style="font-size: 10px; color: var(--c-brass); margin-bottom: 4px;">
              REAL-TIME SSE STAGES (PROGRESSIVE TELEMETRY)
            </div>
            <div class="font-mono" style="font-size: 11px; color: var(--c-stone);">
              1. url (2ms) → 2. fetch (50ms) → 3. html (15ms) → 4. text (25ms) → 5. vision (80ms) → 6. fusion (done)
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div style="border-top: 1px solid var(--c-graphite-border); padding-top: 14px; display: flex; justify-content: space-between; align-items: baseline;">
        <div style="font-size: 15px; color: var(--c-stone);">
          <strong style="color: var(--c-bone);">LOW-LATENCY STREAMING:</strong>
          Server-Sent Events eliminate blocking wait states, providing progressive UX for security operators.
        </div>
        <div class="font-mono" style="font-size: 13px; color: var(--c-stone);">
          SPACE / ARROW → STEP 3 OF 3
        </div>
      </div>
    </div>
  `;

  return {
    index: 21,
    id: "scene-system-endpoints",
    element: el,

    enter(step: number) {
      activeTimeline = gsap.timeline();
      activeTimeline.from(el.querySelectorAll(".sys-comp"), {
        opacity: 0,
        x: -20,
        stagger: 0.15,
        duration: 0.5,
        ease: "power2.out",
      });
      this.stepTo?.(step);
    },

    stepTo(step: number) {
      const comps = el.querySelectorAll<HTMLElement>(".sys-comp");
      if (step === 0) {
        comps.forEach((c) => (c.style.opacity = "1"));
      } else if (step === 1) {
        comps[0].style.opacity = "1";
        comps[1].style.opacity = "0.4";
        comps[2].style.opacity = "0.4";
      } else if (step === 2) {
        comps.forEach((c) => (c.style.opacity = "1"));
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
