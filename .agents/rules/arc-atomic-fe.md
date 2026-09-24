---
trigger: manual
---

# Atomic Design — Frontend Rules

## Overview
Atomic Design organizes UI components by complexity and reusability,
from the smallest indivisible unit (atom) up to full pages.
Hierarchy: atoms → molecules → organisms → templates → pages

## Folder Structure
src/
  components/
    atoms/       # Smallest UI units — cannot be broken down further
    molecules/   # Combinations of atoms forming a functional unit
    organisms/   # Complex UI sections composed of molecules and atoms
  templates/     # Page layouts — define structure, not content
  pages/         # Full pages — inject real content into templates
  hooks/         # Custom hooks — one concern per hook
  services/      # Data fetching and business logic
  store/         # Global state (if needed)
  utils/         # Pure helper functions
  assets/        # Static files: images, fonts, icons
  styles/        # Global styles and design tokens

## Level Definitions

### Atoms
- Single HTML elements or the smallest possible UI unit
- Examples: Button, Input, Label, Icon, Badge, Spinner
- Must have no dependency on other components
- Must be fully controlled via props — no internal data fetching

### Molecules
- Two or more atoms combined to form a functional UI unit
- Examples: FormField (Label + Input), SearchBar (Input + Button), NavItem (Icon + Label)
- May import from atoms/ only
- Must remain generic — no business-domain-specific logic

### Organisms
- Complex UI sections that represent a distinct section of the interface
- Examples: Header, ProductCard, CommentList, CheckoutForm
- May import from atoms/ and molecules/
- May contain domain-specific logic and data (connected to store or services)

### Templates
- Page-level layout components — define where content goes, not what it is
- Examples: DashboardTemplate, AuthTemplate, TwoColumnLayout
- May import from organisms/, molecules/, atoms/
- Must use placeholder props or slots — never hardcode real data

### Pages
- Final assembled views with real data injected into templates
- Examples: HomePage, ProductDetailPage, LoginPage
- May import from templates/, organisms/, hooks/, services/
- One file per route — the only place where routing context is consumed

## Naming Conventions
- All component files: PascalCase (e.g. Button.tsx, SearchBar.tsx, ProductCard.tsx)
- Atoms folder: atoms/Button/Button.tsx — one folder per atom with co-located styles and types
- Molecules folder: molecules/SearchBar/SearchBar.tsx
- Organisms folder: organisms/Header/Header.tsx
- Templates folder: templates/DashboardTemplate.tsx
- Pages folder: pages/ProductDetailPage.tsx

## Dependency Rules
- atoms/ imports nothing from the project
- molecules/ imports from atoms/ only
- organisms/ imports from molecules/ and atoms/ only
- templates/ imports from organisms/, molecules/, and atoms/ only
- pages/ imports from templates/, organisms/, hooks/, and services/
- Never import upward — atoms must not import from molecules, molecules must not import from organisms

## Component Rules
- Never assign margins directly to a component — margins are assigned by the parent
- Atoms and molecules must be fully reusable across domains — no business-specific strings or logic
- Organisms may know about business domains but must not fetch data directly — receive via props or hooks
- If a component is used in only one place, question whether it belongs one level higher
