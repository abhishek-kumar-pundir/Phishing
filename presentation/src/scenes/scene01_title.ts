import { gsap } from "gsap";
import { SceneInstance } from "./types";

export function createScene01(): SceneInstance {
  const el = document.createElement("section");
  el.className = "scene-stage scene-dark active";
  el.id = "scene-title";

  el.innerHTML = `
    <header class="scene-header">
      <span class="scene-index">01</span>
      <span class="scene-category">01 · PROJECT DEFENSE · SUPERVISED MACHINE LEARNING</span>
    </header>

    <div class="scene-content" style="justify-content: space-between;">
      <!-- Title Block with Masked Reveals -->
      <div style="margin-top: clamp(20px, 3vh, 48px);">
        <div style="overflow: hidden; padding-bottom: 8px;">
          <h1 class="title-main" style="font-size: clamp(80px, 9.5vw, 150px); line-height: 0.88; letter-spacing: -0.04em;">
            <span class="title-word" style="display: inline-block;">Phish360</span>
          </h1>
        </div>

        <div style="overflow: hidden; margin-top: 18px;">
          <p class="title-subtitle lead subtle-text" style="max-width: 820px; line-height: 1.35;">
            Multimodal detection of zero-day credential harvesting through late-fusion decision ensembles across URL, DOM, text, and visual representations.
          </p>
        </div>
      </div>

      <!-- Live Typing & Previewing URL Split Container -->
      <div class="url-preview-box" style="margin: clamp(24px, 3.5vh, 48px) 0; border: var(--stroke-hairline) solid var(--c-graphite-border); background: var(--c-ink-soft); border-radius: 4px; padding: clamp(20px, 2.4vw, 36px);">
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 16px;">
          <span class="meta-label" style="color: var(--c-brass);">Attack Surface Vector #1 · Lexical Input</span>
          <span class="font-mono" style="font-size: var(--text-micro); color: var(--c-stone);">PREVIEWING MORPHOLOGICAL DECOMPOSITION</span>
        </div>

        <!-- Terminal URL String -->
        <div class="url-display font-mono" style="font-size: clamp(22px, 2.2vw, 38px); line-height: 1.3; min-height: 52px; display: flex; align-items: center; flex-wrap: wrap;">
          <span id="typed-url-text" style="color: var(--c-bone); font-weight: 500;"></span>
          <span class="typing-cursor" style="display: inline-block; width: 3px; height: 1.1em; background: var(--c-brass); margin-left: 4px; animation: blink 1s step-end infinite;"></span>
        </div>

        <!-- Dissected Segments (Reveals on Step 1) -->
        <div id="url-segmented-preview" style="display: none; margin-top: 24px; padding-top: 20px; border-top: 1px dashed var(--c-graphite-border); grid-template-columns: repeat(4, 1fr); gap: 16px;">
          <div style="border-left: 2px solid var(--c-stone); padding-left: 12px;">
            <span class="meta-label" style="color: var(--c-stone);">01 · PROTOCOL</span>
            <div class="font-mono" style="font-size: 18px; color: var(--c-bone); margin-top: 4px;">https://</div>
          </div>
          <div style="border-left: 2px solid var(--c-oxide); padding-left: 12px;">
            <span class="meta-label" style="color: var(--c-oxide);">02 · SPOOFED SUBDOMAIN</span>
            <div class="font-mono" style="font-size: 18px; color: var(--c-bone); margin-top: 4px;">account.security-update.</div>
          </div>
          <div style="border-left: 2px solid var(--c-brass); padding-left: 12px;">
            <span class="meta-label" style="color: var(--c-brass);">03 · REGISTRAR ROOT</span>
            <div class="font-mono" style="font-size: 18px; color: var(--c-bone); margin-top: 4px;">example-bank.test</div>
          </div>
          <div style="border-left: 2px solid var(--c-slate); padding-left: 12px;">
            <span class="meta-label" style="color: var(--c-slate);">04 · CREDENTIAL PATH</span>
            <div class="font-mono" style="font-size: 18px; color: var(--c-bone); margin-top: 4px;">/login/verification/</div>
          </div>
        </div>
      </div>

      <!-- Footer Metadata Rail -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: var(--stroke-hairline) solid var(--c-graphite-border); padding-top: 16px;">
        <div>
          <span class="meta-label" style="color: var(--c-stone);">ACADEMIC DEFENSE</span>
          <div style="font-size: 16px; color: var(--c-bone); margin-top: 4px;">Supervised Learning Portfolio</div>
        </div>
        <div style="text-align: right;">
          <span class="meta-label" style="color: var(--c-stone);">HOLD-OUT BENCHMARK</span>
          <div class="font-mono tabular" style="font-size: 16px; color: var(--c-brass); margin-top: 4px;">2,760 TEST SAMPLES · F1: 0.9583</div>
        </div>
      </div>
    </div>
  `;

  // Animation timeline
  let tl: gsap.core.Timeline | null = null;
  const rawUrl = "https://account.security-update.example-bank.test/login/verification/";

  return {
    index: 1,
    id: "scene-title",
    element: el,

    enter: (step: number) => {
      tl?.kill();
      tl = gsap.timeline();

      // Masked title reveal
      tl.fromTo(
        el.querySelector(".title-word"),
        { y: "110%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 1.0, ease: "power3.out" }
      );

      tl.fromTo(
        el.querySelector(".title-subtitle"),
        { y: "40px", opacity: 0 },
        { y: "0px", opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.6"
      );

      // Typing animation
      const typedEl = el.querySelector("#typed-url-text") as HTMLElement;
      if (typedEl) {
        typedEl.textContent = "";
        let i = 0;
        const typeInterval = setInterval(() => {
          if (i < rawUrl.length) {
            typedEl.textContent += rawUrl[i];
            i++;
          } else {
            clearInterval(typeInterval);
          }
        }, 22);
      }

      if (step >= 1) {
        const segEl = el.querySelector("#url-segmented-preview") as HTMLElement;
        if (segEl) {
          segEl.style.display = "grid";
          gsap.fromTo(segEl, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 });
        }
      }
    },

    stepTo: (step: number) => {
      const segEl = el.querySelector("#url-segmented-preview") as HTMLElement;
      if (!segEl) return;

      if (step >= 1) {
        segEl.style.display = "grid";
        gsap.fromTo(segEl, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
      } else {
        gsap.to(segEl, { opacity: 0, y: 10, duration: 0.3, onComplete: () => (segEl.style.display = "none") });
      }
    },

    leave: () => {
      tl?.kill();
    },
  };
}

