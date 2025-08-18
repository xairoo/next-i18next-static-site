import { useTranslation } from "next-i18next-static-site";

export default function T({ key }: { key: string }) {
  const { t } = useTranslation();
  return <>{t(key)}</>;
}
