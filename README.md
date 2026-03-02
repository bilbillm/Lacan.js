# Lacan.js

精神分析理论的空间化可视化，基于雅克·拉康的三大秩序构建。

> The Spatial Architecture of Psychoanalysis

## 特性

- **Schema L 可视化** - 拉康镜像阶段图示的精确 SVG 实现，包含无意识与想象关系的动态呈现
- **玻璃态面板 UI** - Apple visionOS 风格的毛玻璃效果，带有微妙的视差交互
- **深层空间背景** - 多层次透视线条动画，构建深邃的心理空间隐喻
- **流畅动画** - 基于 Framer Motion 的入场动画与交互反馈

## 技术栈

- React 18 + TypeScript
- Vite
- Framer Motion
- Tailwind CSS
- SVG

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
```

## 项目结构

```
src/
├── components/
│   ├── SchemaL.tsx        # Schema L 图示组件
│   ├── GlassPanel.tsx     # 玻璃态面板组件
│   └── DeepEnvironment.tsx # 深层环境背景
├── App.tsx                # 主应用
├── App.css
└── index.css
```

## License

MIT
