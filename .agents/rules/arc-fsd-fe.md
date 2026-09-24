---
trigger: manual
---

# Feature-Sliced Design (FSD) — Frontend Rules

## Overview
FSD organizes code by scope of influence (layers), domain (slices), and technical purpose (segments).
Layers from top to bottom: app → pages → widgets → features → entities → shared
Higher layers may import from lower layers — never the reverse.

## Folder Structure
src/
  app/        # App initialization: routing, global providers, global styles
  pages/      # Full route pages — compose widgets and features
  widgets/    # Independent UI blocks composed of features and entities
  features/   # User interactions and business scenarios (e.g. add-to-cart, login)
  entities/   # Business models reused across features (e.g. User, Product, Order)
  shared/     # Generic reusable code with no business logic (ui/, api/, lib/, config/)

## Layer Rules
- app/ may import from all layers
- pages/ may import from widgets/, features/, entities/, shared/
- widgets/ may import from features/, entities/, shared/
- features/ may import from entities/ and shared/ only — never from other features/
- entities/ may import from shared/ only — never from features/ or widgets/
- shared/ must not import from any layer above it
- Cross-feature communication must be lifted to pages/ or widgets/ — never coupled directly

## Slice Rules
- Every slice (except app/ and shared/) must have a public API via index.ts
- External code imports from the slice root only (e.g. features/auth) — never from internals
- Whatever is not exported from index.ts is an implementation detail — freely reorganizable
- A slice must be independently deletable — deleting it should only affect pages/ that compose it

## Segment Conventions (inside each slice)
- ui/       — React components and styles
- model/    — State, types, stores, business logic
- api/      — API calls and data fetching specific to this slice
- lib/      — Internal helpers and utilities
- config/   — Slice-level constants and configuration

## Naming Conventions
- Slice folders: kebab-case matching the domain concept (e.g. add-to-cart/, user-profile/)
- Segment folders: lowercase fixed names (ui/, model/, api/, lib/, config/)
- Components inside ui/: PascalCase
- Hooks inside model/: camelCase prefixed with use
- API functions inside api/: camelCase

## File Placement Rules
- Shared UI primitives (Button, Input, Modal) belong in shared/ui/
- Generic API utilities (axios instance, fetch wrapper) belong in shared/api/
- Business models used by more than one feature belong in entities/
- A util used by exactly one feature stays inside that feature — move to shared/ only when two or more features need it
- Never put business logic in shared/ — it must remain domain-agnostic
