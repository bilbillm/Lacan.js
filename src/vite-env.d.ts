/// <reference types="vite/client" />

// SVG 文件导入类型声明
declare module '*.svg?raw' {
  const content: string
  export default content
}
