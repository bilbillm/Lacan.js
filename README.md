# Lacan.js

一个面向公众与拉康理论学习者的交互式精神分析图式档案。

> The Spatial Architecture of Psychoanalysis

## 内容

- **核心图式**：Schema L、Schema R、Schema I、Graph of Desire
- **扩展构造**：四种话语、性化公式、光学模型、主体拓扑
- **精神分析发展史**：十个事件组成的滚动档案
- **波罗米结**：符号界、想象界与实在界的 2D 交互结构

每个理论入口都有中英文说明、简短出处和与概念对应的专属交互。

## 体验

- 动效优先的编辑式排版与档案印刷视觉
- 默认亮色、可持久化的完整暗色主题
- 中英文切换与本地偏好持久化
- 原生纵向滚动、粘性章节导航和全屏理论档案
- 键盘导航、焦点管理和 `prefers-reduced-motion` 支持
- 桌面、平板、手机与横屏响应式布局

## 技术栈

- React 19 + TypeScript 5.9
- Vite 7 + Tailwind CSS 4
- Framer Motion 12
- Lucide React
- Fontsource Variable Fonts
- Playwright

## 开发

```bash
npm install
npm run dev
npm run lint
npm run build
npm run test:e2e
npm run perf:sample
```

GitHub Pages 使用 `/Lacan.js/` 作为 Vite base。推送到默认分支后，CI 会依次运行 lint、构建与 Playwright E2E，再发布 `dist`。

## 架构

- `App.tsx` 只管理主题、语言、活动章节与当前理论档案。
- `components/app/` 负责导航、首屏、理论索引、档案、时间线与页尾。
- `components/theory/` 通过懒加载注册表提供 8 个可视化。
- `components/app/panels.ts` 是理论元数据、双语文案、出处与洞见说明的单一来源。
- `App.css` 使用语义色彩令牌与统一响应式断点，不依赖 React Router 或动画状态库。

## License

MIT
