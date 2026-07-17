# Changelog

## 2026-07-17 — 移动端样式优化

### 修改文件
- `style.css`

### 修复内容

#### 🔴 高优先级
- **触摸目标过小**：增大 `.filter-btn`、`.practice-toggle`、`.pc-btn` 的 padding 并添加 `min-height: 44px`，符合 Apple 最小触摸标准
- **iOS Safari `backdrop-filter` 兼容**：`.controls` 添加 `-webkit-backdrop-filter` 前缀，并用 `@supports` 提供不透明回退方案
- **iPhone 刘海屏安全区域**：`.controls` 和 `.site-header` 使用 `env(safe-area-inset-top)` 适配安全区域
- **长单词溢出卡片**：`.card-word`、`.card-meaning`、`.fc-word`、`.fc-meaning` 添加 `overflow-wrap: break-word` 和 `word-break: break-word`

#### 🟡 中优先级
- **Flashcard 小屏高度**：`.flashcard` 从固定 `height: 300px` 改为 `min-height: 260px` + `height: auto`；小屏降至 `min-height: 220px`
- **iOS 点击高亮**：添加 `-webkit-tap-highlight-color: transparent`
- **防水平溢出**：`html, body` 添加 `overflow-x: hidden`
- **`.controls` 背景可读性**：`@supports` 回退方案在无 `backdrop-filter` 的浏览器中使用不透明背景

### 验证
- CSS 语法检查通过（89 对大括号平衡）
- `@media` 和 `@supports` 块结构正确
