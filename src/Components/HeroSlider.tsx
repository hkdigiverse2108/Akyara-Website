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
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#e7e7e7]">
        {heroBanners.map((banner, index) => {
          const isActive = index === activeBanner;

          return (
            <div key={banner.src} className={`absolute inset-0 transition-opacity duration-700 ${isActive ? "opacity-100" : "opacity-0"}`}>
              <div className="h-full w-full bg-cover bg-no-repeat bg-center " style={{ backgroundImage: `url(${banner.src})` }}/>
            </div>
          );
        })}

        {/* Overlay Text */}
        <div className="absolute inset-0 z-10">
          <div className="mx-auto flex h-full w-[92%] max-w-[1400px] items-center">
            <div className="max-w-[580px]">
              <span className="text-xs font-medium uppercase tracking-[0.32em] text-[#e53935] sm:text-sm">
                {activeSlide.label}
              </span>

              <h1 className="mt-3 text-[clamp(1.7rem,3.8vw,4rem)] font-medium leading-tight text-black">
                {activeSlide.title}
                <br />
                {activeSlide.title2}
              </h1>

              <p className="mt-4 text-base italic text-[#4f5a7a] sm:text-lg md:text-xl">
                {activeSlide.tagline}
              </p>

              <button type="button" className="mt-8 inline-flex items-center gap-2 border border-black px-7 py-3 text-sm font-medium text-black transition-colors duration-200 hover:bg-black hover:text-white">
                Shop Now
                <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Slider Dots */}
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {heroBanners.map((_, index) => (
            <span key={index} className={`h-1.5 w-8 rounded-full transition ${index === activeBanner ? "bg-black" : "bg-black/40"}`}/>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
