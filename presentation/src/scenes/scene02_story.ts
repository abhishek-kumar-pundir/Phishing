import { gsap } from "gsap";
import { SceneInstance } from "./types";

export function createScene02(): SceneInstance {
  const el = document.createElement("section");
  el.className = "scene-stage scene-light";
  el.id = "scene-story";

  el.innerHTML = `
    <header class="scene-header">
      <span class="scene-index">02</span>
      <span class="scene-category">02 · MOTIVATION · THE ATTACK TRAJECTORY</span>
    </header>

    <div class="scene-content" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <span class="meta-label" style="color: var(--c-slate);">The User Journey</span>
        <h2 style="margin-top: 6px;">How an Attack Unfolds in 180 Seconds</h2>
        <p class="lead subtle-text" style="max-width: 820px; margin-top: 8px; font-size: 21px;">
          Phishing succeeds by manipulating trust, urgency, and visual familiarity. Step through the timeline to see where traditional defenses collapse.
        </p>
      </div>

      <!-- Interactive Story Canvas (Email -> Cloned Page -> Credential Exfiltration) -->
      <div style="margin: 16px 0; background: #E2DBD0; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); border-radius: 4px; padding: clamp(20px, 2.5vw, 36px); min-height: 400px; display: flex; align-items: center; justify-content: center; position: relative;">
        
        <!-- Step 0: The Urgent Phishing Email -->
        <div id="story-email" style="width: 100%; max-width: 640px; background: #EDE7DC; border: var(--stroke-hairline) solid rgba(42, 41, 38, 0.3); border-radius: 4px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.06);">
          <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(42, 41, 38, 0.15); padding-bottom: 12px; margin-bottom: 16px; font-family: var(--font-mono); font-size: 12px; color: var(--c-graphite);">
            <div><strong>FROM:</strong> security-alert@account-verification.test</div>
            <div><strong>SUBJECT:</strong> [URGENT] Account Access Suspended</div>
          </div>
          <p style="font-size: 16px; line-height: 1.5; margin: 0 0 16px 0; color: var(--c-ink);">
            Dear Customer, We detected an unauthorized sign-in attempt from an unrecognized IP address. To prevent permanent suspension, you must verify your identity immediately.
          </p>
          <div style="text-align: center; margin-top: 20px;">
            <div style="display: inline-block; background: var(--c-oxide); color: var(--c-bone); font-family: var(--font-mono); font-size: 13px; font-weight: 600; padding: 10px 20px; border-radius: 3px; cursor: pointer;">
              VERIFY YOUR ACCOUNT NOW →
            </div>
            <div style="font-family: var(--font-mono); font-size: 11px; color: var(--c-stone); margin-top: 8px;">
              Link: https://account.security-update.example-bank.test/login/
            </div>
          </div>
        </div>

        <!-- Step 1 & 2: SVG Cloned Login Page & The Exfiltration Arrow -->
        <div id="story-login" style="display: none; width: 100%; max-width: 820px; position: relative;">
          <svg viewBox="0 0 760 300" width="100%" height="auto" style="overflow: visible;">
            <!-- Browser Chrome Mockup -->
            <rect x="0" y="0" width="460" height="290" rx="6" fill="#F4F0E8" stroke="#2A2926" stroke-width="2" />
            <!-- Browser Address Bar -->
            <rect x="15" y="12" width="430" height="26" rx="3" fill="#E8E2D4" stroke="#8F897A" stroke-width="1" />
            <text x="25" y="29" font-family="IBM Plex Mono" font-size="10" fill="#8C3F32">https://account.security-update.example-bank.test/login/</text>

            <!-- Login Form Interior -->
            <text x="40" y="70" font-family="Fraunces" font-size="18" fill="#14130F" font-weight="600">Example Bank Portal</text>
            <text x="40" y="90" font-family="IBM Plex Sans" font-size="11" fill="#635F55">Sign in to your online corporate account</text>

            <!-- Input Fields -->
            <rect x="40" y="110" width="220" height="28" rx="2" fill="#FFFFFF" stroke="#8F897A" stroke-width="1.5" />
            <text x="48" y="128" font-family="IBM Plex Mono" font-size="11" fill="#14130F">user@enterprise.test</text>

            <rect x="40" y="150" width="220" height="28" rx="2" fill="#FFFFFF" stroke="#8F897A" stroke-width="1.5" />
            <text x="48" y="168" font-family="IBM Plex Mono" font-size="13" fill="#14130F">••••••••••••</text>

            <!-- Submit Button -->
            <rect x="40" y="195" width="220" height="32" rx="2" fill="#14130F" />
            <text x="110" y="215" font-family="IBM Plex Sans" font-size="12" fill="#E8E2D4" font-weight="600">Sign In</text>

            <!-- Disguised Authentic Look Indicator -->
            <g transform="translate(40, 245)">
              <rect width="220" height="22" fill="#55705A" rx="2" opacity="0.15" />
              <text x="10" y="15" font-family="IBM Plex Mono" font-size="10" fill="#55705A">SURFACE: VISUALLY AUTHENTIC</text>
            </g>

            <!-- The Exfiltration Red Dashed Arrow -->
            <g id="exfiltration-arrow" style="opacity: 0;">
              <!-- Curved path from form button to somewhere else box -->
              <path d="M 270 210 C 370 210, 430 140, 520 140" fill="none" stroke="#8C3F32" stroke-width="3" stroke-dasharray="6,4" stroke-linecap="round" />
              <polygon points="525,140 515,134 515,146" fill="#8C3F32" />

              <text x="320" y="180" font-family="IBM Plex Mono" font-size="11" fill="#8C3F32" font-weight="bold">
                POST form-data
              </text>
              <text x="320" y="195" font-family="IBM Plex Mono" font-size="9" fill="#8C3F32">
                External origin bypass
              </text>

              <!-- Box Labelled "Somewhere Else" -->
              <g transform="translate(530, 95)">
                <rect width="180" height="90" rx="4" fill="#14130F" stroke="#8C3F32" stroke-width="2.5" />
                <text x="15" y="30" font-family="IBM Plex Mono" font-size="11" fill="#8C3F32" font-weight="bold">DESTINATION</text>
                <text x="15" y="52" font-family="Fraunces" font-size="16" fill="#E8E2D4">"Somewhere Else"</text>
                <text x="15" y="72" font-family="IBM Plex Mono" font-size="9" fill="#8F897A">drop.attacker-infra.test</text>
              </g>
            </g>
          </svg>
        </div>
      </div>

      <!-- Footer Insight -->
      <div style="display: flex; justify-content: space-between; align-items: baseline; border-top: var(--stroke-hairline) solid rgba(42, 41, 38, 0.2); padding-top: 14px;">
        <span class="subtle-text" style="font-size: 15px;">
          The user sees an authentic login interface. The DOM reveals the credentials never reach the genuine bank.
        </span>
        <span class="font-mono tabular" style="font-size: 13px; color: var(--c-oxide); font-weight: 600;">
          STEP: USE RIGHT ARROW TO ADVANCE STORY
        </span>
      </div>
    </div>
  `;

  return {
    index: 2,
    id: "scene-story",
    element: el,

    enter: (step: number) => {
      const emailEl = el.querySelector("#story-email") as HTMLElement;
      const loginEl = el.querySelector("#story-login") as HTMLElement;
      const arrowEl = el.querySelector("#exfiltration-arrow") as SVGElement;

      if (step === 0) {
        emailEl.style.display = "block";
        loginEl.style.display = "none";
        gsap.fromTo(emailEl, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 });
      } else {
        emailEl.style.display = "none";
        loginEl.style.display = "block";
        if (step >= 2) {
          gsap.to(arrowEl, { opacity: 1, duration: 0.5 });
        }
      }
    },

    stepTo: (step: number) => {
      const emailEl = el.querySelector("#story-email") as HTMLElement;
      const loginEl = el.querySelector("#story-login") as HTMLElement;
      const arrowEl = el.querySelector("#exfiltration-arrow") as SVGElement;

      if (step === 0) {
        gsap.to(loginEl, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            loginEl.style.display = "none";
            emailEl.style.display = "block";
            gsap.fromTo(emailEl, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.4 });
          },
        });
      } else if (step === 1) {
        gsap.to(emailEl, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            emailEl.style.display = "none";
            loginEl.style.display = "block";
            gsap.fromTo(loginEl, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.4 });
            gsap.to(arrowEl, { opacity: 0, duration: 0.2 });
          },
        });
      } else if (step >= 2) {
        emailEl.style.display = "none";
        loginEl.style.display = "block";
        loginEl.style.opacity = "1";
        gsap.fromTo(arrowEl, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" });
      }
    },
  };
}

