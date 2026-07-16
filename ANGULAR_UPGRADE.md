# Angular Upgrade: v16 → v22

This document records the incremental upgrade of `petclinic-angular` from Angular 16 to the latest Angular, and every breaking change encountered along the way.

The upgrade was performed one major version at a time using `ng update`, as recommended by the official [Angular Update Guide](https://angular.dev/update-guide), running each step's migration schematics.

## Environment changes

- **Node.js**: Angular 16 supported Node 16/18. Recent Angular majors dropped older Node versions. Node was upgraded to satisfy each step (Node 20.x for v16→v20 steps, Node 22.22+ for v21/v22).

## v16 → v17

Ran: `ng update @angular/core@17 @angular/cli@17 @angular/material@17 @angular/cdk@17 @angular-eslint/schematics@17 ...`

Breaking changes / notable updates:
- **TypeScript**: minimum bumped `4.9.5` → `5.4.5`. TypeScript 4.9 is no longer supported.
- **zone.js**: `0.13.x` → `0.14.x`.
- **`angular.json` builder options**: deprecated options removed by the CLI migration (`Replace deprecated options in 'angular.json'`).
- **New control-flow syntax** (`@if`/`@for`/`@switch`) introduced; existing `*ngIf`/`*ngFor` still supported. A migration escaped literal `@`/`}` characters in templates to HTML entities where needed.
- **`TransferState`/`makeStateKey`/`StateKey`** moved from `@angular/platform-browser` to `@angular/core` (migration applied automatically).
- **Node support**: Angular 17 requires Node `^18.13.0 || ^20.9.0`.

## v17 → v18

Ran: `ng update @angular/core@18 @angular/cli@18 @angular/material@18 @angular/cdk@18 @angular-eslint/schematics@18 ...`

Breaking changes / notable updates:
- **`HttpClientModule` deprecated** → replaced by the `provideHttpClient(withInterceptorsFromDi())` provider function (migration modified `app.module.ts` and all `*.service.ts` / `*.service.spec.ts` files). `HttpClientTestingModule` in specs was likewise replaced with `provideHttpClientTesting()`.
- **`@angular-eslint` → v18**: requires `@typescript-eslint` v7/v8 (peer dep). `typescript-eslint` was subsequently aligned.
- **Material** updated to v18 (MDC-based components; theming API changes handled by schematic).
- Optional migration `use-application-builder` (new esbuild-based application builder) was **not** applied to keep the change set minimal; the project continues on the Webpack `browser` builder.
- **Node support**: Angular 18 requires Node `^18.19.0 || ^20.11.0`.

## v18 → v19

Ran: `ng update @angular/core@19 @angular/cli@19 @angular/material@19 @angular/cdk@19 @angular-eslint/schematics@19 ...`

Breaking changes / notable updates:
- **Standalone is now the default.** In v19 components/directives/pipes are standalone unless stated otherwise. Since this app is still NgModule-based, the migration added `standalone: false` to all 24 declared components/directives (and test stubs) so they keep working. This is the single biggest source of file changes in this step.
- **TypeScript**: `5.4.5` → `5.8.3` (minimum TS bumped).
- **zone.js**: `0.14.x` → `0.15.x`.
- **`ExperimentalPendingTasks` → `PendingTasks`** (stabilised; migration applied, no usages here).
- Optional migrations available but **not** applied: `use-application-builder`, and `provide-initializer` (`APP_INITIALIZER` → `provideAppInitializer`, etc.). Neither is used in this codebase.
- **Node support**: Angular 19 requires Node `^18.19.1 || ^20.11.1 || ^22.0.0`.

## v19 → v20

Ran: `ng update @angular/core@20 @angular/cli@20 @angular/material@20 @angular/cdk@20 @angular-eslint/schematics@20 ... --force`

`--force` was required because two framework packages are being phased out and no longer track the main release train (see below), producing patch-level peer-dependency mismatches within v20. These are cosmetic (all still v20.x) and do not affect the build.

Breaking changes / notable updates:
- **`@angular/animations` and `@angular/platform-browser-dynamic` diverged from the release train.** `@20` resolves them to their last published patches (`animations@20.1.8`, `platform-browser-dynamic@20.0.7`) while the rest of the framework is `20.3.26`. Angular is winding these packages down (animations is moving into core; dynamic bootstrap is legacy). The version skew is expected and is the reason `--force` is needed.
- **`TestBed.get()` removed** → migrated to `TestBed.inject()` (4 spec files updated).
- **`DOCUMENT` token** moved from `@angular/common` to `@angular/core` (migration ran; no usages here).
- **`InjectFlags` enum** deprecated/removed (migration ran; no usages here).
- **`tsconfig.json`**: `moduleResolution` updated to `bundler`.
- **Angular Material v20**: theming/token updates applied by the schematic.
- Optional migrations available but **not** applied: `use-application-builder`, `control-flow-migration` (`*ngIf`/`*ngFor` → `@if`/`@for`), and `router-current-navigation`. These are stylistic/architectural and out of scope for a version bump.
- **Node support**: Angular 20 requires Node `^20.19.0 || ^22.12.0 || >=24.0.0` (Node 18 dropped).
