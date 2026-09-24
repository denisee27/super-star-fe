# IMPROVE MODE — Audit & Upgrade Existing UI

## Step 1 — Confirm Scope

State scope before touching anything:
```
Scope: [what will be improved]
Leaving unchanged: [what will NOT be touched]
```

Only audit and rewrite within the confirmed scope.
Never expand scope beyond what the user specified.
Output only the changed scope — not the full file, not surrounding components.

---

## Step 2 — Audit

Scan only the scoped area against these categories:

### Typography
- Generic font stack only (Inter, system-ui, Arial — no distinctive pairing)
- Inconsistent type scale (arbitrary px values, no clear hierarchy)
- Line height or letter spacing not set deliberately
- Missing responsive type scaling
- Body font below 16px on mobile

### Color
- Hardcoded hex values instead of CSS variables / design tokens
- No clear color hierarchy (everything same visual weight)
- Insufficient contrast (below WCAG AA: 4.5:1 body, 3:1 large text)
- Missing semantic colors (success, error, warning not defined)

### Spacing
- Arbitrary spacing values not on a consistent scale
- Inconsistent padding inside similar components
- Content cramped or layout too sparse without reason

### Layout
- Default stacked layout with no intentional composition
- Full-width elements where max-width would improve readability
- Missing responsive behavior
- No visual hierarchy guiding the eye

### Component States
- Missing interactive states (hover, focus, active, disabled, loading)
- Placeholder-only form labels (no persistent label above input)
- No empty state design
- No error state design
- Loading state is spinner-only — no skeleton for layout-heavy content

### Mobile Responsiveness
- Breaks or overflows at 375px width (iPhone SE)
- Touch targets below 44x44px
- Hover-only interactions with no touch equivalent
- Layout does not reflow at breakpoints
- Font sizes require zooming to read on mobile
- Fixed-width elements that overflow on small screens
- Full table rendered on mobile without card layout or scroll fallback
- Form inputs not full-width on mobile

### AI-Slop Patterns (flag each one found)
- Purple-to-blue gradient as hero or background
- Inter as sole font choice
- Generic drop shadow cards in three-column grid
- Centered CTA button on gradient background
- Icon + heading + paragraph three-column features section
- Navbar: logo left, links center, button right — unstyled default
- Empty modal: header / scrollable body / Cancel + Confirm footer
- Stacked full-width form inputs with no visual design
- "No items yet" empty state with no design
- Undraw-style illustrations

### Code Quality
- Hardcoded colors, spacing, or font sizes (not using variables/tokens)
- Inline styles for static values
- Missing accessibility (no focus styles, no aria labels, non-semantic HTML)
- `!important` usage
- Inconsistent class ordering (Tailwind)

---

## Step 3 — Prioritize

**Critical** — breaks usability or accessibility:
missing focus styles, contrast failures, non-keyboard-accessible interactions,
mobile overflow/breakage, touch targets too small

**High** — significantly degrades visual quality:
AI-slop patterns, missing states, inconsistent spacing, hardcoded values,
mobile layout not responsive

**Medium** — polish and consistency:
type scale, color tokens, layout refinement, motion

**Low** — nice-to-have:
advanced micro-interactions, animation polish

---

## Step 4 — Improve

- Fix all Critical and High issues by default
- Ask user before tackling Medium and Low if scope is large
- Preserve functionality exactly — only improve appearance and UX
- Do not change prop interfaces unless necessary
- Output only the scoped section — not the full file

---

## Output Format

```
## Scope
Improving: [confirmed scope]
Leaving unchanged: [what is not touched]

## Audit Results

**Critical**
- [issue] → [fix applied]

**High**
- [issue] → [fix applied]

**Medium** (applied / skipped — ask user)
- [issue] → [fix applied or proposed]

## What Changed
- [change 1]: [why]
- [change 2]: [why]

## Improved Code
[only the scoped section — not the full file]
```
