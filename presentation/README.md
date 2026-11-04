# Phish360 Defense Presentation Website

An offline-first, scroll-driven, keyboard-controlled presentation delivered as a static web application for university Supervised Learning project defense.

---

## 1. Quick Start (100% Offline)

Ensure Node.js 18+ is installed.

```bash
# Navigate to presentation directory
cd presentation

# Install pinned dependencies (GSAP, Lenis, @fontsource fonts)
npm install

# Run local development server
npm run dev
```

Alternatively, to build and run the optimized production bundle:

```bash
npm run build
npm run preview
```

Open `http://localhost:4173` (or `http://localhost:5173`) in any modern browser (Chrome, Edge, Firefox, Safari).

---

## 2. Presenter Controls & Keyboard Shortcuts

| Key | Action | Description |
|---|---|---|
| **Right Arrow** / **Space** / **PageDown** | Advance Substep / Scene | Advances animation state inside scene; advances to next scene at boundary |
| **Left Arrow** / **PageUp** | Previous Substep / Scene | Steps backward through animations or returns to previous scene |
| **N** | Toggle Speaker Notes | Opens docked drawer or launches synchronized pop-out window |
| **O** | 24-Scene Overview | Opens full 24-scene grid matrix with instant keyboard jump |
| **F** | Toggle Fullscreen | Maximizes viewport for projector display |
| **B** | Toggle Blackout | Blanks the screen to focus audience attention on the speaker |
| **P** | Projector Mode | Boosts stroke weight and contrast for dim auditorium projectors |
| **Home** / **End** | First / Last Scene | Jumps directly to Scene 01 or Scene 24 |

---

## 3. Synchronized Dual-Window Presenter Mode

To run in dual-monitor mode (projector displaying slides, laptop displaying notes and timer):
1. Open `http://localhost:5173/` on the projector screen.
2. Open `http://localhost:5173/notes.html` on your laptop screen.
3. Both windows automatically sync in real-time via `BroadcastChannel` with zero network overhead.

---

## 4. Visual Design System

- **Palette**: Near-black neutral background with strict semantic accents:
  - `Ink #14130F` & `Graphite #2A2926`: Dark backgrounds and structural borders
  - `Bone #E8E2D4` & `Stone #8F897A`: Typography and secondary labels
  - `Oxide #8C3F32`: Phishing and danger states only
  - `Moss #55705A`: Legitimate and verified authentic states only
  - `Slate #4A5C70`: Data curves and engineering metrics
  - `Brass #A88B50`: Late-fusion meta-estimator and key highlights
- **Typography**:
  - `Fraunces`: Colossal display titles with tight optical kerning
  - `IBM Plex Sans`: Crisp body copy (≥28px at 1080p)
  - `IBM Plex Mono`: Code, URLs, and tabular statistics (`tabular-nums`)
- **Anti-Template Philosophy**:
  - Zero stock icons or generic emojis
  - Zero glassmorphism blur or neon glow blobs
  - Handcrafted SVG diagrams, interactive Shannon entropy calculators, live DOM tree scanners, and real TreeSHAP attribution plots.

---

## 5. Verified Project Metrics (Source of Truth)

All metrics are grounded strictly in held-out test evaluations (`artifacts/metrics/`, `models/`):
- **Test Samples**: 2,760 independent held-out sites (1,261 Phishing, 1,499 Legitimate)
- **Validation Samples**: 1,191 sites | **Training Samples**: 6,749 sites
- **Standalone Model Accuracy**:
  - URL (Random Forest): 80.76% (ROC-AUC: 0.9053)
  - Vision (ResNet-18 512-d): 85.43% (ROC-AUC: 0.9304)
  - Text (Linear TF-IDF): 87.90% (ROC-AUC: 0.9705)
  - DOM (Random Forest): 94.42% (ROC-AUC: 0.9854)
- **Late-Fusion Meta-Estimator (Logistic Regression)**:
  - Accuracy: **96.27%** | Precision: **97.93%** | Recall: **93.81%** | F1: **0.9583** | ROC-AUC: **0.9949**
  - Learned Weights: Intercept $w_0 = -6.2590$, Text $w_{\text{text}} = +4.9169$ (39.8%), URL $w_{\text{url}} = +3.5985$ (29.1%), DOM $w_{\text{html}} = +2.6307$ (21.3%), Vision $w_{\text{vision}} = +1.2024$ (9.7%)
- **Calibrated Operating Points**:
  - Balanced ($\tau = 0.45$, review band $[0.35, 0.55]$, F1 = 0.9613, test accuracy = 96.52%)
  - High Recall ($\tau = 0.20$, review band $[0.15, 0.30]$, recall = 97.86%, test accuracy = 96.56%)
  - High Precision ($\tau = 0.90$, review band $[0.70, 0.90]$, precision = 100.0%, 0 false positives across 1,499 clean sites)
- **Calibration**: Brier score 0.02878, Expected Calibration Error (ECE) 0.0400
- **Domain Shift**: Vision drops -26.34% accuracy on unstyled offline HTML; multimodal fusion drops only -0.16% (0.17% flip rate).

