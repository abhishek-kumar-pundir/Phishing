import { SCENES_DATA } from "../data/notes";
import { SceneInstance } from "./types";

export function createPlaceholderScene(index: number): SceneInstance {
  const meta = SCENES_DATA[index - 1];
  const el = document.createElement("section");
  el.className = `scene-stage scene-${meta.theme}`;
  el.id = meta.id;

  el.innerHTML = `
    <header class="scene-header">
      <span class="scene-index">${String(meta.index).padStart(2, "0")}</span>
      <span class="scene-category">${meta.category}</span>
    </header>

    <div class="scene-content" style="display: flex; flex-direction: column; justify-content: center;">
      <span class="meta-label" style="color: var(--c-brass); margin-bottom: 8px;">
        Phase Defense Slide · Scene ${String(meta.index).padStart(2, "0")}
      </span>
      <h1 style="max-width: 900px; margin-bottom: 24px;">${meta.title}</h1>

      <div style="max-width: 780px; padding: 24px; border-left: 3px solid var(--c-stone); background: rgba(0,0,0,0.15);">
        <p class="lead" style="margin: 0; opacity: 0.9;">
          ${meta.script.slice(0, 220)}…
        </p>
      </div>

      <div style="margin-top: 36px; display: flex; gap: 24px; font-family: var(--font-mono); font-size: 13px; color: var(--c-stone);">
        <span>STATUS: PHASE 1 SCAFFOLDED</span>
        <span>·</span>
        <span>SCHEDULED FOR PHASE ${meta.index <= 8 ? "2" : meta.index <= 16 ? "3" : "4"}</span>
        <span>·</span>
        <span>PRESS [N] TO VIEW DEFENSE NOTES</span>
      </div>
    </div>
  `;

  return {
    index: meta.index,
    id: meta.id,
    element: el,
  };
}

