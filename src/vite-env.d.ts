/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

// 支持SVG作为原始字符串导入
declare module '*.svg?raw' {
  const content: string
  export default content
}

// 支持SVG作为URL导入
declare module '*.svg?url' {
  const url: string
  export default url
}
