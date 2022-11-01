import Head from "next/head";
import { useTranslation } from "next-i18next-static-site";
import Link from "../link";
import LanguageMenu from "./languageMenu";
import styles from "./index.module.css";

export default function Header() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{`${t("title", { ns: "meta" })}`}</title>
      </Head>

      <div className={styles.header}>
        <div className={styles.flex}>
          <div>
            <Link href="/">{t("Home")}</Link>
          </div>
          <div>
            <Link href="/second-page">{t("Second Page")}</Link>
          </div>
          <div>
            <Link href="/404-page">{t("404 Page")}</Link>
          </div>
        </div>
        <LanguageMenu />
      </div>
    </>
  );
}
