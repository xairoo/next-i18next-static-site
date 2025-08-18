import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

if (!process.env.NEXT_PUBLIC_I18N_LANGUAGES) {
  throw Error("NEXT_PUBLIC_I18N_LANGUAGES not set");
}

const contentDir = path.join(process.cwd(), "content");
const languages = JSON.parse(process.env.NEXT_PUBLIC_I18N_LANGUAGES);

type GroupEntry = {
  slug: string;
  title: string;
};

type TypeGroups = Record<string, Record<string, GroupEntry>>;

type Groups = Record<string, Record<string, string>>;

type GroupStructure = {
  groups: Groups;
  staticGroups: TypeGroups;
  blogGroups: TypeGroups;
};

async function readGroupStructure(): Promise<GroupStructure> {
  const groups: Groups = {};
  const staticGroups: TypeGroups = {};
  const blogGroups: TypeGroups = {};

  const groupDirs = fs
    .readdirSync(contentDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  for (const group of groupDirs) {
    const groupPath = path.join(contentDir, group);
    const files = fs.readdirSync(groupPath);

    if (!fs.existsSync(path.join(groupPath, `index.mdx`))) {
      continue;
    }
    const fileContent = fs.readFileSync(
      path.join(groupPath, `index.mdx`),
      "utf-8"
    );

    // Get static flag
    const { data: frontmatter } = matter(fileContent);

    for (const lang of languages) {
      if (files.includes(`${lang}.ts`)) {
        const { meta } = await import(path.join(groupPath, `${lang}.ts`));
        if (!groups[lang]) {
          groups[lang] = {};
        }

        groups[lang][meta.slug] = group;

        // type: static
        if (frontmatter.type && frontmatter.type === "static") {
          if (!staticGroups[group]) {
            staticGroups[group] = {};
          }

          if (!staticGroups[group][lang]) {
            staticGroups[group][lang] = { slug: meta.slug, title: meta.title };
          }
        }

        // type: blog
        if (frontmatter.type && frontmatter.type === "blog") {
          if (!blogGroups[group]) {
            blogGroups[group] = {};
          }

          if (!blogGroups[group][lang]) {
            blogGroups[group][lang] = { slug: meta.slug, title: meta.title };
          }
        }
      }
    }
  }

  return { groups, staticGroups, blogGroups };
}

async function init() {
  const {
    groups: slugsByLocale,
    staticGroups,
    blogGroups,
  } = await readGroupStructure();

  const slugsByGroup: Record<string, Record<string, string>> = {};

  for (const locale in slugsByLocale) {
    for (const localSlug in slugsByLocale[locale]) {
      const group = slugsByLocale[locale][localSlug];
      slugsByGroup[group] ??= {};
      slugsByGroup[group][locale] = localSlug;
    }
  }

  // staticGroups.json
  fs.writeFileSync(
    path.join(process.cwd(), "data/staticGroups.json"),
    JSON.stringify(staticGroups),
    "utf-8"
  );

  // blogGroups.json
  fs.writeFileSync(
    path.join(process.cwd(), "data/blogGroups.json"),
    JSON.stringify(blogGroups),
    "utf-8"
  );

  // slugsByLocale.json
  fs.writeFileSync(
    path.join(process.cwd(), "data/slugsByLocale.json"),
    JSON.stringify(slugsByLocale),
    "utf-8"
  );

  // slugsByGroup.json
  fs.writeFileSync(
    path.join(process.cwd(), "data/slugsByGroup.json"),
    JSON.stringify(slugsByGroup),
    "utf-8"
  );
}

init();
