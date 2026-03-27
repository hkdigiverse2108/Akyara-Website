import { HeartOutlined, SearchOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";

const navLinks = ["Home", "Shop", "Product", "Pages", "Docs"];

const Header = () => {
  return (
    <header className="sticky top-0 z-20 border-b border-[#e5e5e5] bg-white">
      <div className="mx-auto flex w-[92%] max-w-[1200px] items-center gap-6 py-[18px]">
        <div className="flex items-center gap-2.5">
          <img
            className="block h-10 w-auto object-contain"
            src="/assets/images/logo/logo.png"
            alt="Kumo logo"
          />
        </div>
        <nav className="flex flex-1 items-center justify-center gap-8 font-medium">
          {navLinks.map((label) => (
            <a
              key={label}
              href="#"
              className="relative after:absolute after:left-0 after:-bottom-1.5 after:h-[2px] after:w-0 after:bg-[#f6821f] after:transition-[width] after:duration-200 hover:after:w-full"
            >
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <button
            className="relative inline-grid h-10 w-10 place-items-center rounded-full bg-white text-black transition duration-200 hover:-translate-y-0.5 hover:bg-[#ececec]"
            type="button"
            aria-label="Search"
          >
            <SearchOutlined />
          </button>
          <button
            className="relative inline-grid h-10 w-10 place-items-center rounded-full bg-white text-black transition duration-200 hover:-translate-y-0.5 hover:bg-[#ececec]"
            type="button"
            aria-label="Account"
          >
            <UserOutlined />
          </button>
          <button
            className="relative inline-grid h-10 w-10 place-items-center rounded-full bg-white text-black transition duration-200 hover:-translate-y-0.5 hover:bg-[#ececec]"
            type="button"
            aria-label="Wishlist"
          >
            <HeartOutlined />
            <span className="absolute -top-1.5 -right-1 rounded-full bg-black px-1.5 py-0.5 text-[0.7rem] text-white">
              2
            </span>
          </button>
          <button
            className="relative inline-grid h-10 w-10 place-items-center rounded-full bg-white text-black transition duration-200 hover:-translate-y-0.5 hover:bg-[#ececec]"
            type="button"
            aria-label="Cart"
          >
            <ShoppingCartOutlined />
            <span className="absolute -top-1.5 -right-1 rounded-full bg-black px-1.5 py-0.5 text-[0.7rem] text-white">
              3
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
