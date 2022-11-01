import Head from "next/head";
import { useRouter } from "next/router";
import { Trans, useTranslation } from "next-i18next-static-site";
import { LinkText } from "../components/link";

function Custom404() {
  const { t, i18n } = useTranslation("error");

  const router = useRouter();
  const { asPath } = router;

  return (
    <>
      <Head>
        <title>
          {`${t("404", { ns: "error" })} | ${t("title", {
            ns: "meta",
          })}`}
        </title>
      </Head>
      <h1>
        404 -{" "}
        {t("404", {
          ns: "error",
        })}
      </h1>

      <p>
        <Trans i18nKey="404-goto" ns="error">
          Site {{ asPath }} not found. Please go to our{" "}
          <LinkText href={`/${i18n.language}`}>home</LinkText> site.
        </Trans>
      </p>
    </>
  );
}

export default Custom404;

// Used to prevent `Error: Text content does not match server-rendered HTML.`
export async function getStaticProps() {
  return {
    props: {},
  };
}
