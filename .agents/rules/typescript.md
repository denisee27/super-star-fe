---
trigger: always_on
---

# TypeScript Rules

## Style
- Follow Airbnb TypeScript style guide
- Use meaningful, descriptive names over short abbreviations
- Prefer readability over cleverness

## Types
- Always define explicit return types on functions
- No `any` — use `unknown` and narrow it
- Prefer `interface` for object shapes, `type` for unions and primitives
- Use `readonly` for props that should not mutate

## Functions
- Prefer named functions over anonymous arrows for top-level declarations
- Keep functions small and single-purpose
- Use early returns to reduce nesting

## Imports
- Use existing well-known libraries instead of writing from scratch
- Group imports: external → internal → types
- No default exports except for pages and components
- Never import a module that is not used — remove unused imports immediately

## Error Handling
- Always handle promise rejections explicitly
- Use typed error classes instead of throwing plain strings

## Naming
- `PascalCase` for types, interfaces, classes, components
- `camelCase` for variables, functions, methods
- `SCREAMING_SNAKE_CASE` for constants
- `kebab-case` for file names

## Comments
- Comments must be plain descriptive English — no decorative characters
- Code must speak for itself — naming of variables, functions, and types must be descriptive enough that no comment is needed to understand intent
- For complex logic, use a single-line simulation comment in the format `// "input example" -> "output example"` — show real data, not explanation
- Never write comments that describe what the code does line by line — the simulation comment is enough

## Folder Structure & File Placement
- Before creating any file, check if a matching folder already exists
- Never create a file at the root if a relevant subfolder exists
- One responsibility per file — if a file grows beyond ~200 lines, split it
- Before and after every edit, scan the file line count — if it exceeds 400 lines, it must be split immediately
- When a file exceeds 400 lines: extract functions into a dedicated helper or utils file, never leave the file over 400 lines after your edit is done
- Index files (`index.ts`) are for re-exports only — no logic inside

## Coding Flow
- Always define types and interfaces first before writing implementation
- Write the function signature and return type before the body
- Never leave `TODO` comments — either implement it now or open an issue
- When adding a feature: types → implementation → export → test
- When fixing a bug: reproduce → isolate → fix → verify

## Constants & Types
- Zero tolerance for magic strings or magic numbers anywhere in the codebase
- Every string or number that represents a domain concept, state, role, status, or config value must be a named constant — no exceptions
- When a string or number value is used even once as a domain value, create a `const` object with `as const` and a corresponding union type
- Always derive the union type from the const object using `typeof CONST[keyof typeof CONST]` — never write the union type manually
- Group related constants into a single `const` object, not separate variables
- Place constants and their types at the top of the file or in a dedicated `constants.ts` file if shared across files
- When scanning existing code and a magic string or number is found, extract it immediately before continuing with the task

## Conditional Logic
- No nested ternaries — more than 1 level deep must be refactored
- Use `if/else` blocks when there are 3 or more conditions
- Use a lookup object (`Record<string, value>`) for string-based branching instead of chained ternaries or else-if chains
- Extract complex conditional logic into a named function with an explicit return type
- Use `??` (nullish coalescing) instead of `||` when the fallback is only for `null` or `undefined`

## File Creation Rules
- Check for existing utilities before creating new ones
- If a helper is used more than once, move it to a shared `utils/` or `helpers/` folder
- Feature-specific code stays inside the feature folder, not at the top level
- Never duplicate logic — extract shared code immediately