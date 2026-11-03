import { gsap } from "gsap";
import { SceneInstance } from "./types";

export function createScene05(): SceneInstance {
  const el = document.createElement("section");
  el.className = "scene-stage scene-dark";
  el.id = "scene-url-anatomy";

  el.innerHTML = `
    <header class="scene-header">
      <span class="scene-index">05</span>
      <span class="scene-category">05 · FEATURE ENGINEERING · INFORMATION THEORY</span>
    </header>

    <div class="scene-content" style="display: flex; flex-direction: column; justify-content: space-between;">
      <!-- Title & Core Principle -->
      <div>
        <span class="meta-label" style="color: var(--c-brass);">Attack Vector Decomposition</span>
        <h2 style="margin-top: 6px; max-width: 950px;">URL Anatomy & The Right-to-Left Authority Rule</h2>
        <p class="lead subtle-text" style="max-width: 820px; margin-top: 10px; font-size: 22px;">
          Humans read left-to-right, falling for deceptive brand subdomains. DNS resolution inspects from the right. Phish360 extracts 16 quantitative signals in &lt;2ms without network calls.
        </p>
      </div>

      <!-- Interactive Anatomy Stage -->
      <div class="anatomy-stage" style="margin: 24px 0; background: var(--c-ink-soft); border: var(--stroke-hairline) solid var(--c-graphite-border); border-radius: 4px; padding: clamp(24px, 3vw, 44px); position: relative;">
        <!-- Right-to-Left Architectural Arrow (SVG) -->
        <div id="rtl-arrow-container" style="display: flex; justify-content: flex-end; align-items: center; gap: 12px; margin-bottom: 24px; opacity: 0.35; transition: opacity 0.4s ease;">
          <span class="font-mono" style="font-size: 13px; color: var(--c-brass); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">
            ← READ FROM THE RIGHT: The authoritative host is anchored immediately before the first single slash
          </span>
          <svg width="48" height="16" viewBox="0 0 48 16" fill="none" style="stroke: var(--c-brass); stroke-width: 2.5px;">
            <path d="M48 8H4M4 8L12 2M4 8L12 14" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>

        <!-- Segmented Interactive URL Blocks -->
        <div class="segments-row" style="display: flex; flex-wrap: wrap; gap: 8px; align-items: stretch;">
          <!-- 1. Protocol -->
          <div class="url-segment" data-segment="protocol" style="flex: 0 0 auto; background: #1A1915; border: 1.5px solid var(--c-graphite-border); border-radius: 4px; padding: 14px 18px; cursor: pointer; transition: all 0.3s var(--ease-out-expo);">
            <div class="font-mono" style="font-size: 24px; color: var(--c-bone); font-weight: 500;">https://</div>
            <div class="meta-label" style="color: var(--c-stone); margin-top: 8px;">01 · SCHEME</div>
            <div class="features-list" style="margin-top: 10px; font-family: var(--font-mono); font-size: 11px; color: var(--c-stone); line-height: 1.4;">
              <div>• has_https: 1</div>
              <div>• proto_relative: 0</div>
            </div>
          </div>

          <!-- 2. Subdomains -->
          <div class="url-segment segment-spoofed" data-segment="subdomain" style="flex: 1 1 240px; background: #1E1715; border: 1.5px solid rgba(140, 63, 50, 0.4); border-radius: 4px; padding: 14px 18px; cursor: pointer; transition: all 0.3s var(--ease-out-expo);">
            <div class="font-mono" style="font-size: 24px; color: var(--c-oxide); font-weight: 600;">account.security-update.</div>
            <div class="meta-label" style="color: var(--c-oxide); margin-top: 8px;">02 · SPOOFED SUBDOMAIN (LURE)</div>
            <div class="features-list" style="margin-top: 10px; font-family: var(--font-mono); font-size: 11px; color: var(--c-oxide); line-height: 1.4; opacity: 0.9;">
              <div>• num_subdomains: 2</div>
              <div>• subdomain_len: 23</div>
              <div>• hyphen_count: 1</div>
            </div>
          </div>

          <!-- 3. Real Registrar Domain -->
          <div class="url-segment segment-domain" data-segment="domain" style="flex: 1 1 200px; background: #1B1A14; border: 2px solid var(--c-brass); border-radius: 4px; padding: 14px 18px; cursor: pointer; transition: all 0.3s var(--ease-out-expo); box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
            <div class="font-mono" style="font-size: 24px; color: var(--c-brass); font-weight: 700;">example-bank</div>
            <div class="meta-label" style="color: var(--c-brass); margin-top: 8px;">03 · REGISTRAR ROOT (TRUE OWNER)</div>
            <div class="features-list" style="margin-top: 10px; font-family: var(--font-mono); font-size: 11px; color: var(--c-bone); line-height: 1.4;">
              <div>• domain_entropy: 3.085</div>
              <div>• domain_len: 12</div>
              <div>• brand_keyword: true</div>
            </div>
          </div>

          <!-- 4. TLD & Port -->
          <div class="url-segment" data-segment="tld" style="flex: 0 0 auto; background: #1A1915; border: 1.5px solid var(--c-graphite-border); border-radius: 4px; padding: 14px 18px; cursor: pointer; transition: all 0.3s var(--ease-out-expo);">
            <div class="font-mono" style="font-size: 24px; color: var(--c-bone); font-weight: 500;">.test:8080</div>
            <div class="meta-label" style="color: var(--c-stone); margin-top: 8px;">04 · TLD & PORT</div>
            <div class="features-list" style="margin-top: 10px; font-family: var(--font-mono); font-size: 11px; color: var(--c-stone); line-height: 1.4;">
              <div>• non_std_port: 1</div>
              <div>• is_ip_host: 0</div>
            </div>
          </div>

          <!-- 5. Path & Query -->
          <div class="url-segment" data-segment="path" style="flex: 1 1 260px; background: #16181B; border: 1.5px solid rgba(74, 92, 112, 0.4); border-radius: 4px; padding: 14px 18px; cursor: pointer; transition: all 0.3s var(--ease-out-expo);">
            <div class="font-mono" style="font-size: 24px; color: var(--c-bone); font-weight: 500;">/login/verification/?token=8f9a2b</div>
            <div class="meta-label" style="color: var(--c-slate); margin-top: 8px;">05 · PATH & QUERY TOKENS</div>
            <div class="features-list" style="margin-top: 10px; font-family: var(--font-mono); font-size: 11px; color: var(--c-slate); line-height: 1.4;">
              <div>• path_length: 20 · slashes: 3</div>
              <div>• url_entropy: 3.921</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quantitative Summary Footnote -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; border-top: var(--stroke-hairline) solid var(--c-graphite-border); padding-top: 18px;">
        <div>
          <span class="meta-label" style="color: var(--c-stone);">FEATURE DIMENSIONALITY</span>
          <div class="font-mono" style="font-size: 18px; color: var(--c-bone); margin-top: 2px;">16 Lexical & Entropy Features</div>
        </div>
        <div>
          <span class="meta-label" style="color: var(--c-stone);">STANDALONE CLASSIFIER</span>
          <div class="font-mono" style="font-size: 18px; color: var(--c-bone); margin-top: 2px;">Random Forest (100 Estimators)</div>
        </div>
        <div style="text-align: right;">
          <span class="meta-label" style="color: var(--c-brass);">FUSION COEFFICIENT</span>
          <div class="font-mono tabular" style="font-size: 18px; color: var(--c-brass); margin-top: 2px;">w_url = +3.5985 (29.1% share)</div>
        </div>
      </div>
    </div>
  `;

  return {
    index: 5,
    id: "scene-url-anatomy",
    element: el,

    enter: (step: number) => {
      const segments = el.querySelectorAll(".url-segment");
      const arrow = el.querySelector("#rtl-arrow-container");

      gsap.fromTo(
        segments,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: "power3.out" }
      );

      if (step >= 1 && arrow) {
        gsap.to(arrow, { opacity: 1, duration: 0.5 });
      }
    },

    stepTo: (step: number) => {
      const arrow = el.querySelector("#rtl-arrow-container");
      const rootDomain = el.querySelector(".segment-domain");
      const spoofed = el.querySelector(".segment-spoofed");

      if (step >= 1 && arrow) {
        gsap.to(arrow, { opacity: 1, duration: 0.5 });
        gsap.to(rootDomain, { scale: 1.04, y: -6, duration: 0.4, ease: "power3.out" });
      } else if (arrow) {
        gsap.to(arrow, { opacity: 0.35, duration: 0.4 });
        gsap.to(rootDomain, { scale: 1.0, y: 0, duration: 0.3 });
      }

      if (step >= 2 && spoofed) {
        gsap.to(spoofed, { y: -6, duration: 0.4, ease: "power3.out" });
      } else if (spoofed) {
        gsap.to(spoofed, { y: 0, duration: 0.3 });
      }
    },
  };
}
