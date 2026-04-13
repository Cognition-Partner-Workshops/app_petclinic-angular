# Breaking Changes: Angular 16 to 21 Upgrade

This document lists all breaking changes encountered during the upgrade from Angular 16.2.1 to Angular 21.2.8.

## Angular 16 to 17

- **Angular CLI and Core**: Updated from 16.2.1 to 17.x
- **Angular Material**: Updated from 16.2.1 to 17.3.10
- **TypeScript**: Updated to match Angular 17 requirements

## Angular 17 to 18

- **HTTP Module Migration**: `HttpClientModule` replaced with `provideHttpClient()` and `withInterceptorsFromDi()` provider functions. 13 files were updated to use the new functional HTTP client API.
  - `HttpClientModule` removed from `imports` in `app.module.ts`
  - `provideHttpClient(withInterceptorsFromDi())` added to `providers`
  - `HttpClientTestingModule` replaced with `provideHttpClientTesting()` in spec files

## Angular 18 to 19

- **Standalone Components Default**: Components now default to `standalone: true`. All existing non-standalone components required explicit `standalone: false` in their `@Component` decorator (24 files updated).
- **Application Builder Migration**: The build system migrated from `@angular-devkit/build-angular:browser` to `@angular-devkit/build-angular:application`.
  - `outputPath` changed from a string (`"dist"`) to an object (`{ "base": "dist" }`)
  - `main` option renamed to `browser`
  - `browserTarget` renamed to `buildTarget` throughout angular.json
  - `vendorChunk` and `buildOptimizer` options removed (handled automatically by the new builder)
  - `polyfills` changed from a string to an array

## Angular 19 to 20

- **Control Flow Syntax**: All `*ngIf`, `*ngFor`, and `*ngSwitch` directives converted to the new block control flow syntax (`@if`, `@for`, `@switch`). 19 template files updated.
- **TestBed.get Deprecation**: `TestBed.get()` replaced with `TestBed.inject()` in 4 spec files.
- **moduleResolution**: TypeScript `moduleResolution` changed from `"node"` to `"bundler"` in `tsconfig.json`.
- **Workspace Generation Defaults**: angular.json schematics updated with new generation defaults (type suffixes, type separators).
- **Node.js Requirement**: Minimum Node.js version increased to 20+ (upgraded from Node 18 to Node 20).

## Angular 20 to 21

- **Bootstrap Options Migration**: Deprecated bootstrap options migrated to providers in `src/main.ts`.
- **TypeScript lib Update**: `lib` property in tsconfig updated to use `es2022` or more modern version (removed explicit `es2017` and `dom` entries).
- **Angular Material**: Updated from 20.x to 21.2.6
- **Angular CDK**: Updated from 20.x to 21.2.6
- **TypeScript**: Updated to 5.9.3

## Additional Fixes Required After Upgrade

- **Moment.js Import Style**: `import * as moment from 'moment'` changed to `import moment from 'moment'` in 4 files. The `moduleResolution: "bundler"` setting requires ESM-style default imports instead of namespace imports.
  - `src/app/pets/pet-add/pet-add.component.ts`
  - `src/app/pets/pet-edit/pet-edit.component.ts`
  - `src/app/visits/visit-add/visit-add.component.ts`
  - `src/app/visits/visit-edit/visit-edit.component.ts`

- **Duplicate Bootstrap CSS**: Removed `node_modules/bootstrap/dist/css/bootstrap.css` from angular.json `styles` array. The application builder's CSS url() resolution caused a conflict with the project's custom `petclinic.css` (which already includes Bootstrap 3.3.7), as both referenced different versions of `glyphicons-halflings-regular.svg` at the same output path.

## Dependency Version Summary

| Package | Before | After |
|---------|--------|-------|
| @angular/core | 16.2.1 | 21.2.8 |
| @angular/cli | 16.2.0 | 21.2.7 |
| @angular/material | 16.2.1 | 21.2.6 |
| @angular/cdk | 16.2.1 | 21.2.6 |
| TypeScript | ~5.1.6 | 5.9.3 |
| zone.js | ~0.13.1 | ~0.15.1 |
| RxJS | ^6.3.1 | ^6.3.1 (unchanged) |
