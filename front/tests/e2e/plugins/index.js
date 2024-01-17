/* eslint-disable arrow-body-style */
// https://docs.cypress.io/guides/guides/plugins-guide.html

// if you need a custom webpack configuration you can uncomment the following import
// and then use the `file:preprocessor` event
// as explained in the cypress docs
// https://docs.cypress.io/api/plugins/preprocessors-api.html#Examples

// /* eslint-disable import/no-extraneous-dependencies, global-require */
// const webpack = require('@cypress/webpack-preprocessor')

require("dotenv").config();

module.exports = (on, config) => {
  // on('file:preprocessor', webpack({
  //  webpackOptions: require('@vue/cli-service/webpack.config'),
  //  watchOptions: {}
  // }))

  const PROTOCOL_BACKSLASHES = "//";

  const baseUrl = process.env.VUE_APP_DOMAIN;
  const dynamicAppBaseUrl = process.env.VUE_APP_BASE_DOMAIN;
  const appName = process.env.VUE_APP_E2E_APP_NAME;

  const [protocol] = baseUrl.split(PROTOCOL_BACKSLASHES);
  const isFullBaseUrl = protocol === "https:" || protocol === "http:";

  config.env.baseUrl = baseUrl && isFullBaseUrl ? baseUrl : "";
  config.env.restApiPrefix = process.env.VUE_APP_REST_API_PREFIX;
  config.env.mainBaseUrl = process.env.VUE_APP_MAIN_DOMAIN;
  config.env.appBaseUrl = dynamicAppBaseUrl.replace("{{businessName}}", appName);
  config.env.e2eAppName = process.env.VUE_APP_E2E_APP_NAME;

  return Object.assign({}, config, {
    fixturesFolder: "tests/e2e/fixtures",
    integrationFolder: "tests/e2e/specs",
    screenshotsFolder: "tests/e2e/screenshots",
    videosFolder: "tests/e2e/videos",
    supportFile: "tests/e2e/support/index.js",
  });
};
