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
      <div className="relative isolate h-screen min-h-[420px] w-full overflow-hidden bg-[#e7e7e7]">
        {displayBanners.map((banner, index) => {
          const isActive = index === activeBanner;
          return (
            <div key={banner._id || index} className={`absolute inset-0 transition-opacity duration-700 ${isActive ? "opacity-100" : "opacity-0"}`}>
              <img
                src={banner.image?.startsWith('http') ? banner.image : assetUrl(banner.image || "")}
                alt={banner.title}
                className="h-full w-full object-cover object-top"
              />
            </div>
          );
        })}

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.65)_30%,rgba(255,255,255,0.12)_62%,rgba(255,255,255,0)_100%)] sm:bg-[linear-gradient(90deg,rgba(255,255,255,0.86)_0%,rgba(255,255,255,0.48)_38%,rgba(255,255,255,0)_72%)]" />

        <div className="absolute inset-0 z-10">
          <div className="site-container flex h-full items-end pb-10 pt-16 sm:items-center sm:pb-0 sm:pt-0">
            <div className="max-w-[620px]">
              <span className="text-[0.65rem] font-medium uppercase tracking-[0.24em] text-[#e53935] sm:text-sm sm:tracking-[0.32em]">
                {activeSlide.type || "Special Collection"}
              </span>

              <h1 className="mt-2.5 text-[clamp(1.6rem,7vw,2.8rem)] font-medium leading-[1.08] text-black sm:mt-3">
                {activeSlide.title}
                {activeSlide.subtitle && (
                  <>
                    <br />
                    {activeSlide.subtitle}
                  </>
                )}
              </h1>
              <p className="mt-2.5 text-[0.95rem] italic text-[#4f5a7a] sm:mt-4 sm:text-lg md:text-xl">
                There&apos;s nothing like trend
              </p>

              <Link
                to={activeSlide.ctaButtonRedirection || activeSlide.pageRedirection || "/products"}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-black px-6 py-2.5 text-sm font-medium text-black transition-colors duration-200 hover:bg-black hover:text-white sm:mt-7 sm:w-auto sm:px-7 sm:py-3"
              >
                {activeSlide.ctaButton || "Shop Now"}
                <span aria-hidden="true">&rarr;</span>
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
