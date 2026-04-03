import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Queries } from "../../Api/Queries";
import BlogThumbnailImage from "./BlogThumbnailImage";
import {getBlogDetailPath,getBlogExcerpt,getBlogIdentifier,getBlogTitle,normalizeBlogItems,resolveBlogDate,} from "./blogData";

const BLOGS_PER_PAGE = 12;

const BlogPage = () => {
  const blogQuery = Queries.useGetBlogAll(true);
  const [currentPage, setCurrentPage] = useState(1);

  const blogPosts = useMemo(() =>normalizeBlogItems(blogQuery.data?.data)  .filter((item) => item.isDeleted !== true && item.isActive !== false && !!getBlogIdentifier(item))  .sort((a, b) => {    const aDate = new Date(a.createdAt || a.updatedAt || 0).getTime();    const bDate = new Date(b.createdAt || b.updatedAt || 0).getTime();    return bDate - aDate;  }),[blogQuery.data?.data], );

  const totalPages = Math.max(1, Math.ceil(blogPosts.length / BLOGS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);

  const paginatedPosts = useMemo(() => {
    const startIndex = (activePage - 1) * BLOGS_PER_PAGE;
    return blogPosts.slice(startIndex, startIndex + BLOGS_PER_PAGE);
  }, [activePage, blogPosts]);

  const pageNumbers = useMemo(() => Array.from({ length: totalPages }, (_, index) => index + 1), [totalPages]);

  return (
    <section className="bg-white py-10 sm:py-12 lg:py-14">
      <div className="mx-auto w-[92%] max-w-[1400px]">
        <div className="relative mb-8 text-center sm:mb-10">
          <p className="pointer-events-none absolute left-1/2 top-0 hidden -translate-x-1/2 -translate-y-[35%] whitespace-nowrap text-[clamp(2.5rem,6vw,4.5rem)] font-semibold italic leading-none text-[#d9dde4]/60 md:block">
            Latest News
          </p>
          <h1 className="relative z-10 text-2xl font-semibold text-[#0b0b0b] sm:text-3xl">New Updates</h1>
        </div>
        {blogQuery.isLoading ? (
          <div className="grid gap-6 sm:gap-7 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div key={item} className="overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white">
                <div className="h-[220px] animate-pulse bg-[#eef1f5] sm:h-[260px] lg:h-[300px]" />
                <div className="grid gap-2 p-4">
                  <div className="h-4 w-28 animate-pulse rounded bg-[#eef1f5]" />
                  <div className="h-5 w-full animate-pulse rounded bg-[#eef1f5]" />
                  <div className="h-4 w-[90%] animate-pulse rounded bg-[#eef1f5]" />
                </div>
              </div>
            ))}
          </div>
        ) : blogPosts.length ? (
          <>
            <div className="grid gap-6 sm:gap-7 md:grid-cols-2 xl:grid-cols-3">
              {paginatedPosts.map((post) => {
                const postId = getBlogIdentifier(post);
                return (
                  <article key={postId} className="group rounded-[12px] bg-white transition hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
                    <Link to={getBlogDetailPath(postId)} className="block overflow-hidden rounded-[12px]"><BlogThumbnailImage key={`${postId}-${post.thumbnail ?? ""}`} value={post.thumbnail} alt={post.imageAltText || getBlogTitle(post)} className="h-[220px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05] sm:h-[260px] lg:h-[300px]" loading="lazy"/></Link>
                    <div className="p-4">
                      <p className="text-[0.85rem] text-[#6b7280]">{resolveBlogDate(post.createdAt || post.updatedAt)}</p>
                      <h2 className="mt-1 text-[1rem] font-semibold leading-[1.4] text-[#111827] sm:text-[1.05rem]"><Link to={getBlogDetailPath(postId)} className="transition hover:text-black">{getBlogTitle(post)}</Link></h2>
                      <p className="mt-2 text-[0.9rem] leading-6 text-[#6b7280]">{getBlogExcerpt(post)}</p>
                      <Link to={getBlogDetailPath(postId)} className="mt-3 inline-flex text-[0.9rem] font-medium text-[#111827] transition hover:text-black">{"Continue Reading ->"}</Link>
                    </div>
                  </article>
                );
              })}
            </div>

            {totalPages > 1 ? (
              <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:mt-10">
                <button type="button" onClick={() => setCurrentPage((previous) => Math.max(1, previous - 1))} disabled={activePage === 1} className="rounded-[8px] border border-[#d8dee8] bg-white px-3 py-2 text-sm font-medium text-[#374151] transition hover:border-black hover:text-black disabled:cursor-not-allowed disabled:opacity-50">Previous</button>
                {pageNumbers.map((page) => (<button key={page} type="button" onClick={() => setCurrentPage(page)} className={`min-w-[38px] rounded-[8px] border px-3 py-2 text-sm font-semibold transition ${   page === activePage     ? "border-black bg-black text-white"     : "border-[#d8dee8] bg-white text-[#374151] hover:border-black hover:text-black" }`}>{page}</button>))}
                <button type="button" onClick={() => setCurrentPage((previous) => Math.min(totalPages, previous + 1))} disabled={activePage === totalPages} className="rounded-[8px] border border-[#d8dee8] bg-white px-3 py-2 text-sm font-medium text-[#374151] transition hover:border-black hover:text-black disabled:cursor-not-allowed disabled:opacity-50">Next</button>
              </div>
            ) : null}
          </>
        ) : (
          <div className="rounded-[12px] border border-dashed border-[#d8dee8] bg-[#f7f8fa] px-5 py-10 text-center">
            <p className="text-base text-[#5f6774]">No blogs available right now.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogPage;
