import { ArrowLeftOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { Link, useParams } from "react-router-dom";
import { ROUTES } from "../../Constants";
import { BLOG_POSTS, getBlogDetailPath, getBlogPostBySlug } from "./blogData";

const BlogDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return (
      <section className="bg-white py-12 sm:py-14">
        <div className="mx-auto w-[92%] max-w-[800px] rounded-xl border border-[#e5e7eb] px-5 py-8 text-center">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-[#9aa4b2]">
            Blog Detail
          </p>
          <h1 className="mt-2 text-xl font-semibold text-[#111827] sm:text-2xl">
            Article not found
          </h1>
          <p className="mt-3 text-sm text-[#6b7280]">
            This blog is not available. Please check other articles.
          </p>

          <Link
            to={ROUTES.INFO.BLOG}
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-black px-5 py-2 text-sm text-white"
          >
            <ArrowLeftOutlined />
            Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  const relatedPosts = BLOG_POSTS.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="mx-auto w-[92%] max-w-[1300px]">

        {/* Back */}
        <div className="mb-5">
          <Link
            to={ROUTES.INFO.BLOG}
            className="inline-flex items-center gap-2 text-sm text-[#6b7280] hover:text-black"
          >
            <ArrowLeftOutlined />
            Back to Blog
          </Link>
        </div>

        {/* Layout */}
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">

          {/* Blog Content */}
          <article>
            <div className="overflow-hidden rounded-[12px]">
              <img
                src={post.image}
                alt={post.title}
                className="h-[220px] w-full object-cover sm:h-[300px] lg:h-[380px]"
              />
            </div>

            {/* Meta */}
            <div className="mt-4 flex items-center gap-3 text-[0.75rem] text-[#9aa4b2]">
              <span className="flex items-center gap-1">
                <ClockCircleOutlined />
                {post.date}
              </span>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <span>Editorial</span>
            </div>

            {/* Title */}
            <h1 className="mt-2 text-xl font-semibold text-[#111827] sm:text-2xl lg:text-[1.7rem]">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="mt-3 text-[0.95rem] leading-7 text-[#6b7280]">
              {post.excerpt}
            </p>

            {/* Content */}
            <div className="mt-5 space-y-4 text-[0.95rem] leading-7 text-[#374151]">
              {post.content.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="rounded-xl border border-[#e5e7eb] bg-[#fafafa] p-4 lg:sticky lg:top-[100px]">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-[#9aa4b2]">
              Latest Posts
            </p>

            <div className="mt-3 space-y-3">
              {relatedPosts.map((item) => (
                <Link
                  key={item.slug}
                  to={getBlogDetailPath(item.slug)}
                  className="block rounded-lg bg-white p-3 transition hover:shadow-sm"
                >
                  <p className="text-[0.7rem] text-[#9aa4b2]">{item.date}</p>
                  <p className="mt-1 text-[0.85rem] font-medium text-[#111827]">
                    {item.title}
                  </p>
                </Link>
              ))}
            </div>
          </aside>

        </div>
      </div>
    </section>
  );
};

export default BlogDetailPage;