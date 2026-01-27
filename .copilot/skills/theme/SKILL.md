# 主题颜色规范

本项目的设计主题遵循现代化的蓝青色渐变风格，所有交互元素（按钮、高亮、图标等）都应该使用统一的颜色主题。

## 核心颜色

### 主题渐变

```
from-blue-500 to-cyan-500
```

**颜色值：**

- **Blue-500**: `#3b82f6` (RGB: 59, 130, 246)
- **Cyan-500**: `#06b6d4` (RGB: 6, 182, 212)

### 阴影配色

```
shadow-blue-500/50
```

**悬停状态阴影：**

```
shadow-cyan-500/50
```

---

## 使用场景

### 1. 主要按钮（Primary Button）

所有主要操作按钮都应使用蓝青色渐变：

```tsx
<Button className="bg-linear-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-cyan-500/50">
  Primary Action
</Button>
```

**完整示例（带微交互）：**

```tsx
<Button
  size="default"
  className="group relative overflow-hidden bg-linear-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/50 hover:scale-105"
>
  {/* Background shimmer effect */}
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

  {/* Content */}
  <div className="relative flex items-center gap-2">
    <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
    <span className="font-medium">Button Text</span>
  </div>
</Button>
```

### 2. 图标容器

图标背景使用相同的渐变主题：

```tsx
<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50">
  <Icon className="h-6 w-6 text-white" />
</div>
```

### 3. 卡片悬停效果

卡片底部高亮条使用蓝青色渐变：

```tsx
<Card className="group relative overflow-hidden">
  {/* Card content */}
  <div className="p-5">{/* ... */}</div>

  {/* Hover Effect */}
  <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 transition-opacity group-hover:opacity-100" />
</Card>
```

### 4. 进度条 / 加载状态

```tsx
<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
  <div
    className="h-full bg-linear-to-r from-blue-500 to-cyan-500 transition-all"
    style={{ width: "60%" }}
  />
</div>
```

### 5. Badge / 标签

带渐变的状态标签：

```tsx
<Badge className="bg-linear-to-r from-blue-500 to-cyan-500 text-white border-0">
  Active
</Badge>
```

---

## 渐变方向规范

### 按钮和图标容器

```
bg-linear-to-br  // 从左上到右下（bottom-right）
```

### 卡片底部高亮 / 进度条

```
bg-gradient-to-r  // 从左到右（right）
```

### 其他装饰元素

根据设计需求选择：

- `bg-linear-to-tr` - 右上方向
- `bg-linear-to-bl` - 左下方向
- `bg-gradient-to-l` - 从右到左

---

## 阴影规范

### 默认状态

```tsx
shadow-lg shadow-blue-500/50
```

- `shadow-lg` - 阴影大小
- `shadow-blue-500/50` - 蓝色阴影，50% 透明度

### 悬停状态

```tsx
hover:shadow-xl hover:shadow-cyan-500/50
```

- `shadow-xl` - 更大的阴影
- `shadow-cyan-500/50` - 青色阴影，50% 透明度

### 聚焦状态

```tsx
focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
```

---

## 变体规范

### 次要按钮（Secondary）

使用边框渐变而非背景渐变：

```tsx
<Button
  variant="outline"
  className="border-2 border-transparent bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-border hover:shadow-md hover:shadow-blue-500/30"
>
  Secondary Action
</Button>
```

或使用细边框：

```tsx
<Button
  variant="outline"
  className="border-blue-500/50 text-blue-600 hover:bg-blue-50 hover:border-blue-500"
>
  Secondary Action
</Button>
```

### Ghost 按钮

文字颜色使用主题色：

```tsx
<Button
  variant="ghost"
  className="text-blue-600 hover:bg-blue-50 hover:text-cyan-600"
>
  Ghost Action
</Button>
```

---

## 禁用状态

禁用时去掉渐变，使用灰色：

```tsx
<Button
  disabled
  className="bg-muted text-muted-foreground cursor-not-allowed opacity-50"
>
  Disabled
</Button>
```

---

## 文字渐变

特殊标题或强调文字可以使用文字渐变：

```tsx
<h1 className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
  Gradient Title
</h1>
```

---

## 深色模式适配

在深色模式下，保持相同的渐变色，但调整阴影透明度：

```tsx
<Button className="bg-linear-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/30 dark:shadow-blue-500/20 hover:shadow-cyan-500/40 dark:hover:shadow-cyan-500/30">
  Dark Mode Button
</Button>
```

---

## 辅助色

### 成功（Success）

保留绿色，但可以混合少量青色：

```
from-green-500 to-emerald-500
```

### 警告（Warning）

```
from-amber-500 to-orange-500
```

### 危险（Danger / Destructive）

```
from-red-500 to-rose-500
```

### 信息（Info）

使用主题色：

```
from-blue-500 to-cyan-500
```

---

## 最佳实践

### ✅ 推荐

1. **一致性**：所有主要操作按钮使用相同的渐变
2. **层次感**：通过阴影大小区分重要性
3. **微交互**：添加 hover 效果（scale、阴影变化）
4. **可访问性**：确保文字与背景有足够对比度（白色文字 + 渐变背景）

### ❌ 避免

1. 不要在同一页面混用多种渐变方向
2. 不要过度使用渐变（次要元素使用纯色）
3. 不要在小元素（< 24px）上使用渐变
4. 避免渐变色与文字冲突导致可读性下降

---

## 快速参考

### Tailwind 类名速查

```tsx
// 主题渐变
bg-linear-to-br from-blue-500 to-cyan-500

// 阴影
shadow-lg shadow-blue-500/50
hover:shadow-xl hover:shadow-cyan-500/50

// 文字
text-white

// 过渡
transition-all

// 缩放
hover:scale-105

// 完整按钮类名
className="group relative overflow-hidden bg-linear-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50 transition-all hover:shadow-xl hover:shadow-cyan-500/50 hover:scale-105"
```

---

## 示例组件

### NewWorkflowButton

参考：`src/feature/workflows/components/NewWorkflowButton.tsx`

### WorkflowCard 底部高亮

参考：`src/feature/workflows/components/WorkflowList.tsx`

---

## 更新日志

- **2026-01-27**: 初始化主题颜色规范
  - 定义核心颜色：蓝青色渐变
  - 规范按钮、图标、卡片使用方式
  - 添加变体和最佳实践

---

**重要提示**：创建新按钮或交互元素时，请始终参考此文档确保颜色一致性。
