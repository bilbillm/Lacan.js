# Lacan.js

精神分析理论的空间化可视化，基于雅克·拉康的三大秩序构建。

> The Spatial Architecture of Psychoanalysis

## 特性

- **多 Schema 可视化** - 当前包含 Schema L、Schema R、Schema I 与 Graph of Desire，并通过面板注册表统一选择与展示
- **玻璃态面板 UI** - Apple visionOS 风格的毛玻璃效果，带有微妙的视差交互
- **深层空间背景** - 多层次透视线条动画，构建深邃的心理空间隐喻
- **流畅动画** - 基于 Framer Motion 的入场、聚焦与退场过渡
- **交互式节点选择** - Schema L / I / D 支持双节点选择，并驱动聚焦态右侧信息面板

## 技术栈

- React 19 + TypeScript 5
- Vite 7
- Framer Motion 12
- Tailwind CSS 4（通过 `@tailwindcss/vite` 集成）
- SVG 资源导入（`vite-plugin-svgr`）

## 核心概念

拉康的三大秩序：

1. **The Symbolic (符号界)** - 语言与符号秩序
2. **The Imaginary (想象界)** - 自我与他者的想象关系
3. **The Real (实在界)** - 无法被符号化的真实

## 开始使用

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 运行 ESLint
npm run lint

# 预览构建产物
npm run preview
```

## 项目结构

```
src/
├── components/
│   ├── app/
│   │   ├── AppHeader.tsx            # 顶部标题与副标题动画
│   │   ├── PanelGallery.tsx         # 主面板网格与分页展示
│   │   ├── FocusView.tsx            # 聚焦态面板与右侧信息区域
│   │   ├── panels.ts                # 面板元数据
│   │   └── panelSchemaRegistry.ts   # panel -> schema 映射
│   ├── schema/
│   │   ├── InteractiveSchemaFrame.tsx # L / I / D 共用的交互外壳
│   │   └── useSchemaInteraction.ts    # L / I / D 共用的节点选择逻辑
│   ├── SchemaL.tsx                 # Schema L
│   ├── SchemaR.tsx                 # Schema R
│   ├── SchemaI.tsx                 # Schema I
│   ├── SchemaD.tsx                 # Graph of Desire
│   ├── GlassPanel.tsx              # 玻璃态面板组件
│   └── DeepEnvironment.tsx         # 深层环境背景
├── App.tsx                         # 应用状态与视图编排入口
├── App.css
└── index.css
```

## 当前架构概览

- `App.tsx` 负责应用级状态：当前选中面板、节点选择结果、首屏入场状态与分页状态。
- `components/app/*` 负责页面级编排：header、gallery、focus view，以及 panel 到 schema 的映射关系。
- `components/schema/*` 负责交互 schema 的共用能力，目前仅服务于 `SchemaL`、`SchemaI` 与 `SchemaD`。
- `SchemaR` 保持为独立的非交互组件，没有被纳入交互抽象。

## License

MIT
