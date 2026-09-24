---
trigger: manual
---

# Clean Architecture — Frontend Rules

## Overview
Clean Architecture separates the application into concentric layers where business rules
are at the core, independent of frameworks, UI, and infrastructure.
Layers from inner to outer: Entities → Use Cases → Adapters → Frameworks & Drivers (UI)
Dependency rule: outer layers depend on inner layers — never the reverse.

## Folder Structure
src/
  core/
    entities/     # Business objects and pure domain logic — no framework dependency
    use-cases/    # Application business rules — orchestrates entities
    ports/        # Interfaces (contracts) for infrastructure — implemented by adapters
  adapters/
    repositories/ # Implements ports — talks to API or storage
    presenters/   # Transforms use case output into UI-ready format
    controllers/  # Handles user input and calls use cases
  infrastructure/
    api/          # HTTP clients, REST or GraphQL calls
    storage/      # Local storage, cookies, IndexedDB
    services/     # Third-party integrations (analytics, auth providers)
  ui/
    components/   # Reusable presentational React components
    pages/        # Route-level components
    hooks/        # React hooks that connect UI to controllers or presenters
  config/         # Environment variables and app-wide constants
  utils/          # Pure utility functions with no side effects

## Layer Rules
- core/ must have zero framework imports — no React, no axios, no third-party libraries
- core/entities/ contains only business objects, value objects, and pure domain logic
- core/use-cases/ orchestrates entities and calls ports — never calls infrastructure directly
- core/ports/ defines interfaces that infrastructure must implement — never implements them
- adapters/ implements ports from core/ — the only layer allowed to bridge core and infrastructure
- infrastructure/ contains all side effects — API calls, storage, external services
- ui/ imports from adapters/ and core/ports/ only — never from infrastructure/ directly
- Dependency injection is used to provide infrastructure implementations to use cases

## Naming Conventions
- Entities: PascalCase interface or class (e.g. User, Product, Order)
- Use cases: camelCase describing the action (e.g. createOrder.ts, authenticateUser.ts)
- Ports: PascalCase interface with Repository or Service suffix (e.g. IProductRepository, IAuthService)
- Repositories: PascalCase with Repository suffix (e.g. ProductRepository.ts)
- Presenters: PascalCase with Presenter suffix (e.g. ProductPresenter.ts)
- Controllers: PascalCase with Controller suffix (e.g. CheckoutController.ts)
- UI Components: PascalCase (e.g. ProductCard.tsx, CheckoutForm.tsx)

## File Placement Rules
- If logic does not depend on React, it belongs in core/ — not in ui/
- If logic talks to an external resource, it belongs in infrastructure/ — not in core/
- If logic transforms data between layers, it belongs in adapters/
- Business rules that change often stay in core/use-cases/
- Business rules that rarely change stay in core/entities/
- Never put a fetch call in a React component — delegate to an adapter via a hook

## Dependency Injection Rules
- Use cases receive their dependencies (ports) via constructor or function parameter injection
- React hooks act as the composition root — they wire use cases with their implementations
- Never instantiate infrastructure classes directly inside use cases or components
- Infrastructure implementations are provided at the app boundary (app/ or root providers)

## Testing Strategy
- core/entities/ and core/use-cases/ are tested in pure unit tests — no mocks needed for framework
- adapters/ are tested with integration tests against mock infrastructure
- ui/ components are tested with component tests — mock adapters, not infrastructure
- infrastructure/ is tested with end-to-end or contract tests
