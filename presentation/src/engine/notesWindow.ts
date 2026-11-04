import { presentationState, PresentationState } from "./state";

export function mountNotesDrawer(container: HTMLElement) {
  const drawer = document.createElement("aside");
  drawer.className = "notes-drawer";
  drawer.id = "notes-drawer";

  drawer.innerHTML = `
    <div class="notes-header">
      <div>
        <span class="notes-title" id="notes-scene-id">SCENE 01</span>
        <div id="notes-scene-title" style="font-weight: 600; font-size: 16px; color: var(--c-bone); margin-top: 2px;"></div>
      </div>
      <div style="display: flex; gap: 8px; align-items: center;">
        <button id="btn-popout-notes" class="key-badge" style="cursor: pointer;" title="Open in dedicated second monitor window">POPOUT ↗</button>
        <button id="btn-close-notes" class="key-badge" style="cursor: pointer;">✕</button>
      </div>
    </div>

    <div class="notes-body">
      <div style="margin-bottom: 12px; font-family: var(--font-mono); font-size: 11px; color: var(--c-brass); text-transform: uppercase; letter-spacing: 0.1em;">
        Presenter Defense Script (~40s)
      </div>
      <div class="notes-script" id="notes-script-text"></div>

      <div class="notes-viva">
        <div class="notes-viva-title">Expected Viva / Defense Question</div>
        <p id="notes-viva-q" style="margin: 0 0 10px 0; font-weight: 500; color: var(--c-bone);"></p>
        <div class="notes-viva-title" style="margin-top: 10px;">Recommended Concise Answer</div>
        <p id="notes-viva-a" style="margin: 0; color: var(--c-bone); opacity: 0.9; line-height: 1.45;"></p>
      </div>
    </div>
  `;

  container.appendChild(drawer);

  // Close button
  drawer.querySelector("#btn-close-notes")?.addEventListener("click", () => {
    presentationState.setNotesOpen(false);
  });

  // Pop-out second window
  drawer.querySelector("#btn-popout-notes")?.addEventListener("click", () => {
    openPopoutNotesWindow();
  });

  // State subscription
  presentationState.subscribe((state: PresentationState) => {
    const scene = presentationState.getCurrentScene();

    drawer.classList.toggle("open", state.isNotesOpen);

    const idEl = drawer.querySelector("#notes-scene-id");
    if (idEl) idEl.textContent = `SCENE ${String(scene.index).padStart(2, "0")} · STEP ${state.step + 1}/${scene.substepsCount}`;

    const titleEl = drawer.querySelector("#notes-scene-title");
    if (titleEl) titleEl.textContent = scene.title;

    const scriptEl = drawer.querySelector("#notes-script-text");
    if (scriptEl) scriptEl.textContent = scene.script;

    const qEl = drawer.querySelector("#notes-viva-q");
    if (qEl) qEl.textContent = `Q: ${scene.vivaQuestion}`;

    const aEl = drawer.querySelector("#notes-viva-a");
    if (aEl) aEl.textContent = scene.vivaAnswer;
  });
}

export function openPopoutNotesWindow() {
  const width = 640;
  const height = 800;
  const left = window.screen.width - width - 40;
  const top = 60;

  window.open(
    "./notes.html",
    "Phish360NotesWindow",
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );
}

