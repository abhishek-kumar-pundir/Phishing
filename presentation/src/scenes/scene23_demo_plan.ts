import { gsap } from "gsap";
import { SceneInstance } from "./types";

export function createScene23(): SceneInstance {
  const el = document.createElement("section");
  el.className = "scene-stage scene-dark";
  el.id = "scene-demo-plan";

  let activeTimeline: gsap.core.Timeline | null = null;

  el.innerHTML = `
    <header class="scene-header">
      <span class="scene-index">23</span>
      <span class="scene-category">23 · DEMONSTRATION PLAN · TELEMETRY PROTOCOL</span>
    </header>

    <div class="scene-content" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <span class="meta-label" style="color: var(--c-brass);">Three Scenarios + Replay Failsafe</span>
        <h2 style="margin-top: 6px;">Live Demonstration & Telemetry Protocol</h2>
        <p class="lead subtle-text" style="max-width: 900px; margin-top: 8px; font-size: 21px;">
          To validate real-time inference during the defense, we prepared three live test scenarios alongside a local deterministic replay buffer.
        </p>
      </div>

      <!-- 3 Test Cases + Offline Fallback -->
      <div style="flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; align-items: stretch; padding: 24px 0;">
        <!-- Scenario 1: Clean -->
        <div class="demo-card" style="background: var(--c-ink-soft); border: 1px solid var(--c-graphite-border); padding: 22px; display: flex; flex-direction: column; justify-content: space-between; border-top: 3px solid var(--c-moss); border-radius: 4px;">
          <div>
            <span class="font-mono" style="font-size: 11px; color: var(--c-moss); font-weight: 600; display: block; margin-bottom: 6px;">
              SCENARIO 01 · CLEAN CONTROL
            </span>
            <h3 style="font-family: var(--font-display); font-size: 20px; color: var(--c-bone); margin: 0 0 8px 0;">
              Authentic University Portal
            </h3>
            <div class="font-mono" style="font-size: 11px; color: var(--c-stone); background: var(--c-graphite); padding: 6px 10px; margin-bottom: 12px; word-break: break-all; border-radius: 2px;">
              https://portal.examplebank.test
            </div>
            <p class="subtle-text" style="font-size: 13px; line-height: 1.5; margin: 0;">
              Demonstrates 140+ internal links, low Shannon entropy, clean text, and fast negative verdict (Risk &lt; 0.05).
            </p>
          </div>
          <div style="border-top: 1px solid var(--c-graphite-border); padding-top: 12px; margin-top: 14px;">
            <span class="font-mono" style="font-size: 10px; color: var(--c-stone); display: block;">EXPECTED VERDICT</span>
            <div class="font-mono tabular-nums" style="font-size: 15px; color: var(--c-moss); font-weight: 700; margin-top: 2px;">
              LEGITIMATE (P = 0.02)
            </div>
          </div>
        </div>

        <!-- Scenario 2: Active Phishing -->
        <div class="demo-card" style="background: var(--c-ink-soft); border: 1px solid var(--c-graphite-border); padding: 22px; display: flex; flex-direction: column; justify-content: space-between; border-top: 3px solid var(--c-oxide); border-radius: 4px;">
          <div>
            <span class="font-mono" style="font-size: 11px; color: var(--c-oxide); font-weight: 600; display: block; margin-bottom: 6px;">
              SCENARIO 02 · ZERO-DAY LURE
            </span>
            <h3 style="font-family: var(--font-display); font-size: 20px; color: var(--c-bone); margin: 0 0 8px 0;">
              Active Credential Replica
            </h3>
            <div class="font-mono" style="font-size: 11px; color: var(--c-oxide); background: var(--c-graphite); padding: 6px 10px; margin-bottom: 12px; word-break: break-all; border-radius: 2px;">
              https://sec-verify.examplebank.test
            </div>
            <p class="subtle-text" style="font-size: 13px; line-height: 1.5; margin: 0;">
              Visual clone with cross-origin POST action to external IP and urgent text triggers. Immediate auto-block (Risk &gt; 0.95).
            </p>
          </div>
          <div style="border-top: 1px solid var(--c-graphite-border); padding-top: 12px; margin-top: 14px;">
            <span class="font-mono" style="font-size: 10px; color: var(--c-stone); display: block;">EXPECTED VERDICT</span>
            <div class="font-mono tabular-nums" style="font-size: 15px; color: var(--c-oxide); font-weight: 700; margin-top: 2px;">
              PHISHING (P = 0.98)
            </div>
          </div>
        </div>

        <!-- Scenario 3: Review Band -->
        <div class="demo-card" style="background: var(--c-ink-soft); border: 1px solid var(--c-graphite-border); padding: 22px; display: flex; flex-direction: column; justify-content: space-between; border-top: 3px solid var(--c-brass); border-radius: 4px;">
          <div>
            <span class="font-mono" style="font-size: 11px; color: var(--c-brass); font-weight: 600; display: block; margin-bottom: 6px;">
              SCENARIO 03 · AMBIGUOUS EDGE
            </span>
            <h3 style="font-family: var(--font-display); font-size: 20px; color: var(--c-bone); margin: 0 0 8px 0;">
              Ambiguous Tracking Domain
            </h3>
            <div class="font-mono" style="font-size: 11px; color: var(--c-stone); background: var(--c-graphite); padding: 6px 10px; margin-bottom: 12px; word-break: break-all; border-radius: 2px;">
              https://track.flow-mail.test/redirect
            </div>
            <p class="subtle-text" style="font-size: 13px; line-height: 1.5; margin: 0;">
              Short body text and deep query path fall into the calibrated review band [0.35, 0.55], triggering human escalation.
            </p>
          </div>
          <div style="border-top: 1px solid var(--c-graphite-border); padding-top: 12px; margin-top: 14px;">
            <span class="font-mono" style="font-size: 10px; color: var(--c-stone); display: block;">EXPECTED VERDICT</span>
            <div class="font-mono tabular-nums" style="font-size: 15px; color: var(--c-brass); font-weight: 700; margin-top: 2px;">
              REVIEW BAND (P = 0.44)
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Offline Scrubber Assurance -->
      <div style="border-top: 1px solid var(--c-graphite-border); padding-top: 14px; display: flex; justify-content: space-between; align-items: baseline;">
        <div style="font-size: 15px; color: var(--c-stone);">
          <strong style="color: var(--c-brass);">OFFLINE REPLAY SCATTER FAILSAFE:</strong>
          If classroom Wi-Fi fluctuates, the SQLite forensic cache replays full feature tensors and TreeSHAP charts with 0% network dependence.
        </div>
        <div class="font-mono" style="font-size: 13px; color: var(--c-stone);">
          SPACE / ARROW → STEP 2 OF 2
        </div>
      </div>
    </div>
  `;

  return {
    index: 23,
    id: "scene-demo-plan",
    element: el,

    enter(step: number) {
      activeTimeline = gsap.timeline();
      activeTimeline.from(el.querySelectorAll(".demo-card"), {
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.5,
        ease: "power2.out",
      });
      this.stepTo?.(step);
    },

    stepTo(step: number) {
      const cards = el.querySelectorAll<HTMLElement>(".demo-card");
      if (step === 0) {
        cards.forEach((c) => (c.style.opacity = "1"));
      } else if (step === 1) {
        gsap.to(cards[2], { scale: 1.03, duration: 0.3, yoyo: true, repeat: 1 });
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
