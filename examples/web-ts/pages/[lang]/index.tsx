import { useState } from "react";
import {
  getAllLanguageSlugs,
  getLanguage,
  useTranslation,
  Trans,
} from "next-i18next-static-site";
import { LinkText } from "../../components/link";

export default function Home() {
  const { t, i18n } = useTranslation();

  const [count, setCount] = useState(1);

  return (
    <div>
      <h1>{t("Home")}</h1>

      <p>
        {t("Language")}: {i18n.language.toLocaleUpperCase()}
      </p>

      <blockquote>
        <Trans i18nKey="userMessagesUnread" count={count}>
          Hello <strong title={t("nameTitle")}>{{ name: "Mike" }}</strong>, you
          have {{ count }} unread message.{" "}
          <LinkText href={`${i18n.language}/second-page`}>
            Go to the second page
          </LinkText>
          .
        </Trans>
      </blockquote>

      <p>
        <button onClick={() => setCount(count + 1)}>
          {t("Message count +")}
        </button>
        <button onClick={() => setCount(count - 1)}>
          {t("Message count -")}
        </button>
      </p>

      <p>parseMissingKeyHandler() test: {t("someMissingKey")}</p>

      <pre>
        Example name: {process.env.NEXT_PUBLIC_EXAMPLE_NAME}
        {"\n"}
        Example version: {process.env.NEXT_PUBLIC_EXAMPLE_VERSION}
        {"\n"}
        Next.js version: {process.env.NEXT_PUBLIC_NEXT_VERSION}
        {"\n"}
      </pre>
    </div>
  );
}

export async function getStaticPaths() {
  const paths = getAllLanguageSlugs();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }: any) {
  const language = getLanguage(params.lang);
  return {
    props: {
      language,
    },
  };
}
