---
trigger: manual
---

# Layered Architecture — Frontend Rules

## Overview
Layered Architecture separates the application into horizontal layers where each layer
has a single responsibility and can only communicate with the layer directly below it.
Layers: Presentation → Application → Domain → Infrastructure

## Folder Structure
src/
  pages/          # Route-level components — one file per route
  components/     # Reusable UI components — no business logic
  containers/     # Stateful components that connect UI to application layer
  hooks/          # Custom hooks — one hook per concern
  services/       # Application logic — orchestrates domain and infrastructure
  domain/         # Business entities, types, and pure business rules
  infrastructure/ # API calls, local storage, third-party integrations
  store/          # Global state (if needed)
  utils/          # Pure helper functions with no side effects
  assets/         # Static files: images, fonts, icons
  config/         # Environment variables and app-wide constants

## Layer Rules
- Presentation layer (pages/, components/, containers/) must never import from infrastructure/
- Application layer (services/, hooks/) orchestrates domain and infrastructure — never the other way
- Domain layer (domain/) must be pure — no framework imports, no React, no API calls
- Infrastructure layer (infrastructure/) is the only place allowed to make API calls or access storage
- Data always flows downward: pages → containers → services → domain/infrastructure
- Never skip a layer — a page must not import directly from infrastructure/

## File Placement
- pages/ contains only route-level components — no reusable logic inside
- components/ contains only presentational components — no data fetching, no side effects
- containers/ is the bridge between UI and logic — keeps components clean
- services/ contains one file per use case (e.g. authService.ts, productService.ts)
- domain/ contains interfaces, types, and pure functions only
- infrastructure/ contains one file per external resource (e.g. api.ts, localStorage.ts)

## Naming Conventions
- Pages: PascalCase matching the route (e.g. ProductDetailPage.tsx)
- Components: PascalCase describing the UI element (e.g. ProductCard.tsx)
- Containers: PascalCase with Container suffix (e.g. ProductListContainer.tsx)
- Services: camelCase with Service suffix (e.g. productService.ts)
- Domain entities: PascalCase interface (e.g. Product, Order, User)
- Infrastructure files: camelCase with Api or Repository suffix (e.g. productApi.ts)

## Dependency Rules
- components/ and pages/ may import from components/, hooks/, and domain/ only
- containers/ may import from components/, hooks/, services/, and domain/
- services/ may import from domain/ and infrastructure/ only
- infrastructure/ may import from domain/ only
- domain/ imports nothing from the project — only external pure libraries
