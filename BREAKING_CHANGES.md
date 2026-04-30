# Breaking Changes — Angular 16 → 21 Upgrade

This document lists every breaking change encountered and addressed during the upgrade of `app_petclinic-angular` from **Angular 16.2.1** to **Angular 21.2.11**.

---

## 1. Node.js Version Requirement

| Before | After |
|--------|-------|
| Node 18 | Node 22 (minimum 20.11.1) |

Angular 20+ dropped support for Node 18. The project now requires Node 20.11.1 or later (Node 22 recommended).

## 2. TypeScript Version

| Before | After |
|--------|-------|
| TypeScript 4.9.5 | TypeScript 5.9.3 |

Angular 21 requires TypeScript 5.9+. The `tsconfig.json` was updated accordingly:
- `moduleResolution`: `"node"` → `"bundler"` (required for Angular 21's module resolution)
- `module`: `"es2020"` → `"ES2022"`
- `lib`: `["es2017", "dom"]` → `["ES2022", "dom"]`
- Removed `emitDecoratorMetadata` and `experimentalDecorators` (Angular 21 uses TC39 decorators)
- Added `esModuleInterop: true`, `forceConsistentCasingInFileNames: true`, `skipLibCheck: true`
- Changed `useDefineForClassFields` from `false` to `true`

## 3. RxJS Version

| Before | After |
|--------|-------|
| rxjs ^6.3.1 | rxjs ^7.8.1 |

Angular 17+ requires RxJS 7. The `rxjs/operators` imports still work but the pipe-based API is preferred. No code changes were needed as the existing code already used pipeable operators.

## 4. Zone.js Version

| Before | After |
|--------|-------|
| zone.js ~0.13.1 | zone.js ~0.15.0 |

Updated to Zone.js 0.15 for Angular 21 compatibility.

## 5. `HttpClientModule` Removed → `provideHttpClient()`

**Breaking Change (Angular 18+):** `HttpClientModule` is deprecated and removed in favor of the functional `provideHttpClient()` API.

**Fix:** Replaced `HttpClientModule` import in `AppModule` with `provideHttpClient()` in the providers array. Services using `HttpClient` via constructor injection required no changes.

## 6. `HttpClientTestingModule` Removed → `provideHttpClientTesting()`

**Breaking Change (Angular 18+):** `HttpClientTestingModule` is deprecated in favor of `provideHttpClientTesting()`.

**Fix:** All service spec files updated:
```typescript
// Before
imports: [HttpClientTestingModule]

// After
providers: [provideHttpClient(), provideHttpClientTesting()]
```

## 7. `BrowserAnimationsModule` Removed → `provideAnimationsAsync()`

**Breaking Change (Angular 17+):** `BrowserAnimationsModule` is deprecated in favor of `provideAnimationsAsync()` or `provideAnimations()`.

**Fix:** Replaced `BrowserAnimationsModule` with `provideAnimationsAsync()` in the AppModule providers.

## 8. `provideZoneChangeDetection()` Required (Angular 21)

**Breaking Change (Angular 21):** Zone-based applications must explicitly add `provideZoneChangeDetection()` to their root providers.

**Fix:** Added `provideZoneChangeDetection({eventCoalescing: true})` to AppModule providers.

## 9. Standalone Components Default (Angular 19+)

**Breaking Change (Angular 19+):** Components, directives, and pipes default to `standalone: true`. NgModule-declared components must explicitly set `standalone: false`.

**Fix:** Added `standalone: false` to all `@Component` and `@Directive` decorators in the project.

## 10. `polyfills.ts` File Removed

**Breaking Change (Angular 17+):** The `polyfills.ts` file is replaced by the `polyfills` array in `angular.json`. Zone.js is now listed directly as a polyfill entry.

**Fix:** Deleted `src/polyfills.ts` and `src/test.ts`. Updated `angular.json` to use:
```json
"polyfills": ["zone.js"]
```
For tests:
```json
"polyfills": ["zone.js", "zone.js/testing"]
```

## 11. Moment.js Import Syntax

**Breaking Change (TypeScript 5+ / ES Module Interop):** `import * as moment from 'moment'` no longer works with `esModuleInterop: true`.

**Fix:** Changed all moment imports to:
```typescript
import moment from 'moment';
```

## 12. `TestBed.get()` Removed → `TestBed.inject()`

**Breaking Change (Angular 20):** `TestBed.get()` is removed in favor of `TestBed.inject()`.

**Fix:** Replaced all `TestBed.get()` calls with `TestBed.inject()`.

## 13. Angular CLI Build System

| Before | After |
|--------|-------|
| `@angular-devkit/build-angular:browser` (webpack) | `@angular-devkit/build-angular:browser` (webpack, retained) |

The `browser` builder is retained due to Bootstrap 3's glyphicon font references causing conflicts with the esbuild-based `application` builder. The webpack-based `browser` builder handles this correctly. A future migration to the `application` builder would require updating to Bootstrap 5+.

## 14. `browserTarget` → `buildTarget` in angular.json

**Breaking Change (Angular 17+):** The `browserTarget` option in serve/extract-i18n configs is renamed to `buildTarget`.

**Fix:** Updated all `browserTarget` references to `buildTarget` in `angular.json`.

## 15. Template Control Flow Migration

**Breaking Change (Angular 17+):** Structural directives `*ngIf`, `*ngFor`, `*ngSwitch` are deprecated in favor of built-in control flow: `@if`, `@for`, `@switch`.

**Fix:** Ran `ng generate @angular/core:control-flow` to automatically migrate all templates to the new control flow syntax.

## 16. `karma-coverage-istanbul-reporter` → `karma-coverage`

**Breaking Change (Angular 17+):** `karma-coverage-istanbul-reporter` is replaced by `karma-coverage`.

**Fix:** Updated `karma.conf.js` and `package.json` to use `karma-coverage`.

## 17. ESLint / TypeScript ESLint Updates

| Before | After |
|--------|-------|
| `@typescript-eslint/*` v6 | `@typescript-eslint/*` v8 |
| `@angular-eslint/*` v16.1 | `@angular-eslint/*` v21.3 |

Key changes:
- Removed `@typescript-eslint/quotes` rule (moved to `@stylistic/ts` in v8, not needed)
- Disabled `@angular-eslint/prefer-standalone` (NgModule-based architecture retained)
- Disabled `@angular-eslint/prefer-inject` (constructor injection pattern retained)
- Removed `e2e/tsconfig.json` reference from ESLint config (e2e directory removed)

## 18. Protractor & e2e Removed

**Breaking Change (Angular 17+):** Protractor is no longer supported. The `e2e/` directory and `protractor.conf.js` were removed.

## 19. Deprecated Packages Removed

The following packages were removed as they are no longer needed:
- `codelyzer` — replaced by `@angular-eslint`
- `protractor` — deprecated, removed
- `core-js` — no longer needed (modern browsers & Zone.js 0.15)
- `@types/jasminewd2` — Protractor-specific types
- `jasmine-spec-reporter` — not needed with current karma setup
- `source-map-explorer` — dev utility, not required
- `ts-node` — not needed for Angular 21 CLI

## 20. Angular Material & CDK

| Before | After |
|--------|-------|
| `@angular/material` 16.2.1 | `@angular/material` 21.2.9 |
| `@angular/cdk` 16.2.1 | `@angular/cdk` 21.2.9 |
| `@angular/material-moment-adapter` 16.2.1 | `@angular/material-moment-adapter` 21.2.9 |

Material components (MatDatepicker, MatSelect, MatMomentDateModule) continued to work without code changes after the version bump.

---

## Summary

| Category | Count |
|----------|-------|
| Breaking changes addressed | 20 |
| Files modified | 40+ |
| Dependencies updated | 30+ |
| Build status | Passing |
| Lint status | Passing |
