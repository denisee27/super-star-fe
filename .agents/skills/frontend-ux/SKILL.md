---
name: frontend-ux
description: >
  Design, build, audit, and improve frontend UI/UX components, pages, layouts, and design
  systems with distinctive, production-grade quality. Use this skill whenever the user asks to:
  build or create any UI component or page from scratch, redesign or improve existing UI,
  audit or review existing frontend code for design quality, fix something that looks generic
  or AI-generated, make UI more polished or professional, improve UX flow or interaction design,
  review and give feedback on a design or component, or refactor visual code for consistency.
  Also triggers when the user shares existing code and says "improve this", "make this look better",
  "this looks generic", "clean this up", or pastes a component asking for a review.
  Enforces anti-AI-slop design principles and produces interfaces that look intentionally crafted.
---

# Frontend UX Skill — Router

This skill operates in two modes. Detect which applies, load only the relevant reference file.
Do NOT load both files — load only what is needed to save tokens.

---

## Step 1 — Detect Mode

**CREATE mode** — user wants something built from scratch:
- "Build me a...", "Create a...", "Make a component for..."
- No existing code or screenshot provided
- → Read `references/create.md` then proceed

**IMPROVE mode** — user has existing UI to fix:
- User shares existing code, screenshot, or describes existing UI
- "Improve this", "Make this look better", "Fix this", "This looks generic"
- "Clean this up", "Polish this", "Refactor this", points at a specific section
- → Read `references/improve.md` then proceed

---

## Step 2 — Detect Scope (both modes)

Before loading any reference file, determine scope:

**Whole page / full component** — user says "this page", "all of it", shares full code
**Specific section** — user names a part: "the history list", "the navbar", "the card"
**Single element** — "this button", "the title", "that badge"

If scope is ambiguous → ask ONE question before proceeding:
"Do you want me to improve only [named part], or the full page?"

When scope is clear, state it explicitly before starting:
```
Scope: [what will be improved]
Leaving unchanged: [what will NOT be touched]
```

---

## Step 3 — Load Reference and Execute

Load the correct reference file based on mode detected in Step 1, then follow it completely.
