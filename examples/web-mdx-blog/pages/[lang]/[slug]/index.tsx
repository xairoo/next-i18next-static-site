import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { GetStaticPaths, GetStaticProps } from "next";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import Head from "next/head";
import slugsByLocaleRaw from "../../../data/slugsByLocale.json";
import slugsByGroupRaw from "../../../data/slugsByGroup.json";
import staticGroups from "../../../data/staticGroups.json";
import { SlugsByLocale, SlugsByGroup, PageProps } from "../../../types";
import HelloWorld from "../../../components/helloWord";
import T from "../../../components/t";
import MDXBlock from "../../../components/MDXBlock";

export default function Page({
  content,
  meta,
  text,
  data,
  mdxBlock,
}: PageProps) {
  const components = {
    Head,
    HelloWorld,
    T,
    MDXBlock: () => (
      <MDXBlock content={mdxBlock} scope={{ meta, text, data }} />
    ),
  };

  return (
    <>
      <Head>
        <title>{`${meta?.title && meta?.title + " | "}${process.env.NEXT_PUBLIC_SITE_TITLE}`}</title>
      </Head>

      <h1>{meta.title}</h1>

      <div>
        <MDXRemote components={components} {...content} />
      </div>
    </>
  );
}

type Params = {
  lang: string;
  slug: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugsByGroup: SlugsByGroup = slugsByGroupRaw;
  const paths: { params: Params }[] = [];

  for (const group in slugsByGroup) {
    const slugs = slugsByGroup[group];
    for (const locale in slugs) {
      paths.push({
        params: {
          lang: locale,
          slug: slugsByGroup[group][locale],
        },
      });
    }
  }

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { lang, slug } = params as Params;

  const slugsByLocale: SlugsByLocale = slugsByLocaleRaw;
  const slugsByGroup: SlugsByGroup = slugsByGroupRaw;

  const group = slugsByLocale[lang][slug];

  const dirPath = path.join(process.cwd(), "content");
  const filePath = path.join(dirPath, group, "index.mdx");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data: frontmatter, content } = matter(fileContent);

  if (frontmatter.date) {
    frontmatter.date = new Date(frontmatter.date).toISOString();
  }

  let meta: { [key: string]: string } = {};
  let text: { [key: string]: string } = {};
  let data: { [key: string]: string } = {};

  const langModule = await import(`../../../content/${group}/${lang}.ts`);

  meta = langModule.meta || {};
  text = langModule.text || {};
  data = langModule.data || {};

  const mdxSource = await serialize(content, {
    scope: {
      meta,
      text,
      data,
    },
  });

  const mdxBlockPath = path.join(
    process.cwd(),
    "content",
    group,
    `${lang}.mdx`
  );
  const mdxBlock = fs.existsSync(mdxBlockPath)
    ? fs.readFileSync(mdxBlockPath, "utf-8")
    : "";

  return {
    props: {
      lang,
      groupSlugs: slugsByGroup[group],
      staticGroups: staticGroups,
      content: mdxSource,
      frontmatter,
      meta,
      text,
      data,
      mdxBlock,
    },
  };
};
