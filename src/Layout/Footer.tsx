import {FacebookFilled,InstagramFilled,TwitterOutlined,YoutubeFilled,} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { Queries } from "../Api/Queries";
import { ROUTES } from "../Constants";
import { getPrimarySettings, normalizeExternalLink, resolveSettingsImageUrl } from "../Utils/settings";

const companyLinks = [{ label: "Contact Us", to: ROUTES.INFO.CONTACT },{ label: "About Us", to: ROUTES.INFO.ABOUT },{ label: "Tracking Order", to: ROUTES.INFO.TRACKING },{ label: "Blog", to: ROUTES.INFO.BLOG },{ label: "FAQ Page", to: ROUTES.INFO.FAQ }];

const supportLinks = [{ label: "Return & Refund Policy", to: ROUTES.INFO.REFUND },{ label: "Privacy Policy", to: ROUTES.INFO.PRIVACY },{ label: "Terms & Condition", to: ROUTES.INFO.TERMS },{ label: "Cancellation Policy", to: ROUTES.INFO.CANCELLATION },];

const toAddressLine = (value?: string) =>
  value? value    .split(/\r?\n|,/)    .map((item) => item.trim())    .filter(Boolean)    .join(", "): "";

const Footer = () => {
  const settingsQuery = Queries.useGetSettings(true);
  const settings = getPrimarySettings(settingsQuery.data?.data);

  const addressLine = toAddressLine(settings?.address);
  const contact = settings?.contact?.trim() ;
  const email = settings?.email?.trim();
  const socialLinks = [{label: "Facebook",href: normalizeExternalLink(settings?.facebook || "https://facebook.com"),icon: <FacebookFilled />,},{label: "Twitter",href: normalizeExternalLink(settings?.twitter || "https://twitter.com"),icon: <TwitterOutlined />,},{label: "Youtube",href: normalizeExternalLink(settings?.youtube || "https://youtube.com"),icon: <YoutubeFilled />,},{label: "Instagram",href: normalizeExternalLink(settings?.instagram || "https://instagram.com"),icon: <InstagramFilled />,},].filter((item) => !!item.href);
  const securePaymentImages = (settings?.securePaymentImages ?? []).map((item) => resolveSettingsImageUrl(item)).filter(Boolean);

    return (
      <footer className="bg-[#1f2937] py-10 text-[#d1d5db] sm:py-12">
      <div className="site-container grid gap-8 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-[minmax(290px,1.45fr)_minmax(170px,0.85fr)_minmax(220px,1fr)_max-content] lg:items-start xl:gap-10">
        <div className="flex flex-col items-center sm:items-start lg:pr-6">
          <Link to={ROUTES.HOME}>
            <img className="h-10 object-contain" src="/assets/images/logo/image.png" alt="Logo" />
          </Link>

          <div className="mt-3 space-y-1 text-sm leading-6">
            {addressLine ? <p>{addressLine}</p> : null}
            <a href={`tel:${contact}`} className="block transition hover:text-white"> {contact}</a>
            <a href={`mailto:${email}`} className="block transition hover:text-white">{email}</a>
          </div>

          <div className="mt-3 flex gap-3 text-base">
            {socialLinks.map(({ label, href, icon }) => (<a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} className="transition hover:text-white">{icon}</a>))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-white">Company</h3>
          <ul className="space-y-1 text-sm">
            {companyLinks.map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="transition hover:text-white">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-white">Support</h3>
          <ul className="space-y-1 text-sm">
            {supportLinks.map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="transition hover:text-white">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center sm:items-start lg:items-end">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-white">
            {settings?.securePaymentTitle?.trim() || "Payments"}
          </h3>

          {securePaymentImages.length ? (
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start lg:flex-nowrap lg:justify-end">
              {securePaymentImages.map((image, index) => (
                <img key={`${image}-${index}`} src={image} alt="Secure payment" className="h-10 w-auto rounded bg-white object-contain p-1" loading="lazy"/>
              ))}
            </div>
          ) : (<img src="/assets/images/payment-methods.svg" alt="Payments" className="w-[180px] max-w-full" />)}
        </div>
      </div>

      <div className="site-container mt-8 border-t border-gray-700 pt-3 text-center text-xs text-gray-400 sm:text-sm">
        (c) {new Date().getFullYear()} Kumo. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
