import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../Constants";
import { getApiBaseUrl } from "../Utils";
import type { SaleBanner as SaleBannerType } from "../Types";

const assetUrl = (path: string) => `${import.meta.env.BASE_URL}${path}`;

interface SaleBannerProps {
  banner: SaleBannerType | null | undefined;
}

export const SaleBanner = ({ banner }: SaleBannerProps) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const resolvedSaleBannerImage = useMemo(() => {
    if (!banner?.image) return "";
    if (banner.image.startsWith("http")) return banner.image;
    const base = getApiBaseUrl();
    return banner.image.startsWith("/") ? `${base}${banner.image}` : `${base}/${banner.image}`;
  }, [banner?.image]);

  useEffect(() => {
    if (!banner?.saleEndTime) return;

    const calculateTimeLeft = () => {
      const difference = +new Date(banner.saleEndTime) - +new Date();
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
  }, [banner?.saleEndTime]);

  if (!banner || !banner.isActive) return null;

  return (
    <section 
      className="relative mt-16 bg-cover bg-center bg-no-repeat py-14 sm:py-[80px]" 
      style={{ backgroundImage: `url(${resolvedSaleBannerImage})` }}
    >
      <div className="site-container">
        <div className="mx-auto max-w-[750px] text-center">
          <p className="text-base font-semibold text-[#111111]">{banner.subtitle}</p>
          <h2 className="mt-2 text-[clamp(1.5rem,5vw,2rem)] font-semibold text-[#111111]">
            {banner.title}
          </h2>
          
          <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-4">
            {[{ label: "Days", value: timeLeft.days },{ label: "Hours", value: timeLeft.hours },{ label: "Minutes", value: timeLeft.minutes },{ label: "Seconds", value: timeLeft.seconds },].map((item) => (
              <div className="bg-[#f1e9e2] px-3 py-5 text-center shadow-[0_10px_22px_-18px_rgba(0,0,0,0.25)]" key={item.label}>
                <div className="text-2xl font-semibold text-[#d29a70]">{item.value.toString().padStart(2, '0')}</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-[#555555]">{item.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to={`${ROUTES.PRODUCTS}?sale=true`} className="inline-flex items-center justify-center gap-2 border border-black px-10 py-3 text-sm font-medium text-black transition-colors duration-200 hover:bg-black hover:text-white group">
              Shop Now
              <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
