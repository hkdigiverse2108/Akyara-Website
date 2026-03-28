import { useEffect, useState } from "react";
import CategoryHighlights from "../Components/CategoryHighlights";
import HeroSlider from "../Components/HeroSlider";
const products = [
  { name: "Half Running Set", price: "$119.00", badge: "Sale" },
  { name: "Formal Men Lowers", price: "$79.00", badge: "New" },
  { name: "Half Running Suit", price: "$80.00" },
  { name: "Half Fancy Lady Dress", price: "$110.00", badge: "Hot" },
  { name: "Flix Flox Jeans", price: "$49.00" },
  { name: "Fancy Salwar Suits", price: "$114.00", badge: "Hot" },
  { name: "Collot Full Dress", price: "$120.00", badge: "Sale" },
  { name: "Formal Fluex Kurti", price: "$129.00", badge: "New" },
];

const Home = () => {
  const [showSubscribe, setShowSubscribe] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowSubscribe(true);
    }, 2000);

    return () => window.clearTimeout(timer);
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

      <section className="py-[70px] pt-0">
        <div className="mx-auto w-full px-[30px]">
          <div className="mb-9 text-center">
            <h2 className="m-0 font-display text-2xl">Our Trending Products</h2>
            <p className="m-0 text-[#777777]">Handpicked favorites that customers love right now.</p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-[22px]">
            {products.map((product) => (
              <div
                className="overflow-hidden rounded-[18px] bg-white shadow-[0_16px_40px_-32px_rgba(0,0,0,0.4)]"
                key={product.name}
              >
                <div className="h-[180px] bg-[linear-gradient(135deg,#f7f0ea,#f5f5f5)]" />
                <div className="grid gap-1.5 p-4">
                  {product.badge && (
                    <span className="inline-block rounded-full bg-[#f6821f] px-2.5 py-1 text-[0.7rem] text-white">
                      {product.badge}
                    </span>
                  )}
                  <strong>{product.name}</strong>
                  <span className="text-[#777777]">{product.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[70px]">
        <div className="mx-auto w-[92%] max-w-[1200px]">
          <div className="rounded-[22px] bg-[#1f2430] p-[60px] text-center text-white">
            <h2 className="m-0 text-2xl font-semibold">Get up to 40% off</h2>
            <p className="mt-3 text-[#d2d7df]">Only summer collections. Limited time.</p>
          </div>
        </div>
      </section>

      <section className="py-[70px] pt-0">
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

      <section className="py-[70px] pt-0">
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
          <div className="flex items-center gap-3 rounded-[16px] bg-white p-[18px]">
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








