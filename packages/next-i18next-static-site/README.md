<div align="center">
  <h1>next-i18next-static-site</h1>
  <p>i18next solution for static sites build with Next.js (static HTML export / <code>next export</code>).</p>
  <p>
    <a href="https://www.npmjs.com/package/next-i18next-static-site"><img src="https://img.shields.io/npm/v/next-i18next-static-site/latest?style=flat-square&label=latest%20stable" /></a>
    <img src="https://img.shields.io/bundlephobia/minzip/next-i18next-static-site?style=flat-square" alt="npm bundle size" />
    <img src="https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=fff&style=flat-square" alt="TypeScript" />
  </p>
</div>

This package brings you `react-i18next` and `i18next` to your static sites build with the `next export` future from Next.js.

- 🗲 Translation is already rendered (SSG), client will receive the final translated site.
- 🔥 Hot reloading works also when you update your locale (translation) files.
- 🚀 Automatic browser language detection can be realized.
- 🍪 Cookie stores the client language.

## Installation

```
npm install --save next-i18next-static-site
```

## Usage

> `publicRuntimeConfig` is deprecated by Next.js.  
> I moved the configuration for `next-i18next-static-site` to environment variables.

Set the supported languages and the namespaces in your `next.config.js` or in your `.env.local`:

`next.config.js` example:

```js
module.exports = {
  env: {
    NEXT_PUBLIC_I18N_LANGUAGES: '["en", "de"]',
    NEXT_PUBLIC_I18N_DEFAULT_LANGUAGE: "en",
    NEXT_PUBLIC_I18N_NAMESPACES: '["common", "meta", "error"]',
    NEXT_PUBLIC_I18N_DEFAULT_NAMESPACE: "common",
  },
};
```

Arrays have to be a string within `next.config.js`, just put them into brackets, otherwise Next.js will throw an error.

`.env.local` example:

```
NEXT_PUBLIC_I18N_LANGUAGES=["en", "de"]
NEXT_PUBLIC_I18N_DEFAULT_LANGUAGE=en
NEXT_PUBLIC_I18N_NAMESPACES=["common", "meta", "error"]
NEXT_PUBLIC_I18N_DEFAULT_NAMESPACE=common
```

Additional [i18next options](https://www.i18next.com/overview/configuration-options) can be set with `NEXT_PUBLIC_I18N_OPTIONS`:

> Note:
> Calling functions like `parseMissingKeyHandler` won't work within the .env file, use `<I18nProvider i18n={i18nOptions} />` instead. See [example](https://github.com/xairoo/next-i18next-static-site/blob/main/examples/web-ts/pages/_app.tsx).

```
NEXT_PUBLIC_I18N_OPTIONS={"debug": true}
```

> Adding the same option keys within `<I18nProvider i18n={i18nOptions} />` will replace the values from the .env

Add your locales like that:

```
📦project
 ┗ 📂locales
    ┣ 📂de
    ┃  ┗ 📜common.json
    ┗ 📂en
       ┗ 📜common.json
```

> The locales folder structure could be changed, just update the locales loader to match your custom structure

Load the locales:

```js
// lib/locales.js
import { languages, namespaces } from "next-i18next-static-site";

const locales = {};
languages.map((language) => {
  locales[language] = {};

  namespaces.map((namespace) => {
    locales[language][namespace] = require(
      "./../locales/" + language + "/" + namespace + ".json"
    );
  });
});

export default locales;
```

Finally implement the locales loader and the `I18nProvider` like this in your `_app.js`:

```js
import {
  I18nProvider,
  languages,
  defaultLanguage,
  namespaces,
  defaultNamespace,
} from "next-i18next-static-site";

// Locales loader
import locales from "../lib/locales";

const App = function ({ Component, pageProps }) {
  // i18n options
  const i18n = {
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
      return <span className="error">{key}</span>;
    },
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

### Language detection

Your `pages/index.js` can use the default `useLanguageDetection()` function to redirect the user based on the browser locale or stored cookie:

```js
import { useLanguageDetection } from "next-i18next-static-site";

export default function Home() {
  useLanguageDetection();
}
```

> Custom language detection needed?  
> Have a look at the [`useLanguageDetection()`](https://github.com/xairoo/next-i18next-static-site/blob/main/packages/next-i18next-static-site/src/index.tsx) function.

## Online Example at Cloudflare Pages:

https://next-i18next-static-site.pages.dev/de  
Source: [examples/web](https://github.com/xairoo/next-i18next-static-site/tree/main/examples/web)
