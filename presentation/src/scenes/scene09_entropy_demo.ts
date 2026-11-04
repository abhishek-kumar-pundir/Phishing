import { gsap } from "gsap";
import { SceneInstance } from "./types";

export function createScene09(): SceneInstance {
  const el = document.createElement("section");
  el.className = "scene-stage scene-dark";
  el.id = "scene-url-features";

  let activeTimeline: gsap.core.Timeline | null = null;

  function calculateEntropy(str: string): { entropy: number; freqs: Record<string, number>; len: number } {
    if (!str || str.length === 0) return { entropy: 0, freqs: {}, len: 0 };
    const len = str.length;
    const freqs: Record<string, number> = {};
    for (const ch of str) {
      freqs[ch] = (freqs[ch] || 0) + 1;
    }
    let entropy = 0;
    for (const ch in freqs) {
      const p = freqs[ch] / len;
      entropy -= p * Math.log2(p);
    }
    return { entropy, freqs, len };
  }

  el.innerHTML = `
    <header class="scene-header">
      <span class="scene-index">09</span>
      <span class="scene-category">09 · LEXICAL MODELING · INFORMATION THEORY ENGINE</span>
    </header>

    <div class="scene-content" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <span class="meta-label" style="color: var(--c-brass);">Live Information Theory Engine</span>
        <h2 style="margin-top: 6px;">URL Features & Live Shannon Entropy</h2>
        <p class="lead subtle-text" style="max-width: 900px; margin-top: 8px; font-size: 21px;">
          Domain Generation Algorithms (DGAs) and ephemeral lures exhibit high character randomness measurable via Shannon entropy: 
          <span class="font-mono" style="color: var(--c-bone);">H(X) = -Σ p(x) log₂ p(x)</span>.
        </p>
      </div>

      <!-- Interactive Calculator Body -->
      <div style="flex: 1; display: grid; grid-template-columns: 1fr 1fr; gap: 36px; align-items: center; padding: 18px 0;">
        <!-- Left: Interactive Input & Presets -->
        <div style="background: var(--c-ink-soft); border: 1px solid var(--c-graphite-border); padding: 24px; border-radius: 4px;">
          <div class="font-mono" style="font-size: 12px; color: var(--c-stone); margin-bottom: 10px;">
            TEST DOMAIN / URL INPUT (TYPE TO EVALUATE)
          </div>
          <input id="entropy-input" type="text" value="security-auth.examplebank-verify.test" style="width: 100%; background: var(--c-graphite); border: 1px solid var(--c-graphite-border); color: var(--c-bone); font-family: var(--font-mono); font-size: 15px; padding: 10px 14px; margin-bottom: 14px; outline: none; border-radius: 3px;" />

          <!-- Quick Presets -->
          <div style="display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap;">
            <button class="preset-btn" data-url="examplebank.test" style="background: var(--c-graphite); border: 1px solid var(--c-graphite-border); color: var(--c-bone); font-family: var(--font-mono); font-size: 12px; padding: 6px 12px; cursor: pointer; border-radius: 2px;">
              Clean: examplebank.test
            </button>
            <button class="preset-btn" data-url="security-auth.examplebank-verify.test" style="background: var(--c-graphite); border: 1px solid var(--c-graphite-border); color: var(--c-bone); font-family: var(--font-mono); font-size: 12px; padding: 6px 12px; cursor: pointer; border-radius: 2px;">
              Lure: security-auth...
            </button>
            <button class="preset-btn" data-url="xj89-4b1z0-m99.auth-gate.test" style="background: var(--c-graphite); border: 1px solid var(--c-graphite-border); color: var(--c-bone); font-family: var(--font-mono); font-size: 12px; padding: 6px 12px; cursor: pointer; border-radius: 2px;">
              DGA: xj89-4b1z0-m99...
            </button>
          </div>

          <!-- Other Lexical Features Extracted -->
          <div class="font-mono" style="font-size: 11px; color: var(--c-stone); margin-bottom: 8px;">
            PARALLEL LEXICAL SIGNALS EXTRACTED (16 TOTAL)
          </div>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
            <div style="background: var(--c-graphite); padding: 8px 12px; display: flex; justify-content: space-between; border-radius: 2px;">
              <span class="font-mono" style="font-size: 12px; color: var(--c-stone);">length</span>
              <span id="feat-len" class="font-mono tabular-nums" style="font-size: 12px; color: var(--c-bone); font-weight: 600;">38</span>
            </div>
            <div style="background: var(--c-graphite); padding: 8px 12px; display: flex; justify-content: space-between; border-radius: 2px;">
              <span class="font-mono" style="font-size: 12px; color: var(--c-stone);">subdomain_count</span>
              <span id="feat-sub" class="font-mono tabular-nums" style="font-size: 12px; color: var(--c-bone); font-weight: 600;">2</span>
            </div>
            <div style="background: var(--c-graphite); padding: 8px 12px; display: flex; justify-content: space-between; border-radius: 2px;">
              <span class="font-mono" style="font-size: 12px; color: var(--c-stone);">hyphen_count</span>
              <span id="feat-hyp" class="font-mono tabular-nums" style="font-size: 12px; color: var(--c-bone); font-weight: 600;">2</span>
            </div>
            <div style="background: var(--c-graphite); padding: 8px 12px; display: flex; justify-content: space-between; border-radius: 2px;">
              <span class="font-mono" style="font-size: 12px; color: var(--c-stone);">has_ip_host</span>
              <span id="feat-ip" class="font-mono" style="font-size: 12px; color: var(--c-moss); font-weight: 600;">0 (False)</span>
            </div>
          </div>
        </div>

        <!-- Right: Real-time Entropy Metric Display -->
        <div style="background: var(--c-ink-soft); border: 1px solid var(--c-graphite-border); padding: 28px; display: flex; flex-direction: column; justify-content: space-between; border-radius: 4px;">
          <div>
            <span class="font-mono" style="font-size: 13px; color: var(--c-brass); letter-spacing: 0.08em; text-transform: uppercase;">
              Calculated Metric
            </span>
            <div style="display: flex; align-items: baseline; gap: 12px; margin-top: 8px;">
              <div id="entropy-value" class="tabular-nums" style="font-family: var(--font-display); font-size: 88px; color: var(--c-brass); line-height: 1;">
                3.41
              </div>
              <span class="font-mono" style="font-size: 18px; color: var(--c-stone);">bits / char</span>
            </div>
            <div id="entropy-verdict" class="font-mono" style="font-size: 13px; margin-top: 10px; color: var(--c-oxide); font-weight: 600;">
              HIGH ENTROPY THRESHOLD EXCEEDED (&gt; 3.20)
            </div>
          </div>

          <!-- Character Probability Density Bars -->
          <div style="margin-top: 20px; border-top: 1px solid var(--c-graphite-border); padding-top: 14px;">
            <div class="font-mono" style="font-size: 11px; color: var(--c-stone); margin-bottom: 8px;">
              CHARACTER PROBABILITY DENSITY p(x)
            </div>
            <div id="char-freq-bar" style="display: flex; gap: 4px; height: 44px; align-items: flex-end; overflow-x: auto; padding-bottom: 4px;">
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div style="border-top: 1px solid var(--c-graphite-border); padding-top: 14px; display: flex; justify-content: space-between; align-items: baseline;">
        <div style="font-size: 15px; color: var(--c-stone);">
          <strong style="color: var(--c-bone);">INFERENCE SPEED:</strong>
          All 16 lexical signals including entropy calculate in &lt; 2.1 milliseconds in Python/Rust with zero network requests.
        </div>
        <div class="font-mono" style="font-size: 13px; color: var(--c-stone);">
          SPACE / ARROW → ADVANCE SUBSTEP
        </div>
      </div>
    </div>
  `;

  // Helper wiring
  const input = el.querySelector<HTMLInputElement>("#entropy-input");
  const entropyVal = el.querySelector<HTMLElement>("#entropy-value");
  const entropyVerdict = el.querySelector<HTMLElement>("#entropy-verdict");
  const freqBarContainer = el.querySelector<HTMLElement>("#char-freq-bar");
  const featLen = el.querySelector<HTMLElement>("#feat-len");
  const featSub = el.querySelector<HTMLElement>("#feat-sub");
  const featHyp = el.querySelector<HTMLElement>("#feat-hyp");

  function update(str: string) {
    if (!entropyVal || !entropyVerdict || !freqBarContainer) return;
    const { entropy, freqs, len } = calculateEntropy(str);
    entropyVal.textContent = entropy.toFixed(2);

    if (featLen) featLen.textContent = String(len);
    if (featSub) featSub.textContent = String(Math.max(0, (str.split(".").length - 2)));
    if (featHyp) featHyp.textContent = String((str.match(/-/g) || []).length);

    if (entropy > 3.4) {
      entropyVerdict.textContent = "SUSPICIOUS ENTROPY SURGE (> 3.40 bits/char)";
      entropyVerdict.style.color = "var(--c-oxide)";
    } else if (entropy > 2.9) {
      entropyVerdict.textContent = "MODERATE ENTROPY (Common brand lure range)";
      entropyVerdict.style.color = "var(--c-brass)";
    } else {
      entropyVerdict.textContent = "LOW NATURAL ENTROPY (Typical branded domain)";
      entropyVerdict.style.color = "var(--c-moss)";
    }

    freqBarContainer.innerHTML = "";
    const sortedChars = Object.keys(freqs).sort((a, b) => freqs[b] - freqs[a]).slice(0, 20);
    sortedChars.forEach((ch) => {
      const bar = document.createElement("div");
      const p = freqs[ch] / len;
      const h = Math.max(6, Math.round(p * 55));
      bar.style.width = "14px";
      bar.style.height = `${h}px`;
      bar.style.background = "var(--c-brass)";
      bar.style.opacity = "0.75";
      bar.title = `'${ch}': ${(p * 100).toFixed(1)}%`;
      freqBarContainer.appendChild(bar);
    });
  }

  if (input) {
    input.addEventListener("input", (e) => {
      update((e.target as HTMLInputElement).value);
    });
    update(input.value);
  }

  const presetBtns = el.querySelectorAll<HTMLButtonElement>(".preset-btn");
  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const val = btn.dataset.url || "";
      if (input) {
        input.value = val;
        update(val);
      }
    });
  });

  return {
    index: 9,
    id: "scene-url-features",
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
        if (input) input.value = "examplebank.test";
        input?.dispatchEvent(new Event("input"));
      } else if (step === 1) {
        if (input) input.value = "xj89-4b1z0-m99.auth-gate.test";
        input?.dispatchEvent(new Event("input"));
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
