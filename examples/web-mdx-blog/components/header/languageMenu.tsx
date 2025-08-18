import { languages, useTranslation } from "next-i18next-static-site";
import Link from "../link";
import styles from "./languageMenu.module.css";

type Props = {
  groupSlugs?: Record<string, string>;
};

export default function LanguageMenu({ groupSlugs }: Props) {
  const { t } = useTranslation();

  return (
    <div className={styles.flex}>
      {languages.map((lang) => {
        const slug = groupSlugs?.[lang];

        if (groupSlugs && !slug) {
          return null;
        }

        return (
          <Link key={lang} href={slug ? `/${slug}` : "/"} locale={lang}>
            <span>{t(lang)}</span>
          </Link>
        );
      })}
    </div>
  );
}
