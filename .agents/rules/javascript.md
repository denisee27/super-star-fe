---
trigger: always_on
---

# JavaScript Rules

## Style
- Follow Airbnb JavaScript style guide
- Use meaningful, descriptive names over short abbreviations
- Prefer readability over cleverness

## Variables & Declarations
- Always use `const` by default — use `let` only when reassignment is required
- Never use `var` — no exceptions
- Destructure objects and arrays when accessing more than one property at a time
- Use optional chaining `?.` to safely access nested properties instead of manual null checks
- Use `??` (nullish coalescing) instead of `||` when the fallback is only for `null` or `undefined`
- Use spread `...` to copy objects and arrays — never mutate a parameter directly

## Functions
- Prefer named functions over anonymous arrows for top-level declarations
- Keep functions small and single-purpose
- Use early returns to reduce nesting
- Use default parameter values instead of checking inside the body:

  ```js
  // Wrong
  function greet(name) {
    const n = name || "Guest";
  }

  // Correct
  function greet(name = "Guest") { ... }
  ```

- For complex functions, add a plain English comment above describing intent — no type annotations:

  ```js
  // Returns remaining time as { days, hours, minutes } from now until targetDate
  function getTimeLeft(targetDate) { ... }
  ```

## Imports
- Use existing well-known libraries instead of writing from scratch
- Group imports: external libraries → internal modules → assets/styles
- No default exports except for pages and components
- Never import a module that is not used — remove unused imports immediately

## Error Handling
- Always handle promise rejections explicitly — never leave a `catch` block empty
- Throw with a descriptive message: `throw new Error("Event not found: " + id)`
- Never silently swallow errors: `catch (e) {}` is forbidden
- Use `finally` when cleanup must always run (close modal, reset loading state)

## Naming

- `PascalCase` for React components
- `camelCase` for variables, functions, hooks, and object keys
- `SCREAMING_SNAKE_CASE` for module-level constants
- `kebab-case` for file names and folder names
- Boolean variables must start with `is`, `has`, or `should`: `isLoading`, `hasError`, `shouldRefetch`

## Comments
- Comments must be plain descriptive English — no decorative characters
- Code must speak for itself — naming of variables and functions must be descriptive enough that no comment is needed to understand intent
- For complex logic, use a single-line simulation comment in the format `// "input" -> "output"` — show real data, not explanation
- Never write comments that describe what the code does line by line

## Folder Structure & File Placement
- Before creating any file, check if a matching folder already exists
- Never create a file at the root if a relevant subfolder exists
- One responsibility per file — if a file grows beyond ~200 lines, split it
- Before and after every edit, scan the file line count — if it exceeds 400 lines, it must be split immediately
- When a file exceeds 400 lines: extract functions into a dedicated helper or utils file, never leave the file over 400 lines after your edit is done
- Index files (`index.js`) are for re-exports only — no logic inside

## Coding Flow
- Write the function signature and describe its intent in a plain comment before the body
- Never leave `TODO` comments — either implement it now or open an issue
- When adding a feature: constants → helper functions → component/module → export
- When fixing a bug: reproduce → isolate → fix → verify

## Constants & Magic Values
- Zero tolerance for magic strings or magic numbers anywhere in the codebase
- Every string or number that represents a domain concept, state, role, status, or config value must be a named constant — no exceptions
- Use `Object.freeze()` to make constant objects immutable:
  ```js
  // Wrong
  if (event.type === "ON_SITE") { ... }

  // Correct
  const EVENT_TYPE = Object.freeze({ ON_SITE: "ON_SITE", ONLINE: "ONLINE" });
  if (event.type === EVENT_TYPE.ON_SITE) { ... }
  ```
- Group related constants into a single frozen object, not separate variables
- Place constants at the top of the file or in a dedicated `constants.js` file if shared across files
- When scanning existing code and a magic string or number is found, extract it immediately before continuing with the task

## Conditional Logic
- No nested ternaries — more than 1 level deep must be refactored into `if/else`
- Use `if/else` blocks when there are 3 or more conditions
- Use a lookup object for string-based branching instead of chained ternaries or else-if chains:
  ```js
  // Wrong
  const label = type === "ON_SITE" ? "On-Site" : type === "ONLINE" ? "Online" : "Unknown";

  // Correct
  const TYPE_LABEL = { ON_SITE: "On-Site", ONLINE: "Online" };
  const label = TYPE_LABEL[type] ?? "Unknown";
  ```
- Extract complex conditional logic into a named function

## Arrays & Objects

- Use array methods (`map`, `filter`, `find`, `reduce`, `some`, `every`) over `for` loops
- Never mutate arrays in place — use `filter`, `map`, or spread to return new arrays
- Use `Object.keys()`, `Object.values()`, `Object.entries()` over manual iteration
- Avoid deep nesting — flatten data before rendering when possible

## Async & Promises

- Always use `async/await` — never `.then().catch()` chains
- Never `await` inside a loop — use `Promise.all()` for parallel operations:
  ```js
  // Wrong
  for (const id of ids) {
    await fetchItem(id);
  }

  // Correct
  const results = await Promise.all(ids.map(fetchItem));
  ```

- Always handle the loading and error states when fetching data

## File Creation Rules
- Check for existing utilities before creating new ones
- If a helper is used more than once, move it to a shared `utils/` or `helpers/` folder
- Feature-specific code stays inside the feature folder, not at the top level
- Never duplicate logic — extract shared code immediately
