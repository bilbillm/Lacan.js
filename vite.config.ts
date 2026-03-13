import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/Lacan.js/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  // 确保SVG文件可以作为原始字符串导入
  assetsInclude: ['**/*.svg'],
})
