/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  // mais variáveis de ambiente aqui...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}