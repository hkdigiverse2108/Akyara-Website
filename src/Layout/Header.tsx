import {CloseOutlined,HeartOutlined,LogoutOutlined,MenuOutlined,SearchOutlined,ShoppingCartOutlined,UserOutlined,} from "@ant-design/icons";
import { Dropdown } from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Queries } from "../Api/Queries";
import { ROUTES } from "../Constants";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { setSignOut, setUser } from "../Store/Slices/AuthSlice";
import type { AuthSessionUser } from "../Types";
import { useWishlist } from "../Hooks/useWishlist";
import { useCart } from "../Hooks/useCart";
import CartDrawer from "../Components/Cart/CartDrawer";

const navLinks = [{ label: "Home", to: ROUTES.HOME }, { label: "Products", to: ROUTES.PRODUCTS }, { label: "Shirts", to: ROUTES.SHIRTS }, { label: "Tshirts", to: ROUTES.TSHIRTS }, { label: "Jeans", to: ROUTES.JEANS },];

const formatDisplayName = (user: AuthSessionUser | null) => {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  if (fullName) return fullName;

  if (user?.email) { return user.email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
  return "Account";
};

const getInitials = (user: AuthSessionUser | null) => {
  const displayName = formatDisplayName(user);
  return displayName.split(" ").filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase() ?? "").join("");
};

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchOpen(false);
      setMobileMenuOpen(false);
      navigate(`${ROUTES.PRODUCTS}?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };
  const { wishlistMap } = useWishlist();
  const wishlistCount = wishlistMap.size;
  const { cartList } = useCart();
  const cartCount = cartList.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
  const userId = user?._id;
  const singleUserQuery = Queries.useGetSingleUser(userId);

  useEffect(() => {
    if (!singleUserQuery.data?.data) return;
    dispatch(setUser(singleUserQuery.data.data));
  }, [dispatch, singleUserQuery.data?.data]);

  useEffect(() => {
    const closeMenusTimer = window.setTimeout(() => {
      setMobileMenuOpen(false);
      setAccountOpen(false);
      setSearchOpen(false);
    }, 0);

    return () => {
      window.clearTimeout(closeMenusTimer);
    };
  }, [location.pathname, location.search, location.hash]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    setAccountOpen(false);
    dispatch(setSignOut());
    navigate(ROUTES.HOME);
  };

  const handleProfileOpen = () => {
    setAccountOpen(false);
    navigate(ROUTES.PROFILE);
  };

  const displayName = formatDisplayName(user);
  const initials = getInitials(user);

  const accountDropdown = (
    <div className="min-w-[280px] rounded-[22px] border border-[#e8e8e8] bg-white p-2 shadow-[0_20px_45px_rgba(17,17,17,0.12)]">
      <div className="flex items-center gap-3 rounded-[16px] bg-[#f7f7f7] px-3 py-3">
        <span className="inline-grid h-12 w-12 shrink-0 place-items-center rounded-full bg-black text-sm font-semibold text-white">{initials || "A"}</span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#111111]">{displayName}</p>
          <p className="truncate text-xs text-[#777777]">{user?.email ?? "Manage your account"}</p>
        </div>
      </div>

      <div className="mt-2 grid gap-1">
        <button type="button" onClick={handleProfileOpen} className="flex w-full items-center justify-between rounded-[14px] px-3 py-3 text-left text-sm font-semibold text-[#111111] transition hover:bg-[#f6f6f6]">
          <span className="inline-flex items-center gap-2"><UserOutlined /> My Profile</span>
          <span className="text-xs font-medium text-[#8a8a8a]">Open page</span>
        </button>

        <button type="button" onClick={handleLogout} className="flex w-full items-center justify-between rounded-[14px] px-3 py-3 text-left text-sm font-semibold text-[#c62828] transition hover:bg-[#fff2f2]">
          <span className="inline-flex items-center gap-2"><LogoutOutlined />Logout</span>
          <span className="text-xs font-medium text-[#d36a6a]">Sign out everywhere</span>
        </button>
      </div>
    </div>
  );

  const [isScrolled, setIsScrolled] = useState(false);
  const isHome = location.pathname === "/" || location.pathname === "";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`fixed left-0 right-0 top-0 z-40 transition-all duration-300 ${isHome && !isScrolled ? "border-transparent bg-transparent" : "border-b border-[#e7ebf2] bg-white/95 backdrop-blur shadow-sm"}`}>
      <div className="site-container">
        <div className="flex min-h-[64px] items-center gap-2 sm:min-h-[70px] lg:min-h-[78px]">
          <div className="shrink-0">
            <Link to={ROUTES.HOME} aria-label="Home">
              <img className="block h-7 w-auto object-contain sm:h-8 md:h-9 lg:h-11" src="/assets/images/logo/logo.png" alt="Kumo logo"/>
            </Link>
          </div>

          <nav className="ml-7 hidden items-center gap-4 lg:flex xl:gap-6">
            {navLinks.map(({ label, to }) => {
              return (
                <Link key={label} to={to} className="whitespace-nowrap text-[0.92rem] font-medium text-[#444] transition duration-200 hover:text-black xl:text-[0.96rem]">{label}</Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-0.5 sm:gap-1 lg:gap-2">
            <button type="button" aria-label="Search" onClick={() => setSearchOpen((prev) => !prev)} className="hidden h-9 w-9 place-items-center rounded-full text-[#111] transition hover:bg-[#f3f4f6] lg:grid lg:h-10 lg:w-10">
              <SearchOutlined className="text-[1rem]" />
            </button>
            {isAuthenticated ? (
              <Dropdown trigger={["click"]} placement="bottomRight" open={accountOpen} onOpenChange={setAccountOpen} destroyOnHidden popupRender={() => accountDropdown}><button type="button" aria-label="Account" className="hidden h-10 w-10 place-items-center rounded-full bg-[#111827] text-[0.72rem] font-semibold text-white transition hover:bg-black lg:grid">{initials || "A"}</button></Dropdown>
            ) : (
              <Link to={ROUTES.AUTH.LOGIN} aria-label="Login" className="hidden h-9 w-9 place-items-center rounded-full text-[#111] transition hover:bg-[#f3f4f6] lg:grid lg:h-10 lg:w-10"><UserOutlined className="text-[1rem]" /></Link>
            )}
            <button type="button" aria-label="Wishlist" onClick={() => navigate(ROUTES.ACCOUNT.WISHLIST)} className="relative hidden h-9 w-9 place-items-center rounded-full text-[#111] transition hover:bg-[#f3f4f6] lg:grid lg:h-10 lg:w-10">
              <HeartOutlined className="text-[1rem]" />
              {wishlistCount > 0 ? (
                <span className="absolute -right-1 -top-1 rounded-full bg-black px-1.5 py-[1px] text-[10px] font-medium text-white">{wishlistCount}</span>
              ) : null}
            </button>
            <button type="button" aria-label="Cart" onClick={() => setCartOpen(true)} className="relative hidden h-9 w-9 place-items-center rounded-full text-[#111] transition hover:bg-[#f3f4f6] lg:grid lg:h-10 lg:w-10">
              <ShoppingCartOutlined className="text-[1rem]" />
              {cartCount > 0 ? (
                <span className="absolute -right-1 -top-1 rounded-full bg-black px-1.5 py-[1px] text-[10px] font-medium text-white">{cartCount}</span>
              ) : null}
            </button>
            <button type="button" aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} aria-expanded={mobileMenuOpen} aria-controls="mobile-header-menu" onClick={() => setMobileMenuOpen((prev) => !prev)} className="grid h-9 w-9 place-items-center rounded-full border border-[#e5e7eb] text-[#111] transition hover:bg-[#f3f4f6] lg:hidden">
              {mobileMenuOpen ? (<CloseOutlined className="text-[1rem]" />) : ( <MenuOutlined className="text-[1rem]" />)}
            </button>
          </div>
        </div>

        <div id="mobile-header-menu" className={`overflow-hidden transition-all duration-300 lg:hidden ${   mobileMenuOpen ? "max-h-[680px] border-t border-[#e7ebf2] pb-2.5 pt-2.5 opacity-100 sm:pb-3" : "max-h-0 opacity-0" }`}>
          <div className="rounded-xl border border-[#e5e9f0] bg-[linear-gradient(145deg,#ffffff_0%,#f8fbff_65%,#fff7f1_100%)] p-2.5 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
            <div className="rounded-lg border border-[#e6ebf2] bg-white p-2.5">
              <p className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[#ef6b4a]">Shop Categories</p>
              <nav className="mt-1.5 flex flex-col gap-2 px-1 py-1">
                {navLinks.map(({ label, to }) => {
                  return (
                    <Link key={label} to={to} className="inline-flex w-fit pb-1 text-[1.05rem] font-semibold text-[#444b56] transition hover:text-[#111111]">{label}</Link>
                  );
                })}
              </nav>
            </div>

            <div className="mt-2.5 rounded-lg border border-[#e6ebf2] bg-white p-2.5">
              <div className="flex items-center justify-between">
                <p className="text-[0.64rem] font-semibold uppercase tracking-[0.18em] text-[#8a95a5]">Quick Actions</p>
                {isAuthenticated ? (
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#111827] text-[0.68rem] font-semibold text-white">
                    {initials || "A"}
                  </span>
                ) : null}
              </div>

              <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                <button type="button" onClick={() => { setMobileMenuOpen(false); setSearchOpen(true); }} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-2.5 py-2 text-[0.95rem] font-semibold text-[#111] transition hover:bg-white"><SearchOutlined />Search</button>
                <button type="button" onClick={() => navigate(ROUTES.ACCOUNT.WISHLIST)} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-2.5 py-2 text-[0.95rem] font-semibold text-[#111] transition hover:bg-white"><HeartOutlined />Wishlist ({wishlistCount})</button>
                <button type="button" onClick={() => setCartOpen(true)} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] px-2.5 py-2 text-[0.95rem] font-semibold text-[#111] transition hover:bg-white"><ShoppingCartOutlined />Cart ({cartCount})</button>

                {isAuthenticated ? (
                  <>
                    <button type="button" onClick={handleProfileOpen} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#111827] px-2.5 py-2 text-[0.95rem] font-semibold text-white transition hover:bg-black"><UserOutlined />Profile</button>
                    <button type="button" onClick={handleLogout} className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#ffd7d7] bg-[#fff4f4] px-2.5 py-2 text-[0.95rem] font-semibold text-[#c62828] transition hover:bg-[#ffe8e8]"><LogoutOutlined />Logout</button>
                  </>
                ) : (
                  <Link to={ROUTES.AUTH.LOGIN} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#111827] px-2.5 py-2 text-[0.95rem] font-semibold text-white transition hover:bg-black"><UserOutlined />Login</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {searchOpen && (
        <div className="absolute inset-0 z-50 flex items-center bg-white px-4">
          <div className="site-container relative flex w-full items-center gap-3">
             <SearchOutlined className="text-[1.1rem] text-[#888]" />
             <form onSubmit={handleSearchSubmit} className="flex-1">
                <input autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for products, categories or brands..." className="w-full bg-transparent py-2.5 text-[0.95rem] font-medium text-[#111] outline-none placeholder:text-[#888] sm:text-[1.05rem]" />
             </form>
             <button type="button" onClick={() => setSearchOpen(false)} className="grid h-9 w-9 place-items-center rounded-full bg-[#f3f4f6] text-[#111] transition hover:bg-[#e5e7eb]"><CloseOutlined className="text-[0.9rem]" /></button>
          </div>
        </div>
      )}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
};

export default Header;
