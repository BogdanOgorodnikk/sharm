/**
 * Automatically imports all the modules and exports as a single module object
 */
const requireModule = require.context(".", false, /\.module\.js$/);
const entityModules = {};

requireModule.keys().forEach((filename) => {
  // create the module name from fileName
  // remove the store.js extension and capitalize
  const moduleName = filename.replace(/(\.\/|\.module\.js)/g, "");

  entityModules[moduleName] = requireModule(filename).default || requireModule(filename);
});

export default entityModules;
