---
trigger: manual
---

# Feature-Based (Colocated) Architecture — Frontend Rules

## Overview
Feature-Based Architecture organizes code by feature/domain rather than by technical type.
Everything a feature needs — components, hooks, services, types, tests — lives together in
one folder. Code is colocated by ownership, not by file type.
Philosophy: if you delete a feature folder, nothing outside it should break.

## Folder Structure
src/
  features/           # One folder per feature/domain
    auth/
      components/     # UI components owned by this feature
      hooks/          # Hooks used only by this feature
      services/       # Data fetching and business logic for this feature
      types/          # TypeScript types and interfaces for this feature
      utils/          # Helper functions scoped to this feature
      constants.ts    # Constants scoped to this feature
      index.ts        # Public API — re-exports only
    dashboard/
      components/
      hooks/
      services/
      types/
      index.ts
    product/
      components/
      hooks/
      services/
      types/
      index.ts
  shared/             # Code used by more than one feature
    components/       # Reusable UI primitives (Button, Input, Modal)
    hooks/            # Reusable hooks shared across features
    services/         # Shared API utilities (axios instance, fetch wrapper)
    types/            # Shared TypeScript types and interfaces
    utils/            # Shared pure helper functions
    constants.ts      # App-wide constants
  pages/              # Route-level components — compose features, no logic
  app/                # App initialization: routing, providers, global styles
  config/             # Environment variables and app-wide configuration
  assets/             # Static files: images, fonts, icons

## Feature Rules
- Every feature is self-contained — components, hooks, services, types stay inside the feature folder
- Every feature exposes a public API via index.ts — external code imports from the feature root only
- Never import from inside a feature's internals (e.g. features/auth/components/LoginForm) — always from the root (features/auth)
- Features must not import from each other directly — shared code is lifted to shared/
- Deleting a feature folder must not break any other feature folder
- pages/ composes features — it is the only place where multiple features are wired together

## Shared vs Feature
- If a component, hook, or util is used by exactly one feature — it lives inside that feature
- If it is used by two or more features — move it to shared/ immediately
- Never preemptively put code in shared/ — wait until the second feature needs it
- shared/ must remain domain-agnostic — no business logic tied to a specific feature

## File Placement Rules
- Route-level components belong in pages/ — they import from features/, not the other way around
- App-wide providers, routing setup, and global styles belong in app/
- index.ts inside each feature is for re-exports only — no logic inside
- One responsibility per file — if a file grows beyond ~200 lines, split it

## Naming Conventions
- Feature folders: kebab-case matching the domain (e.g. user-profile/, order-management/)
- Components: PascalCase (e.g. LoginForm.tsx, ProductCard.tsx)
- Hooks: camelCase prefixed with use (e.g. useAuthSession.ts, useProductList.ts)
- Services: camelCase with Service suffix (e.g. authService.ts, productService.ts)
- Types files: camelCase or PascalCase matching the domain (e.g. auth.types.ts, Product.ts)
- Constants files: constants.ts at feature or shared level

## Dependency Rules
- pages/ may import from features/ and shared/
- features/ may import from shared/ only — never from other features/
- shared/ imports nothing from features/ or pages/
- app/ may import from features/, shared/, and pages/
- Cross-feature data sharing is handled via shared/ types and services, or lifted to pages/