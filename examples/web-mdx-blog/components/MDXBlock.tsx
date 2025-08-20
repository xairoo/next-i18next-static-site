import { useEffect, useState } from "react";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { MdxScope } from "../types";

type ExternalBlockProps = {
  content: string;
  scope: MdxScope;
};

export default function ExternalBlock({ content, scope }: ExternalBlockProps) {
  const [source, setSource] = useState<MDXRemoteSerializeResult | null>(null);

  useEffect(() => {
    serialize(content, { scope }).then((s) => setSource(s));
  }, [content, scope]);

  if (!source) {
    return null;
  }

  return <MDXRemote {...source} components={{ ExternalBlock }} />;
}
