import { SCENES_DATA, SceneMetadata } from "../data/notes";

export interface PresentationState {
  sceneIndex: number; // 1 to 24
  step: number;       // 0 to substepsCount - 1
  isNotesOpen: boolean;
  isOverviewOpen: boolean;
  isBlackout: boolean;
  isProjectorMode: boolean;
  elapsedSeconds: number;
}

type StateListener = (state: PresentationState) => void;

class StateManager {
  private state: PresentationState = {
    sceneIndex: 1,
    step: 0,
    isNotesOpen: false,
    isOverviewOpen: false,
    isBlackout: false,
    isProjectorMode: false,
    elapsedSeconds: 0,
  };

  private listeners: Set<StateListener> = new Set();
  private channel: BroadcastChannel | null = null;

  constructor() {
    try {
      this.channel = new BroadcastChannel("phish360_presentation_sync");
      this.channel.onmessage = (event) => {
        if (event.data?.type === "REMOTE_NAV") {
          this.goTo(event.data.sceneIndex, event.data.step ?? 0);
        } else if (event.data?.type === "TOGGLE_NOTES") {
          this.setNotesOpen(event.data.isOpen);
        } else if (event.data?.type === "TOGGLE_BLACKOUT") {
          this.toggleBlackout();
        }
      };
    } catch {
      // BroadcastChannel unsupported fallback
    }

    // Start presentation timer
    window.setInterval(() => {
      this.state.elapsedSeconds += 1;
      this.notify();
    }, 1000);
  }

  public getState(): Readonly<PresentationState> {
    return this.state;
  }

  public getCurrentScene(): SceneMetadata {
    return SCENES_DATA[this.state.sceneIndex - 1] || SCENES_DATA[0];
  }

  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.state);
    }
    this.broadcastState();
  }

  private broadcastState() {
    try {
      this.channel?.postMessage({
        type: "STATE_SYNC",
        state: this.state,
        currentScene: this.getCurrentScene(),
      });
    } catch {
      // Ignore broadcast errors
    }
  }

  public next(): boolean {
    const currentScene = this.getCurrentScene();
    if (this.state.step < currentScene.substepsCount - 1) {
      this.state.step += 1;
      this.notify();
      return true;
    }

    if (this.state.sceneIndex < SCENES_DATA.length) {
      this.state.sceneIndex += 1;
      this.state.step = 0;
      this.notify();
      return true;
    }

    return false;
  }

  public prev(): boolean {
    if (this.state.step > 0) {
      this.state.step -= 1;
      this.notify();
      return true;
    }

    if (this.state.sceneIndex > 1) {
      this.state.sceneIndex -= 1;
      const prevScene = this.getCurrentScene();
      this.state.step = Math.max(0, prevScene.substepsCount - 1);
      this.notify();
      return true;
    }

    return false;
  }

  public nextScene(): boolean {
    if (this.state.sceneIndex < SCENES_DATA.length) {
      this.state.sceneIndex += 1;
      this.state.step = 0;
      this.notify();
      return true;
    }
    return false;
  }

  public prevScene(): boolean {
    if (this.state.sceneIndex > 1) {
      this.state.sceneIndex -= 1;
      this.state.step = 0;
      this.notify();
      return true;
    }
    return false;
  }

  public goTo(sceneIndex: number, step = 0) {
    const clampedIndex = Math.max(1, Math.min(SCENES_DATA.length, sceneIndex));
    const scene = SCENES_DATA[clampedIndex - 1];
    const clampedStep = Math.max(0, Math.min(scene.substepsCount - 1, step));

    this.state.sceneIndex = clampedIndex;
    this.state.step = clampedStep;
    this.state.isOverviewOpen = false;
    this.notify();
  }

  public toggleNotes() {
    this.state.isNotesOpen = !this.state.isNotesOpen;
    this.notify();
  }

  public setNotesOpen(open: boolean) {
    this.state.isNotesOpen = open;
    this.notify();
  }

  public toggleOverview() {
    this.state.isOverviewOpen = !this.state.isOverviewOpen;
    this.notify();
  }

  public toggleBlackout() {
    this.state.isBlackout = !this.state.isBlackout;
    this.notify();
  }

  public toggleProjectorMode() {
    this.state.isProjectorMode = !this.state.isProjectorMode;
    document.body.classList.toggle("projector-mode", this.state.isProjectorMode);
    this.notify();
  }

  public toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }
}

export const presentationState = new StateManager();
