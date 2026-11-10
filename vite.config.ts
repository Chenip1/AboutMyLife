import path from 'path'
import type { ConfigEnv } from 'vite'
import { defineConfig } from '@lark-apaas/coding-preset-vite-react'

export default function config({ mode }: ConfigEnv) {
  if (mode === 'github-pages') {
    process.env.MIAODA_BUILD_TARGET = 'standalone'
    process.env.CLIENT_BASE_PATH = ''
  }

  return defineConfig({
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, 'src'),
        '@shared': path.resolve(import.meta.dirname, 'shared'),
      },
    },
  })
}
