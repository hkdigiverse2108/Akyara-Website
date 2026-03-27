import { useEffect, useState } from "react";

const categories = [
  { title: "Women's Wear", count: "3268 Items" },
  { title: "Kid's Wear", count: "8562 Items" },
  { title: "Men's Wear", count: "32 Items" },
];

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
          <div
            className="absolute inset-0 bg-black/55"
            onClick={() => setShowSubscribe(false)}
          />
          <div
            className="relative z-[1] w-[min(520px,92vw)] rounded-[22px] bg-white px-8 py-7 text-black shadow-[0_24px_60px_rgba(0,0,0,0.45)] animate-slideUp"
            role="dialog"
            aria-modal="true"
          >
            <button
              className="absolute right-4 top-3.5 text-[1.3rem] text-black"
              type="button"
              aria-label="Close subscribe popup"
              onClick={() => setShowSubscribe(false)}
            >
              ×
            </button>
            <h3 className="mb-[10px] font-display text-[1.6rem]">Subscribe</h3>
            <p className="mb-[18px] text-[#333333] leading-relaxed">
              Receive updates, hot deals, discounts sent straight in your inbox daily.
            </p>
            <form className="flex items-center gap-2 rounded-[16px] bg-[#f1f1f1] px-4 py-3">
              <input
                className="flex-1 bg-transparent text-black placeholder:text-[#777777] outline-none"
                type="email"
                placeholder="Email Address"
              />
              <button type="submit" aria-label="Submit email" className="text-[1.3rem] text-black">
                →
              </button>
            </form>
          </div>
        </div>
      )}

      <section className="bg-[#efefef] py-16">
        <div className="mx-auto grid w-[92%] max-w-[1200px] items-center gap-10 md:grid-cols-[1fr_1fr]">
          <div className="max-w-[520px]">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-[#e53935]">
              Winter Collection
            </span>
            <h1 className="mt-4 text-[clamp(2.6rem,4vw,3.6rem)] font-semibold leading-tight">
              New Winter
              <br />
              Collections 2021
            </h1>
            <p className="mt-3 text-lg italic text-[#5f5f5f]">
              There's nothing like trend
            </p>
            <button
              className="mt-6 inline-flex items-center gap-2 rounded-md border border-black px-6 py-3 text-sm font-medium"
              type="button"
            >
              Shop Now
              <span aria-hidden="true">→</span>
            </button>
          </div>
          <div className="flex justify-center md:justify-end">
            <img
              className="w-full max-w-[520px] object-contain"
              src="/assets/images/collection/women.png"
              alt="Winter collection"
            />
          </div>
        </div>
      </section>

      <section className="py-[70px]">
        <div className="mx-auto w-[92%] max-w-[1200px]">
          <div className="mb-9 text-center">
            <h2 className="m-0 font-display text-2xl">Category Highlights</h2>
            <p className="m-0 text-[#777777]">Shop by the styles that fit your season.</p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-5">
            {categories.map((item) => (
              <div
                className="flex min-h-[180px] flex-col justify-between rounded-[18px] bg-white p-7 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.3)]"
                key={item.title}
              >
                <div>
                  <h3 className="mb-1 text-lg font-semibold">{item.title}</h3>
                  <span className="text-[#777777]">{item.count}</span>
                </div>
                <button
                  className="inline-flex items-center gap-2.5 rounded-full bg-[#f6821f] px-[26px] py-3 font-semibold text-white"
                  type="button"
                >
                  Browse Items ?
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[70px] pt-0">
        <div className="mx-auto w-[92%] max-w-[1200px]">
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
