/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Public URL of the serverless function that holds the Anthropic API key.
   * Empty means the live-Claude features are dark. Never holds a secret.
   */
  readonly VITE_REFLECT_ENDPOINT: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
