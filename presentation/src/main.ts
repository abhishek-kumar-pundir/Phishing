import "./styles/main.css";
import { sceneEngine } from "./engine/sceneEngine";
import { initControls, mountProgressRail } from "./engine/controls";
import { mountNotesDrawer } from "./engine/notesWindow";
import { mountOverviewModal } from "./engine/overview";
import { presentationState } from "./engine/state";

// Scenes
import { createScene01 } from "./scenes/scene01_title";
import { createScene05 } from "./scenes/scene05_url_anatomy";
import { createScene14 } from "./scenes/scene14_fusion";
import { createPlaceholderScene } from "./scenes/placeholder_scene";

document.addEventListener("DOMContentLoaded", () => {
  const appContainer = document.getElementById("app");
  if (!appContainer) {
    console.error("No #app container found");
    return;
  }

  // Register all 24 scenes
  for (let idx = 1; idx <= 24; idx++) {
    if (idx === 1) {
      sceneEngine.register(createScene01());
    } else if (idx === 5) {
      sceneEngine.register(createScene05());
    } else if (idx === 14) {
      sceneEngine.register(createScene14());
    } else {
      sceneEngine.register(createPlaceholderScene(idx));
    }
  }

  // Mount components
  sceneEngine.init(appContainer);
  mountProgressRail(appContainer);
  mountNotesDrawer(appContainer);
  mountOverviewModal(appContainer);
  initControls();

  // Jump to initial scene (read URL query param ?scene=5 if present)
  const urlParams = new URLSearchParams(window.location.search);
  const initialScene = parseInt(urlParams.get("scene") || "1", 10);
  presentationState.goTo(initialScene, 0);

  console.log(
    "%c Phish360 Defense Presentation Loaded %c 24 Scenes · Phase 1 Scaffolded ",
    "background: #14130F; color: #A88B50; font-weight: bold; padding: 4px 8px; border: 1px solid #A88B50;",
    "background: #2A2926; color: #E8E2D4; padding: 4px 8px;"
  );
});
