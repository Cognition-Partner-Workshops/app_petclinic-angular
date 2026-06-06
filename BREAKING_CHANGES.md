# Breaking Changes: Angular 16 → 21 Upgrade

This document lists every breaking change encountered during the upgrade from Angular 16.2.1 to Angular 21.2.11.

---

## 1. Angular 16 → 17

### TypeScript 4.9.5 → 5.4.5
- **Impact**: New stricter type-checking in TypeScript 5.x. No code changes required for this project.

### RxJS 6.x → 7.x
- **Impact**: RxJS 7 drops several deprecated APIs (e.g., `toPromise()`, `pluck()`). This project only used `Observable`, `throwError`, `pipe`, and `catchError`, which are unchanged.

### zone.js 0.13 → 0.14
- **Impact**: Internal API changes only. No source code changes required.

### @angular-eslint/* → 17.x / @typescript-eslint/* → 7.x
- **Impact**: Updated lint tooling with minor rule changes. No additional code fixes needed.

### angular.json deprecated options updated
- **Impact**: The Angular CLI migration removed deprecated builder options automatically.

---

## 2. Angular 17 → 18

### Build system: `browser` → `application` builder (esbuild)
- **Impact**: The `@angular-devkit/build-angular:browser` builder was replaced by `@angular-devkit/build-angular:application` using esbuild under the hood.
- **Changes required**:
  - `angular.json` builder and configuration structure updated.
  - Output path changed from `dist` to `dist/browser` (configurable via `outputPath.base`).
  - `main` option renamed to `browser` in angular.json.

### `import * as moment from 'moment'` → `import moment from 'moment'`
- **Impact**: The new esbuild-based builder treats namespace imports (`import * as X`) strictly. Calling a namespace object as a function crashes at runtime.
- **Changes required**: All 4 files using moment.js updated to default imports. `esModuleInterop: true` added to `tsconfig.json`.

### `HttpClientModule` → `provideHttpClient()`
- **Impact**: `HttpClientModule` was deprecated in Angular 18. The automated migration replaced it with `provideHttpClient()` in `app.module.ts` providers.
- **Changes required**: `HttpClientModule` removed from imports; `provideHttpClient()` added to providers in `AppModule`. Service imports updated from `@angular/common/http` module-based patterns.

### Bootstrap 3 glyphicon font file conflict
- **Impact**: The esbuild `application` builder processes CSS `url()` references and copies assets. Both `node_modules/bootstrap/dist/fonts/` and `src/assets/fonts/` contained glyphicon SVG files with different contents, causing "Two output files share the same path" build error.
- **Changes required**: Synced `src/assets/fonts/` with `node_modules/bootstrap/dist/fonts/` to resolve the conflict.

---

## 3. Angular 18 → 19

### TypeScript 5.4.5 → 5.8.3
- **Impact**: Continued stricter type-checking. No additional code changes required.

### zone.js 0.14 → 0.15
- **Impact**: Internal improvements. No source code changes.

### `standalone: false` now required explicitly
- **Impact**: Angular 19 changed the default for components/directives/pipes from `standalone: false` to `standalone: true`. All non-standalone declarations now require an explicit `standalone: false`.
- **Changes required**: The automated migration added `standalone: false` to all 24 components, directives, and pipes that use NgModules.

---

## 4. Angular 19 → 20

### Node.js minimum version: 18 → 20.19 / 22.12
- **Impact**: Angular CLI 20 refuses to run on Node.js 18. Switched to Node.js 22.
- **Changes required**: Updated project's Node.js requirement from 18 to 22.

### `moduleResolution: 'node'` → `'bundler'`
- **Impact**: The Angular CLI migration updated `tsconfig.json` to use `"moduleResolution": "bundler"` for better compatibility with the esbuild-based `application` builder.
- **Changes required**: Automatic tsconfig update by migration.

### `TestBed.get()` → `TestBed.inject()`
- **Impact**: `TestBed.get()` was removed. The migration replaced all 4 usages in test files with `TestBed.inject()`.

### Template control flow: `*ngIf`, `*ngFor` → `@if`, `@for`
- **Impact**: Angular 17+ introduced block control flow syntax. The Angular 20 migration converted all templates (19 HTML files) from structural directives to the new syntax.
- **Changes required**:
  - `*ngIf="condition"` → `@if (condition) { ... }`
  - `*ngFor="let item of items"` → `@for (item of items; track item) { ... }`
  - `*ngIf="...; else ..."` → `@if (...) { ... } @else { ... }`

### Workspace generation defaults updated
- **Impact**: New schematics defaults for Angular 20 style guide (type suffixes, separators) added to `angular.json`.

---

## 5. Angular 20 → 21

### TypeScript 5.8.3 → 5.9.3
- **Impact**: No code changes required.

### tsconfig `lib` updated: `es2017` → `es2022`
- **Impact**: Angular 21 requires ES2022 or later library typings. The migration updated `tsconfig.json` automatically.

### `platformBrowserDynamic().bootstrapModule()` deprecated options → providers
- **Impact**: Deprecated bootstrap options migrated to use `provideZoneChangeDetection()` in `main.ts`.
- **Changes required**: `main.ts` updated to pass `applicationProviders: [provideZoneChangeDetection()]` to `bootstrapModule()`.

---

## 6. Cross-Version Cleanup (Post-Upgrade)

### Deprecated dependencies removed
| Package | Reason |
|---------|--------|
| `codelyzer` | Replaced by `@angular-eslint` (deprecated since Angular 12) |
| `protractor` | Deprecated e2e framework (removed since Angular 12) |
| `@types/jasminewd2` | Only needed for Protractor |
| `core-js` | No longer needed; Angular handles polyfills natively |
| `karma-coverage-istanbul-reporter` | Replaced by `karma-coverage` |

### Updated dev dependencies
| Package | From | To |
|---------|------|----|
| `@typescript-eslint/*` | 7.x | 8.x |
| `@types/jasmine` | 3.6 | 5.1 |
| `@types/node` | 12.x | 22.x |
| `jasmine-core` | 3.6 | 5.1 |
| `karma` | 6.3 | 6.4 |
| `karma-coverage` | (new) | 2.2 |

### `polyfills.ts` replaced with direct `zone.js` reference
- **Impact**: The `polyfills.ts` file is no longer referenced in `angular.json`. Polyfills are now specified as `["zone.js"]` directly.

### `useDefineForClassFields: false` removed from tsconfig
- **Impact**: This TypeScript option was a legacy workaround. Angular 20+ requires the default (`true`) behavior.

### `module: 'es2020'` → `'es2022'` in tsconfig
- **Impact**: Aligned with the Angular 21 requirement for ES2022 modules.

### Constructor injection → `inject()` function
- **Impact**: The Angular 21 ESLint rules (`@angular-eslint/prefer-inject`) recommend using the `inject()` function over constructor parameter injection.
- **Changes required**: All 27 services and components migrated from constructor DI to field-level `inject()` calls using the official `ng generate @angular/core:inject` schematic.

### `@typescript-eslint/quotes` rule removed
- **Impact**: This rule was removed in `@typescript-eslint` v8. Replaced with the built-in ESLint `quotes` rule.

### Protractor e2e project removed from `angular.json`
- **Impact**: The `spring-petclinic-angular-e2e` project entry was removed since Protractor is no longer supported.

### ESLint config: `createDefaultProgram` removed
- **Impact**: This deprecated parser option was removed from `.eslintrc.json`.

---

## Summary

| Aspect | Before | After |
|--------|--------|-------|
| Angular | 16.2.1 | 21.2.11 |
| TypeScript | 4.9.5 | 5.9.3 |
| RxJS | 6.x | 7.x |
| Node.js | 18 | 22+ |
| Build system | Webpack (`browser`) | esbuild (`application`) |
| Module system | ES2020 | ES2022 |
| Template syntax | `*ngIf` / `*ngFor` | `@if` / `@for` |
| DI pattern | Constructor injection | `inject()` function |
| HTTP setup | `HttpClientModule` | `provideHttpClient()` |
| Zone setup | `polyfills.ts` | `provideZoneChangeDetection()` |
