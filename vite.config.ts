import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  base: './',
  plugins: [
    react(),
    tailwindcss(),
    svgr({
      svgrOptions: {
        viewBox: true,
        dimensions: true,
        // 减少转换，保留原始结构
        expandProps: false,
        // 禁用SVG优化，保留原始内容
        svgo: false,
      },
    }),
  ],
  // 确保SVG文件可以作为原始字符串导入
  assetsInclude: ['**/*.svg'],
})
