import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { Banner } from "../Types";

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

interface HeroSliderProps {
  banners?: Banner[];
}

const fallbackBanners = [
  {
    _id: "fb-1",
    image: assetUrl("assets/bennr-1.png"),
    title: "New Winter",
    subtitle: "Collections 2021",
    type: "Winter Collection",
    ctaButton: "Shop Now",
    ctaButtonRedirection: "/products"
  },
  {
    _id: "fb-2",
    image: assetUrl("assets/bennr-2.png"),
    title: "Women's Fashion",
    subtitle: "UpTo 30% Off",
    type: "Summer Collection",
    ctaButton: "Shop Now",
    ctaButtonRedirection: "/products"
  }
];

const HeroSlider = ({ banners }: HeroSliderProps) => {
  const [activeBanner, setActiveBanner] = useState(0);
  const displayBanners = banners && banners.length > 0 ? banners : (fallbackBanners as unknown as Banner[]);

  useEffect(() => {
    if (displayBanners.length <= 1) return;
    const interval = window.setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % displayBanners.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, [displayBanners.length]);

  const activeSlide = displayBanners[activeBanner];

  return (
    <section className="bg-[#efefef]">
      <div className="relative isolate h-[60dvh] min-h-[460px] w-full overflow-hidden bg-white sm:h-[calc(100dvh-78px)]">
        {displayBanners.map((banner, index) => {
          const isActive = index === activeBanner;
          return (
            <div key={banner._id || index} className={`absolute inset-0 transition-opacity duration-1000 ${isActive ? "opacity-100" : "opacity-0 invisible"}`}>
              <img
                src={banner.image?.startsWith('http') ? banner.image : assetUrl(banner.image || "")}
                alt={banner.title}
                className="h-full w-full object-cover object-[center_15%] sm:object-top"
              />
            </div>
          );
        })}

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0)_40%,rgba(255,255,255,0.7)_100%)] sm:bg-[linear-gradient(90deg,rgba(255,255,255,0.92)_0%,rgba(255,255,255,0.7)_40%,rgba(255,255,255,0)_100%)]" />

        <div className="absolute inset-0 z-10">
          <div className="site-container flex h-full items-center pb-12 pt-20 sm:pb-0 sm:pt-0">
            <div className="max-w-[620px]">
              <span className="text-[0.65rem] font-medium uppercase tracking-[0.24em] text-[#e53935] sm:text-sm sm:tracking-[0.32em]">
                {activeSlide.type || "Special Collection"}
              </span>

              <h1 className="mt-3 text-[clamp(1.65rem,8vw,2.4rem)] font-semibold leading-[1.15] tracking-tight text-black sm:mt-4 sm:text-[clamp(2.8rem,6vw,4rem)]">
                {activeSlide.title}
                {activeSlide.subtitle && (
                  <span className="mt-2 block text-[0.65em] font-medium leading-relaxed text-black/80 sm:mt-3">
                    {activeSlide.subtitle}
                  </span>
                )}
              </h1>

              <Link
                to={activeSlide.ctaButtonRedirection || activeSlide.pageRedirection || "/products"}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 border-2 border-black bg-transparent px-6 py-3 text-sm font-bold uppercase tracking-wider text-black transition-all duration-300 hover:bg-black hover:text-white sm:mt-8 sm:w-auto sm:px-10 sm:py-4"
              >
                {activeSlide.ctaButton || "Shop Now"}
                <span className="text-lg" aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 sm:bottom-6 sm:gap-2">
          {displayBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveBanner(index)}
              className={`h-1.5 rounded-full transition sm:w-8 ${index === activeBanner ? "bg-black w-8" : "bg-black/40 w-6"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
