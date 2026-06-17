# Breaking Changes: Angular 16 → Angular 21 Upgrade

This document lists every breaking change encountered during the upgrade from Angular 16.2.1 to Angular 21.2.11.

---

## 1. TypeScript 4.9 → 5.9

- **`moduleResolution`**: Changed from `"node"` to `"bundler"`. Angular 21 packages use the `exports` field in `package.json`, which requires `"bundler"` (or `"node16"`) module resolution. The legacy `"node"` resolution does not read `exports` and fails to resolve sub-path imports like `@angular/common/http`.
- **`lib`**: Updated from `["es2017", "dom"]` to `["ES2022", "dom"]` to match the target.
- **`module`**: Updated from `"es2020"` to `"ES2022"`.
- **`esModuleInterop` / `allowSyntheticDefaultImports`**: Enabled to support default imports from CommonJS modules (e.g., `moment`).
- **`skipLibCheck`**: Enabled to avoid type-checking issues in third-party `.d.ts` files.
- **`forceConsistentCasingInFileNames`**: Enabled (new TypeScript 5.x default).

## 2. Standalone Components Default (Angular 19+)

Starting in Angular 19, `standalone: true` is the default for `@Component`, `@Directive`, and `@Pipe`. All components/directives declared in NgModules must now explicitly set `standalone: false` to remain module-scoped. Without this, the Angular compiler emits `NG6008: Component X is standalone, and cannot be declared in an NgModule`.

**Files affected**: All 22 component and 1 directive files across the project.

## 3. HttpClientModule → provideHttpClient() (Angular 17+)

`HttpClientModule` was deprecated in Angular 17 in favor of the `provideHttpClient()` function. In `app.module.ts`:
- Removed `HttpClientModule` from `imports`
- Added `provideHttpClient(withFetch())` to `providers`

## 4. BrowserAnimationsModule → provideAnimationsAsync() (Angular 17+)

`BrowserAnimationsModule` was replaced with the `provideAnimationsAsync()` provider function for better tree-shaking and lazy-loading support.

## 5. RxJS 6 → RxJS 7

- **`throwError(value)`**: The direct-value signature was deprecated. Changed to `throwError(() => value)` (factory function form) in `error.service.ts`.

## 6. Moment.js Import Syntax

- **`import * as moment from 'moment'`** → **`import moment from 'moment'`**: With `esModuleInterop` enabled, the namespace import is no longer needed and causes issues with the bundler module resolution.
- **Files affected**: `pet-add.component.ts`, `pet-edit.component.ts`, `visit-add.component.ts`, `visit-edit.component.ts`.

## 7. Polyfills Handling (Angular 17+)

- **`src/polyfills.ts` removed**: The `polyfills` option in `angular.json` now accepts a string array (e.g., `["zone.js"]`) instead of referencing a TypeScript file. The separate `polyfills.ts` file is no longer needed.
- **`src/tsconfig.app.json` and `src/tsconfig.spec.json`**: Removed `polyfills.ts` from the `files` array.

## 8. Test Initialization (Angular 17+)

- **`src/test.ts` removed**: The test setup file (`getTestBed().initTestEnvironment(...)`) is no longer needed. The Karma builder handles test initialization internally. The `zone.js/testing` polyfill is now specified in `angular.json` under the test target's `polyfills` array.
- **`src/tsconfig.spec.json`**: Removed `test.ts` from the `files` array; `node` type removed (only `jasmine` needed).

## 9. Protractor / E2E Removal

Protractor was deprecated in Angular 15 and removed from the CLI. The `e2e/` directory and Protractor configuration have been removed. Projects requiring E2E testing should migrate to Playwright, Cypress, or WebDriverIO.

## 10. Karma Coverage Reporter

- **`karma-coverage-istanbul-reporter`** → **`karma-coverage`**: The Istanbul-based reporter was deprecated. Replaced with the official `karma-coverage` package.

## 11. ESLint Configuration Updates

- **`@typescript-eslint/quotes` rule removed**: This rule was removed in `@typescript-eslint` v8. Removed from `.eslintrc.json`.
- **`@angular-eslint/prefer-standalone` rule**: New in angular-eslint 21, warns about non-standalone components. Disabled since this project uses NgModules.
- **`@angular-eslint/prefer-inject` rule**: New in angular-eslint 21, recommends `inject()` function over constructor injection. Disabled as constructor injection is valid and used throughout.
- **`@angular-eslint/template/prefer-control-flow` rule**: New in angular-eslint 21, recommends `@if`/`@for` over `*ngIf`/`*ngFor`. Disabled since structural directives are still supported.
- **`createDefaultProgram` removed**: This deprecated ESLint parser option was removed.

## 12. Deprecated DevDependencies Removed

The following packages were removed as they are no longer needed or supported:
- `codelyzer` (TSLint-era linter, replaced by `@angular-eslint`)
- `protractor` (deprecated E2E framework)
- `@types/jasminewd2` (Protractor-specific types)
- `@types/node` (not needed for browser-only Angular apps)
- `jasmine-spec-reporter` (replaced by built-in reporters)
- `karma-coverage-istanbul-reporter` (replaced by `karma-coverage`)
- `ts-node` (not needed with modern Angular CLI)
- `source-map-explorer` (optional tool, not required)
- `core-js` (polyfills no longer needed for modern browsers)
- `eslint-config-prettier` / `eslint-plugin-prettier` (removed to simplify config)

## 13. Non-Relative Import Paths

- Changed `import {SpecialtyService} from 'app/specialties/specialty.service'` to a relative import `'../../specialties/specialty.service'` in `vet-add.component.ts`. While `baseUrl: "src"` in tsconfig enables this path, relative imports are more explicit and reliable with the `"bundler"` module resolution.

## 14. Angular.json Build Configuration

- **`polyfills`**: Changed from a file path (`"src/polyfills.ts"`) to a string array (`["zone.js"]`).
- **`browserTarget`** → **`buildTarget`**: Renamed in the serve and extract-i18n configurations.
- **`allowedCommonJsDependencies`**: Added `"moment"` to suppress CommonJS import warnings.

---

## Dependency Version Summary

| Package | Before | After |
|---------|--------|-------|
| @angular/* | 16.2.1 | 21.2.11 |
| @angular/cdk | 16.2.1 | 21.2.9 |
| @angular/material | 16.2.1 | 21.2.9 |
| @angular/material-moment-adapter | 16.2.1 | 21.2.9 |
| @angular-devkit/build-angular | 16.2.16 | 21.2.9 |
| @angular/cli | 16.2.0 | 21.2.9 |
| @angular-eslint/* | 16.1.1 | 21.3.1 |
| TypeScript | 4.9.5 | 5.9.3 |
| RxJS | ^6.3.1 | ^7.8.0 |
| zone.js | ~0.13.1 | ~0.16.0 |
| Karma | 6.3.16 | ~6.4.0 |
| Jasmine | 3.6.0 | ~5.5.0 |
| @types/jasmine | 3.6.0 | ~5.1.0 |
| @typescript-eslint/* | 5.62.0 | ^8.59.0 |
| ESLint | ^8.28.0 | ^8.57.0 |
