import { CloseOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState, useMemo, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Mutations, Queries } from "../../Api";
import { CategoryHighlights, HeroSlider, InstagramFeed, ProductCard } from "../../Components";
import { ROUTES } from "../../Constants";
import { badgeStyles, getProductDetailPath, products as fallbackProducts } from "../Products/productData";
import { normalizeProductList } from "../Products/productApiUtils";
import { useAppSelector } from "../../Store/Hooks";
import { getApiBaseUrl } from "../../Utils";

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

const Home = () => {
  const [subscribe, setSubscribe] = useState({
    show: false,
    email: "",
    status: null as { error?: string; success?: string } | null,
  });

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isDealsHovered, setIsDealsHovered] = useState(false);
  const dealsSliderRef = useRef<HTMLDivElement | null>(null);
  const scrollAmountRef = useRef(260);
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const sessionEmail = user?.email ?? "";
  const newsletterMutation = Mutations.useSubscribeNewsletter();
  
  const { data: trendingData } = Queries.useGetAllProducts({ isTrending: true });
  const { data: dealsData } = Queries.useGetAllProducts({ isDealOfDay: true });
  const { data: saleProductsData } = Queries.useGetAllProducts({ isSale: true });
  const { data: bannerData } = Queries.useGetAllBanners();
  const { data: saleBannerData } = Queries.useGetSaleBanner();

  const trendingProducts = normalizeProductList(trendingData);
  const dealProducts = normalizeProductList(dealsData);
  const saleProductsList = normalizeProductList(saleProductsData);
  
  const trendingCatalog = trendingProducts.length ? trendingProducts : fallbackProducts;
  const dealsCatalog = dealProducts.length ? dealProducts : fallbackProducts;
  const banners = useMemo(() => bannerData?.data?.banner_data || [], [bannerData]);
  const saleBanner = saleBannerData?.data;

  const resolvedSaleBannerImage = useMemo(() => {
    if (!saleBanner?.image) return "";
    if (saleBanner.image.startsWith("http")) return saleBanner.image;
    const base = getApiBaseUrl();
    return saleBanner.image.startsWith("/") ? `${base}${saleBanner.image}` : `${base}/${saleBanner.image}`;
  }, [saleBanner?.image]);

  useEffect(() => {
    if (!saleBanner?.saleEndTime) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(saleBanner.saleEndTime) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const id = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(id);
  }, [saleBanner?.saleEndTime]);

  useEffect(() => {
    const el = dealsSliderRef.current;
    if (!el) return;

    const card = el.querySelector<HTMLElement>("[data-product-card='true']");
    const gap = parseFloat(getComputedStyle(el).gap || "0");

    scrollAmountRef.current = (card?.offsetWidth ?? 260) + gap;
  }, [dealsCatalog]);

  useEffect(() => {
    if (isAuthenticated) return;

    const t = setTimeout(() => {
      setSubscribe((s) => ({ ...s, show: true }))
    }, 2000);

    return () => clearTimeout(t);
  }, [isAuthenticated]);

  useEffect(() => {
    if (!sessionEmail) return;
    setSubscribe((s) => ({ ...s, email: s.email || sessionEmail }));
  }, [sessionEmail]);

  useEffect(() => {
    const id = setInterval(() => {
      if (isDealsHovered) return;
      const el = dealsSliderRef.current;
      if (!el) return;
      const scroll = scrollAmountRef.current;
      const max = el.scrollWidth - el.clientWidth;

      el.scrollLeft + scroll >= max ? el.scrollTo({ left: 0, behavior: "smooth" }) : el.scrollBy({ left: scroll, behavior: "smooth" });
    }, 3000);

    return () => clearInterval(id);
  }, [isDealsHovered]);

  const scrollByCard = (dir: 1 | -1) => {
    const el = dealsSliderRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * scrollAmountRef.current, behavior: "smooth" });
  };

  const closeSubscribePopup = () => setSubscribe({ show: false, email: "", status: null });

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();

    const email = subscribe.email.trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return setSubscribe((s) => ({ ...s, status: { error: !email ? "Email is required" : "Invalid email" }, }));
    }

    try {
      const res = await newsletterMutation.mutateAsync({ email });

      setSubscribe((s) => ({ ...s, status: { success: res?.message || "Subscribed successfully" }, }));

      setTimeout(closeSubscribePopup, 1200);
    } catch (err) {
      setSubscribe((s) => ({ ...s, status: { error: err instanceof Error ? err.message : "Failed" }, }));
    }
  };

  return (
    <div>
      {subscribe.show && (
        <div className="fixed inset-0 z-[60] grid place-items-center animate-fadeIn">
          <div className="absolute inset-0 bg-black/55" onClick={closeSubscribePopup} />
          <div className="relative z-[1] w-[min(520px,92vw)] rounded-[15px] bg-white px-5 py-6 text-black shadow-[0_24px_60px_rgba(0,0,0,0.45)] animate-slideUp sm:px-8 sm:py-7" role="dialog" aria-modal="true">
            <button className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#1f1f1f] text-[1.2rem] text-[#1f1f1f] hover:bg-black/5" type="button" aria-label="Close subscribe popup" onClick={closeSubscribePopup}>
              <CloseOutlined className="text-[0.95rem] leading-none" aria-hidden="true" />
            </button>
            <img className="mx-auto mb-4 h-10 w-auto" src="/assets/images/logo/logo.png" alt="Akyara" />
            <h3 className="mb-[10px] text-center font-display text-[1.35rem] text-[#1f1f1f] sm:text-[1.6rem]">Don't Miss Out</h3>
            <p className="mb-6 text-center text-[#6b6b6b] leading-relaxed">Subscribe for exclusive offers, new fragrance launches, and curated scentstories delivered to your inbox.</p>
            <form className="grid gap-4" onSubmit={handleSubscribe}>
              <input className="w-full rounded-[14px] border border-[#e1e1e1] px-4 py-2 text-[#2b2b2b] placeholder:text-[#b7b7b7] outline-none transition focus:border-black" type="email" placeholder="Enter your email address" value={subscribe.email} onChange={(e) => setSubscribe((s) => ({ ...s, email: e.target.value, status: null }))} disabled={newsletterMutation.isPending} />
              {subscribe.status?.error && (<p className="rounded-[10px] bg-[#ffecec] px-3 py-2 text-sm text-[#e53935]">{subscribe.status.error}</p>)}
              {subscribe.status?.success && (<p className="rounded-[10px] bg-[#ecfff0] px-3 py-2 text-sm text-[#1b7f3a]">{subscribe.status.success}</p>)}
              <button type="submit" disabled={newsletterMutation.isPending} className="w-full rounded-full bg-black py-3 font-semibold text-white shadow-[0_10px_24px_rgba(0,0,0,0.25)] transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-70">{newsletterMutation.isPending ? "Subscribing..." : "Subscribe"}</button>
            </form>
          </div>
        </div>
      )}
      <HeroSlider banners={banners} />
      <CategoryHighlights />
      <section className="mt-12 py-10 sm:mt-14 sm:py-16">
        <div className="site-container">
          <div className="relative mb-10 text-center sm:mb-12">
            <span className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-[70%] whitespace-nowrap text-[clamp(2.2rem,6vw,3.5rem)] font-semibold italic text-black/10 md:block" aria-hidden="true">Trending Products</span>
            <h2 className="relative z-10 m-0 pt-2 font-display text-2xl sm:text-3xl">Our Trending Products</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 lg:gap-6 xl:grid-cols-4">
              {trendingCatalog.slice(0, 8).map((product) => (<ProductCard key={product.id} {...product} href={getProductDetailPath(product.id)} badgeStyles={badgeStyles} />))}
            </div>
          <div className="mt-10 text-center">
            <Link to={ROUTES.PRODUCTS} className="inline-flex w-full items-center justify-center gap-2 border border-black px-7 py-3 text-sm font-medium text-black transition-colors duration-200 hover:bg-black hover:text-white sm:w-auto">Explore More<span aria-hidden="true">&rarr;</span></Link>
          </div>
        </div>
      </section>
      
      {saleBanner && saleBanner.isActive && (
        <section className="relative mt-16 bg-cover bg-center bg-no-repeat py-14 sm:py-[80px]" style={{ backgroundImage: `url(${resolvedSaleBannerImage})` }}>
          <div className="site-container">
            <div className="mx-auto max-w-[750px] text-center">
              <p className="text-base font-semibold text-[#111111]">{saleBanner.subtitle}</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#111111] sm:text-3xl">{saleBanner.title}</h2>
              <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-4">
                {[
                  { label: "Days", value: timeLeft.days },
                  { label: "Hours", value: timeLeft.hours },
                  { label: "Minutes", value: timeLeft.minutes },
                  { label: "Seconds", value: timeLeft.seconds },
                ].map((item) => (
                  <div className="bg-[#f1e9e2] px-3 py-5 text-center shadow-[0_10px_22px_-18px_rgba(0,0,0,0.25)]" key={item.label}>
                    <div className="text-2xl font-semibold text-[#d29a70]">{item.value.toString().padStart(2, '0')}</div>
                    <div className="mt-1 text-sm font-medium text-[#555555]">{item.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link
                  to={`${ROUTES.PRODUCTS}?sale=true`}
                  className="inline-flex items-center justify-center gap-2 border border-black px-10 py-3 text-sm font-medium text-black transition-colors duration-200 hover:bg-black hover:text-white group"
                >
                  Shop Now
                  <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {saleProductsList.length > 0 && (
        <section className="mt-12 py-10 sm:mt-16 sm:py-16 bg-gray-50/50">
          <div className="site-container">
            <div className="relative mb-10 text-center sm:mb-12">
              <span className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-[70%] whitespace-nowrap text-[clamp(2.2rem,6vw,3.5rem)] font-semibold italic text-black/10 md:block" aria-hidden="true">Summer Collection</span>
              <h2 className="relative z-10 m-0 pt-2 font-display text-2xl sm:text-3xl">Summer Sale Products</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 lg:gap-6 xl:grid-cols-4">
              {saleProductsList.map((product) => (<ProductCard key={product.id} {...product} href={getProductDetailPath(product.id)} badgeStyles={badgeStyles} />))}
            </div>
          </div>
        </section>
      )}

      <section className="mt-12 py-10 sm:mt-16 sm:py-16">
        <div className="site-container">
          <div className="mb-10 sm:mb-12">
            <div className="row justify-content-center">
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                <div className="sec_title relative text-center">
                  <h2 className="off_title pointer-events-none absolute left-1/2 top-0 z-0 hidden -translate-x-1/2 whitespace-nowrap text-[clamp(2.6rem,6vw,4.5rem)] font-semibold italic leading-none text-black/10 md:block">
                    Good Deals
                  </h2>
                  <h3 className="ft-bold relative z-10 pt-2 font-display text-2xl font-semibold sm:pt-10 sm:text-3xl">Deals of The Day</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <button type="button" className="absolute left-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition hover:scale-105 md:inline-flex lg:-left-4" aria-label="Scroll to previous deals" onClick={() => scrollByCard(-1)}>
              <span aria-hidden="true">&larr;</span>
            </button>
            <button type="button" className="absolute right-2 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_12px_30px_rgba(0,0,0,0.18)] transition hover:scale-105 md:inline-flex lg:-right-4" aria-label="Scroll to next deals" onClick={() => scrollByCard(1)}>
              <span aria-hidden="true">&rarr;</span>
            </button>

            <div ref={dealsSliderRef} className="hide-scrollbar flex gap-4 overflow-x-auto px-2 pb-6 scroll-smooth snap-x snap-mandatory sm:gap-6 sm:px-6 xl:px-0" onMouseEnter={() => setIsDealsHovered(true)} onMouseLeave={() => setIsDealsHovered(false)} onTouchStart={() => setIsDealsHovered(true)} onTouchEnd={() => setIsDealsHovered(false)} onTouchCancel={() => setIsDealsHovered(false)}>
              {dealsCatalog.map((deal) => (<ProductCard key={deal.id} {...deal} href={getProductDetailPath(deal.id)} badgeStyles={badgeStyles} className="min-w-[180px] flex-shrink-0 snap-start min-[420px]:min-w-[210px] sm:min-w-[230px] md:min-w-[250px] lg:min-w-[260px] xl:min-w-0 xl:flex-[0_0_calc((100%-72px)/4)]" imageClassName="h-[220px] min-[420px]:h-[250px] sm:h-[300px] lg:h-[340px]" cardDataAttribute={{ name: "data-product-card", value: "true" }} />))}
            </div>
          </div>
        </div>
      </section>

      <InstagramFeed />
    </div>
  );
};

export default Home;
