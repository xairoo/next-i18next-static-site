import { useEffect } from "react";
import { useRouter } from "next/router";
import { cookieName, useTranslation } from "next-i18next-static-site";
import Cookies from "js-cookie";

export default function Home() {
  const { i18n } = useTranslation();
  const router = useRouter();

  useEffect(() => {
    const cookieLocale = Cookies.get(cookieName);

    let browserLocale =
      navigator.languages && navigator.languages.length
        ? navigator.languages[0]
        : navigator.language;

    browserLocale = browserLocale.slice(0, 2);

    if (cookieLocale && cookieLocale !== "false") {
      router.push("/" + cookieLocale);
    } else if (browserLocale) {
      router.push("/" + browserLocale);
    } else {
      router.push("/" + i18n.language);
    }
  }, [router, i18n.language]);

  return null;
}
