# 设计规范 (Design System)

本文档定义了项目的完整设计规范，所有新组件和页面都应遵循这些原则。

---

## 🎨 设计理念

### 核心原则

1. **极简主义 (Minimalism)**
   - 去除多余装饰，专注核心功能
   - 清晰的信息层级
   - 留白的艺术

2. **现代化 (Modern)**
   - 2025 年设计趋势
   - 微交互和流畅动画
   - 毛玻璃效果和柔和阴影

3. **直观性 (Intuitive)**
   - 用户能立即理解界面
   - 符合用户预期的交互
   - 明确的视觉反馈

4. **一致性 (Consistency)**
   - 统一的颜色主题
   - 统一的间距系统
   - 统一的组件样式

---

## 🎨 颜色系统

### 主题色

**详细颜色规范请参考：** [theme/SKILL.md](../theme/SKILL.md)

**核心渐变：**

```
from-blue-500 to-cyan-500
```

**使用场景：**

- 主要按钮和 CTA
- 图标容器
- 卡片悬停效果
- 进度指示器

### 语义化颜色

```tsx
// 背景色
bg - background; // 主背景
bg - accent / 20; // 次要背景区域
bg - muted; // 禁用/静默状态

// 文字色
text - foreground; // 主要文字
text - muted - foreground; // 次要文字/描述
text - white; // 白色文字（用于深色背景）

// 边框色
border - border / 40; // 默认边框
border - border / 50; // 悬停边框
border - dashed; // 虚线边框（空状态）

// 状态色
bg - destructive; // 危险/删除
text - destructive; // 危险操作文字
```

---

## 📐 布局规范

### 页面结构

**使用 `PageContainer` 组件：**

```tsx
import PageContainer from "@/components/page-container";

<PageContainer header={<YourHeader />} footer={<YourFooter />}>
  <YourContent />
</PageContainer>;
```

**布局层级：**

```
Dashboard Layout (外层)
├── MobileHeader
└── SidebarInset
    └── PageContainer (页面级)
        ├── Header (页面头部)
        ├── Content (主内容)
        └── Footer (分页/操作栏)
```

### 容器规范

```tsx
// ✅ 推荐：使用 flex 布局
<div className="flex flex-col">
  <div className="flex-shrink-0">{/* Header */}</div>
  <div className="flex-1">{/* Content */}</div>
  <div className="flex-shrink-0">{/* Footer */}</div>
</div>

// ❌ 避免：使用 min-h-screen（会导致内容被推出视口）
<div className="flex min-h-screen flex-col">
```

---

## 📏 间距系统

### Padding 规范

```tsx
// 页面级 padding（由 layout 提供）
p-4 md:p-8

// 区块 padding
px-6 py-6    // Header/Footer
px-6 py-8    // Content

// 卡片 padding
p-5          // 标准卡片内边距
p-4          // 紧凑卡片

// 组件内间距
gap-2        // 小间距（图标 + 文字）
gap-4        // 中等间距（卡片网格）
gap-8        // 大间距（区块之间）
```

### Margin 规范

```tsx
// 垂直间距
space - y - 1; // 标题 + 描述
space - y - 2; // 表单字段
space - y - 4; // 区块内容
space - y - 8; // 主要区块

// 水平间距
space - x - 2; // 按钮组
space - x - 4; // 导航项
```

---

## 🔤 字体系统

### 标题层级

```tsx
// 页面主标题
<h1 className="text-3xl font-semibold tracking-tight">
  Page Title
</h1>

// 区块标题
<h2 className="text-2xl font-semibold">
  Section Title
</h2>

// 卡片标题
<h3 className="text-base font-semibold leading-none">
  Card Title
</h3>

// 小标题
<h4 className="text-sm font-medium">
  Subtitle
</h4>
```

### 正文文字

```tsx
// 默认正文
<p className="text-sm text-muted-foreground">
  Description text
</p>

// 小字体（时间戳、辅助信息）
<span className="text-xs text-muted-foreground">
  2h ago
</span>

// 强调文字
<span className="font-medium">
  Important
</span>
```

### 字体粗细

```
font-normal      // 400 - 正文
font-medium      // 500 - 按钮、强调
font-semibold    // 600 - 标题
font-bold        // 700 - 特别强调（少用）
```

---

## 🎯 组件设计规范

### 按钮 (Button)

**主要按钮：**

```tsx
<Button className="group relative overflow-hidden bg-linear-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/50 hover:scale-105">
  <div className="relative flex items-center gap-2">
    <Icon className="h-4 w-4 transition-transform group-hover:rotate-90" />
    <span className="font-medium">Action</span>
  </div>
</Button>
```

**次要按钮：**

```tsx
<Button
  variant="outline"
  className="border-blue-500/50 text-blue-600 hover:bg-blue-50"
>
  Secondary
</Button>
```

**Ghost 按钮：**

```tsx
<Button variant="ghost" className="text-muted-foreground hover:bg-accent">
  Ghost
</Button>
```

**图标按钮：**

```tsx
<Button
  variant="ghost"
  size="icon"
  className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
>
  <Icon className="h-4 w-4" />
</Button>
```

### 卡片 (Card)

**标准卡片：**

```tsx
<Card className="group relative overflow-hidden transition-all hover:shadow-md">
  <div className="p-5">
    {/* Header */}
    <div className="mb-3 flex items-start justify-between gap-2">
      <div className="flex-1 space-y-1">
        <h3 className="line-clamp-1 text-base font-semibold leading-none">
          Title
        </h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">
          Description
        </p>
      </div>
      <DropdownMenu>{/* Actions */}</DropdownMenu>
    </div>

    {/* Footer */}
    <div className="flex items-center justify-between pt-3">
      <div className="text-xs text-muted-foreground">Metadata</div>
      <Badge variant="secondary">Status</Badge>
    </div>
  </div>

  {/* Hover Effect */}
  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 transition-opacity group-hover:opacity-100" />
</Card>
```

### 网格布局 (Grid)

**响应式卡片网格：**

```tsx
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  {items.map((item) => (
    <Card key={item.id}>...</Card>
  ))}
</div>
```

**断点规范：**

- `sm:` 640px - 手机横屏
- `md:` 768px - 平板
- `lg:` 1024px - 桌面
- `xl:` 1280px - 大屏幕

### Header 组件

**页面 Header：**

```tsx
<div className="border-b border-border/40 bg-background/95 px-6 py-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="flex items-center justify-between">
    <div className="space-y-1">
      <h1 className="text-3xl font-semibold tracking-tight">Title</h1>
      <p className="text-sm text-muted-foreground">Description</p>
    </div>
    <Button>Action</Button>
  </div>
</div>
```

### Footer 组件

**页面 Footer（含分页）：**

```tsx
<div className="border-t border-border/40 bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="flex items-center justify-between">
    <p className="text-sm text-muted-foreground">Showing 1-10 of 42 results</p>
    <Pagination>{/* ... */}</Pagination>
  </div>
</div>
```

### 空状态 (Empty State)

```tsx
<div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-border/50 bg-muted/10 px-6 py-12 text-center">
  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
    <Icon className="h-6 w-6 text-muted-foreground" />
  </div>
  <h3 className="mt-4 text-lg font-semibold">No items yet</h3>
  <p className="mt-2 max-w-sm text-sm text-muted-foreground">
    Get started by creating your first item.
  </p>
  <Button size="sm" className="mt-6 gap-2">
    <Plus className="h-4 w-4" />
    Create Item
  </Button>
</div>
```

---

## ✨ 视觉效果

### 阴影规范

```tsx
// 卡片阴影
shadow - sm; // 轻微阴影
shadow - md; // 中等阴影（悬停）
shadow - lg; // 大阴影（按钮）
shadow - xl; // 特大阴影（悬停按钮）

// 彩色阴影
shadow - blue - 500 / 50; // 蓝色阴影 50% 透明度
shadow - cyan - 500 / 50; // 青色阴影 50% 透明度
```

### 毛玻璃效果

```tsx
// Header/Footer 的毛玻璃背景
bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60
```

### 边框规范

```tsx
// 默认边框
border border-border

// 细边框
border border-border/40

// 虚线边框（空状态）
border border-dashed border-border/50

// 渐变边框（少用）
border-2 border-transparent bg-gradient-to-r from-blue-500 to-cyan-500
```

### 圆角规范

```tsx
rounded - sm; // 2px - 小元素
rounded; // 4px - 默认
rounded - md; // 6px - 卡片
rounded - lg; // 8px - 按钮、图标容器
rounded - xl; // 12px - 大卡片
rounded - full; // 完全圆形 - Avatar、Badge
```

---

## 🎬 动画和过渡

### 过渡效果

```tsx
// 全属性过渡
transition - all;

// 特定属性
transition - opacity;
transition - transform;
transition - shadow;

// 时长（默认 150ms）
duration - 200;
duration - 300;
```

### 微交互

**悬停缩放：**

```tsx
hover: scale - 105;
hover: scale - 110;
```

**悬停旋转：**

```tsx
transition-transform group-hover:rotate-90
```

**淡入淡出：**

```tsx
opacity-0 transition-opacity group-hover:opacity-100
```

**阴影增强：**

```tsx
shadow-lg hover:shadow-xl
shadow-blue-500/50 hover:shadow-cyan-500/50
```

---

## 📱 响应式设计

### 移动优先

```tsx
// ✅ 正确：移动端为基础，逐步增强
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

// ❌ 错误：桌面端为基础
<div className="grid grid-cols-3 md:grid-cols-1">
```

### 常见响应式模式

**导航栏：**

```tsx
<div className="flex flex-col md:flex-row md:items-center md:justify-between">
  <h1>Title</h1>
  <Button>Action</Button>
</div>
```

**Padding 自适应：**

```tsx
<div className="p-4 md:p-6 lg:p-8">
```

**网格自适应：**

```tsx
// 1列 → 2列 → 3列
<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

// 1列 → 3列 → 4列
<div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">
```

**文字大小自适应：**

```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl">
```

---

## 🔍 可访问性 (Accessibility)

### 语义化 HTML

```tsx
// ✅ 使用正确的标签
<button>Click</button>
<nav>...</nav>
<main>...</main>
<article>...</article>

// ❌ 避免滥用 div
<div onClick={...}>Click</div>
```

### 焦点状态

```tsx
// 键盘焦点可见
focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
```

### 替代文字

```tsx
// 图标按钮必须有 label
<Button variant="ghost" size="icon">
  <Icon className="h-4 w-4" />
  <span className="sr-only">Delete</span>
</Button>

// 图片必须有 alt
<img src="..." alt="Description" />
```

---

## 📦 组件清单

### 必须使用的基础组件

从 `@/components/ui` 导入：

```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
```

### 布局组件

```tsx
import PageContainer from "@/components/page-container";
```

### 图标

```tsx
import {
  Plus,
  MoreHorizontal,
  Calendar,
  Pencil,
  Trash2,
  FileText,
  // ...
} from "lucide-react";
```

---

## 📋 开发检查清单

创建新组件时，请确保：

### 视觉设计

- [ ] 使用统一的蓝青色主题 (`from-blue-500 to-cyan-500`)
- [ ] 遵循间距规范（p-4/p-6/p-8）
- [ ] 字体大小和粗细符合规范
- [ ] 添加适当的阴影效果
- [ ] 圆角使用 `rounded-lg` 或 `rounded-md`

### 交互设计

- [ ] 添加 hover 效果（`hover:shadow-md`、`hover:scale-105`）
- [ ] 添加过渡动画（`transition-all`）
- [ ] 按钮有明确的禁用状态
- [ ] 悬停时有视觉反馈

### 响应式

- [ ] 移动端优先设计
- [ ] 网格布局自适应（`md:grid-cols-2 lg:grid-cols-3`）
- [ ] Padding 自适应（`p-4 md:p-6`）

### 可访问性

- [ ] 使用语义化标签
- [ ] 图标按钮有 `sr-only` label
- [ ] 交互元素有焦点状态
- [ ] 颜色对比度足够

### 代码质量

- [ ] 使用 TypeScript 类型定义
- [ ] Props 有清晰的命名
- [ ] 组件有注释说明用途
- [ ] 遵循项目文件结构

---

## 📖 参考示例

### 完整页面示例

**参考文件：**

- `src/feature/workflows/components/Workflow.tsx` - 完整页面结构
- `src/feature/workflows/components/WorkflowList.tsx` - 卡片列表
- `src/feature/workflows/components/NewWorkflowButton.tsx` - 主题按钮

### 设计模式

**列表页面模式：**

```
Header (标题 + 统计 + 操作按钮)
  ↓
Content (响应式网格 + 卡片)
  ↓
Footer (统计信息 + 分页)
```

**卡片模式：**

```
Card
├── Header (标题 + 描述 + 操作菜单)
├── Content (主要内容)
├── Footer (元数据 + 状态标签)
└── Hover Effect (底部渐变条)
```

---

## 🎯 最佳实践总结

### ✅ 推荐做法

1. **复用组件** - 使用 `PageContainer`、shadcn/ui 组件
2. **统一主题** - 蓝青色渐变贯穿所有交互元素
3. **微交互** - 添加 hover、focus 状态
4. **响应式** - 移动端优先，逐步增强
5. **留白** - 适当使用 padding 和 gap
6. **层次感** - 通过阴影、边框区分层级

### ❌ 避免事项

1. 不要使用 `min-h-screen`（会导致 footer 不可见）
2. 不要混用多种颜色主题
3. 不要忽略响应式设计
4. 不要过度使用动画（保持克制）
5. 不要省略可访问性属性
6. 不要创建一次性组件（优先复用）

---

## 📝 更新日志

- **2026-01-27**: 初始化设计规范
  - 定义核心设计理念
  - 建立颜色、字体、间距系统
  - 规范组件设计模式
  - 添加响应式和可访问性指南
  - 提供完整示例和检查清单

---

**重要提示**：在开始编写任何新组件之前，请务必阅读本文档，确保设计一致性。如有疑问，请参考现有组件代码。
