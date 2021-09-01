/// <reference types="cypress" />

import injectDevServer from '@cypress/react/plugins/react-scripts';
import installCoverageTask from '@cypress/code-coverage/task';
import '@cypress/instrument-cra';

const pluginConfig: Cypress.PluginConfig = (on, config) => {
  if (config.testingType === 'component') {
    injectDevServer(on, config);
  }
  installCoverageTask(on, config);
  return config;
};

export default pluginConfig;
