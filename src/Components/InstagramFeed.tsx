import { Queries } from "../Api";
import { InstagramOutlined } from "@ant-design/icons";

const InstagramFeed = () => {
    const { data: igData } = Queries.useGetIgPosts();
    const posts = igData?.data?.ig_post_data || [];

    if (posts.length === 0) return null;

    return (
        <section className="py-12 sm:py-16 overflow-hidden">
            <div className="site-container">
                <div className="relative mb-10 text-center">
                    <span className="pointer-events-none absolute left-1/2 top-0 hidden -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[clamp(2.4rem,6vw,4rem)] font-semibold italic text-black/10 md:block">
                        Instagram Gallery
                    </span>
                    <p className="relative z-10 m-0 pt-2 text-lg font-semibold text-[#e53935]">@akyara_official</p>
                    <h2 className="relative z-10 m-0 pt-2 font-display text-2xl font-bold sm:text-3xl">From Instagram</h2>
                </div>
            </div>

            {/* Slider/Carousel Logic */}
            <div className="flex gap-2.5 overflow-x-auto px-4 md:px-0 pb-4 scrollbar-hide snap-x snap-mandatory">
                <div className="flex gap-2.5 site-container">
                    {posts.map((post: any) => (
                        <a key={post._id} href={post.link || "#"} target="_blank" rel="noopener noreferrer" className="w-[180px] sm:w-[220px] aspect-square rounded-[10px] overflow-hidden group relative bg-gray-50 shrink-0 snap-start">
                            <img src={post.image} alt={post.title || "Instagram Post"} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <InstagramOutlined style={{ color: '#fff', fontSize: '32px' }} className="transform scale-50 group-hover:scale-100 transition-transform duration-300" />
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                  display: none;
                }
                .scrollbar-hide {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
            `}</style>
        </section>
    );
};

export default InstagramFeed;
