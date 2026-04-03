import { Link } from "react-router-dom";
import { BLOG_POSTS, getBlogDetailPath } from "./blogData";

const BlogPage = () => {
  return (
    <section className="bg-white py-10 sm:py-12 lg:py-14">
      <div className="mx-auto w-[92%] max-w-[1400px]">
        <div className="relative mb-8 text-center sm:mb-10">
          <p className="pointer-events-none absolute left-1/2 top-0 hidden -translate-x-1/2 -translate-y-[35%] whitespace-nowrap text-[clamp(2.5rem,6vw,4.5rem)] font-semibold italic leading-none text-[#d9dde4]/60 md:block">Latest News</p>
          <h1 className="relative z-10 text-2xl font-semibold text-[#0b0b0b] sm:text-3xl">New Updates</h1>
        </div>

        <div className="grid gap-6 sm:gap-7 md:grid-cols-2 xl:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <article key={post.slug} className="group rounded-[12px] bg-white transition hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
              <Link to={getBlogDetailPath(post.slug)} className="block overflow-hidden rounded-[12px]"><img src={post.image} alt={post.title} className="h-[220px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.05] sm:h-[260px] lg:h-[300px]" loading="lazy"/></Link>
              <div className="p-4">
                <p className="text-[0.85rem] text-[#6b7280]">{post.date}</p>
                <h2 className="mt-1 text-[1rem] font-semibold leading-[1.4] text-[#111827] sm:text-[1.05rem]">
                  <Link to={getBlogDetailPath(post.slug)} className="transition hover:text-black">{post.title}</Link>
                </h2>
                <p className="mt-2 text-[0.9rem] leading-6 text-[#6b7280]">{post.excerpt}</p>
                <Link to={getBlogDetailPath(post.slug)} className="mt-3 inline-flex text-[0.9rem] font-medium text-[#111827] transition hover:text-black">{"Continue Reading ->"}</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPage;
