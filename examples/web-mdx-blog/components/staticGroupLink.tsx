import Link from "./link";
import { StaticGroups } from "../types";
import { defaultLanguage } from "next-i18next-static-site";

interface StaticSlugLinkProps {
  keyName: string;
  language: string;
  staticGroups: StaticGroups;
}

export default function StaticGroupLink({
  keyName,
  language,
  staticGroups,
}: StaticSlugLinkProps) {
  if (!language || !staticGroups || !staticGroups[keyName]) {
    return null;
  }

  const lang = staticGroups[keyName][language] ? language : defaultLanguage;

  const entry = staticGroups[keyName][lang];

  if (!entry) {
    return null;
  }

  return (
    <div>
      <Link href={`/${entry.slug}`} locale={lang}>
        {entry.title}
      </Link>
    </div>
  );
}
