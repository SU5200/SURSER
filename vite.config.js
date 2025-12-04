// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/surser/', // 设置GitHub Pages的base路径
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // 生产环境不需要sourcemap
    rollupOptions: {
      output: {
        manualChunks: {
          vue: ['vue'],
          router: ['vue-router']
        }
      }
    }
  }
})