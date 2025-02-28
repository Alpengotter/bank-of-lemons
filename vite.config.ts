/// <reference types="vitest" />
/// <reference types="vite/client" />

import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import svgLoader from 'vite-svg-loader'
import fs from 'fs'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  const isDevelopment = mode === 'development'

  return {
    server: {
      host: 'localhost.bankoflemons.ru',
      port: 5173,
      ...(isDevelopment && {
        proxy: {
          '/api/v1': {
            target: 'https://uat.bankoflemons.ru',
            changeOrigin: true,
            secure: false,
            headers: {
              Origin: 'https://uat.bankoflemons.ru',
            },
            credentials: 'include',
          },
        },
        https: {
          key: fs.readFileSync(path.resolve(__dirname, './certificate.key')),
          cert: fs.readFileSync(path.resolve(__dirname, './certificate.crt')),
        },
      }),
    },
    plugins: [vue(), vueJsx(), vueDevTools(), svgLoader()],
    build: {
      minify: 'terser',
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
