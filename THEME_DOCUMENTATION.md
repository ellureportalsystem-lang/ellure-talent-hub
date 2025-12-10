# Ellure NexHire - Complete Theme Documentation

## 📋 Table of Contents
1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Buttons](#buttons)
4. [Backgrounds](#backgrounds)
5. [Borders & Shadows](#borders--shadows)
6. [Gradients](#gradients)
7. [Spacing & Layout](#spacing--layout)
8. [Animations & Transitions](#animations--transitions)
9. [Component-Specific Styling](#component-specific-styling)

---

## 🎨 Color Palette

### Primary Colors (Light Mode)
- **Primary**: `hsl(212 100% 32%)` - Deep Blue (#0052CC)
  - Used for: Main buttons, links, active states, brand elements
  - Foreground: `hsl(0 0% 100%)` - White
  
- **Secondary**: `hsl(180 100% 33%)` - Teal/Cyan (#00A3A3)
  - Used for: Secondary buttons, accents, complementary actions
  - Foreground: `hsl(0 0% 100%)` - White

### Semantic Colors (Light Mode)
- **Success**: `hsl(142 76% 36%)` - Green (#0D9488)
  - Used for: Success messages, checkmarks, positive indicators
  - Foreground: `hsl(0 0% 100%)` - White

- **Warning**: `hsl(38 92% 50%)` - Amber/Orange (#F59E0B)
  - Used for: Warnings, alerts, caution indicators
  - Foreground: `hsl(0 0% 100%)` - White

- **Info**: `hsl(199 89% 48%)` - Sky Blue (#0EA5E9)
  - Used for: Information messages, info badges
  - Foreground: `hsl(0 0% 100%)` - White

- **Destructive**: `hsl(0 84.2% 60.2%)` - Red (#EF4444)
  - Used for: Delete actions, errors, destructive operations
  - Foreground: `hsl(0 0% 100%)` - White

### Background Colors (Light Mode)
- **Background**: `hsl(0 0% 100%)` - Pure White
- **Card**: `hsl(0 0% 100%)` - White
- **Muted**: `hsl(216 16% 95%)` - Very Light Gray (#F3F4F6)
- **Popover**: `hsl(0 0% 100%)` - White
- **Sidebar Background**: `hsl(0 0% 98%)` - Off-White (#FAFAFA)

### Text Colors (Light Mode)
- **Foreground**: `hsl(216 32% 17%)` - Dark Slate (#1E293B)
- **Muted Foreground**: `hsl(216 12% 45%)` - Medium Gray (#64748B)
- **Card Foreground**: `hsl(216 32% 17%)` - Dark Slate

### Border & Input Colors (Light Mode)
- **Border**: `hsl(216 16% 90%)` - Light Gray (#E2E8F0)
- **Input**: `hsl(216 16% 90%)` - Light Gray
- **Ring** (Focus): `hsl(212 100% 32%)` - Primary Blue

### Dark Mode Colors
- **Background**: `hsl(216 32% 8%)` - Very Dark Blue (#0F172A)
- **Foreground**: `hsl(0 0% 98%)` - Off-White
- **Card**: `hsl(216 28% 12%)` - Dark Gray-Blue (#1E293B)
- **Primary**: `hsl(212 100% 45%)` - Lighter Blue (#3B82F6)
- **Secondary**: `hsl(180 100% 40%)` - Lighter Teal (#14B8A6)
- **Muted**: `hsl(216 20% 18%)` - Dark Gray
- **Border**: `hsl(216 20% 18%)` - Dark Gray

---

## 📝 Typography

### Font Family
- **Default**: System font stack (no custom font imports found)
  - Uses browser default: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
  - Applied via Tailwind's default font stack

### Font Sizes
- **Text Base**: `1rem` (16px) - Default body text
- **Text SM**: `0.875rem` (14px) - Small text, captions
- **Text XS**: `0.75rem` (12px) - Extra small text, labels
- **Text LG**: `1.125rem` (18px) - Large body text
- **Text XL**: `1.25rem` (20px) - Extra large text
- **Text 2XL**: `1.5rem` (24px) - Headings
- **Text 3XL**: `1.875rem` (30px) - Large headings
- **Text 4XL**: `2.25rem` (36px) - Extra large headings
- **Text 5XL**: `3rem` (48px) - Hero headings
- **Text 6XL**: `3.75rem` (60px) - Massive headings

### Font Weights
- **Normal**: `400` - Regular text
- **Medium**: `500` - Medium emphasis
- **Semibold**: `600` - Semibold headings
- **Bold**: `700` - Bold headings, emphasis

### Font Styles
- **Antialiased**: Applied to body for smooth text rendering
- **Uppercase**: Used for labels, badges (with `tracking-wider`)

### Line Heights
- Default line heights from Tailwind:
  - Tight: `1.25`
  - Normal: `1.5`
  - Relaxed: `1.75`

---

## 🔘 Buttons

### Button Variants

#### 1. **Default Button** (`variant="default"`)
- **Background**: Primary Blue `hsl(212 100% 32%)`
- **Text**: White `hsl(0 0% 100%)`
- **Hover**: `bg-primary/90` (90% opacity)
- **Usage**: Primary actions, main CTAs

#### 2. **Secondary Button** (`variant="secondary"`)
- **Background**: Secondary Teal `hsl(180 100% 33%)`
- **Text**: White `hsl(0 0% 100%)`
- **Hover**: `bg-secondary/80` (80% opacity)
- **Usage**: Secondary actions, alternative CTAs

#### 3. **Outline Button** (`variant="outline"`)
- **Border**: Input color `hsl(216 16% 90%)`
- **Background**: Transparent/Background
- **Text**: Foreground color
- **Hover**: Accent background with accent foreground
- **Usage**: Tertiary actions, less prominent buttons

#### 4. **Ghost Button** (`variant="ghost"`)
- **Background**: Transparent
- **Text**: Foreground color
- **Hover**: Accent background with accent foreground
- **Usage**: Subtle actions, icon buttons, navigation

#### 5. **Destructive Button** (`variant="destructive"`)
- **Background**: Red `hsl(0 84.2% 60.2%)`
- **Text**: White
- **Hover**: `bg-destructive/90`
- **Usage**: Delete actions, dangerous operations

#### 6. **Link Button** (`variant="link"`)
- **Text**: Primary color
- **Decoration**: Underline on hover
- **Usage**: Text links styled as buttons

### Button Sizes
- **Default**: `h-10 px-4 py-2` (40px height)
- **Small** (`size="sm"`): `h-9 px-3` (36px height, rounded-md)
- **Large** (`size="lg"`): `h-11 px-8` (44px height, rounded-md)
- **Icon** (`size="icon"`): `h-10 w-10` (40x40px square)

### Button States
- **Disabled**: `opacity-50` with `pointer-events-none`
- **Focus**: Ring with primary color, 2px offset
- **Hover Effects**: 
  - Scale: `scale-[1.02]` (via `btn-hover` class)
  - Shadow: `shadow-lg` on hover

### Custom Button Classes
- **`.btn-hover`**: Adds transition and hover effects
  - `transition-all duration-300 ease-out`
  - Hover: `shadow-lg scale-[1.02]`

---

## 🎨 Backgrounds

### Main Backgrounds
- **Page Background**: `bg-gradient-subtle` - Subtle gradient from white to very light gray
- **Hero Section**: `bg-gradient-primary` - Primary gradient (blue to teal)
- **Card Background**: `bg-card` - White (light mode) / Dark gray-blue (dark mode)
- **Muted Background**: `bg-muted` - Very light gray
- **Footer Background**: `bg-muted/30` - 30% opacity muted color

### Background Utilities
- **`.bg-dots`**: Radial gradient dots pattern
  - Color: Muted foreground at 10% opacity
  - Size: 20px x 20px grid
  
- **`.bg-grid`**: Grid pattern
  - Color: Border color at 50% opacity
  - Size: 40px x 40px grid

### Background Opacity Variations
- `/10` - 10% opacity (e.g., `bg-primary/10`)
- `/20` - 20% opacity
- `/30` - 30% opacity
- `/50` - 50% opacity
- `/90` - 90% opacity

---

## 🔲 Borders & Shadows

### Border Radius
- **Default Radius**: `0.75rem` (12px) - `--radius`
- **Large** (`rounded-lg`): `0.75rem` (12px)
- **Medium** (`rounded-md`): `calc(0.75rem - 2px)` (10px)
- **Small** (`rounded-sm`): `calc(0.75rem - 4px)` (8px)
- **Full** (`rounded-full`): For circular elements

### Border Colors
- **Default**: `border-border` - Light gray `hsl(216 16% 90%)`
- **Primary**: `border-primary` - Primary blue
- **Muted**: `border-muted` - Muted gray
- **Input**: `border-input` - Same as border

### Shadows

#### Light Mode Shadows
- **Small** (`shadow-sm`): `0 2px 4px hsl(216 32% 17% / 0.05)`
- **Medium** (`shadow-md`): `0 4px 12px hsl(216 32% 17% / 0.08)`
- **Large** (`shadow-lg`): `0 8px 24px hsl(216 32% 17% / 0.12)`
- **Extra Large** (`shadow-xl`): `0 12px 32px hsl(216 32% 17% / 0.16)`

#### Dark Mode Shadows
- **Small**: `0 2px 4px hsl(0 0% 0% / 0.2)`
- **Medium**: `0 4px 12px hsl(0 0% 0% / 0.3)`
- **Large**: `0 8px 24px hsl(0 0% 0% / 0.4)`
- **Extra Large**: `0 12px 32px hsl(0 0% 0% / 0.5)`

---

## 🌈 Gradients

### Primary Gradient (`bg-gradient-primary`)
- **Light Mode**: `linear-gradient(135deg, hsl(212 100% 32%), hsl(180 100% 33%))`
  - From: Primary Blue to Secondary Teal
  - Angle: 135 degrees (diagonal)
  
- **Dark Mode**: `linear-gradient(135deg, hsl(212 100% 45%), hsl(180 100% 40%))`
  - Lighter versions of primary colors

### Subtle Gradient (`bg-gradient-subtle`)
- **Light Mode**: `linear-gradient(180deg, hsl(0 0% 100%), hsl(216 16% 98%))`
  - From: White to Very Light Gray
  - Angle: 180 degrees (vertical)
  
- **Dark Mode**: `linear-gradient(180deg, hsl(216 32% 8%), hsl(216 28% 12%))`
  - From: Dark background to slightly lighter

### Gradient Text (`.gradient-text`)
- **Class**: `bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary`
- **Effect**: Text with gradient from primary to secondary color

---

## 📐 Spacing & Layout

### Container
- **Max Width**: `1400px` (2xl breakpoint)
- **Padding**: `2rem` (32px)
- **Centered**: Yes

### Common Spacing Values
- **Gap**: `gap-1` (4px) to `gap-8` (32px)
- **Padding**: `p-2` (8px) to `p-12` (48px)
- **Margin**: `m-2` (8px) to `m-8` (32px)

### Grid Layouts
- **2 Columns**: `grid-cols-2`
- **3 Columns**: `grid-cols-3`
- **4 Columns**: `grid-cols-4`
- **Responsive**: `md:grid-cols-2`, `lg:grid-cols-3`, etc.

---

## ✨ Animations & Transitions

### Transition Classes
- **Default**: `transition-all duration-300 ease-out`
- **Colors**: `transition-colors duration-300`
- **Transform**: `transition-transform duration-300`

### Custom Animation Classes

#### `.card-hover`
- **Default**: `transition-all duration-300 ease-out`
- **Hover**: `shadow-xl -translate-y-1` (lifts card up)

#### `.btn-hover`
- **Default**: `transition-all duration-300 ease-out`
- **Hover**: `shadow-lg scale-[1.02]` (slight scale up)

#### `.icon-hover`
- **Default**: `transition-all duration-300`
- **Hover**: `scale-110` (10% scale up)

#### `.accordion-smooth`
- **Transition**: Height and opacity with cubic-bezier easing
- **Duration**: 0.4s for height, 0.3s for opacity

### Keyframe Animations
- **Accordion Down**: Height animation from 0 to content height
- **Accordion Up**: Height animation from content height to 0
- **Duration**: 0.2s ease-out

---

## 🧩 Component-Specific Styling

### Navbar
- **Background**: `bg-background/95` with backdrop blur
- **Height**: `h-16` (64px)
- **Border**: Bottom border
- **Sticky**: `sticky top-0 z-50`
- **Active Link**: Primary color with underline animation
- **Hover**: Primary color with background highlight

### Footer
- **Background**: `bg-muted/30`
- **Border**: Top border
- **Padding**: `py-12` (48px vertical)
- **Social Icons**: Circular with primary/10 background, hover to primary

### Cards
- **Background**: `bg-card`
- **Border**: `border` (light gray)
- **Shadow**: `shadow-lg` or `shadow-xl` on hover
- **Padding**: `p-6` to `p-12`
- **Hover Effect**: Lift up with shadow (`card-hover`)

### Input Fields
- **Background**: `bg-background`
- **Border**: `border-input` (light gray)
- **Focus Ring**: Primary color, 2px offset
- **Placeholder**: Muted foreground color

### Badges/Tags
- **Primary Badge**: `bg-primary/10 text-primary`
- **Success Badge**: `bg-success/10 text-success`
- **Info Badge**: `bg-info/10 text-info`
- **Warning Badge**: `bg-warning/10 text-warning`
- **Shape**: `rounded-full` with `px-3 py-1`

### Progress Bars
- **Background**: Muted color
- **Fill**: Primary color
- **Height**: `h-2` (8px)

### Tabs
- **Active**: Primary color
- **Inactive**: Muted foreground
- **Background**: Muted/10

### Sidebar (if used)
- **Background**: `hsl(0 0% 98%)` (light) / `hsl(216 28% 12%)` (dark)
- **Foreground**: Dark slate (light) / Off-white (dark)
- **Accent**: Muted background on hover

---

## 🎯 Usage Examples

### Primary CTA Button
```tsx
<Button size="lg" className="btn-hover">
  Get Started
</Button>
```

### Secondary Action Button
```tsx
<Button variant="secondary" size="lg" className="btn-hover">
  Learn More
</Button>
```

### Outline Button
```tsx
<Button variant="outline">
  Cancel
</Button>
```

### Card with Hover Effect
```tsx
<Card className="card-hover">
  <CardContent>Content</CardContent>
</Card>
```

### Gradient Background Section
```tsx
<section className="bg-gradient-primary text-primary-foreground">
  Hero Content
</section>
```

### Muted Background Section
```tsx
<section className="bg-muted/30">
  Content
</section>
```

### Badge/Tag
```tsx
<span className="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary">
  Active
</span>
```

---

## 📱 Responsive Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1400px (container max-width)

---

## 🌓 Dark Mode Support

All colors have dark mode variants defined in `src/index.css` under `.dark` class. The theme automatically switches based on the `dark` class on the root element.

---

## 📌 Key Design Principles

1. **Consistency**: All colors use HSL format with CSS variables
2. **Accessibility**: High contrast ratios for text on backgrounds
3. **Modern**: Clean, minimal design with subtle animations
4. **Professional**: Blue/Teal color scheme conveys trust and professionalism
5. **Responsive**: Mobile-first approach with breakpoint-based layouts

---

*Last Updated: Based on current codebase analysis*
*Theme System: Tailwind CSS with custom CSS variables*


