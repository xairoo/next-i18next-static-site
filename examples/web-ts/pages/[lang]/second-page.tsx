import {
  getAllLanguageSlugs,
  getLanguage,
  useTranslation,
  Trans,
} from "next-i18next-static-site";
import { LinkText } from "../../components/link";

export default function SecondPage() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("Second Page")}</h1>
      <blockquote>
        <Trans i18nKey="transComponentExample">
          This is a <em>react-i18next</em>{" "}
          <LinkText href="https://react.i18next.com/latest/trans-component">
            Trans
          </LinkText>{" "}
          component example.
        </Trans>
      </blockquote>
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

type Params = {
  params: {
    lang: string;
  };
};

export const getStaticProps = async ({ params }: Params) => {
  const language = getLanguage(params.lang);
  return {
    props: {
      language,
    },
  };
};
