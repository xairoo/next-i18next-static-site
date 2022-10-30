import getConfig from "next/config";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Cookies, { CookieAttributes } from "js-cookie";
import i18next, { i18n } from "i18next";
import {
  initReactI18next,
  useTranslation,
  withTranslation,
  Translation,
  Trans,
} from "react-i18next";

// Translation exports from react-i18next
export { useTranslation, withTranslation, Translation, Trans };

const { publicRuntimeConfig } = getConfig();

interface Config {
  languages: string[];
  defaultLanguage: string;
  namespaces: string[];
  defaultNamespace: string;
  allowHydration: boolean;
  cookieName: string;
  cookieOptions: CookieAttributes;
}

const defaultConfig = {
  allowHydration: true,
  languages: ["en"],
  defaultLanguage: "en",
  namespaces: ["common"],
  defaultNamespace: "common",
  cookieName: "lang",
  // optional set cookie options, reference:[MDN Set-Cookie docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
  cookieOptions: { expires: 365, path: "/" },
};

const config: Config = {
  ...defaultConfig,
  languages: publicRuntimeConfig.i18n.languages,
  defaultLanguage: publicRuntimeConfig.i18n.defaultLanguage,
  namespaces: publicRuntimeConfig.i18n.namespaces,
  defaultNamespace: publicRuntimeConfig.i18n.defaultNamespace,
};

export const languages = config.languages;
export const defaultLanguage = config.defaultLanguage;
export const namespaces = config.namespaces;
export const defaultNamespace = config.defaultNamespace;
export const defaultNamespace2 = config.defaultNamespace;
export const cookieName = config.cookieName;

const createI18nextInstance = (locales: any, language: string): i18n => {
  // i18n plugins to load
  const plugins = [
    //
    initReactI18next,
  ];

  const i18nInstance = i18next;
  plugins.map((plugin) => i18nInstance.use(plugin));
  i18nInstance.init({
    resources: locales,
    cleanCode: true,
    lng: language,
    supportedLngs: config.languages,
    fallbackLng: language ? language : config.defaultLanguage,
    ns: config.namespaces, // String or array of namespaces to load
    defaultNS: config.defaultNamespace, // Default namespace used if not passed to translation function
    interpolation: {
      escapeValue: false, // Not needed for react as it escapes by default
    },
    react: {
      useSuspense: false, // Not compatible with SSR
    },
    load: "languageOnly", // Remove if you want to use localization (en-US, en-GB)
  });

  return i18nInstance;
};

let globalI18nextInstance: any = null;

export const i18nextInstance = (language: string, locales: object): i18n => {
  if (!globalI18nextInstance) {
    globalI18nextInstance = createI18nextInstance(locales, language);

    return globalI18nextInstance;
  } else {
    globalI18nextInstance.changeLanguage(language);

    return globalI18nextInstance;
  }
};

// Prevent rerender
let loaded = false;

export const I18nProvider = (props: any) => {
  const [hydration, setHydration] = useState(false);

  const options: any = { ...config, ...props.i18n };

  if (!props.i18n?.locales) {
    throw new Error("locales object was not passed into I18nProvider");
  }

  const router = useRouter();
  const { asPath, query } = router;

  // Detect the current language
  const slug = asPath.split("/")[1];
  const langSlug = config.languages.includes(slug) && slug;
  const language = (
    query.lang ||
    langSlug ||
    config.defaultLanguage
  ).toString();

  // Store the current language as a cookie
  const pathLocale = (query.lang || langSlug).toString();
  if (pathLocale && pathLocale !== "false") {
    Cookies.set(config.cookieName, pathLocale, config.cookieOptions);
  }

  // Load only once, otherwise there will be an re-render infinite loop
  if (!loaded) {
    i18nextInstance(language, props.i18n.locales);
  }

  const { i18n } = useTranslation();

  useEffect(() => {
    // Overwrite the current store
    i18n.services.resourceStore.data = props.i18n.locales;

    // Required to display the updated translations
    i18n.changeLanguage(language);
  }, [i18n, language, props.i18n.locales]);

  useEffect(() => {
    loaded = true;
    i18n.changeLanguage(language);
  }, [i18n, language]);

  useEffect(() => {
    const hasWindow = typeof window !== "undefined";
    if (hasWindow && options.allowHydration) {
      setHydration(true);
    }
  }, [options.allowHydration]);

  return hydration ? props.children : null;
};

// Used for getStaticPaths
export function getAllLanguageSlugs() {
  return config.languages.map((lang: string) => {
    return { params: { lang: lang } };
  });
}

// Used for getStaticProps
export function getLanguage(lang: string) {
  return config.languages.includes(lang) ? lang : config.defaultLanguage;
}

// Language detection and redirect
export const languageDetection = () => {
  const router = useRouter();

  useEffect(() => {
    let cookieLocale: string | undefined = Cookies.get(cookieName) || undefined;

    let browserLocale: string | undefined =
      (navigator.languages && navigator.languages.length
        ? navigator.languages[0]
        : navigator.language) || undefined;

    if (browserLocale) {
      browserLocale = browserLocale.slice(0, 2);
    }

    if (cookieLocale && languages.includes(cookieLocale)) {
      router.push("/" + cookieLocale);
    } else if (browserLocale && languages.includes(browserLocale)) {
      router.push("/" + browserLocale);
    } else {
      router.push("/" + defaultLanguage);
    }
  }, [router, defaultLanguage]);

  return null;
};
