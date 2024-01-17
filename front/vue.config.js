const path = require("path");

const { version } = require("./package.json");

process.env.VUE_APP_VERSION = version;

module.exports = {
  publicPath: process.env.VUE_APP_PATH,
  outputDir: path.resolve(__dirname, process.env.VUE_APP_OUTPUT_DIR),
  indexPath: "index.html",
  configureWebpack: {
    resolve: {
      alias: {
        vue$: "vue/dist/vue.runtime.esm.js",
        twConfig: path.resolve(__dirname, "tailwind.config.js"),
      },
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule("i18n")
      .resourceQuery(/blockType=i18n/)
      .type("javascript/auto")
      .use("i18n")
      .loader("@intlify/vue-i18n-loader")
      .end()
      .use("yaml")
      .loader("yaml-loader")
      .end();
  },
  css: {
    loaderOptions: {
      postcss: {
        postcssOptions: {
          path: __dirname,
        },
      },
    },
  },
};
