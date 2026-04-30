# Breaking Changes: Angular 16 to Angular 21 Upgrade

This document details all breaking changes encountered during the upgrade of `app_petclinic-angular` from **Angular 16.2.1** to **Angular 21.2.11**.

---

## Summary of Version Upgrades

| Package | Before | After |
|---|---|---|
| Angular (core/cli) | 16.2.1 / 16.2.0 | 21.2.11 / 21.2.9 |
| Angular Material/CDK | 16.2.1 | 21.2.9 |
| TypeScript | 4.9.5 | 5.9.3 |
| RxJS | 6.x | 7.x |
| zone.js | 0.13.x | 0.15.x |
| Node.js requirement | 18.x | 20.x+ |

---

## Angular 16 → 17

### 1. TypeScript 4.9 → 5.4
- TypeScript was upgraded from 4.9.5 to 5.4.5 as required by Angular 17.

### 2. Angular deprecated options in `angular.json`
- The `browserTarget` option was renamed to `buildTarget` in serve/extract-i18n configurations (automatic migration applied).

### 3. HTML entity escaping for `@` and `}` characters
- Angular 17 introduces new control flow syntax using `@` and `}`. Existing usages in templates were checked for conflicts (none found in this project).

---

## Angular 17 → 18

### 4. Build system migration: `browser` → `application` builder
- **Breaking**: The `@angular-devkit/build-angular:browser` builder was replaced with the new `@angular-devkit/build-angular:application` builder (esbuild-based).
- Output path changed from `dist` to `dist/browser` (configurable via `outputPath.base`).
- The `main` option was renamed to `browser` in angular.json.
- Removed `vendorChunk` and `buildOptimizer` options (handled automatically by the new builder).

### 5. `HttpClientModule` → `provideHttpClient()`
- **Breaking**: `HttpClientModule` was deprecated and replaced with `provideHttpClient()` using functional providers.
- All service files were updated to use `provideHttpClient()` with `withInterceptorsFromDi()`.
- The import in `app.module.ts` changed from `HttpClientModule` to the `provideHttpClient()` provider.
- Affected files: `error.service.ts`, `pettype.service.ts`, `pet.service.ts`, `visit.service.ts`, `vet.service.ts`, `specialty.service.ts`, `app.module.ts`, and all corresponding spec files.

### 6. `import * as moment from 'moment'` → `import moment from 'moment'`
- **Breaking**: The esbuild-based application builder does not support namespace imports (`import * as X`) for CommonJS modules that export a callable function. Changed to default imports across 4 files:
  - `pet-add.component.ts`
  - `pet-edit.component.ts`
  - `visit-add.component.ts`
  - `visit-edit.component.ts`

### 7. Duplicate Bootstrap CSS causing esbuild conflict
- **Breaking**: The new esbuild builder errors on "Two output files share the same path but have different contents" when `bootstrap.css` from `node_modules` and the bundled `petclinic.css` (which includes Bootstrap 3) both reference the same glyphicons font files.
- **Fix**: Removed the duplicate `node_modules/bootstrap/dist/css/bootstrap.css` from the `styles` array in angular.json since `petclinic.css` already bundles the full Bootstrap CSS.

---

## Angular 18 → 19

### 8. TypeScript 5.4 → 5.8
- TypeScript upgraded to 5.8.3.

### 9. `standalone: false` required for non-standalone components
- **Breaking**: In Angular 19, standalone became the default for components, directives, and pipes. Non-standalone items must now explicitly declare `standalone: false`.
- Migration automatically added `standalone: false` to all 24 component/directive/pipe files.

### 10. zone.js 0.14 → 0.15
- Updated zone.js to maintain compatibility with Angular 19.

---

## Angular 19 → 20

### 11. Node.js 18 → 20 requirement
- **Breaking**: Angular 20 requires Node.js v20.19+ or v22.12+. Node.js 18 is no longer supported.
- Upgraded from Node.js 18.20.8 to Node.js 20.20.2.

### 12. `moduleResolution` changed to `bundler`
- **Breaking**: The `moduleResolution` in tsconfig.json was changed from `"node"` to `"bundler"` for compatibility with the modern build system.

### 13. `TestBed.get()` → `TestBed.inject()`
- **Breaking**: The deprecated `TestBed.get()` method was replaced with `TestBed.inject()`.
- Affected files: `owner.service.spec.ts`, `owner-add.component.spec.ts`, `owner-detail.component.spec.ts`, `owner-edit.component.spec.ts`.

### 14. Template control flow migration: `*ngIf`/`*ngFor`/`*ngSwitch` → `@if`/`@for`/`@switch`
- **Breaking**: Angular's new block control flow syntax replaces structural directives.
- All 19 template files were migrated from `*ngIf`/`*ngFor`/`ngSwitch` to `@if`/`@for`/`@switch` block syntax.

### 15. Workspace generation defaults updated
- angular.json updated with new schematics defaults for Angular 20 style guide behavior.

---

## Angular 20 → 21

### 16. TypeScript 5.8 → 5.9
- TypeScript upgraded to 5.9.3 as required by Angular 21.

### 17. `lib` property updated to `es2022`
- The `lib` property in tsconfig.json was updated from `["es2017", "dom"]` to `["es2022", "dom"]`.

### 18. Bootstrap migration to standalone APIs
- **Breaking**: The app was migrated from `NgModule`-based bootstrapping (`AppModule`) to standalone `bootstrapApplication()` with `provideRouter()`, `provideHttpClient()`, and `provideAnimationsAsync()`.
- `app.module.ts` was **deleted**.
- `main.ts` was rewritten to use `bootstrapApplication(AppComponent, { providers: [...] })`.

---

## Cross-cutting Changes

### 19. Constructor injection → `inject()` function
- **Breaking**: All 27 service/component files were migrated from constructor-based dependency injection to the `inject()` function, following Angular 21's recommended pattern.

### 20. Standalone components migration
- **Breaking**: All components, directives, and pipes were converted to standalone and now declare their own `imports` array.
- All `NgModule` feature modules (`OwnersModule`, `PetsModule`, `VisitsModule`, `PetTypesModule`, `VetsModule`, `SpecialtiesModule`, `PartsModule`) were **removed**.
- Routing modules were preserved as they provide `RouterModule.forChild()` routes.

### 21. ESLint configuration updates
- `@typescript-eslint/quotes` rule was **removed** (dropped in `@typescript-eslint` v8). Replaced with the base ESLint `quotes` rule.
- `@typescript-eslint/eslint-plugin` and `@typescript-eslint/parser` upgraded from v6/v7 to v8.
- `eslint` remains at v8 for compatibility with `@angular-eslint`.

### 22. Deprecated packages removed
- `protractor` — removed (deprecated since 2023, replaced by Cypress/Playwright).
- `codelyzer` — removed (replaced by `@angular-eslint`).
- `@types/jasminewd2` — removed (protractor-specific types).
- `karma-cli` — removed (outdated, incompatible with modern Node.js).
- `core-js` — removed (no longer needed with modern Angular polyfills).
- `jasmine-spec-reporter` — removed (unused).

### 23. RxJS 6 → 7
- RxJS upgraded from v6.x to v7.8.x. No breaking API changes found in this project's usage.

### 24. Updated dev dependencies
| Package | Before | After |
|---|---|---|
| @types/jasmine | 3.6.x | 5.1.x |
| @types/node | 12.x | 20.x |
| jasmine-core | 3.6.x | 5.1.x |
| karma | 6.3.x | 6.4.x |
| karma-chrome-launcher | 3.1.x | 3.2.x |
| karma-jasmine | 4.0.x | 5.1.x |
| karma-jasmine-html-reporter | 1.5.x | 2.2.x |
| source-map-explorer | 1.5.x | 2.5.x |
| ts-node | 4.1.x | 10.9.x |
