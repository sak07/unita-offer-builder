# Offer Builder

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.2.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Demo Screenshots

You can find demonstration screenshots of the application in the [`/demo`](./demo) folder. These images showcase the offering builder's features, responsive design, and final preview state.

## Project Structure

The project follows a feature-based organization for the Offering Builder:

- **`src/app/features/offering-builder/`**: Core feature directory.
  - **`components/`**: UI components for each step (Selection, Details, Pricing, Media) and shared elements (Preview Card, Builder Container).
  - **`services/`**: `BuilderStateService` and `BuilderStore` manage the state using Angular Signals.
  - **`interfaces/`**: Type definitions for Offerings and Pricing Tiers.
- **`public/assets/`**: Static icons and public assets.
- **`/demo/`**: Reserved for screenshots and demonstration media.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
