# Design System Document: The Precision Engine

## 1. Overview & Creative North Star
**Creative North Star: "The Mechanical Atelier"**
This design system moves beyond the cold, utilitarian nature of enterprise software to create a digital workspace that feels like a high-end, high-precision garage. We reject the "standard" admin template in favor of an **Editorial Bento** layout. 

The aesthetic is defined by **Tonal Layering** and **Asymmetric Balance**. We treat the dashboard not as a grid of boxes, but as a collection of "machined parts"—perfectly weighted, intentionally placed, and connected by whitespace rather than lines. The experience should feel authoritative yet breathable, reflecting the professional mastery required in modern automotive management.

---

## 2. Colors & Surface Architecture

### The "No-Line" Rule
To achieve a premium feel, **1px solid borders are prohibited** for sectioning. Structural boundaries must be defined solely through background color shifts.
- **Background (`#f7f9fb`)**: The base canvas.
- **Sectioning**: Use `surface_container_low` for large logical areas.
- **Nesting**: Place a `surface_container_lowest` (#ffffff) card on top of a `surface_container_low` background to create a "lift" effect without needing a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers:
1.  **Level 0 (Base):** `surface` (#f7f9fb) – The main background.
2.  **Level 1 (The Bento Grid):** `surface_container_low` (#f2f4f6) – Large grouping containers.
3.  **Level 2 (Interactive Elements):** `surface_container_lowest` (#ffffff) – Primary metric cards, data tables, and form fields.
4.  **Level 3 (Overlays):** `surface_bright` with Glassmorphism – Modals and Drawers.

### Signature Textures
- **The "Power Stroke" Gradient:** For primary CTAs and critical growth metrics, use a subtle linear gradient from `primary` (#0040a1) to `primary_container` (#0056d2) at a 135-degree angle. This adds "soul" and depth to the action buttons.
- **Glassmorphism:** For the Sidebar and Top Bar, use `surface_container_lowest` at 85% opacity with a `backdrop-filter: blur(12px)`. This integrates the navigation into the workspace rather than isolating it.

---

## 3. Typography: Be Vietnam Pro
Our typography follows an **Editorial Scale**. We use high contrast between Display and Body styles to establish an immediate information hierarchy.

| Role | Token | Size | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-md` | 2.75rem | 700 | Large KPI numbers in Bento cards. |
| **Headline** | `headline-sm` | 1.5rem | 600 | Page titles (e.g., "Quản lý Đơn hàng"). |
| **Title** | `title-md` | 1.125rem | 600 | Card headers and modal titles. |
| **Body** | `body-md` | 0.875rem | 400 | Standard data, table content. |
| **Label** | `label-md` | 0.75rem | 500 | Status badges and micro-copy. |

*Note: All Vietnamese diacritics must be perfectly vertically aligned. Ensure a line-height of 1.5 for body text to maintain "breathing room."*

---

## 4. Elevation & Depth

### Tonal Layering (The Primary Method)
Avoid shadows for static cards. Instead, use the `surface_container` tokens. A `surface_container_highest` element sitting on a `surface` background provides enough contrast to signify hierarchy without visual clutter.

### Ambient Shadows
For floating elements (Modals, Popovers), use a **Triple-Layer Shadow**:
- `box-shadow: 0 4px 6px -1px rgba(0, 64, 161, 0.04), 0 10px 15px -3px rgba(0, 64, 161, 0.06);`
- The shadow uses a tint of `primary` (#0040a1) rather than black to maintain a "clean" professional look.

### The "Ghost Border"
If a border is required for accessibility (e.g., in high-contrast mode), use `outline_variant` (#c3c6d6) at **15% opacity**. Never use 100% opaque borders.

---

## 5. Components & Bento Logic

### Bento Metric Cards
- **Structure:** Use `xl` (1.5rem) rounding.
- **Visuals:** Incorporate an ApexChart sparkline using the `secondary` color palette, positioned at the bottom of the card with a subtle fade-out.
- **Content:** The "Big Number" uses `display-md` in `on_surface`.

### Status Badges (Huy hiệu Trạng thái)
Use a **Soft-Fill** approach: a background color at 15% opacity of the main status color, with text in the 100% opaque color.
- **Chờ:** `secondary` (#515f74)
- **Đang làm:** `primary` (#0040a1)
- **Hoàn thành:** Green (Success)
- **Quá hạn / Còn nợ:** `error` (#ba1a1a)
- **Sắp hết hàng:** `tertiary` (#822800)

### Professional Tables
- **Prohibition:** Do not use vertical or horizontal divider lines. 
- **Alternative:** Use `spacing.4` (1rem) vertical padding and a `surface_container_low` background on `:hover` to define rows.
- **Header:** Use `label-md` in `on_surface_variant`, all-caps, with a 0.05em letter spacing for an architectural feel.

### Forms & Inputs
- **Base:** `surface_container_lowest` with a `md` (0.75rem) corner radius.
- **Active State:** A 2px "Ghost Border" using `primary` at 30% opacity and a subtle `primary_fixed` glow.

### Sidebar Navigation
- **Layout:** Vertical, slim profile. Use `surface_container_low` background.
- **Active Item:** Do not use a box. Use a vertical "pill" indicator (4px wide) on the left edge in `primary` and shift the text weight to 600.

---

## 6. Do's and Don'ts

### Do
- **Do** use whitespace (Spacing 6 or 8) as the primary way to separate Bento blocks.
- **Do** use `Be Vietnam Pro` weights intentionally—reserve 700 for numbers and 600 for headers.
- **Do** use "Ambient Light" logic: elements higher in the hierarchy should be lighter in color (`surface_container_lowest`).

### Don't
- **Don't** use pure black (#000000) for text. Always use `on_surface` (#191c1e).
- **Don't** use standard 1px borders to separate table cells or card sections.
- **Don't** use sharp corners. The minimum radius allowed is `sm` (0.25rem) for checkboxes; all cards must be `lg` or `xl`.
- **Don't** overcrowd the Bento grid. If a card has too much data, move it to a dedicated Drawer rather than expanding the card.

---

## 7. Signature Interaction: The "Smooth Shift"
When transitioning between dashboard views or opening Drawers, use a `Cubic-Bezier(0.4, 0, 0.2, 1)` transition at 300ms. Elements should feel like they have physical weight—sliding into place with a slight deceleration.