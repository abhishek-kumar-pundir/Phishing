import { gsap } from "gsap";
import { SceneInstance } from "./types";

export function createScene22(): SceneInstance {
  const el = document.createElement("section");
  el.className = "scene-stage scene-light";
  el.id = "scene-limitations";

  let activeTimeline: gsap.core.Timeline | null = null;

  el.innerHTML = `
    <header class="scene-header">
      <span class="scene-index">22</span>
      <span class="scene-category">22 · CRITICAL REFLECTION · SCIENTIFIC LIMITATIONS</span>
    </header>

    <div class="scene-content" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <span class="meta-label" style="color: var(--c-oxide);">Academic Integrity</span>
        <h2 style="margin-top: 6px;">Honest Limitations & Future Work</h2>
        <p class="lead subtle-text" style="max-width: 900px; margin-top: 8px; font-size: 21px;">
          A credible defense acknowledges the structural boundaries of the study. No security model is infallible or immune to adversarial adaptation.
        </p>
      </div>

      <!-- 3 Limitations & Roadmap Columns -->
      <div style="flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; align-items: stretch; padding: 24px 0;">
        <!-- Limitation 1 -->
        <div class="lim-card" style="background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 22px; display: flex; flex-direction: column; justify-content: space-between; border-radius: 4px;">
          <div>
            <span class="font-mono" style="font-size: 11px; color: var(--c-oxide); font-weight: 600; display: block; margin-bottom: 6px;">LIMITATION 01</span>
            <h3 style="font-family: var(--font-display); font-size: 20px; color: var(--c-ink); margin: 0 0 8px 0;">
              Temporal Concept Drift
            </h3>
            <p style="font-size: 13px; color: var(--c-graphite); line-height: 1.5; margin: 0;">
              The training corpus was collected over a fixed seasonal time window. Phishing infrastructure and lure templates evolve rapidly; multi-year longitudinal drift was not systematically measured.
            </p>
          </div>
          <div style="border-top: 1px solid #D5CEBF; padding-top: 10px; margin-top: 14px;">
            <span class="font-mono" style="font-size: 10px; color: var(--c-stone); display: block; margin-bottom: 2px;">COUNTERMEASURE</span>
            <div style="font-size: 12px; color: var(--c-ink); font-weight: 500;">
              Active online learning with automated weekly retraining loops.
            </div>
          </div>
        </div>

        <!-- Limitation 2 -->
        <div class="lim-card" style="background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 22px; display: flex; flex-direction: column; justify-content: space-between; border-radius: 4px;">
          <div>
            <span class="font-mono" style="font-size: 11px; color: var(--c-oxide); font-weight: 600; display: block; margin-bottom: 6px;">LIMITATION 02</span>
            <h3 style="font-family: var(--font-display); font-size: 20px; color: var(--c-ink); margin: 0 0 8px 0;">
              Dynamic CAPTCHA Gateways
            </h3>
            <p style="font-size: 13px; color: var(--c-graphite); line-height: 1.5; margin: 0;">
              Adversaries increasingly hide credential forms behind Cloudflare Turnstile, interstitial bot challenges, or multi-step OTP prompts that automated headless crawlers cannot penetrate.
            </p>
          </div>
          <div style="border-top: 1px solid #D5CEBF; padding-top: 10px; margin-top: 14px;">
            <span class="font-mono" style="font-size: 10px; color: var(--c-stone); display: block; margin-bottom: 2px;">COUNTERMEASURE</span>
            <div style="font-size: 12px; color: var(--c-ink); font-weight: 500;">
              Extension-based in-session evaluation after human completes CAPTCHA.
            </div>
          </div>
        </div>

        <!-- Limitation 3 -->
        <div class="lim-card" style="background: #F4EFE6; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding: 22px; display: flex; flex-direction: column; justify-content: space-between; border-radius: 4px;">
          <div>
            <span class="font-mono" style="font-size: 11px; color: var(--c-oxide); font-weight: 600; display: block; margin-bottom: 6px;">LIMITATION 03</span>
            <h3 style="font-family: var(--font-display); font-size: 20px; color: var(--c-ink); margin: 0 0 8px 0;">
              SaaS Evasion & Fronting
            </h3>
            <p style="font-size: 13px; color: var(--c-graphite); line-height: 1.5; margin: 0;">
              Phishing forms hosted on legitimate enterprise ecosystems (e.g. Microsoft Forms, Google Forms, Notion) possess clean domain reputations, bypassing lexical URL heuristics.
            </p>
          </div>
          <div style="border-top: 1px solid #D5CEBF; padding-top: 10px; margin-top: 14px;">
            <span class="font-mono" style="font-size: 10px; color: var(--c-stone); display: block; margin-bottom: 2px;">COUNTERMEASURE</span>
            <div style="font-size: 12px; color: var(--c-ink); font-weight: 500;">
              Optical Character Recognition (OCR) and brand logo discrepancy matching.
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div style="border-top: 1px solid rgba(42, 41, 38, 0.15); padding-top: 14px; display: flex; justify-content: space-between; align-items: baseline;">
        <div style="font-size: 15px; color: var(--c-graphite);">
          <strong style="color: var(--c-ink);">RESEARCH ETHIC:</strong>
          Honesty about system failure modes is the prerequisite for building trustworthy security engineering.
        </div>
        <div class="font-mono" style="font-size: 13px; color: var(--c-stone);">
          SPACE / ARROW → STEP 3 OF 3
        </div>
      </div>
    </div>
  `;

  return {
    index: 22,
    id: "scene-limitations",
    element: el,

    enter(step: number) {
      activeTimeline = gsap.timeline();
      activeTimeline.from(el.querySelectorAll(".lim-card"), {
        opacity: 0,
        y: 20,
        stagger: 0.15,
        duration: 0.5,
        ease: "power2.out",
      });
      this.stepTo?.(step);
    },

    stepTo(step: number) {
      const cards = el.querySelectorAll<HTMLElement>(".lim-card");
      cards.forEach((c, i) => {
        if (i === step) {
          gsap.to(c, { scale: 1.03, borderColor: "var(--c-oxide)", duration: 0.3 });
        } else {
          gsap.to(c, { scale: 1.0, borderColor: "rgba(42, 41, 38, 0.2)", duration: 0.3 });
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
