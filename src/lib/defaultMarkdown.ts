export const defaultMarkdown = `
# 多列 Markdown 阅读器

<span class="text-[11px] font-bold uppercase tracking-[0.3em] text-[hsl(var(--muted-foreground))] mb-4 block">Chronicle — 一个优雅的阅读体验</span>

这是一个功能完备的多列 Markdown 阅读器，专为长文档阅读设计。它模拟了传统报纸杂志的排版方式，让你的眼睛在垂直方向上舒适地扫描文本，避免了单列长文章带来的视觉疲劳。

## ✨ 功能亮点

本阅读器支持丰富的 Markdown 特性，让你专注于内容本身：

- **多列布局** — 可调节 1-5 列，自定义间距
- **排版控制** — 字体、字号、行高、对齐方式
- **Mermaid 图表** — 流程图、时序图、甘特图等
- **表格扩展** — 大型表格可展开查看
- **代码高亮** — 支持多种编程语言
- **深色模式** — 护眼阅读体验

---

## 📊 数据展示

阅读器对表格和图表有良好的支持。下面是一个技术对比表：

| 特性 | 传统阅读器 | Chronicle | 优势 |
|------|------------|-----------|------|
| 列数 | 单列固定 | 1-5列可调 | 适应不同内容 |
| 字体 | 系统默认 | Sans/Serif/Mono | 专业排版感 |
| 图表 | 需外链 | 内嵌渲染 | 一体化体验 |
| 滚动 | 纵向 | 横向翻页 | 报纸阅读感 |

### 代码示例

支持语法高亮，让代码更易读：

\`\`\`typescript
// React 组件示例
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      点击次数: {count}
    </button>
  );
}
\`\`\`

\`\`\`python
# Python 示例
def fibonacci(n: int) -> list[int]:
    """生成斐波那契数列"""
    a, b = 0, 1
    result = []
    while a < n:
        result.append(a)
        a, b = b, a + b
    return result

print(fibonacci(100))  # [0, 1, 1, 2, 3, 5, 8, 13, 21, ...]
\`\`\`

---

## 🔀 Mermaid 图表

点击图表可以展开，支持 **无限缩放** 和 **自由拖拽**：

### 流程图

\`\`\`mermaid
flowchart LR
    A[用户输入] --> B{解析 Markdown}
    B --> C[渲染内容]
    C --> D[多列布局]
    D --> E[显示结果]
    B -->|错误| F[显示错误提示]
\`\`\`

### 时序图

\`\`\`mermaid
sequenceDiagram
    participant U as 用户
    participant R as Reader
    participant M as Mermaid
    U->>R: 输入 Markdown
    R->>R: 解析内容
    R->>M: 检测 mermaid 代码块
    M->>M: 渲染 SVG
    M-->>R: 返回图表
    R-->>U: 展示结果
\`\`\`

### 类图

\`\`\`mermaid
classDiagram
    class MarkdownViewer {
        +content: string
        +theme: Theme
        +render()
    }
    class MermaidRenderer {
        +code: string
        +svg: string
        +initialize()
    }
    class ExpandableView {
        +isExpanded: boolean
        +scale: number
        +toggle()
        +zoom()
    }
    MarkdownViewer --> MermaidRenderer
    MarkdownViewer --> ExpandableView
\`\`\`

---

## 📝 引用与列表

> "阅读是一场与作者的对话。好的排版，让这场对话更加流畅。"
>
> — 佚名

任务列表也是一种实用的格式：

- [x] 多列布局实现
- [x] Mermaid 图表渲染
- [x] 无限缩放功能
- [x] 拖拽平移功能
- [x] 深色模式支持
- [ ] 导出 PDF 功能
- [ ] 书签保存功能

---

## 🎯 使用建议

1. **调整列数** — 根据屏幕宽度和内容类型选择合适的列数
2. **选择字体** — Serif 适合长文阅读，Sans 适合技术文档
3. **控制行高** — 1.6-1.8 的行高适合大多数场景
4. **使用图表** — 复杂逻辑用 Mermaid 图表可视化
5. **深色模式** — 夜间阅读时开启，保护眼睛

---

*Chronicle — 让阅读回归优雅。*
`;