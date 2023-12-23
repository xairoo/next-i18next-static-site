const { i18n } = require("./next-i18next-static-site-config");
const packageJSON = require("./package.json");

const withTM = require("next-transpile-modules")(["next-i18next-static-site"]);

module.exports = withTM({
  reactStrictMode: true,
  publicRuntimeConfig: {
    i18n,
    packageJSON,
  },
  output: "export",
});
