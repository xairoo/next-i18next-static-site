import Link from "./link";
import { TypeBlog } from "../types";

interface StaticSlugLinkProps {
  blogs: TypeBlog[];
}

export default function BlogPosts({ blogs }: StaticSlugLinkProps) {
  return (
    <ul>
      {blogs.map((blog: TypeBlog) => {
        return (
          <li>
            <div>
              <Link href={`/${blog.meta.slug}`}>{blog.meta.title}</Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
