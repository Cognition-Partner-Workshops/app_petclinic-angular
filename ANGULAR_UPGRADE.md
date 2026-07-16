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

## v20 → v21

Ran (on **Node 22.23.1** — Angular 21 requires Node `^22.22.3 || ^24.15.0 || >=26.0.0`): `ng update @angular/core@21 @angular/cli@21 @angular/material@21 @angular/cdk@21 @angular-eslint/schematics@21 ...`

Breaking changes / notable updates:
- **New block control-flow is now mandatory-migrated.** The `control-flow-migration` (optional in v20) runs by default in v21 and converted **all 19 templates** from `*ngIf`/`*ngFor`/`*ngSwitch` to `@if`/`@for`/`@switch`.
- **Bootstrap options migrated to providers.** `bootstrapModule(AppModule)` now passes `applicationProviders: [provideZoneChangeDetection()]` — zone change detection is no longer implicit; it must be provided explicitly (`src/main.ts`).
- **`ApplicationConfig`** moved from `@angular/platform-browser` to `@angular/core` (migration ran; no usages here).
- **TypeScript**: `5.8.3` → `5.9.3`.
- **tsconfig `lib`** bumped to `es2022`.
- `@angular/animations` / `@angular/platform-browser-dynamic` are back on the release train (`21.2.18`), so no `--force` was needed for this step.
- **Node support**: Angular 21 requires Node `^22.22.3 || ^24.15.0 || >=26.0.0`.

## v21 → v22

Ran: `ng update @angular/core@22 @angular/cli@22 @angular/material@22 @angular/cdk@22 @angular-eslint/schematics@22 ... --force`

`--force` was required because the pre-existing lint stack (`@typescript-eslint@6/7`, `codelyzer@6`, `eslint@8`) was incompatible with the new toolchain (`eslint@10`, `angular-eslint@22`, which need `typescript-eslint@8`). The lint stack was migrated separately (see below).

Framework breaking changes / notable updates handled by schematics:
- **`ChangeDetectionStrategy.Eager` added to every component.** v22 changes change-detection defaults; the migration annotated all 24 components with `changeDetection: ChangeDetectionStrategy.Eager` to preserve the previous (non-OnPush) behavior.
- **`provideHttpClient` now requires `withXhr()`** when `HttpXhrBackend` is used — migration added `withXhr()` to `app.module.ts` and updated 6 spec files.
- **TypeScript**: `5.9.3` → `6.0.3`.
- **ESLint**: `8.x` → `10.x`; **`typescript-eslint`**: `7.x` → `8.x`.
- tsconfig `extendedDiagnostics` (`nullishCoalescingNotNullable`, `optionalChainNotNullable`) suppressed by the migration.
- **Node support**: Angular 22 requires Node `^22.22.3 || ^24.15.0 || >=26.0.0`.

### Manual fixes required after the v22 schematics

These are the breaking changes `ng update` could **not** fix automatically:

1. **TypeScript 6.0 + Angular 22 enable `strict` by default.** The v16 project was non-strict, so ~40 `strictNullChecks` (TS2322) and `strictPropertyInitialization` (TS2564) errors appeared (e.g. `owner.id = null`, `errorMessage: string;` with no initializer). To keep the upgrade scoped to a framework bump and avoid rewriting business logic / model nullability, `"strict": false` was set **explicitly** in `tsconfig.json`, preserving the project's original TypeScript posture. *Recommended follow-up: enable `strict` and fix the types properly in a dedicated PR.*

2. **`baseUrl` deprecated in TypeScript 6.0** (TS5101). Added `"ignoreDeprecations": "6.0"` to `tsconfig.json` (it is removed entirely in TS 7.0).

3. **`moment` default import.** With `moduleResolution: "bundler"`, `import * as moment from "moment"` is no longer callable (TS2349). Switched the 4 usages to `import moment from "moment"` and enabled `"esModuleInterop": true`.

4. **`async()` removed from `@angular/core/testing`** (TS2305). Replaced the deprecated `async(...)` test wrapper with `waitForAsync(...)` and removed the dead `async` import in 3 spec files (`owner-add`, `owner-edit`, `specialty-add`).

5. **ESLint flat config migration.** ESLint 10 dropped `.eslintrc.json` support entirely (flat config only) and `ng lint` failed with "Could not find config file". Actions:
   - Replaced `.eslintrc.json` with `eslint.config.js` (flat config using `typescript-eslint` + `angular-eslint`).
   - Removed the obsolete/incompatible packages `codelyzer`, `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, and the individual `@angular-eslint/eslint-plugin*` / `template-parser` packages; added the unified `typescript-eslint@8` and `angular-eslint@22`, bumped `eslint-config-prettier` to v10.
   - The new `angular-eslint` recommended set adds opinionated rules that require architectural migrations this NgModule/constructor-injection app has not adopted (`prefer-standalone`, `prefer-inject`, `prefer-on-push-component-change-detection`). These are disabled in `eslint.config.js` to keep lint scope equivalent to the original config. *Recommended follow-up: adopt standalone components + `inject()` and re-enable these rules.*

6. **Duplicate asset filename build conflict.** `bootstrap.css` (from `node_modules`) and `src/assets/css/petclinic.css` each declare a `Glyphicons Halflings` `@font-face` pointing at a **different** `glyphicons-halflings-regular.svg`. Angular 22's asset pipeline emits both to the output root under the same filename, producing an intermittent `Conflict: Multiple assets emit different content to the same filename` build failure. Fixed by adding `"outputHashing": "media"` to the base build options so CSS-referenced resources get content hashes and no longer collide.

## Result

- `npm run build` — succeeds (deterministically) on Angular 22.0.7 / TypeScript 6.0.3.
- `ng build --configuration production` — succeeds.
- `npm run lint` — passes.
- `npm run test-headless` — 43/43 specs pass.
