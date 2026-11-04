import "./styles/main.css";
import { sceneEngine } from "./engine/sceneEngine";
import { initControls, mountProgressRail } from "./engine/controls";
import { mountNotesDrawer } from "./engine/notesWindow";
import { mountOverviewModal } from "./engine/overview";
import { presentationState } from "./engine/state";

// Import all 24 defense scenes
import { createScene01 } from "./scenes/scene01_title";
import { createScene02 } from "./scenes/scene02_story";
import { createScene03 } from "./scenes/scene03_timeline";
import { createScene04 } from "./scenes/scene04_real_vs_fake";
import { createScene05 } from "./scenes/scene05_url_anatomy";
import { createScene06 } from "./scenes/scene06_four_artifacts";
import { createScene07 } from "./scenes/scene07_why_one_signal_fails";
import { createScene08 } from "./scenes/scene08_dataset_splits";
import { createScene09 } from "./scenes/scene09_entropy_demo";
import { createScene10 } from "./scenes/scene10_html_dom";
import { createScene11 } from "./scenes/scene11_text_tfidf";
import { createScene12 } from "./scenes/scene12_vision_resnet";
import { createScene13 } from "./scenes/scene13_models_summary";
import { createScene14 } from "./scenes/scene14_fusion";
import { createScene15 } from "./scenes/scene15_metrics_matrix";
import { createScene16 } from "./scenes/scene16_ablation_studio";
import { createScene17 } from "./scenes/scene17_thresholds";
import { createScene18 } from "./scenes/scene18_calibration";
import { createScene19 } from "./scenes/scene19_explainability";
import { createScene20 } from "./scenes/scene20_domain_shift";
import { createScene21 } from "./scenes/scene21_system_endpoints";
import { createScene22 } from "./scenes/scene22_limitations";
import { createScene23 } from "./scenes/scene23_demo_plan";
import { createScene24 } from "./scenes/scene24_conclusion";

document.addEventListener("DOMContentLoaded", () => {
  const appContainer = document.getElementById("app");
  if (!appContainer) {
    console.error("No #app container found");
    return;
  }

  // Register all 24 scenes in sequence
  sceneEngine.register(createScene01());
  sceneEngine.register(createScene02());
  sceneEngine.register(createScene03());
  sceneEngine.register(createScene04());
  sceneEngine.register(createScene05());
  sceneEngine.register(createScene06());
  sceneEngine.register(createScene07());
  sceneEngine.register(createScene08());
  sceneEngine.register(createScene09());
  sceneEngine.register(createScene10());
  sceneEngine.register(createScene11());
  sceneEngine.register(createScene12());
  sceneEngine.register(createScene13());
  sceneEngine.register(createScene14());
  sceneEngine.register(createScene15());
  sceneEngine.register(createScene16());
  sceneEngine.register(createScene17());
  sceneEngine.register(createScene18());
  sceneEngine.register(createScene19());
  sceneEngine.register(createScene20());
  sceneEngine.register(createScene21());
  sceneEngine.register(createScene22());
  sceneEngine.register(createScene23());
  sceneEngine.register(createScene24());

  // Mount presentation components
  sceneEngine.init(appContainer);
  mountProgressRail(appContainer);
  mountNotesDrawer(appContainer);
  mountOverviewModal(appContainer);
  initControls();

  // Jump to initial scene (supports ?scene=X query param)
  const urlParams = new URLSearchParams(window.location.search);
  const initialScene = parseInt(urlParams.get("scene") || "1", 10);
  presentationState.goTo(initialScene, 0);

  console.log(
    "%c Phish360 Defense Presentation Loaded %c 24 Scenes Fully Active ",
    "background: #14130F; color: #A88B50; font-weight: bold; padding: 4px 8px; border: 1px solid var(--color-brass);",
    "background: #2A2926; color: #E8E2D4; padding: 4px 8px;"
  );
});
