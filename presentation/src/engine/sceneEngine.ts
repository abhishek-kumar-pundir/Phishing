import { presentationState, PresentationState } from "./state";
import { SceneInstance } from "../scenes/types";

class SceneEngine {
  private scenes: Map<number, SceneInstance> = new Map();
  private container: HTMLElement | null = null;
  private currentSceneInstance: SceneInstance | null = null;
  private blackoutEl: HTMLElement | null = null;

  public register(scene: SceneInstance) {
    this.scenes.set(scene.index, scene);
  }

  public init(container: HTMLElement) {
    this.container = container;

    // Create blackout curtain
    this.blackoutEl = document.createElement("div");
    this.blackoutEl.className = "blackout-curtain";
    this.container.appendChild(this.blackoutEl);

    // Mount all registered scenes into DOM
    for (let idx = 1; idx <= 24; idx++) {
      const scene = this.scenes.get(idx);
      if (scene) {
        this.container.appendChild(scene.element);
        scene.init?.();
      }
    }

    // Subscribe to state changes
    let prevIndex = -1;
    let prevStep = -1;

    presentationState.subscribe((state: PresentationState) => {
      // Blackout curtain toggle
      this.blackoutEl?.classList.toggle("active", state.isBlackout);

      // Scene transition
      if (state.sceneIndex !== prevIndex) {
        const nextScene = this.scenes.get(state.sceneIndex) || null;

        if (this.currentSceneInstance) {
          this.currentSceneInstance.leave?.();
          this.currentSceneInstance.element.classList.remove("active");
        }

        if (nextScene) {
          nextScene.element.classList.add("active");
          nextScene.enter?.(state.step);
          this.currentSceneInstance = nextScene;
        }

        prevIndex = state.sceneIndex;
        prevStep = state.step;
      } else if (state.step !== prevStep) {
        // Step change within same scene
        this.currentSceneInstance?.stepTo?.(state.step);
        prevStep = state.step;
      }
    });
  }

  public getScene(index: number): SceneInstance | undefined {
    return this.scenes.get(index);
  }
}

export const sceneEngine = new SceneEngine();
