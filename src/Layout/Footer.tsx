import {FacebookFilled,InstagramFilled,LinkedinFilled,TwitterOutlined,YoutubeFilled,} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTES } from "../Constants";

const companyLinks = [{ label: "Contact Us", to: ROUTES.INFO.CONTACT },{ label: "About Us", to: ROUTES.INFO.ABOUT },{ label: "Tracking Order", to: ROUTES.INFO.TRACKING },{ label: "Blog", to: ROUTES.INFO.BLOG },{ label: "FAQ Page", to: ROUTES.INFO.FAQ },];

const supportLinks = [{ label: "Return & Refund Policy", to: ROUTES.INFO.REFUND },{ label: "Privacy Policy", to: ROUTES.INFO.PRIVACY },{ label: "Terms & Condition", to: ROUTES.INFO.TERMS },{ label: "Cancellation Policy", to: ROUTES.INFO.CANCELLATION },];

const socialLinks = [{ label: "Facebook", href: "https://facebook.com", icon: <FacebookFilled /> },{ label: "Twitter", href: "https://twitter.com", icon: <TwitterOutlined /> },{ label: "Youtube", href: "https://youtube.com", icon: <YoutubeFilled /> },{ label: "Instagram", href: "https://instagram.com", icon: <InstagramFilled /> },{ label: "LinkedIn", href: "https://linkedin.com", icon: <LinkedinFilled /> },];

const Footer = () => {
  return (
    <footer className="bg-[#1f2430] pb-5 pt-[60px] text-[#d2d7df]">
      <div className="mx-auto grid w-[92%] max-w-[1200px] gap-x-10 gap-y-8 md:grid-cols-2 xl:grid-cols-[1.15fr_0.85fr_0.9fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Link to={ROUTES.HOME} aria-label="Home">
              <img className="block h-10 w-auto object-contain" src="/assets/images/logo/image.png" alt="Kumo logo" />
            </Link>
          </div>
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
          <div className="mt-2 flex items-center gap-4">
            {socialLinks.map(({ label, href, icon }) => (
              <a key={label} className="inline-grid h-7 w-7 place-items-center bg-transparent text-[#9fb0c6] hover:text-white" href={href} target="_blank" rel="noreferrer" aria-label={label}>{icon}</a>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3.5 font-semibold text-white"> Company</div>
          <ul className="m-0 grid list-none gap-2.5 p-0">
            {companyLinks.map(({ label, to }) => (
              <li key={label}>
                <Link className="transition hover:text-white" to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-3.5 font-semibold text-white">Supports</div>
          <ul className="m-0 grid list-none gap-2.5 p-0">
            {supportLinks.map(({ label, to }) => (
              <li key={label}>
                <Link className="transition hover:text-white" to={to}>{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-3.5 font-semibold text-white">Secure Payments</div>
          <img className="mt-2 block h-auto w-full max-w-[280px]" src="/assets/images/payment-methods.svg" alt="Secure payment methods" />
        </div>
      </div>

      <div className="mx-auto mt-[30px] w-[92%] max-w-[1200px] border-t border-white/10 pt-5 text-center text-[0.9rem] text-[#9ea6b1]">2026 Kumo. Designed for your new project.</div>
    </footer>
  );
};

export default Footer;
