import {FacebookFilled,InstagramFilled,LinkedinFilled,TwitterOutlined,YoutubeFilled,} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTES } from "../Constants";

const companyLinks = [{ label: "Contact Us", to: ROUTES.INFO.CONTACT },{ label: "About Us", to: ROUTES.INFO.ABOUT },{ label: "Tracking Order", to: ROUTES.INFO.TRACKING },{ label: "Blog", to: ROUTES.INFO.BLOG },{ label: "FAQ Page", to: ROUTES.INFO.FAQ },];

const supportLinks = [{ label: "Return & Refund Policy", to: ROUTES.INFO.REFUND },{ label: "Privacy Policy", to: ROUTES.INFO.PRIVACY },{ label: "Terms & Condition", to: ROUTES.INFO.TERMS },{ label: "Cancellation Policy", to: ROUTES.INFO.CANCELLATION },];

const socialLinks = [{ label: "Facebook", href: "https://facebook.com", icon: <FacebookFilled /> },{ label: "Twitter", href: "https://twitter.com", icon: <TwitterOutlined /> },{ label: "Youtube", href: "https://youtube.com", icon: <YoutubeFilled /> },{ label: "Instagram", href: "https://instagram.com", icon: <InstagramFilled /> },{ label: "LinkedIn", href: "https://linkedin.com", icon: <LinkedinFilled /> },];

const Footer = () => {
  return (
    <footer className="bg-[#242834] pb-6 pt-16 text-[#e2e7ef]">
      <div className="mx-auto grid w-[92%] max-w-[1500px] gap-x-12 gap-y-10 md:grid-cols-2 xl:grid-cols-[1.35fr_0.9fr_1fr_1.2fr]">
        <div className="max-w-[360px]">
          <div className="flex items-center gap-2.5">
            <Link to={ROUTES.HOME} aria-label="Home">
              <img className="block h-12 w-auto object-contain" src="/assets/images/logo/image.png" alt="Kumo logo" />
            </Link>
          </div>
          <div className="mt-4 space-y-2 text-[15px] leading-8 text-[#f1f4fa]">
            <p>3298 Grant Street Longview, TX</p>
            <p>United Kingdom 75601</p>
            <p>
              <a className="transition hover:text-white" href="tel:+12025550106">
                1-202-555-0106
              </a>
            </p>
            <p>
              <a className="transition hover:text-white" href="mailto:help@shopper.com">
                help@shopper.com
              </a>
            </p>
          </div>
          <div className="mt-5 flex items-center gap-5 text-[20px] text-[#a9b5c8]">
            {socialLinks.map(({ label, href, icon }) => (
              <a key={label} className="inline-grid place-items-center transition hover:text-white" href={href} target="_blank" rel="noreferrer" aria-label={label}>
                {icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 text-[18px] font-semibold text-white">Company</div>
          <ul className="m-0 grid list-none gap-3 p-0 text-[15px] text-[#f1f4fa]">
            {companyLinks.map(({ label, to }) => (
              <li key={label}>
                <Link className="transition hover:text-white" to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-4 text-[18px] font-semibold text-white">Supports</div>
          <ul className="m-0 grid list-none gap-3 p-0 text-[15px] text-[#f1f4fa]">
            {supportLinks.map(({ label, to }) => (
              <li key={label}>
                <Link className="transition hover:text-white" to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="xl:justify-self-end">
          <div className="mb-4 text-[18px] font-semibold text-white">Secure Payments</div>
          <img className="mt-2 block h-auto w-full max-w-[340px]" src="/assets/images/payment-methods.svg" alt="Secure payment methods" />
        </div>
      </div>

      <div className="mx-auto mt-10 w-[92%] max-w-[1500px] border-t border-white/10 pt-6 text-center text-[15px] text-[#aeb7c7]">
        2026 Kumo. Designed for your new project.
      </div>
    </footer>
  );
};

export default Footer;
