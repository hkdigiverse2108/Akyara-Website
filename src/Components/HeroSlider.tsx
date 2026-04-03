import { useEffect, useState } from "react";

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const heroBanners = [
  {
    src: assetUrl("assets/bennr-1.png"),
    label: "Winter Collection",
    title: "New Winter",
    title2: "Collections 2021",
    tagline: "There's nothing like trend",
  },
  {
    src: assetUrl("assets/bennr-2.png"),
    label: "Summer Collection",
    title: "Women's Fashion",
    title2: "UpTo 30% Off",
    tagline: "There's nothing like trend",
  },
  {
    src: assetUrl("assets/bennr-3.png"),
    label: "Winter Collection",
    title: "New Winter",
    title2: "Collections 2021",
    tagline: "There's nothing like trend",
  },
];

const HeroSlider = () => {
  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % heroBanners.length);
    }, 3500);

    return () => window.clearInterval(interval);
  }, []);

  const activeSlide = heroBanners[activeBanner];

  return (
    <section className="bg-[#efefef]">
      <div className="relative isolate h-[calc(100vh-64px)] min-h-[420px] w-full overflow-hidden bg-[#e7e7e7] sm:h-[calc(100vh-70px)] lg:h-[calc(100vh-78px)] lg:min-h-[560px]">
        {heroBanners.map((banner, index) => {
          const isActive = index === activeBanner;

          return (
            <div key={banner.src} className={`absolute inset-0 transition-opacity duration-700 ${isActive ? "opacity-100" : "opacity-0"}`}>
              <img
                src={banner.src}
                alt={banner.label}
                className="h-full w-full object-cover object-[72%_center] sm:object-center lg:object-contain lg:object-right"
              />
            </div>
          );
        })}

        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.88)_0%,rgba(255,255,255,0.65)_30%,rgba(255,255,255,0.12)_62%,rgba(255,255,255,0)_100%)] sm:bg-[linear-gradient(90deg,rgba(255,255,255,0.86)_0%,rgba(255,255,255,0.48)_38%,rgba(255,255,255,0)_72%)]" />

        <div className="absolute inset-0 z-10">
          <div className="mx-auto flex h-full w-[92%] max-w-[1400px] items-end pb-10 pt-16 sm:items-center sm:pb-0 sm:pt-0">
            <div className="max-w-[620px]">
              <span className="text-[0.65rem] font-medium uppercase tracking-[0.24em] text-[#e53935] sm:text-sm sm:tracking-[0.32em]">
                {activeSlide.label}
              </span>

              <h1 className="mt-2.5 text-[clamp(1.6rem,7vw,4rem)] font-medium leading-[1.08] text-black sm:mt-3">
                {activeSlide.title}
                <br />
                {activeSlide.title2}
              </h1>

              <p className="mt-2.5 text-[0.95rem] italic text-[#4f5a7a] sm:mt-4 sm:text-lg md:text-xl">
                {activeSlide.tagline}
              </p>

              <button type="button" className="mt-5 inline-flex w-full items-center justify-center gap-2 border border-black px-6 py-2.5 text-sm font-medium text-black transition-colors duration-200 hover:bg-black hover:text-white sm:mt-7 sm:w-auto sm:px-7 sm:py-3">
                Shop Now
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 sm:bottom-6 sm:gap-2">
          {heroBanners.map((_, index) => (
            <span key={index} className={`h-1.5 w-6 rounded-full transition sm:w-8 ${index === activeBanner ? "bg-black" : "bg-black/40"}`}/>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
