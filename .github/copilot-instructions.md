# React Vite Guidelines

## Architecture

Feature-based modular structure where each feature is self-contained. Shared logic and global assets live in `src/shared/`.

* **src/shared/**: Constants, types, hooks, components, theme, utils, and providers.
* **src/features/<feature>/**:
* `api/`: Fetcher functions, axios instances, and query keys.
* `hooks/`: Feature-specific logic, state, and use cases.
* `components/`: Local UI components.
* `pages/`: Feature entry points and screens.
* `styles/`: Feature-specific styles (if not using Tailwind).
* `data/`: Mock data, fixtures, or test data related to the feature.

* **Root Files**: `App.jsx`, `main.jsx`, `routes.jsx`.

---

## Core Rules

* **State management**: React Context API (Provider pattern) or Zustand for global state.
* **Dependency injection**: Centralized service instances exported from `src/shared/api/` or provided via Context.
* **Models**: Use **TypeScript Interfaces** for structures and **Zod** for schema validation/JSON parsing.
* **Naming**: `*.types.jsx`, `*Provider.jsx`, `*Page.jsx`, `use*Hook.jsx`.
* **Constants**: API endpoints, routes, and static strings in `src/shared/constants/`.
* **Routing**: Object-based routing using **React Router** (Data APIs).
* **Tab lazy-loading**: Implement a memoized wrapper; use a `visited` state to conditionally render components or return `null` if never active.
* **Error handling**: Use **Error Boundaries** for UI crashes. Use an `ErrorHandler` utility to map Axios/Fetch errors to user-friendly strings. `console.error` only in development; never expose raw stack traces to UI.
* **Code quality**: Production-ready, functional programming style, strict TypeScript; fix all linter and type errors.
* **Documentation**: Minimal README per feature explaining data flow.

---

## UI/UX

* **Polished layout**: Grid/Flexbox with consistent spacing.
* **Colors**: Use **Tailwind CSS** config or **CSS Variables**. No hardcoded hex codes in components.
* **Theme**: Support `dark` and `light` modes via a `ThemeProvider`. Use system-level typography settings.
* **Spacing & Typography**: 4px/8px scale. Use semantic tags (`<h1>`, `<p>`) styled via global tokens.
* **Animations**: Use **Framer Motion** for purposeful transitions only.
* **Feedback**: Skeleton screens for loading, empty state components, and Toast notifications for errors.

---

## Mandatory After Every Code Change

1. **If types or schemas changed**:
```bash
# Verify types across the project
npx tsc --noEmit
```


2. **Always run**:
```bash
npm run lint    # Runs ESLint to fix/report issues
npm run format  # Runs Prettier
```

Fix all warnings/errors; do not use `eslint-disable`.


3. **Finish completely**: Ensure the feature is fully responsive, types are strict, and the build succeeds (`npm run build`) before marking complete.

