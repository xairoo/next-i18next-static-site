<div align="center">
  <h1>next-i18next-static-site</h1>
  <p>i18next solution for static sites build with Next.js (static HTML export / <code>next export</code>).</p>
</div>

## i18next solution for Next.js

This package brings you `react-i18next` and `i18next` to your static sites build with the `next export` future from Next.js.

- 🗲 Translation is already rendered (SSG), client will receive the final translated site.
- 🚀 Automatic browser language detection.
- 🍪 Cookie stores the client language.
- 🔥 Hot reload works also when you update your locale (translation) files.

## Installation

```
npm install --save next-i18next-static-site
```

## Configuration

You have to add a few environment variables to your `next.config.js`.

## Usage

Set the supported languages and the namespaces in your `next.config.js`:

```js
publicRuntimeConfig: {
  i18n: {
    languages: ["en", "de"],
    defaultLanguage: "en",
    namespaces: ["common", "meta", "error"],
    defaultNamespace: "common",
  },
}
```

Add your locales like that:

```
📦project
 ┣ 📂locales
 ┃ ┣ 📂de
 ┃ ┃ ┣ 📜common.json
 ┃ ┗ 📂en
 ┃ ┃ ┣ 📜common.json
```

> The locales folder structure could be changed, just update the locales loader to match your custom structure

Finally implement the locales loader and the `I18nProvider` like this in your `_app.js`:

```js
import {
  I18nProvider,
  languages,
  defaultLanguage,
  namespaces,
  defaultNamespace,
} from "next-i18next-static-site";

// Load all locales, required for next-i18next-static-site
export const locales = {};
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

const App = function ({ Component, pageProps }) {
  // i18n options
  const i18n = {
    languages,
    defaultLanguage,
    namespaces,
    defaultNamespace,
    locales,
  };

  return (
    <I18nProvider i18n={i18n}>
      <Component {...pageProps} />
    </I18nProvider>
  );
};

export default App;
```

Now you are able to use `useTranslation`, `withTranslation`, `Translation` and `Trans` directly from `react-i18next` or from `next-i18next-static-site`.

> The [example Next.js site](https://github.com/xairoo/next-i18next-static-site/tree/main/apps/web-ts) provides a `Link` and `LinkText` (used for `Trans`) component and als a custom `404` page.
