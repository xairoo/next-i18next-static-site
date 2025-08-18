import Head from "next/head";
import { useTranslation } from "next-i18next-static-site";
import Link from "../link";
import LanguageMenu from "./languageMenu";
import styles from "./index.module.css";
import StaticGroupLink from "../staticGroupLink";
import { GroupSlugs, StaticGroups } from "../../types";

type Props = {
  groupSlugs?: GroupSlugs;
  staticGroups: StaticGroups;
};

export default function Header({ groupSlugs, staticGroups }: Props) {
  const { t, i18n } = useTranslation();

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
            <Link href="/blog">Blog</Link>
          </div>
          <div>
            <StaticGroupLink
              keyName="static-page"
              language={i18n.language}
              staticGroups={staticGroups}
            />
          </div>
          <div>
            <Link href="/404-page">{t("404 Page")}</Link>
          </div>
        </div>
        <LanguageMenu groupSlugs={groupSlugs} />
      </div>
    </>
  );
}
