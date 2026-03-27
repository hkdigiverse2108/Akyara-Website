import { FacebookFilled, InstagramFilled, LinkedinFilled, TwitterOutlined, YoutubeFilled } from "@ant-design/icons";

const Footer = () => {
  return (
    <footer className="bg-[#1f2430] pb-5 pt-[60px] text-[#d2d7df]">
      <div className="mx-auto grid w-[92%] max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-7">
        <div>
          <div className="flex items-center gap-2.5">
            <img className="block h-10 w-auto object-contain" src="/assets/images/logo/image.png" alt="Kumo logo" />
          </div>
          <p>3298 Grant Street Longview, TX</p>
          <p>United Kingdom 75601</p>
          <p>1-202-555-0106</p>
          <p>help@shopper.com</p>
          <div className="mt-2 flex items-center gap-4">
            <button className="inline-grid h-7 w-7 place-items-center bg-transparent text-[#9fb0c6] hover:text-white" type="button" aria-label="Facebook"><FacebookFilled /></button>
            <button className="inline-grid h-7 w-7 place-items-center bg-transparent text-[#9fb0c6] hover:text-white" type="button" aria-label="Twitter"><TwitterOutlined /></button>
            <button className="inline-grid h-7 w-7 place-items-center bg-transparent text-[#9fb0c6] hover:text-white" type="button" aria-label="Youtube"><YoutubeFilled /></button>
            <button className="inline-grid h-7 w-7 place-items-center bg-transparent text-[#9fb0c6] hover:text-white" type="button" aria-label="Instagram"><InstagramFilled /></button>
            <button className="inline-grid h-7 w-7 place-items-center bg-transparent text-[#9fb0c6] hover:text-white" type="button" aria-label="LinkedIn"><LinkedinFilled /></button>
          </div>
        </div>

        <div>
          <div className="mb-3.5 font-semibold text-white">Supports</div>
          <ul className="m-0 grid list-none gap-2.5 p-0">
            <li>Contact Us</li>
            <li>About Page</li>
            <li>Size Guide</li>
            <li>Shipping & Returns</li>
            <li>FAQ's Page</li>
            <li>Privacy</li>
          </ul>
        </div>

        <div>
          <div className="mb-3.5 font-semibold text-white">Shop</div>
          <ul className="m-0 grid list-none gap-2.5 p-0">
            <li>Men's Shopping</li>
            <li>Women's Shopping</li>
            <li>Kids's Shopping</li>
            <li>Furniture</li>
            <li>Discounts</li>
          </ul>
        </div>

        <div>
          <div className="mb-3.5 font-semibold text-white">Company</div>
          <ul className="m-0 grid list-none gap-2.5 p-0">
            <li>About</li>
            <li>Blog</li>
            <li>Affiliate</li>
            <li>Login</li>
          </ul>
        </div>

        <div>
          <div className="mb-3.5 font-semibold text-white">Secure Payments</div>
          <img className="mt-2 block h-auto w-full max-w-[280px]" src="/assets/images/payment-methods.svg" alt="Secure payment methods"/>
        </div>
      </div>

      <div className="mx-auto mt-[30px] w-[92%] max-w-[1200px] border-t border-white/10 pt-5 text-center text-[0.9rem] text-[#9ea6b1]">
        © 2026 Kumo. Designed for your new project.
      </div>
    </footer>
  );
};

export default Footer;
