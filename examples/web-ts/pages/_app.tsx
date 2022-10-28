import { AppProps } from "next/app";
import {
  I18nProvider,
  languages,
  defaultLanguage,
  namespaces,
  defaultNamespace,
} from "next-i18next-static-site";
import Header from "../components/header";
import "./styles.css";

interface locales {
  [key: string]: any;
}

// Load all locales, required for next-i18n-static-site
export const locales: locales = {};
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

const App = function ({ Component, pageProps }: AppProps) {
  // i18n options
  const i18n = {
    languages,
    defaultLanguage,
    namespaces,
    defaultNamespace,
    locales,
    // allowHydration: true, // Defaults to `true`
  };

  return (
    <I18nProvider i18n={i18n} /* Pass the i18n options to the i18n provider */>
      <Header />
      <Component {...pageProps} />
    </I18nProvider>
  );
};

export default App;
