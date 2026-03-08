---
name: 固定页面大小并排显示4个卡片
overview: 移除滚轮分页功能，固定显示4个一排的卡片布局
todos:
  - id: remove-page-group-state
    content: 移除 App.tsx 中的 pageGroup 状态和相关变量
    status: completed
  - id: remove-wheel-listener
    content: 移除滚轮事件监听 useEffect
    status: completed
  - id: fix-page-size-css
    content: 修改 CSS 固定页面大小并禁止滚动
    status: completed
  - id: adjust-grid-layout
    content: 调整卡片布局为每行4个
    status: completed
---

## 用户需求

固定页面大小，让页面并排固定放4个卡片

## 核心功能

- 移除滚轮切换页面功能
- 固定页面高度，禁止滚动
- 调整卡片布局为每行固定4个

## 技术方案

- React + TypeScript + Tailwind CSS
- 修改 App.tsx 移除分页相关代码
- 修改 CSS 固定页面大小
- 使用 CSS Grid 或 Flex 实现每行4个卡片布局

## 修改文件

1. **App.tsx** (83-92行, 127-145行)

- 移除 pageGroup, panelsPerPage, totalPages, getCurrentPagePanels 状态/变量
- 移除滚轮事件监听 useEffect

2. **App.css**

- 设置固定高度 height: 100vh
- 移除 overflow-y: auto

3. **index.css**

- 设置 overflow: hidden