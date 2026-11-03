export interface SceneInstance {
  index: number;
  id: string;
  element: HTMLElement;
  init?: () => void;
  enter?: (step: number) => void;
  stepTo?: (step: number) => void;
  leave?: () => void;
  destroy?: () => void;
}
