const packageJSON = require("./package.json");

const withTM = require("next-transpile-modules")(["next-i18next-static-site"]);

module.exports = withTM({
  reactStrictMode: true,
  env: {
    // Just for the example
    NEXT_PUBLIC_EXAMPLE_NAME: packageJSON.name,
    NEXT_PUBLIC_EXAMPLE_VERSION: packageJSON.version,
    NEXT_PUBLIC_NEXT_VERSION: packageJSON.dependencies.next,
  },
  output: "export",
});
