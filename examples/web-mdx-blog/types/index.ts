import { MDXRemoteSerializeResult } from "next-mdx-remote";

export type SlugsByLocale = Record<string, Record<string, string>>;

export type SlugsByGroup = Record<string, Record<string, string>>;

export type GroupSlugs = Record<string, string>;

export type StaticGroups = {
  [key: string]: {
    [key: string]: {
      slug: string;
      title: string;
    };
  };
};

export type TextProps = {
  [key: string]: string;
};

export type GroupEntry = {
  slug: string;
  title: string;
};

export type TypeGroups = Record<string, Record<string, GroupEntry>>;

export type TypeBlog = {
  [key: string]: {
    [key: string]: {
      slug: string;
      title: string;
    };
  };
};

export type Frontmatter = {
  slug: string;
  title: string;
  date: string;
  tags?: string[];
};

export type PageProps = {
  content: MDXRemoteSerializeResult;
  frontmatter: Frontmatter;
  meta: {
    title: string;
    slug: string;
    [key: string]: string;
  };
  text?: {
    [key: string]: string;
  };
  data?: {
    [key: string]: string;
  };
};
