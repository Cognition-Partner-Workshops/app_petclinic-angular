# Breaking Changes: Angular 16 to Angular 21 Upgrade

This document lists every breaking change encountered and addressed during the upgrade from Angular 16.2.1 to Angular 21.2.8.

---

## 1. Build System: Browser Builder → Application Builder

**Angular versions affected:** 17+

The `@angular-devkit/build-angular:browser` builder has been replaced by the new esbuild-based `@angular-devkit/build-angular:application` builder.

**Changes made in `angular.json`:**
- Builder changed from `@angular-devkit/build-angular:browser` to `@angular-devkit/build-angular:application`
- `main` property renamed to `browser`
- `polyfills` changed from a file path (`src/polyfills.ts`) to an array (`["zone.js"]`)
- Assets configuration updated to use `glob`/`input`/`output` format
- `serve` target changed from `browserTarget` to `buildTarget`
- Removed `extract-i18n` and `e2e` project configurations

---

## 2. Components Are Standalone by Default

**Angular versions affected:** 19+

Starting in Angular 19, components are standalone by default. Components declared in NgModules must now explicitly set `standalone: false`.

**Changes made:**
- Added `standalone: false` to all 23 component `@Component()` decorators across the application

**Files affected:**
- `src/app/app.component.ts`
- All components in `owners/`, `pets/`, `pettypes/`, `specialties/`, `vets/`, `visits/`, `parts/`, and `testing/`

---

## 3. HttpClientModule → provideHttpClient()

**Angular versions affected:** 18+

`HttpClientModule` has been deprecated in favor of the `provideHttpClient()` function.

**Changes made in `src/app/app.module.ts`:**
- Removed `HttpClientModule` from `imports` array
- Added `provideHttpClient(withInterceptorsFromDi())` to `providers` array
- Updated imports from `@angular/common/http`

---

## 4. BrowserAnimationsModule → provideAnimationsAsync()

**Angular versions affected:** 17+

`BrowserAnimationsModule` has been deprecated in favor of `provideAnimationsAsync()`.

**Changes made in `src/app/app.module.ts`:**
- Removed `BrowserAnimationsModule` from `imports` array
- Added `provideAnimationsAsync()` to `providers` array
- Added import from `@angular/platform-browser/animations/async`

---

## 5. TypeScript Module Resolution: node → bundler

**Angular versions affected:** 17+

The new esbuild-based build system requires `moduleResolution: "bundler"` instead of `"node"` to properly resolve package.json `exports` fields used by Angular 21 packages (e.g., `@angular/common/http`, `@angular/material/*`).

**Changes made in `tsconfig.json`:**
- `moduleResolution` changed from `"node"` to `"bundler"`

---

## 6. TypeScript Compilation Target and Module Updates

**Angular versions affected:** 17+

Angular 21 requires TypeScript 5.9+ and updated compilation targets.

**Changes made in `tsconfig.json`:**
- `target` updated from `"es5"` to `"ES2022"`
- `module` updated from `"es2020"` to `"ES2022"`
- `lib` updated from `["es2017", "dom"]` to `["ES2022", "dom"]`
- Added `esModuleInterop: true`
- Added `allowSyntheticDefaultImports: true`
- Added `forceConsistentCasingInFileNames: true`
- Added `skipLibCheck: true`

---

## 7. Moment.js Import Style Change

**Angular versions affected:** 17+ (with `esModuleInterop: true`)

With `esModuleInterop` enabled, namespace-style imports (`import * as moment from 'moment'`) no longer work as callable. Must use default imports instead.

**Changes made:**
- `import * as moment from 'moment'` → `import moment from 'moment'`

**Files affected:**
- `src/app/pets/pet-add/pet-add.component.ts`
- `src/app/pets/pet-edit/pet-edit.component.ts`
- `src/app/visits/visit-add/visit-add.component.ts`
- `src/app/visits/visit-edit/visit-edit.component.ts`

---

## 8. Non-Relative Imports No Longer Supported by esbuild

**Angular versions affected:** 17+

The esbuild-based builder does not support non-relative imports using the `baseUrl` path mapping (e.g., `'app/...'`). All application imports must use relative paths.

**Changes made:**
- `import {SpecialtyService} from 'app/specialties/specialty.service'` → `import {SpecialtyService} from '../../specialties/specialty.service'`

**Files affected:**
- `src/app/vets/vet-add/vet-add.component.ts`

---

## 9. Polyfills Configuration Moved

**Angular versions affected:** 17+

Polyfills are now configured in `angular.json` rather than in separate TypeScript files.

**Changes made:**
- `src/tsconfig.app.json`: Removed `polyfills.ts` from `files` array
- `src/tsconfig.app.json`: Updated `include` from `["src/**/*.d.ts"]` to `["**/*.d.ts"]`
- `src/tsconfig.spec.json`: Removed `files` array (no longer needed)
- `angular.json`: Added `"polyfills": ["zone.js"]`

---

## 10. Karma Coverage Reporter Change

**Angular versions affected:** 17+

`karma-coverage-istanbul-reporter` has been replaced by `karma-coverage`.

**Changes made in `karma.conf.js`:**
- Changed `require('karma-coverage-istanbul-reporter')` to `require('karma-coverage')`
- Changed `coverageIstanbulReporter` config to `coverageReporter` config

---

## 11. RxJS Upgrade (6.x → 7.x)

**Angular versions affected:** 17+

RxJS was upgraded from 6.x to 7.x. No code changes were required as the existing usage was compatible.

**Package change:**
- `rxjs` from `^6.3.1` to `^7.8.0`

---

## 12. Zone.js Upgrade

**Angular versions affected:** 18+

Zone.js was upgraded to support Angular 21.

**Package change:**
- `zone.js` from `~0.13.1` to `~0.15.0`

---

## Dependency Version Summary

| Package | Old Version | New Version |
|---------|-------------|-------------|
| @angular/* | 16.2.1 | 21.2.8 |
| @angular/cdk | 16.2.1 | 21.2.6 |
| @angular/material | 16.2.1 | 21.2.6 |
| @angular/material-moment-adapter | 16.2.1 | 21.2.6 |
| rxjs | ^6.3.1 | ^7.8.0 |
| zone.js | ~0.13.1 | ~0.15.0 |
| TypeScript | 4.9.5 | 5.9.3 |
| tslib | ^2.0.0 | ^2.0.0 |
