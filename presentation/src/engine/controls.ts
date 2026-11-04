import { presentationState, PresentationState } from "./state";
import { SCENES_DATA } from "../data/notes";

export function initControls() {
  // Keyboard Navigation
  window.addEventListener("keydown", (e: KeyboardEvent) => {
    // Ignore keystrokes inside input / textarea elements
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      if (e.key === "Escape") {
        (e.target as HTMLElement).blur();
      }
      return;
    }

    switch (e.code) {
      case "ArrowRight":
      case "Space":
      case "PageDown":
        e.preventDefault();
        presentationState.next();
        break;

      case "ArrowLeft":
      case "PageUp":
        e.preventDefault();
        presentationState.prev();
        break;

      case "ArrowDown":
        e.preventDefault();
        presentationState.nextScene();
        break;

      case "ArrowUp":
        e.preventDefault();
        presentationState.prevScene();
        break;

      case "Home":
        e.preventDefault();
        presentationState.goTo(1);
        break;

      case "End":
        e.preventDefault();
        presentationState.goTo(SCENES_DATA.length);
        break;

      case "KeyN":
        e.preventDefault();
        presentationState.toggleNotes();
        break;

      case "KeyO":
        e.preventDefault();
        presentationState.toggleOverview();
        break;

      case "KeyB":
        e.preventDefault();
        presentationState.toggleBlackout();
        break;

      case "KeyF":
        e.preventDefault();
        presentationState.toggleFullscreen();
        break;

      case "KeyP":
        e.preventDefault();
        presentationState.toggleProjectorMode();
        break;

      case "Escape":
        if (presentationState.getState().isOverviewOpen) {
          presentationState.toggleOverview();
        } else if (presentationState.getState().isNotesOpen) {
          presentationState.setNotesOpen(false);
        } else if (presentationState.getState().isBlackout) {
          presentationState.toggleBlackout();
        }
        break;
    }
  });

  // Touch Swipe navigation (for mobile or touchscreen lecterns)
  let touchStartX = 0;
  let touchStartY = 0;

  window.addEventListener(
    "touchstart",
    (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchend",
    (e: TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;

      if (Math.abs(deltaX) > 60 && Math.abs(deltaY) < 50) {
        if (deltaX < 0) {
          presentationState.next();
        } else {
          presentationState.prev();
        }
      }
    },
    { passive: true }
  );

  // Wheel debounce navigation
  let lastWheelTime = 0;
  window.addEventListener(
    "wheel",
    (e: WheelEvent) => {
      const now = performance.now();
      if (now - lastWheelTime < 700) return;

      // Don't hijack if scrolling inside scrollable container (notes, overview)
      let el = e.target as HTMLElement | null;
      while (el && el !== document.body) {
        if (el.scrollHeight > el.clientHeight && (el.scrollTop > 0 || e.deltaY > 0)) {
          return;
        }
        el = el.parentElement;
      }

      if (Math.abs(e.deltaY) > 40) {
        lastWheelTime = now;
        if (e.deltaY > 0) {
          presentationState.next();
        } else {
          presentationState.prev();
        }
      }
    },
    { passive: true }
  );
}

/**
 * Mounts the Presenter Progress Rail at bottom of viewport
 */
export function mountProgressRail(container: HTMLElement) {
  const rail = document.createElement("div");
  rail.className = "presenter-rail";

  rail.innerHTML = `
    <div class="rail-left">
      <span id="rail-index" style="font-weight: 600; color: var(--c-bone);">01 / 24</span>
      <span class="subtle-text">·</span>
      <span id="rail-category" class="subtle-text">PHISH360 DEFENSE</span>
      <div id="rail-steps" class="step-pills"></div>
    </div>

    <div class="rail-center">
      <span id="rail-title" style="color: var(--c-bone); font-weight: 500;"></span>
    </div>

    <div class="rail-right">
      <span id="rail-timer" class="tabular">00:00</span>
      <button id="btn-notes" class="key-badge" title="Toggle Speaker Notes (N)" style="cursor: pointer;">N: NOTES</button>
      <button id="btn-overview" class="key-badge" title="Scene Grid Overview (O)" style="cursor: pointer;">O: GRID</button>
      <button id="btn-blackout" class="key-badge" title="Blackout Screen (B)" style="cursor: pointer;">B: BLANK</button>
      <button id="btn-projector" class="key-badge" title="High Contrast Projector Mode (P)" style="cursor: pointer;">P: HI-CON</button>
    </div>
  `;

  container.appendChild(rail);

  // Button actions
  rail.querySelector("#btn-notes")?.addEventListener("click", () => presentationState.toggleNotes());
  rail.querySelector("#btn-overview")?.addEventListener("click", () => presentationState.toggleOverview());
  rail.querySelector("#btn-blackout")?.addEventListener("click", () => presentationState.toggleBlackout());
  rail.querySelector("#btn-projector")?.addEventListener("click", () => presentationState.toggleProjectorMode());

  // Subscribe to state updates
  presentationState.subscribe((state: PresentationState) => {
    const scene = presentationState.getCurrentScene();

    const idxEl = document.getElementById("rail-index");
    if (idxEl) idxEl.textContent = `${String(state.sceneIndex).padStart(2, "0")} / ${String(SCENES_DATA.length).padStart(2, "0")}`;

    const catEl = document.getElementById("rail-category");
    if (catEl) catEl.textContent = scene.category.toUpperCase();

    const titleEl = document.getElementById("rail-title");
    if (titleEl) titleEl.textContent = scene.title;

    // Steps indicator pills
    const stepsEl = document.getElementById("rail-steps");
    if (stepsEl) {
      stepsEl.innerHTML = "";
      for (let i = 0; i < scene.substepsCount; i++) {
        const pill = document.createElement("div");
        pill.className = `step-pill ${i <= state.step ? "active" : ""}`;
        pill.title = `Step ${i + 1} of ${scene.substepsCount}`;
        pill.style.cursor = "pointer";
        pill.addEventListener("click", (e) => {
          e.stopPropagation();
          presentationState.goTo(state.sceneIndex, i);
        });
        stepsEl.appendChild(pill);
      }
    }

    // Elapsed presentation clock
    const timerEl = document.getElementById("rail-timer");
    if (timerEl) {
      const mins = String(Math.floor(state.elapsedSeconds / 60)).padStart(2, "0");
      const secs = String(state.elapsedSeconds % 60).padStart(2, "0");
      timerEl.textContent = `${mins}:${secs}`;
    }
  });
}

