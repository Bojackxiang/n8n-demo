# ShopNode Design System - Master Document

> **Last Updated:** 2026-01-23
> **Design Philosophy:** Technical, Futuristic, Dark Mode-First inspired by n8n automation platform

---

## 🎨 Design Pattern

- **Pattern Type:** Real-Time Monitoring
- **CTA Strategy:** Above fold
- **Page Structure:** Hero > Features > CTA
- **Inspiration:** n8n workflow automation platform

---

## 🌈 Color Palette

| Role               | Hex                    | Usage                                   |
| ------------------ | ---------------------- | --------------------------------------- |
| **Primary**        | `#3B82F6` (blue-500)   | Main brand color, primary actions       |
| **Secondary**      | `#06B6D4` (cyan-500)   | Accent color, gradients                 |
| **CTA**            | `#F97316` (orange-500) | Call-to-action highlights               |
| **Background**     | `#000000` (black)      | Main background (dark mode OLED)        |
| **Surface**        | `#000000` with opacity | Cards, containers (black/50, black/70)  |
| **Text Primary**   | `#FFFFFF` (white)      | Headings, important text                |
| **Text Secondary** | `#94A3B8` (slate-400)  | Body text, descriptions                 |
| **Text Muted**     | `#64748B` (slate-500)  | Footnotes, less important info          |
| **Success**        | `#4ADE80` (green-400)  | Success states, checkmarks              |
| **Border**         | `#3B82F6` with opacity | Card borders (blue-500/30, blue-500/50) |

### Gradient Combinations

```css
/* Primary Gradient */
bg-linear-to-r from-blue-500 to-cyan-500

/* Secondary Gradient */
bg-linear-to-br from-blue-600 via-blue-700 to-cyan-600

/* Hover Overlay Gradient */
bg-linear-to-br from-blue-500/5 to-cyan-500/5

/* Text Gradient */
bg-linear-to-r from-blue-400 via-cyan-400 to-purple-400
```

---

## 📝 Typography

### Font Pairing

- **Heading Font:** [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)
  - Weights: 400, 500, 600, 700
  - Use for: H1-H6, UI labels, buttons
  - Variable: `font-heading`

- **Body Font:** [DM Sans](https://fonts.google.com/specimen/DM+Sans)
  - Weights: 400, 500, 700
  - Use for: Body text, descriptions, paragraphs
  - Variable: `font-sans`

### Font Sizes

```css
/* Headings */
Hero H1: text-5xl sm:text-6xl lg:text-7xl (48-72px)
Section H2: text-3xl sm:text-4xl (30-36px)
Card H3: text-xl to text-2xl (20-24px)
Feature H4: text-xl (20px)

/* Body */
Subheadline: text-lg sm:text-xl (18-20px)
Body: text-base (16px)
Small: text-sm (14px)
```

### Text Colors & Effects

```css
/* Light Text (Headings) */
text-white

/* Secondary Text (Body) */
text-slate-400

/* Muted Text */
text-slate-500

/* Glow Effect (Technical Look) */
drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]
drop-shadow-[0_0_20px_rgba(59,130,246,0.9)]
```

---

## ✨ Visual Effects

### 1. Grid Background

```jsx
<div className="fixed inset-0 opacity-20">
  <div
    className="absolute inset-0"
    style={{
      backgroundImage: `
        linear-gradient(to right, rgba(59, 130, 246, 0.3) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
      `,
      backgroundSize: "50px 50px",
    }}
  />
</div>
```

### 2. Animated Gradient Orbs

```jsx
<div className="pointer-events-none fixed inset-0">
  <div className="absolute left-1/4 top-20 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl animate-pulse" />
  <div
    className="absolute right-1/4 top-1/3 h-96 w-96 rounded-full bg-purple-600/30 blur-3xl animate-pulse"
    style={{ animationDelay: "1s" }}
  />
  <div
    className="absolute left-1/3 bottom-20 h-96 w-96 rounded-full bg-cyan-600/30 blur-3xl animate-pulse"
    style={{ animationDelay: "2s" }}
  />
</div>
```

### 3. Glow Effects

```css
/* Text Glow */
drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]

/* Icon Glow on Hover */
group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]

/* Button Glow */
shadow-lg shadow-blue-500/50
hover:shadow-xl hover:shadow-blue-500/70
hover:drop-shadow-[0_0_20px_rgba(59,130,246,1)]
```

### 4. Backdrop Blur

```css
backdrop-blur-xl  /* For glassmorphism cards */
```

---

## 🎯 Component Patterns

### Card Style (Feature Cards, Pricing Cards, Stats)

```jsx
<div className="group relative overflow-hidden rounded-2xl border border-blue-500/30 bg-black/50 p-6 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/30">
  {/* Hover glow overlay */}
  <div className="absolute inset-0 bg-linear-to-br from-blue-500/0 to-cyan-500/0 opacity-0 transition-opacity duration-300 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 group-hover:opacity-100"></div>

  {/* Content */}
  <div className="relative">
    {/* Icon with glow */}
    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/20 transition-all duration-300 group-hover:shadow-blue-500/50 group-hover:drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-white">Title</h3>
    <p className="text-slate-400">Description</p>
  </div>
</div>
```

### Button Patterns

```jsx
/* Primary CTA Button */
<Button className="cursor-pointer bg-linear-to-r from-blue-500 to-cyan-500 font-medium text-white shadow-lg shadow-blue-500/50 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/70 hover:drop-shadow-[0_0_20px_rgba(59,130,246,1)]">
  Get Started
</Button>

/* Secondary Button */
<Button
  variant="outline"
  className="cursor-pointer border-blue-500/50 bg-blue-500/5 text-blue-400 backdrop-blur-sm transition-all duration-200 hover:bg-blue-500/10 hover:border-blue-400"
>
  Watch Demo
</Button>
```

### Navigation Bar

```jsx
<nav className="fixed left-4 right-4 top-4 z-50">
  <div className="mx-auto max-w-7xl rounded-2xl border border-blue-500/30 bg-black/80 px-6 py-4 shadow-2xl shadow-blue-500/20 backdrop-blur-xl">
    {/* Nav content */}
  </div>
</nav>
```

---

## 🎬 Animation Guidelines

### Transition Durations

```css
/* Micro-interactions */
transition-all duration-200  /* Buttons, links */

/* Card hover effects */
transition-all duration-300  /* Cards, containers */

/* Overlay effects */
transition-opacity duration-300  /* Gradient overlays */
```

### Hover Effects

```css
/* Scale on hover */
hover:scale-[1.02]

/* Glow intensity increase */
hover:shadow-xl hover:shadow-blue-500/70

/* Border brightness */
hover:border-blue-400/50
```

### Pulse Animation

```jsx
className="animate-pulse"
style={{ animationDelay: '1s' }}  /* For staggered effects */
```

---

## 🔍 Accessibility

### Contrast Requirements

- **Text on dark background:** WCAG AAA compliant
  - White text (#FFFFFF) on black background
  - Slate-400 text (#94A3B8) on black background

### Focus States

```css
/* Visible focus rings on interactive elements */
focus-visible: ring-blue-500/50;
```

### Reduced Motion

```css
/* Respect user preference */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
Default: 375px+
sm: 640px   /* Tablets */
md: 768px   /* Small laptops */
lg: 1024px  /* Desktops */
xl: 1440px  /* Large screens */
```

### Responsive Patterns

```jsx
/* Section Spacing */
className = "px-4 sm:px-6 lg:px-8 py-20";

/* Typography */
className = "text-5xl sm:text-6xl lg:text-7xl";

/* Grid Layouts */
className = "grid gap-6 md:grid-cols-2 lg:grid-cols-3";
```

---

## 🚫 Anti-Patterns (Avoid These)

1. **No Light Mode Fallbacks** - This is dark-mode only design
2. **No Emojis as Icons** - Use SVG icons from Lucide React
3. **No Flat Colors** - Always use gradients and glow effects for key elements
4. **No White Backgrounds** - Use black or black with opacity
5. **No Instant Transitions** - Always use 200-300ms durations
6. **No Layout Shift on Hover** - Use scale transform carefully
7. **Avoid Pure White Borders** - Use blue-500 with opacity instead

---

## 📦 Technology Stack

- **Framework:** Next.js 15.5.4 with App Router
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React (SVG icons)
- **Fonts:** Google Fonts (Space Grotesk + DM Sans)
- **UI Components:** shadcn/ui with Radix UI primitives

---

## 🎓 Usage Guidelines

### When to Use This Design System

- **Automation platforms** (workflow builders, integration tools)
- **SaaS dashboards** (analytics, monitoring)
- **Developer tools** (APIs, technical products)
- **Tech-focused landing pages**

### Design Principles

1. **Technical Excellence** - Grid backgrounds and precise geometries
2. **Futuristic Aesthetics** - Glow effects and neon accents
3. **High Contrast** - Dark backgrounds with bright highlights
4. **Smooth Interactions** - Hover effects and transitions
5. **Performance-Conscious** - OLED-friendly dark mode

---

## 🔗 References

- [n8n.io](https://n8n.io) - Design inspiration
- [Space Grotesk Font](https://fonts.google.com/specimen/Space+Grotesk)
- [DM Sans Font](https://fonts.google.com/specimen/DM+Sans)
- [Lucide Icons](https://lucide.dev)
- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
