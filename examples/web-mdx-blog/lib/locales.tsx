import { languages, namespaces } from "next-i18next-static-site";

interface Locales {
  [key: string]: any;
}

// Load all locales, required for next-i18n-static-site
// Can be changed based on your folder structure
const locales: Locales = {};
languages.map((language) => {
  locales[language] = {};

  namespaces.map((namespace) => {
    locales[language][namespace] = require("./../locales/" +
      language +
      "/" +
      namespace +
      ".json");
  });
});

export default locales;
