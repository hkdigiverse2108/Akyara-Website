import { ArrowLeftOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Queries } from "../../../Api/Queries";
import { ROUTES } from "../../../Constants";
import BlogThumbnailImage from "./BlogThumbnailImage";
import {getBlogDescription,getBlogIdentifier,getBlogTitle,normalizeBlogItems,resolveBlogDate,} from "./blogData";

const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const detailQuery = Queries.useGetBlogById(id, !!id);
  const post = useMemo(() => {const normalized = normalizeBlogItems(detailQuery.data?.data);return normalized[0];}, [detailQuery.data?.data]);

  const postId = post ? getBlogIdentifier(post) : "";

  if (detailQuery.isLoading) {
    return (
      <section className="bg-white py-10 sm:py-12">
        <div className="mx-auto w-[92%] max-w-[1300px]">
          <div className="h-[40px] w-[160px] animate-pulse rounded bg-[#eef1f5]" />
          <div className="mt-5 h-[220px] animate-pulse rounded-[12px] bg-[#eef1f5] sm:h-[300px] lg:h-[380px]" />
          <div className="mt-4 h-6 w-[70%] animate-pulse rounded bg-[#eef1f5]" />
          <div className="mt-3 h-5 w-full animate-pulse rounded bg-[#eef1f5]" />
          <div className="mt-2 h-5 w-[92%] animate-pulse rounded bg-[#eef1f5]" />
        </div>
      </section>
    );
  }
  if (!post) {
    return (
      <section className="bg-white py-12 sm:py-14">
        <div className="mx-auto w-[92%] max-w-[800px] rounded-xl border border-[#e5e7eb] px-5 py-8 text-center">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.2em] text-[#9aa4b2]">Blog Detail</p>
          <h1 className="mt-2 text-xl font-semibold text-[#111827] sm:text-2xl">Article not found</h1>
          <p className="mt-3 text-sm text-[#6b7280]">This blog is not available. Please check other articles.</p>
          <Link to={ROUTES.INFO.BLOG} className="mt-5 inline-flex items-center gap-2 rounded-full bg-black px-5 py-2 text-sm text-white"><ArrowLeftOutlined />Back to Blog</Link>
        </div>
      </section>
    );
  }
  return (
    <section className="bg-white py-10 sm:py-12">
      <div className="mx-auto w-[92%] max-w-[1300px]">
        <div className="mb-5">
          <Link to={ROUTES.INFO.BLOG} className="inline-flex items-center gap-2 text-sm text-[#6b7280] hover:text-black"><ArrowLeftOutlined />Back to Blog</Link>
        </div>

        <div className="mx-auto max-w-[900px]">
          <article>
            <div className="overflow-hidden rounded-[12px]">
              <BlogThumbnailImage key={`${postId}-${post.thumbnail ?? ""}`} value={post.thumbnail} alt={post.imageAltText || getBlogTitle(post)} className="h-[220px] w-full object-cover sm:h-[300px] lg:h-[380px]" loading="eager"/>
            </div>
            <div className="mt-4 flex items-center gap-3 text-[0.75rem] text-[#9aa4b2]">
              <span className="flex items-center gap-1">
                <ClockCircleOutlined />
                {resolveBlogDate(post.createdAt || post.updatedAt)}
              </span>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <span>Editorial</span>
            </div>
            <h1 className="mt-2 text-xl font-semibold text-[#111827] sm:text-2xl lg:text-[1.7rem]">{getBlogTitle(post)}</h1>
            {post.tagLine ? <p className="mt-3 text-[1rem] font-medium text-[#4b5563]">{post.tagLine}</p> : null}
            <p className="mt-3 whitespace-pre-line text-[0.95rem] leading-7 text-[#374151]">{getBlogDescription(post)}</p>
            {post.tags?.length ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span key={`${postId}-${tag}`} className="rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-3 py-1 text-xs font-medium text-[#4b5563]">#{tag}</span>
                ))}
              </div>
            ) : null}
          </article>
        </div>
      </div>
    </section>
  );
};

export default BlogDetailPage;

