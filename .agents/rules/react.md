---
trigger: always_on
---

# Frontend & React Rules

## Components & Props
- Never pass more than 5 props directly to a component — group related props into a single object
- Group props by domain: each logical group becomes its own interface
- Never pass raw state setters (setState) directly as props — wrap them in a handler function
- Never pass business logic handlers directly from parent to child — abstract them into a custom hook or context
- If a component requires more than 5 props, extract state and handlers into a custom hook first
- Use Context + custom hook for state shared across more than 2 components
- Co-locate state with the component that owns it — lift state only when necessary
- Never let UI components know about data-fetching or side-effect logic directly

## Icons & UI Content
- Never use emoticons or emojis in UI labels, strings, comments, or any visible content
- For frontend UI that needs icons, always use an installed icon library (e.g. lucide-react, react-icons, heroicons) — never use emoji as a substitute for icons
- If no icon library is installed, install one (prefer lucide-react) before writing the component
- Never hardcode icon characters or Unicode symbols inline — always use the library component

## Hooks
- Never call hooks inside conditions, loops, or nested functions
- One concern per custom hook — if a hook handles both data-fetching and UI state, split it
- Prefix all custom hooks with `use` — no exceptions
- Extract repeated hook logic into a shared custom hook immediately
- Never use `useEffect` to sync state with another state — derive it instead
- Always specify exhaustive dependencies in `useEffect` and `useCallback`
- Avoid `useEffect` for event handling — use event handlers directly

## State Management
- Keep state as close to where it is used as possible
- Derive values from existing state instead of duplicating state
- Use `useReducer` over multiple `useState` calls when state transitions are related
- Never store derived data in state — compute it during render or with `useMemo`
- Global state is a last resort — exhaust local state and Context first

## Rendering & Performance
- Never create a component inside another component's render — define it outside
- Use `React.memo` only when profiling confirms unnecessary re-renders
- Use `useMemo` and `useCallback` only for expensive computations or stable references — not by default
- Avoid anonymous functions in JSX props when the component re-renders frequently
- Always provide a stable `key` prop when rendering lists — never use array index as key unless the list is static and never reordered

## Styling
- Never use inline styles except for truly dynamic values (e.g. calculated widths, positions)
- Use a consistent styling system throughout the project — do not mix Tailwind, CSS modules, and styled-components in the same codebase
- Never use `!important` — fix specificity issues at the source
- Class names must be meaningful and describe the element role, not its appearance

## Forms
- Always use a form library (e.g. react-hook-form) for forms with more than 2 fields
- Never manage individual field state manually when a form library is available
- Always validate input on both client and server — never rely on client validation alone
- Disable submit button while a form submission is in progress

## Accessibility
- Every interactive element must be keyboard accessible
- Always provide `alt` text for images — empty string `alt=""` for decorative images
- Never use `div` or `span` as interactive elements — use the correct semantic HTML element
- Always associate labels with inputs using `htmlFor` and matching `id`

## Error Boundaries & Loading States
- Every data-fetching component must handle loading, error, and empty states explicitly
- Use error boundaries to catch and display unexpected render errors
- Never show a blank screen on error — always render a fallback UI
- Loading skeletons are preferred over spinners for layout-heavy content