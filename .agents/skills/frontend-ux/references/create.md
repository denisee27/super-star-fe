# CREATE MODE — Build from Scratch

## Step 1 — Understand Context

Before writing code, answer:
- **Who uses this?** (developer tool, consumer app, B2B dashboard, marketing site)
- **What emotion should it trigger?** (trust, delight, focus, urgency, calm)
- **What is the ONE thing the user must notice or do?**
- **What aesthetic direction fits?** (see Direction Palette below)

---

## Step 2 — Pick a Direction, Commit Fully

Choose ONE direction. Do not mix. Do not hedge.

**Refined Minimal**
Sharp whitespace. One accent color. Tight type scale. Beauty from proportion.
Think: Linear, Vercel, Raycast.
- Font: geometric sans + monospace
- Motion: fast, subtle, purposeful

**Editorial / Magazine**
Strong typographic hierarchy. Large display type. Grid-breaking layouts.
Think: Are.na, Cargo, editorial sites.
- Font: serif display + condensed sans
- Motion: scroll-based reveals, type animation

**Brutalist / Raw**
High contrast. Borders exposed. Functional layout visible.
Think: brutalist.fyi, data-heavy tools.
- Font: system mono + grotesque
- Color: black/white + one hard color

**Organic / Warm**
Soft radius. Warm neutrals. Human-feeling. Approachable.
Think: Notion, consumer wellness, newer Linear.
- Font: rounded sans + variable weight
- Motion: elastic, gentle

**Technical / Dense**
Information density is a feature. Compact. Data first.
Think: GitHub, Datadog, Linear issue view.
- Font: tabular mono + small sans
- Color: dark bg, syntax-colored accents
- Motion: none

**Playful / Expressive**
Bold color. Personality. Designed to be remembered.
Think: Duolingo, Loom, early Stripe.
- Font: variable display + rounded body
- Motion: bouncy, character-driven

---

## Step 3 — Anti-Slop Checklist

Never produce:
- `font-family: Inter, system-ui` as the only font
- Purple-to-blue gradient backgrounds
- Generic card grid with drop shadow as primary layout
- Centered "Get Started" CTA on gradient background
- Icon + heading + paragraph three-column feature section
- Default navbar: logo left, links center, CTA right — unstyled
- Empty modal: header / scrollable body / Cancel + Confirm footer
- Stacked full-width form inputs with no visual treatment
- "No items yet" empty state with no design
- Undraw-style illustrations

---

## Step 4 — Design Standards

### Typography
- Never use Inter alone — pair or replace with a distinctive choice
- Define a type scale and use it consistently — no arbitrary px values
- Line height 1.5–1.7 for body text
- Max content width 65ch for reading-focused content
- Minimum body font size 16px on mobile

### Color
- All colors as CSS custom properties at `:root`
- Never hardcode hex values outside `:root`
- Minimum 5-step neutral palette
- Semantic colors defined: success, error, warning, info

### Spacing
- Base unit: 4px or 8px — use the scale, never arbitrary values
- Consistent padding per component size variant (sm / md / lg)
- Touch targets minimum 44x44px

### States (all must be designed)
- hover, focus, active, disabled, loading
- Empty state: icon + headline + supporting text + CTA
- Error state: specific visual treatment, not just red text
- Loading: skeleton for layout-heavy, spinner only for actions

### Mobile Responsiveness
- Design mobile-first — default styles target mobile, scale up with breakpoints
- Single column on mobile, multi-column on desktop
- Touch targets minimum 44x44px, minimum 8px gap between targets
- Never hover-only interactions — touch has no hover
- Bottom tab bar for mobile nav with 4 items or fewer
- Full-width inputs on mobile, `inputMode` matching content type
- Test layout at 375px width (iPhone SE) before finalizing

### Accessibility
- All interactive elements keyboard accessible
- Focus ring: never `outline: none` without a custom replacement
- Color is never the only state differentiator
- `aria-label` on icon-only buttons
- Semantic HTML — never `div` for buttons or links

### Motion
- Only animate when removing it would make the experience worse
- Entrance: ease-out, 200–300ms
- Exit: ease-in, 150–200ms
- Feedback: 100ms
- Never animate decorative elements on loop
- Always wrap animations with `prefers-reduced-motion` check

---

## Output Format

```
## Direction
[2–3 sentences: chosen direction and why it fits the context]

## Design Decisions
- [decision 1]
- [decision 2]
- [decision 3]
- [decision 4]
- [decision 5]

## Code
[full production-ready component]
```
