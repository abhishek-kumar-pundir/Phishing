/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PHISH360_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
