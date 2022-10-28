import { useRouter } from "next/router";
import {
  defaultLanguage,
  languages,
  useTranslation,
} from "next-i18next-static-site";
import Link from "../link";
import styles from "./languageMenu.module.css";

// Alternative
const LanguageMenuTest = () => {
  const router = useRouter();
  const { pathname, query, asPath } = router;

  const changeLanguage = async (locale: string) => {
    // Detect current language
    const slug = asPath.split("/")[1];
    const langSlug = languages.includes(slug) && slug;
    const language: any = query.lang || langSlug || defaultLanguage;

    let href = pathname;

    if (locale) {
      if (pathname.startsWith("/404")) {
        href = `/${locale}`;
      } else {
        href = pathname.replace("[lang]", locale);
      }
    } else {
      if (language) {
        href = `/${language}${href}`;
      } else {
        href = `/${href}`;
      }
    }

    // Fix double slashes
    href = href.replace(/([^:]\/)\/+/g, "$1").replace("//", "/");

    router.push(href);
  };

  return (
    <div className={styles.flex}>
      <div onClick={() => changeLanguage("en")}>en</div>
      <div onClick={() => changeLanguage("de")}>de</div>
    </div>
  );
};

const LanguageMenu = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className={styles.flex}>
      {languages.map((lang, index) => {
        return (
          <Link key={index} locale={lang}>
            <span className={i18n.language === lang ? styles.underline : ""}>
              {t(lang)}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default LanguageMenu;
