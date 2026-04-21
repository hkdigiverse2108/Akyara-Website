import { FacebookFilled, InstagramFilled, TwitterOutlined, YoutubeFilled, } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Queries } from "../Api/Queries";
import { ROUTES } from "../Constants";
import { getPrimarySettings, normalizeExternalLink, resolveSettingsImageUrl } from "../Utils/settings";

const companyLinks = [{ label: "Contact Us", to: ROUTES.INFO.CONTACT }, { label: "About Us", to: ROUTES.INFO.ABOUT }, { label: "Tracking Order", to: ROUTES.INFO.TRACKING }, { label: "Blog", to: ROUTES.INFO.BLOG }, { label: "FAQ Page", to: ROUTES.INFO.FAQ }];

const supportLinks = [{ label: "Return & Refund Policy", to: ROUTES.INFO.REFUND }, { label: "Privacy Policy", to: ROUTES.INFO.PRIVACY }, { label: "Terms & Condition", to: ROUTES.INFO.TERMS }, { label: "Cancellation Policy", to: ROUTES.INFO.CANCELLATION },];

const toAddressLine = (value?: string) =>
  value ? value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean).join(", ") : "";

const Footer = () => {
  const settingsQuery = Queries.useGetSettings(true);
  const settings = getPrimarySettings(settingsQuery.data?.data);

  const addressLine = toAddressLine(settings?.address);
  const contact = settings?.contact?.trim();
  const email = settings?.email?.trim();
  const socialLinks = [{ label: "Facebook", href: normalizeExternalLink(settings?.facebook || "https://facebook.com"), icon: <FacebookFilled />, }, { label: "Twitter", href: normalizeExternalLink(settings?.twitter || "https://twitter.com"), icon: <TwitterOutlined />, }, { label: "Youtube", href: normalizeExternalLink(settings?.youtube || "https://youtube.com"), icon: <YoutubeFilled />, }, { label: "Instagram", href: normalizeExternalLink(settings?.instagram || "https://instagram.com"), icon: <InstagramFilled />, },].filter((item) => !!item.href);
  const securePaymentImages = (settings?.securePaymentImages ?? []).map((item) => resolveSettingsImageUrl(item)).filter(Boolean);

  return (
    <footer className="bg-gradient-to-b from-[#111827] to-[#1f2937] py-7 text-[#d1d5db] sm:py-8 border-t border-gray-800">
      <div className="site-container grid gap-5 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-[minmax(240px,1fr)_minmax(160px,0.8fr)_minmax(200px,1fr)_max-content] lg:items-start xl:gap-8">
        <div className="flex flex-col items-center sm:items-start lg:pr-4">
          <Link to={ROUTES.HOME} className="group transition-transform hover:scale-105 block">
            <img className="h-24 w-auto object-contain opacity-95 transition-opacity hover:opacity-100" src="/akayra-pwa-footer-logo.png" alt="Akyara logo" />
          </Link>

          <div className="mt-2 space-y-1 text-[0.88rem] leading-6 text-gray-400">
            {addressLine ? <p className="max-w-[260px]">{addressLine}</p> : null}
            <div className="flex flex-col gap-0.5">
              <a href={`tel:${contact}`} className="block transition-colors hover:text-white"> {contact}</a>
              <a href={`mailto:${email}`} className="block transition-colors hover:text-white decoration-gray-600 underline-offset-4 hover:underline">{email}</a>
            </div>
          </div>

          <div className="mt-3 flex gap-2.5 text-base">
            {socialLinks.map(({ label, href, icon }) => (
              <a 
                key={label} 
                href={href} 
                target="_blank" 
                rel="noreferrer" 
                aria-label={label} 
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-all hover:bg-white hover:text-black hover:shadow-lg"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center sm:items-start">
          <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-white">Company</h3>
          <ul className="space-y-1.5 text-sm text-left">
            {companyLinks.map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="transition-colors hover:text-white">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center sm:items-start">
          <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-white">Support</h3>
          <ul className="space-y-1.5 text-sm text-left">
            {supportLinks.map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="transition-colors hover:text-white">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center sm:items-start lg:items-start">
          <h3 className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-white">
            {settings?.securePaymentTitle?.trim() || "Safe Payments"}
          </h3>

          {securePaymentImages.length ? (
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start lg:flex-nowrap lg:justify-end">
              {securePaymentImages.map((image, index) => (
                <img key={`${image}-${index}`} src={image} alt="Secure payment" className="h-10 w-auto rounded bg-white/10 p-1 object-contain backdrop-blur-sm transition-transform hover:scale-110" loading="lazy" />
              ))}
            </div>
          ) : (<img src="/assets/images/payment-methods.svg" alt="Payments" className="w-[180px] max-w-full opacity-80" />)}
        </div>
      </div>

      <div className="site-container mt-5 border-t border-gray-800 pt-4 text-center text-xs text-gray-500 sm:text-sm">
        <p>&copy; {new Date().getFullYear()} Akyara. All rights reserved. Crafted for excellence.</p>
      </div>
    </footer>
  );
};

export default Footer;
