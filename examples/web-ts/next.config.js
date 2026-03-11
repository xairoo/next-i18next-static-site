const packageJSON = require("./package.json");

module.exports = {
  reactStrictMode: true,
  output: "export",
  transpilePackages: ["next-i18next-static-site"],
  env: {
    // Just for the example
    NEXT_PUBLIC_EXAMPLE_NAME: packageJSON.name,
    NEXT_PUBLIC_EXAMPLE_VERSION: packageJSON.version,
    NEXT_PUBLIC_NEXT_VERSION: packageJSON.dependencies.next,
  },
  output: "export",
};
