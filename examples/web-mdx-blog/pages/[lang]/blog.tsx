import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { GetStaticPaths, GetStaticProps } from "next";
import { serialize } from "next-mdx-remote/serialize";
import Head from "next/head";
import { languages } from "next-i18next-static-site";
import staticGroups from "../../data/staticGroups.json";
import blogGroups from "../../data/blogGroups.json";
import { TypeBlog } from "../../types";
import BlogPosts from "../../components/blogPosts";

export default function Page({ blogs }: { blogs: TypeBlog[] }) {
  return (
    <>
      <Head>
        <title>Blog | {process.env.NEXT_PUBLIC_SITE_TITLE}</title>
      </Head>

      <h1>Blog</h1>

      <BlogPosts blogs={blogs} />
    </>
  );
}

type Params = {
  lang: string;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: Params }[] = [];

  for (const locale of languages) {
    paths.push({
      params: {
        lang: locale,
      },
    });
  }

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { lang } = params as Params;

  const blogs = [];

  const dirPath = path.join(process.cwd(), "content");

  for (const group in blogGroups) {
    const filePath = path.join(dirPath, group, "index.mdx");
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data: frontmatter, content } = matter(fileContent);

    if (frontmatter.date) {
      frontmatter.date = new Date(frontmatter.date).toISOString();
    }

    let meta: { [key: string]: string } = {};
    let text: { [key: string]: string } = {};
    let data: { [key: string]: string } = {};

    const langModule = await import(`../../content/${group}/${lang}.ts`);

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

    blogs.push({
      content: mdxSource,
      frontmatter,
      meta,
      text,
      data,
    });
  }

  return {
    props: {
      lang,
      groupSlugs: { de: "blog", en: "blog" },
      blogGroups: blogGroups,
      staticGroups: staticGroups,
      blogs,
    },
  };
};
