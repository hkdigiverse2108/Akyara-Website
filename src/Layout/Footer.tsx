import {FacebookFilled,InstagramFilled,LinkedinFilled,TwitterOutlined,YoutubeFilled,} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ROUTES } from "../Constants";

const companyLinks = [{ label: "Contact Us", to: ROUTES.INFO.CONTACT },{ label: "About Us", to: ROUTES.INFO.ABOUT },{ label: "Tracking Order", to: ROUTES.INFO.TRACKING },{ label: "Blog", to: ROUTES.INFO.BLOG },{ label: "FAQ Page", to: ROUTES.INFO.FAQ },];

const supportLinks = [{ label: "Return & Refund Policy", to: ROUTES.INFO.REFUND },{ label: "Privacy Policy", to: ROUTES.INFO.PRIVACY },{ label: "Terms & Condition", to: ROUTES.INFO.TERMS },{ label: "Cancellation Policy", to: ROUTES.INFO.CANCELLATION },];

const socialLinks = [{ label: "Facebook", href: "https://facebook.com", icon: <FacebookFilled /> },{ label: "Twitter", href: "https://twitter.com", icon: <TwitterOutlined /> },{ label: "Youtube", href: "https://youtube.com", icon: <YoutubeFilled /> },{ label: "Instagram", href: "https://instagram.com", icon: <InstagramFilled /> },{ label: "LinkedIn", href: "https://linkedin.com", icon: <LinkedinFilled /> },];

const Footer = () => {
  return (
    <footer className="bg-[#1f2937] py-10 text-[#d1d5db] sm:py-12">
      <div className="mx-auto grid w-[92%] max-w-[1200px] gap-8 text-center sm:grid-cols-2 sm:text-left lg:grid-cols-4">
        <div className="flex flex-col items-center sm:items-start">
          <Link to={ROUTES.HOME}>
            <img className="h-10 object-contain" src="/assets/images/logo/image.png" alt="Logo" />
          </Link>

          <div className="mt-3 space-y-1 text-sm leading-6">
            <p>3298 Grant Street Longview, TX</p>
            <p>United Kingdom 75601</p>
            <p>1-202-555-0106</p>
            <p>help@shopper.com</p>
          </div>

          <div className="mt-3 flex gap-3 text-base">
            {socialLinks.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-white"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-white">Company</h3>
          <ul className="space-y-1 text-sm">
            {companyLinks.map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="transition hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-white">Support</h3>
          <ul className="space-y-1 text-sm">
            {supportLinks.map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className="transition hover:text-white">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col items-center sm:items-start lg:items-end">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-white">Payments</h3>
          <img src="/assets/images/payment-methods.svg" alt="Payments" className="w-[180px] max-w-full" />
        </div>
      </div>

      <div className="mx-auto mt-8 w-[92%] max-w-[1200px] border-t border-gray-700 pt-3 text-center text-xs text-gray-400 sm:text-sm">
        � {new Date().getFullYear()} Kumo. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
