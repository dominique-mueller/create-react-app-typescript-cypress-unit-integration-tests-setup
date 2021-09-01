<div align="center">

# create-react-app-typescript-cypress-unit-integration-tests-setup

Running unit & integration tests with **[Cypress](https://docs.cypress.io/guides/component-testing/introduction)** in a
**[TypeScript](https://github.com/microsoft/TypeScript)** **[React](https://github.com/facebook/react)** project based on
**[create-react-app](https://github.com/facebook/create-react-app)**.

</div>

<br><br><br>

## How to setup Cypress for unit & integration tests

This project is an example React application that uses
**[Cypress Component Testing](https://docs.cypress.io/guides/component-testing/introduction)** for the organization, writing and execution
of unit / integration tests. You can clone it and play around with it (see **[Commands](#commands)**). The following sub-chapters explain
how to setup Cypress Component Testing in a `create-react-app` project, including code coverage output and support for the
**[Testing Library](https://testing-library.com/docs/cypress-testing-library/intro)**.

<br>

### 1. Update dependencies

First of all, we need a few new dependencies. In particular:

- Cypress itself (`cypress`)
- Compatibility with Create React App (`@cypress/react`, `@cypress/webpack-dev-server`, `html-webpack-plugin`)
- Support for code coverage (`@cypress/code-coverage`, `@cypress/instrument-cra`)

Add all those dependencies to your `package.json` file, remove all Jest-related dependencies, and re-install them. For example:

```diff
  {
    "devDependencies": {
-     "@testing-library/jest-dom": "5.14.x",
-     "@testing-library/react": "12.0.x",
-     "@testing-library/user-event": "13.2.x",
-     "@types/jest": "26.0.x",
+     "@cypress/code-coverage": "3.9.x",
+     "@cypress/instrument-cra": "1.4.x",
+     "@cypress/react": "5.9.x",
+     "@cypress/webpack-dev-server": "1.5.x",
+     "cypress": "8.3.x",
+     "html-webpack-plugin": "4.5.x",
    }
  }
```

<br>

### 2. Remove Jest setup

You might find an ESLint configuration in your `package.json` file. If so, remove any Jest-related options from it. For example:

```diff
  "eslintConfig": {
    "extends": [
      "react-app",
-     "react-app/jest"
    ]
  },
```

In addition, the `setupTests.ts` file within the `src` folder is also no longer required and can be deleted. For example:

```diff
- // jest-dom adds custom jest matchers for asserting on DOM nodes.
- // allows you to do things like:
- // expect(element).toHaveTextContent(/react/i)
- // learn more: https://github.com/testing-library/jest-dom
- import '@testing-library/jest-dom';
```

<br>

### 3. Setup Cypress

#### 3.1 Update scripts

First, let's change our test scripts to use Cypress instead of Jest. Within the root folder, update your `package.json` file:

```diff
  {
    "scripts": {
-     "test": "react-scripts test",
+     "test": "cypress run-ct"
+     "test:runner": "cypress open-ct"
    }
  }
```

In detail:

- The `test` script executes all tests in headless mode - optimal for CI systems
- The `test:runner` script opens up the Cypress Test Runner and let's you choose specific tests to run - perfect for local development and
  debugging

> Note: Watching test files and re-executing tests only works with the `test:runner` script, and is enabeld by default
> (**[cypress#3665](https://github.com/cypress-io/cypress/issues/3665)**).

#### 3.2 Configure TypeScript

Now, we want to enable type safety & type support for our Cypress tests. Within the root folder, extend your `tsconfig.json` file:

```diff
  {
    "compilerOptions": {
+     "types": ["cypress"]
    }
  }
```

#### 3.3 Configure Cypress

First, we need to do some basic Cypress configuration, such as where to find unit / integration tests or how to run them.

Within the root folder, create a file named `cypress.json` and add the following content:

```diff
+ {
+   "testFiles": "**/*.test.{ts,tsx}",
+   "componentFolder": "src",
+   "video": false
+ }
```

Then, we need to configure Cypress to use the same dev server (Webpack) configuration that Create React App uses, and also to collect and
save code coverage.

Within the folder `cypress/plugins`, create a file named `index.ts` and add the following content:

```diff
+ /// <reference types="cypress" />
+
+ import injectDevServer from '@cypress/react/plugins/react-scripts';
+ import installCoverageTask from '@cypress/code-coverage/task';
+ import '@cypress/instrument-cra';
+
+ const pluginConfig: Cypress.PluginConfig = (on, config) => {
+   if (config.testingType === 'component') {
+     injectDevServer(on, config);
+   }
+   installCoverageTask(on, config);
+   return config;
+ };
+
+ export default pluginConfig;
```

Within the folder `cypress/support`, create a file named `index.ts` and add the following content:

```diff
+ /// <reference types="cypress" />
+
+ import '@cypress/code-coverage/support'
```

#### 3.4 Extend gitignore

Cypress has its own directory structure and output formats. Within your root folder, extend the `.gitignore` to exclude them:

```diff
  # See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

  # dependencies
  /node_modules
  /.pnp
  .pnp.js

  # testing
  /coverage
+ /.nyc_output
+ cypress/results/*
+ cypress/reports/*
+ cypress/screenshots/*
+ cypress/videos/*

  # production
  /build

  # misc
  .DS_Store
  .env.local
  .env.development.local
  .env.test.local
  .env.production.local

  npm-debug.log*
  yarn-debug.log*
  yarn-error.log*
```

<br>

### 4. Rewrite tests (unit / integration)

Mounting test setups and asserting expectations works similarly between Cypress and Jest, but uses a different syntax. For example, the
`App.test.tsx` requires the following changes:

```diff
- import { render, screen } from '@testing-library/react';
+ import { mount } from '@cypress/react'
  import App from './App';

- test('renders learn react link', () => {
+ it('renders learn react link', () => {
-   render(<App />);
+   mount(<App >);

-   const linkElement = screen.getByText(/learn react/i);
+   cy.get('a').should('exist');
  });
```

<br><br><br>

## Bonus: How to use the **[Testing Library](https://testing-library.com/docs/cypress-testing-library/intro)**

The **[Testing Library](https://testing-library.com/)** is very popuplar within the React community, and these days is also available for
various other frameworks and libraries - amongst them Cypress. The following sub-chapters explain how to set it all up.

<br>

### 1. Install dependencies

Add the dependency to your `package.json` file and install it. For example:

```diff
  {
    "devDependencies": {
+     "@testing-library/cypress": "8.0.x",
    }
  }
```

<br>

### 2. Configure Cypress

#### 2.1 Configure TypeScript

Within the root folder, extend your `tsconfig.json` file:

```diff
  {
    "compilerOptions": {
-     "types": ["cypress"]
+     "types": ["cypress", "@testing-library/cypress"]
    }
  }
```

#### 2.2. Configure Cypress

Within the folder `cypress/support`, open the `index.ts` file and add Testing Library commands:

```diff
  /// <reference types="cypress" />

  import '@cypress/code-coverage/support'
+ import '@testing-library/cypress/add-commands';
```

<br>

### 3. Rewrite tests (unit & integration)

You can now switch from the Cypress queries to Testing Library ones. For example, the `App.test.tsx` can now be changed the following way:

```diff
  import { screen } from '@testing-library/react';
  import { mount } from '@cypress/react'
  import App from './App';

  it('renders learn react link', () => {
    mount(<App >);

-   cy.get('a').should('exist');
+   cy.findByText(/learn react/i).should('exist');
  });
```

<br><br><br>

## Commands

The following commands are available:

| Command               | Description                                                       | CI                 |
| --------------------- | ----------------------------------------------------------------- | ------------------ |
| `npm start`           | Creates a development build, running in watch mode                |                    |
| `npm run build`       | Creates a production build                                        | :heavy_check_mark: |
| `npm run test`        | Executes all unit tests                                           | :heavy_check_mark: |
| `npm run test:runner` | Opens the test runner, allowing for specific unit test executions |                    |
