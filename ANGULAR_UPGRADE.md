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
