import {
  I18nProvider,
  languages,
  defaultLanguage,
  namespaces,
  defaultNamespace,
} from "next-i18next-static-site";

// Locales loader
import locales from "../lib/locales";

import Header from "../components/header";
import "./styles.css";

const App = function ({ Component, pageProps }) {
  // i18n options
  const i18nOptions = {
    languages,
    defaultLanguage,
    namespaces,
    defaultNamespace,
    locales,

    // Additional options, not required.
    // https://www.i18next.com/overview/configuration-options
    debug: true,
    parseMissingKeyHandler: (key) => {
      console.log("Parsing missing key:", key);
      return key.toUpperCase(); // just a silly example
    },
    missingKeyHandler: (lng, ns, key) => {
      console.warn(`[Missing] ${lng}:${ns}:${key}`);
    },
  };

  return (
    <I18nProvider
      i18n={i18nOptions} /* Pass the i18n options to the i18n provider */
    >
      <Header />
      <Component {...pageProps} />
    </I18nProvider>
  );
};

export default App;
