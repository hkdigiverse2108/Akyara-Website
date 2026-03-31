import { useEffect, useRef, useState } from "react";
import CategoryHighlights from "../Components/CategoryHighlights";
import HeroSlider from "../Components/HeroSlider";

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const products = [
  { name: "Half Running Set", price: "$119.00", badge: "Sale", image: assetUrl("assets/1.jpg") },
  { name: "Formal Men Lowers", price: "$79.00", oldPrice: "$129.00", badge: "New", image: assetUrl("assets/2.jpg") },
  { name: "Half Running Suit", price: "$80.00", image: assetUrl("assets/3.jpg") },
  { name: "Half Fancy Lady Dress", price: "$110.00", oldPrice: "$149.00", badge: "Hot", image: assetUrl("assets/4.jpg") },
  { name: "Flix Flox Jeans", price: "$49.00", oldPrice: "$90.00", image: assetUrl("assets/5.jpg") },
  { name: "Fancy Salwar Suits", price: "$114.00", badge: "Hot", image: assetUrl("assets/6.jpg") },
  { name: "Collot Full Dress", price: "$120.00", badge: "Sale", image: assetUrl("assets/7.jpg") },
  { name: "Formal Fluex Kurti", price: "$129.00", oldPrice: "$149.00", badge: "New", image: assetUrl("assets/8.jpg") },
];

const deals = [
  { name: "Formal Men Lowers", price: "$79.00", oldPrice: "$129.00", badge: "New", image: assetUrl("assets/2.jpg") },
  { name: "Half Running Suit", price: "$80.00", image: assetUrl("assets/3.jpg") },
  { name: "Half Fancy Lady Dress", price: "$110.00", oldPrice: "$149.00", badge: "Hot", image: assetUrl("assets/4.jpg") },
  { name: "Flix Flox Jeans", price: "$49.00", oldPrice: "$90.00", image: assetUrl("assets/5.jpg") },
  { name: "Fancy Salwar Suits", price: "$114.00", badge: "Hot", image: assetUrl("assets/6.jpg") },
];

const badgeStyles: Record<string, string> = {
  Sale: "bg-[#bfbfbf]",
  New: "bg-[#4caf50]",
  Hot: "bg-[#ff6a00]",
};

const countdownCards = [
  { label: "days", value: "-1614" },
  { label: "Hours", value: "-12" },
  { label: "Minutes", value: "-50" },
  { label: "Seconds", value: "-44" },
];

const Home = () => {
  const [showSubscribe, setShowSubscribe] = useState(false);
  const [isDealsHovered, setIsDealsHovered] = useState(false);
  const dealsSliderRef = useRef<HTMLDivElement | null>(null);
  const isDealsHoveredRef = useRef(false);

  const scrollByCard = (direction: 1 | -1) => {
    const container = dealsSliderRef.current;
    if (!container) return;
    const card = container.querySelector<HTMLElement>("[data-product-card='true']");
    const cardWidth = card?.offsetWidth ?? 260;
    const styles = window.getComputedStyle(container);
    const gapValue = parseFloat(styles.columnGap || styles.gap || "0");
    const scrollAmount = cardWidth + (Number.isFinite(gapValue) ? gapValue : 0);
    container.scrollBy({ left: direction * scrollAmount, behavior: "smooth" });
  };
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSubscribe(true);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    isDealsHoveredRef.current = isDealsHovered;
  }, [isDealsHovered]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      if (isDealsHoveredRef.current) return;
      const container = dealsSliderRef.current;
      if (!container) return;
      const card = container.querySelector<HTMLElement>("[data-product-card='true']");
      const cardWidth = card?.offsetWidth ?? 260;
      const styles = window.getComputedStyle(container);
      const gapValue = parseFloat(styles.columnGap || styles.gap || "0");
      const scrollAmount = cardWidth + (Number.isFinite(gapValue) ? gapValue : 0);
      const maxScrollLeft = container.scrollWidth - container.clientWidth - 1;
      if (maxScrollLeft <= 0) return;
      if (container.scrollLeft + scrollAmount >= maxScrollLeft) {
        container.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }, 3000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div>
      {showSubscribe && (
        <div className="fixed inset-0 z-[60] grid place-items-center animate-fadeIn">
          <div className="absolute inset-0 bg-black/55" onClick={() => setShowSubscribe(false)} />
          <div className="relative z-[1] w-[min(520px,92vw)] rounded-[22px] bg-white px-8 py-7 text-black shadow-[0_24px_60px_rgba(0,0,0,0.45)] animate-slideUp" role="dialog" aria-modal="true">
            <button className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#1f1f1f] text-[1.2rem] text-[#1f1f1f]" type="button" aria-label="Close subscribe popup" onClick={() => setShowSubscribe(false)}>×</button>
            <img className="mx-auto mb-4 h-10 w-auto" src="/assets/images/logo/logo.png" alt="Akyara" />
            <h3 className="mb-[10px] text-center font-display text-[1.6rem] text-[#1f1f1f]">Don't Miss Out</h3>
            <p className="mb-6 text-center text-[#6b6b6b] leading-relaxed">
              Subscribe for exclusive offers, new fragrance launches, and curated scent
              stories delivered to your inbox.
            </p>
            <form className="grid gap-4">
              <input className="w-full rounded-[14px] border border-[#e1e1e1] px-4 py-3 text-[#2b2b2b] placeholder:text-[#b7b7b7] outline-none" type="email" placeholder="Enter your email address" />
              <button type="submit" className="w-full rounded-full bg-black py-3 font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.25)]"> Subscribe</button>
            </form>
          </div>
        </div>
      )}

      <HeroSlider />

      <CategoryHighlights />

      <section className="mt-16 py-[70px] pt-0">
        <div className="mx-auto w-[92%] max-w-[1200px]">
          <div className="relative mb-12 text-center">
            <span
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[70%] whitespace-nowrap text-[clamp(2.2rem,6vw,4rem)] font-semibold italic text-black/10"
              aria-hidden="true"
            >
              Trendy Products
            </span>
            <h2 className="relative z-10 m-0 pt-2 font-display text-2xl sm:text-3xl">Our Trending Products</h2>
          </div>

          <div className="grid grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div
                className="product-card group relative overflow-hidden rounded-[6px] bg-white shadow-[0_12px_30px_-24px_rgba(0,0,0,0.35)]"
                key={product.name}
              >
                {product.badge && (
                  <span
                    className={`absolute left-4 top-4 z-10 rounded-[6px] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white ${badgeStyles[product.badge] ?? "bg-black"
                      }`}
                  >
                    {product.badge}
                  </span>
                )}

                <button
                  type="button"
                  className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111111] shadow-[0_10px_26px_rgba(0,0,0,0.12)] transition hover:scale-105"
                  aria-label={`Save ${product.name}`}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 20.5l-1.45-1.32C5.4 14.36 2 11.28 2 7.5 2 5 4 3 6.5 3c1.74 0 3.41.9 4.22 2.28C11.53 3.9 13.2 3 14.94 3 17.44 3 19.44 5 19.44 7.5c0 3.78-3.4 6.86-8.55 11.68L12 20.5z" />
                  </svg>
                </button>

                <div className="relative overflow-hidden bg-[#f1f0ec]">
                  <img
                    className="card-img-top h-[380px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                  />
                  <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/90 px-4 py-3 text-center text-sm text-white transition-transform duration-300 group-hover:translate-y-0">
                    <span className="inline-flex items-center gap-2 font-semibold uppercase tracking-wide">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      Quick View
                    </span>
                  </div>
                </div>

                <div className="p-4 text-center">
                  <h5 className="mb-1 text-sm font-medium text-[#1f1f1f]">{product.name}</h5>
                  <div className="text-sm font-medium">
                    {product.oldPrice && (
                      <span className="mr-2 text-[#9b9b9b] line-through">{product.oldPrice}</span>
                    )}
                    <span className={`text-base font-semibold ${product.oldPrice ? "text-[#e53935]" : "text-[#1f1f1f]"}`}>
                      {product.price}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              type="button"
              className="inline-flex items-center gap-2  border border-black px-7 py-3 text-sm font-medium text-black transition-colors duration-200 hover:bg-black hover:text-white"
            >
              Explore More
              <span aria-hidden="true">&rarr;</span>
            </button>
          </div>
        </div>
      </section>

      <section className="relative mt-16 bg-cover bg-center bg-no-repeat py-[80px]" style={{ backgroundImage: `url(${assetUrl("assets/bg.jpg")})` }}>
        <div className="mx-auto w-[92%] max-w-[750px]">
          <div className="text-center">
            <p className="text-base font-semibold text-[#111111]">Get up to -40% Off</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#111111] sm:text-3xl">Only Summer Collections</h2>

            <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {countdownCards.map((item) => (
                <div className="bg-[#f1e9e2] px-3 py-5 text-center shadow-[0_10px_22px_-18px_rgba(0,0,0,0.25)]" key={item.label}>
                  <div className="text-2xl font-semibold text-[#d29a70]">{item.value}</div>
                  <div className="mt-1 text-sm font-medium text-[#555555]">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 py-[70px] pt-0">
        <div className="mx-auto w-[92%] max-w-[1200px]">
          <div className="mb-12">
            <div className="row justify-content-center">
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                <div className="sec_title relative text-center">
                  <h2 className="off_title pointer-events-none absolute left-1/2 top-0 z-0 -translate-x-1/2 whitespace-nowrap text-[clamp(2.6rem,6vw,4.5rem)] font-semibold italic leading-none text-black/10">
                    Good Deals
                  </h2>
                  <h3 className="ft-bold relative z-10 pt-10 font-display text-2xl font-semibold sm:text-3xl">Deals of The Day</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <button
              type="button"
              className="absolute left-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition hover:scale-105 lg:-left-4"
              aria-label="Scroll to previous deals"
              onClick={() => scrollByCard(-1)}
            >
              <span aria-hidden="true">&larr;</span>
            </button>
            <button
              type="button"
              className="absolute right-2 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition hover:scale-105 lg:-right-4"
              aria-label="Scroll to next deals"
              onClick={() => scrollByCard(1)}
            >
              <span aria-hidden="true">&rarr;</span>
            </button>

            <div
              ref={dealsSliderRef}
              className="hide-scrollbar flex gap-6 overflow-x-auto px-6 pb-6 scroll-smooth snap-x snap-mandatory xl:px-0"
              onMouseEnter={() => setIsDealsHovered(true)}
              onMouseLeave={() => setIsDealsHovered(false)}
              onTouchStart={() => setIsDealsHovered(true)}
              onTouchEnd={() => setIsDealsHovered(false)}
              onTouchCancel={() => setIsDealsHovered(false)}
            >
              {deals.map((deal) => (
                <div
                  className="product-card group relative min-w-[220px] flex-shrink-0 snap-start overflow-hidden rounded-[6px] bg-white shadow-[0_12px_30px_-24px_rgba(0,0,0,0.35)] sm:min-w-[240px] md:min-w-[250px] lg:min-w-[260px] xl:min-w-0 xl:flex-[0_0_calc((100%-72px)/4)]"
                  key={deal.name}
                  data-product-card="true"
                >
                  <div className="relative overflow-hidden bg-[#f1f0ec]">
                    {deal.badge && (
                      <span
                        className={`absolute left-4 top-4 z-10 rounded-[6px] px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white ${badgeStyles[deal.badge] ?? "bg-black"
                          }`}
                      >
                        {deal.badge}
                      </span>
                    )}
                    <button
                      type="button"
                      className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#111111] shadow-[0_10px_26px_rgba(0,0,0,0.12)] transition hover:scale-105"
                      aria-label={`Save ${deal.name}`}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M12 20.5l-1.45-1.32C5.4 14.36 2 11.28 2 7.5 2 5 4 3 6.5 3c1.74 0 3.41.9 4.22 2.28C11.53 3.9 13.2 3 14.94 3 17.44 3 19.44 5 19.44 7.5c0 3.78-3.4 6.86-8.55 11.68L12 20.5z" />
                      </svg>
                    </button>
                    <img
                      className="card-img-top h-[380px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      src={deal.image}
                      alt={deal.name}
                      loading="lazy"
                    />
                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/90 px-4 py-3 text-center text-sm text-white transition-transform duration-300 group-hover:translate-y-0">
                      <span className="inline-flex items-center gap-2 font-semibold uppercase tracking-wide">
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        Quick View
                      </span>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <h5 className="mb-1 text-sm font-medium text-[#1f1f1f]">{deal.name}</h5>
                    <div className="text-sm font-medium">
                      {deal.oldPrice && (
                        <span className="mr-2 text-[#9b9b9b] line-through">{deal.oldPrice}</span>
                      )}
                      <span className={`text-base font-semibold ${deal.oldPrice ? "text-[#e53935]" : "text-[#1f1f1f]"}`}>
                        {deal.price}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-16 py-[70px] pt-0">
        <div className="mx-auto w-[92%] max-w-[1200px]">
          <div className="mb-9 text-center">
            <h2 className="m-0 font-display text-2xl">Instagram Gallery</h2>
            <p className="m-0 text-[#777777]">@mahak_71</p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2.5">
            {Array.from({ length: 8 }).map((_, index) => (
              <div className="aspect-square rounded-[10px] bg-[#e7e7e7]" key={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-16 py-[70px] pt-0">
        <div className="mx-auto grid w-[92%] max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6 pt-6">
          <div className="flex items-center gap-3 rounded-[16px] bg-white p-[18px]">
            <div className="inline-grid h-[34px] w-[34px] place-items-center rounded-[9px] bg-[#f6821f] font-bold text-white">
              F
            </div>
            <div>
              <strong>Free Shipping</strong>
              <p className="text-[#777777]">Capped at $10 per order</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-[16px] bg-white p-[18px]">
            <div className="inline-grid h-[34px] w-[34px] place-items-center rounded-[9px] bg-[#f6821f] font-bold text-white">
              S
            </div>
            <div>
              <strong>Secure Payments</strong>
              <p className="text-[#777777]">Up to 6 months installments</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-[6px] bg-white p-[18px]">
            <div className="inline-grid h-[34px] w-[34px] place-items-center rounded-[9px] bg-[#f6821f] font-bold text-white">
              R
            </div>
            <div>
              <strong>15-Day Returns</strong>
              <p className="text-[#777777]">Shop with confidence</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-[16px] bg-white p-[18px]">
            <div className="inline-grid h-[34px] w-[34px] place-items-center rounded-[9px] bg-[#f6821f] font-bold text-white">
              H
            </div>
            <div>
              <strong>24x7 Support</strong>
              <p className="text-[#777777]">Friendly help anytime</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
