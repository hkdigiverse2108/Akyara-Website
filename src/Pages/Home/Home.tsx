import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Queries } from "../../Api";
import { CategoryHighlights, HeroSlider, InstagramFeed, ProductCard, SaleBanner, NewsletterPopup, DealOfTheDaySlider } from "../../Components";
import { ROUTES } from "../../Constants";
import { badgeStyles, getProductDetailPath, products as fallbackProducts } from "../Products/productData";
import { normalizeProductList } from "../Products/productApiUtils";
import type { SaleBanner as SaleBannerType } from "../../Types";

const Home = () => {
  const { data: trendingData } = Queries.useGetAllProducts({ isTrending: true });
  const { data: dealsData } = Queries.useGetAllProducts({ isDealOfDay: true });
  const { data: allProductsData } = Queries.useGetAllProducts();
  const { data: bannerData } = Queries.useGetAllBanners();
  const { data: saleBannerData } = Queries.useGetSaleBanner();

  const trendingProducts = normalizeProductList(trendingData);
  const dealProducts = normalizeProductList(dealsData);
  const allProducts = normalizeProductList(allProductsData);

  const trendingCatalog = trendingProducts.length ? trendingProducts : allProducts.length ? allProducts : fallbackProducts;
  const dealsCatalog = dealProducts.length ? dealProducts : allProducts.length ? allProducts : fallbackProducts;
  const banners = useMemo(() => bannerData?.data?.banner_data || [], [bannerData]);
  const saleBanner = useMemo(() => {
    const raw = saleBannerData?.data as unknown;
    const candidates = Array.isArray(raw) ? raw : raw ? [raw] : [];

    const toBoolean = (value: unknown) => {
      if (typeof value === "boolean") return value;
      if (typeof value === "number") return value === 1;
      if (typeof value === "string") {
        const normalized = value.trim().toLowerCase();
        return normalized === "true" || normalized === "1" || normalized === "yes";
      }
      return false;
    };

    const activeBanner = candidates.find((item) =>
      toBoolean((item as { isActive?: unknown })?.isActive),
    );

    return (activeBanner as SaleBannerType | undefined) ?? null;
  }, [saleBannerData?.data]);

  return (
    <div>
      <NewsletterPopup />
      <HeroSlider banners={banners} />
      <CategoryHighlights />
      <section className="mt-12 py-10 sm:mt-14 sm:py-16">
        <div className="site-container">
          <div className="relative mb-10 text-center sm:mb-12">
            <span className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-[70%] whitespace-nowrap text-[clamp(2.2rem,6vw,3.5rem)] font-semibold italic text-black/10 md:block" aria-hidden="true">Trendy Products</span>
            <h2 className="relative z-10 m-0 pt-2 font-display text-2xl sm:text-3xl">Our Trending Products</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 md:grid-cols-3 lg:gap-6 xl:grid-cols-4">
            {trendingCatalog.slice(0, 8).map((product) => (
              <ProductCard key={product.id} {...product} href={getProductDetailPath(product.id)} badgeStyles={badgeStyles} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to={`${ROUTES.PRODUCTS}?trending=true`} className="inline-flex w-full items-center justify-center gap-2 border border-black px-7 py-3 text-sm font-medium text-black transition-colors duration-200 hover:bg-black hover:text-white sm:w-auto">
              Explore More<span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      <SaleBanner banner={saleBanner} />
      <DealOfTheDaySlider products={dealsCatalog} />
      <InstagramFeed />
    </div>
  );
};

export default Home;
