import { gsap } from "gsap";
import { SceneInstance } from "./types";

export function createScene03(): SceneInstance {
  const el = document.createElement("section");
  el.className = "scene-stage scene-dark";
  el.id = "scene-blacklist-failure";

  let activeTimeline: gsap.core.Timeline | null = null;

  el.innerHTML = `
    <header class="scene-header">
      <span class="scene-index">03</span>
      <span class="scene-category">03 · THREAT LANDSCAPE · THE TEMPORAL RACE</span>
    </header>

    <div class="scene-content" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <span class="meta-label" style="color: var(--c-brass);">Empirical Measurement</span>
        <h2 style="margin-top: 6px;">The Temporal Failure of Blacklists</h2>
        <p class="lead subtle-text" style="max-width: 860px; margin-top: 8px; font-size: 21px;">
          Attackers register, exploit, and abandon domains inside an operational window invisible to reactive crawlers.
        </p>
      </div>

      <!-- Main SVG Timeline Graphic -->
      <div style="flex: 1; display: flex; flex-direction: column; justify-content: center; padding: 20px 0;">
        <svg id="timeline-svg" viewBox="0 0 1400 360" style="width: 100%; height: auto; overflow: visible;">
          <!-- Background Axis -->
          <line x1="100" y1="200" x2="1300" y2="200" stroke="#2A2926" stroke-width="2" />
          
          <!-- Ticks every 1 hour (0 to 12) -->
          ${Array.from({ length: 13 })
            .map((_, i) => {
              const x = 100 + i * 100;
              return `
                <line x1="${x}" y1="192" x2="${x}" y2="208" stroke="#3A3833" stroke-width="1.5" />
                <text x="${x}" y="234" fill="#8F897A" font-family="var(--font-mono)" font-size="13" text-anchor="middle">
                  +${i}h
                </text>
              `;
            })
            .join("")}

          <!-- Vulnerability Window (0h to 6h) Shaded Box -->
          <rect id="vuln-window" x="100" y="70" width="600" height="120" fill="#8C3F32" fill-opacity="0.08" stroke="#8C3F32" stroke-dasharray="4 4" stroke-width="1" />
          <text id="vuln-label" x="400" y="100" fill="#8C3F32" font-family="var(--font-mono)" font-size="13" font-weight="600" text-anchor="middle" letter-spacing="0.08em">
            ACTIVE HARVESTING WINDOW (6 HOURS)
          </text>

          <!-- Node 0: Registration (Hour 0) -->
          <g id="node-0" transform="translate(100, 200)">
            <circle r="8" fill="#14130F" stroke="#E8E2D4" stroke-width="2.5" />
            <line x1="0" y1="-8" x2="0" y2="-60" stroke="#E8E2D4" stroke-width="1" stroke-dasharray="2 2" />
            <rect x="-80" y="-108" width="160" height="44" fill="#2A2926" stroke="#3A3833" rx="3" />
            <text x="0" y="-90" fill="#E8E2D4" font-family="var(--font-body)" font-size="13" font-weight="600" text-anchor="middle">Domain Registered</text>
            <text x="0" y="-74" fill="#8F897A" font-family="var(--font-mono)" font-size="11" text-anchor="middle">DNS TTL = 60s</text>
          </g>

          <!-- Node 1: Campaign Peak (Hours 1-3) -->
          <g id="node-1" transform="translate(300, 200)">
            <circle r="9" fill="#8C3F32" stroke="#14130F" stroke-width="2" />
            <line x1="0" y1="8" x2="0" y2="70" stroke="#8C3F32" stroke-width="1" stroke-dasharray="2 2" />
            <rect x="-95" y="74" width="190" height="54" fill="#2A2926" stroke="#8C3F32" rx="3" />
            <text x="0" y="94" fill="#E8E2D4" font-family="var(--font-body)" font-size="13" font-weight="600" text-anchor="middle">Phishing Campaign Peak</text>
            <text x="0" y="114" fill="#8C3F32" font-family="var(--font-mono)" font-size="12" text-anchor="middle">85% victims compromise</text>
          </g>

          <!-- Node 2: Abandoned (Hour 6) -->
          <g id="node-2" transform="translate(700, 200)">
            <circle r="7" fill="#14130F" stroke="#8F897A" stroke-width="2" />
            <line x1="0" y1="-8" x2="0" y2="-60" stroke="#8F897A" stroke-width="1" stroke-dasharray="2 2" />
            <rect x="-80" y="-108" width="160" height="44" fill="#2A2926" stroke="#3A3833" rx="3" />
            <text x="0" y="-90" fill="#8F897A" font-family="var(--font-body)" font-size="13" font-weight="500" text-anchor="middle">Site Abandoned</text>
            <text x="0" y="-74" fill="#5A564F" font-family="var(--font-mono)" font-size="11" text-anchor="middle">Infra torn down</text>
          </g>

          <!-- Node 3: Blacklist Crawler Arrives (Hour 9) -->
          <g id="node-3" transform="translate(1000, 200)">
            <circle r="9" fill="#4A5C70" stroke="#14130F" stroke-width="2" />
            <line x1="0" y1="8" x2="0" y2="70" stroke="#4A5C70" stroke-width="1" stroke-dasharray="2 2" />
            <rect x="-105" y="74" width="210" height="54" fill="#2A2926" stroke="#4A5C70" rx="3" />
            <text x="0" y="94" fill="#E8E2D4" font-family="var(--font-body)" font-size="13" font-weight="600" text-anchor="middle">Blacklist Crawler Flags</text>
            <text x="0" y="114" fill="#8F897A" font-family="var(--font-mono)" font-size="12" text-anchor="middle">Safe Browsing / PhishTank</text>
          </g>

          <!-- Lag Marker Bracket between 0h and 9h -->
          <g id="lag-marker" opacity="0">
            <line x1="100" y1="40" x2="1000" y2="40" stroke="#A88B50" stroke-width="1.5" />
            <line x1="100" y1="34" x2="100" y2="46" stroke="#A88B50" stroke-width="1.5" />
            <line x1="1000" y1="34" x2="1000" y2="46" stroke="#A88B50" stroke-width="1.5" />
            <text x="550" y="30" fill="#A88B50" font-family="var(--font-mono)" font-size="14" font-weight="600" text-anchor="middle">
              REACTIVE DETECTION LAG: ~9 HOURS (EMPTY ROOM DEFENSE)
            </text>
          </g>
        </svg>
      </div>

      <!-- Bottom Stat Strip -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; border-top: 1px solid var(--c-graphite-border); padding-top: 20px;">
        <div style="border-left: 2px solid var(--c-stone); padding-left: 16px;">
          <span class="font-mono" style="font-size: 13px; color: var(--c-stone); text-transform: uppercase;">Median Life Span</span>
          <div class="font-mono tabular-nums" style="font-family: var(--font-display); font-size: 38px; color: var(--c-bone); margin-top: 4px;">4.2h</div>
          <p class="subtle-text" style="font-size: 14px; margin: 4px 0 0 0;">Phishing domains are operational for less than half a business day.</p>
        </div>
        <div style="border-left: 2px solid var(--c-oxide); padding-left: 16px;">
          <span class="font-mono" style="font-size: 13px; color: var(--c-oxide); text-transform: uppercase;">Victim Compromise</span>
          <div class="font-mono tabular-nums" style="font-family: var(--font-display); font-size: 38px; color: var(--c-oxide); margin-top: 4px;">85%</div>
          <p class="subtle-text" style="font-size: 14px; margin: 4px 0 0 0;">Credentials are gathered in the first 2 hours post-launch.</p>
        </div>
        <div style="border-left: 2px solid var(--c-brass); padding-left: 16px;">
          <span class="font-mono" style="font-size: 13px; color: var(--c-brass); text-transform: uppercase;">Phish360 Latency</span>
          <div class="font-mono tabular-nums" style="font-family: var(--font-display); font-size: 38px; color: var(--c-brass); margin-top: 4px;">&lt; 150ms</div>
          <p class="subtle-text" style="font-size: 14px; margin: 4px 0 0 0;">Zero-day inference at victim's first request; zero external indexing wait.</p>
        </div>
      </div>
    </div>
  `;

  return {
    index: 3,
    id: "scene-blacklist-failure",
    element: el,

    enter(step: number) {
      activeTimeline = gsap.timeline();
      activeTimeline.from(el.querySelector(".scene-content"), {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
      });
      activeTimeline.from(
        el.querySelectorAll("#node-0, #node-1, #node-2, #node-3"),
        {
          opacity: 0,
          scale: 0.8,
          transformOrigin: "center center",
          stagger: 0.15,
          duration: 0.5,
          ease: "back.out(1.5)",
        },
        "-=0.3"
      );
      this.stepTo?.(step);
    },

    stepTo(step: number) {
      if (step === 0) {
        gsap.to(el.querySelector("#node-0"), { scale: 1.15, duration: 0.3, yoyo: true, repeat: 1 });
        gsap.to(el.querySelector("#vuln-window"), { fillOpacity: 0.05, duration: 0.3 });
        gsap.to(el.querySelector("#lag-marker"), { opacity: 0, duration: 0.3 });
      } else if (step === 1) {
        gsap.to(el.querySelector("#node-1"), { scale: 1.25, duration: 0.3, yoyo: true, repeat: 1 });
        gsap.to(el.querySelector("#vuln-window"), { fillOpacity: 0.16, duration: 0.4 });
        gsap.to(el.querySelector("#lag-marker"), { opacity: 0, duration: 0.3 });
      } else if (step === 2) {
        gsap.to(el.querySelector("#lag-marker"), { opacity: 1, duration: 0.5, ease: "power2.out" });
        gsap.to(el.querySelector("#node-3"), { scale: 1.25, duration: 0.3, yoyo: true, repeat: 1 });
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
