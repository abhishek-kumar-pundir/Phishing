import { presentationState, PresentationState } from "./state";
import { SCENES_DATA } from "../data/notes";

export function mountOverviewModal(container: HTMLElement) {
  const modal = document.createElement("div");
  modal.className = "overview-modal";
  modal.id = "overview-modal";

  modal.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1px solid var(--c-graphite-border); padding-bottom: 16px;">
      <div>
        <span class="meta-label" style="color: var(--c-brass);">Scene Navigator (O)</span>
        <h2 style="font-size: 28px; color: var(--c-bone); margin-top: 4px;">24 Defense Presentation Scenes</h2>
      </div>
      <button id="btn-close-overview" class="key-badge" style="cursor: pointer; padding: 6px 12px;">ESC: CLOSE ✕</button>
    </div>

    <div class="overview-grid" id="overview-grid">
      ${SCENES_DATA.map((scene) => `
        <div class="overview-thumb" data-index="${scene.index}">
          <div>
            <span class="thumb-idx">SCENE ${String(scene.index).padStart(2, "0")}</span>
            <div class="thumb-title">${scene.title}</div>
          </div>
          <div style="font-family: var(--font-mono); font-size: 10px; color: var(--c-stone); text-transform: uppercase;">
            ${scene.category}
          </div>
        </div>
      `).join("")}
    </div>
  `;

  container.appendChild(modal);

  // Click handler on scene thumbs
  modal.querySelectorAll(".overview-thumb").forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const idx = parseInt(thumb.getAttribute("data-index") || "1", 10);
      presentationState.goTo(idx, 0);
    });
  });

  // Close button
  modal.querySelector("#btn-close-overview")?.addEventListener("click", () => {
    presentationState.toggleOverview();
  });

  // State subscription
  presentationState.subscribe((state: PresentationState) => {
    modal.classList.toggle("open", state.isOverviewOpen);

    modal.querySelectorAll(".overview-thumb").forEach((thumb) => {
      const idx = parseInt(thumb.getAttribute("data-index") || "1", 10);
      thumb.classList.toggle("active", idx === state.sceneIndex);
    });
  });
}
