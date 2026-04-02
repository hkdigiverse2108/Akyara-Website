import { CloseOutlined, HeartOutlined, LogoutOutlined, MenuOutlined, SearchOutlined, ShoppingCartOutlined, UserOutlined, } from "@ant-design/icons";
import { Dropdown } from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Queries } from "../Api/Queries";
import { ROUTES } from "../Constants";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { setSignOut, setUser } from "../Store/Slices/AuthSlice";
import type { AuthSessionUser } from "../Types";

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
  const userId = user?._id;
  const singleUserQuery = Queries.useGetSingleUser(userId);

  useEffect(() => {
    if (!singleUserQuery.data?.data) return;
    dispatch(setUser(singleUserQuery.data.data));
  }, [dispatch, singleUserQuery.data?.data]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setAccountOpen(false);
  }, [location.pathname, location.search, location.hash]);

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
        <span className="inline-grid h-12 w-12 shrink-0 place-items-center rounded-full bg-black text-sm font-semibold text-white">
          {initials || "A"}
        </span>
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

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-between rounded-[14px] px-3 py-3 text-left text-sm font-semibold text-[#c62828] transition hover:bg-[#fff2f2]"
        >
          <span className="inline-flex items-center gap-2">
            <LogoutOutlined />
            Logout
          </span>
          <span className="text-xs font-medium text-[#d36a6a]">Sign out everywhere</span>
        </button>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-20 border-b border-[#e5e5e5] bg-white">
      <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[68px] items-center gap-2 sm:gap-3 lg:min-h-[78px]">

          <div className="shrink-0">
            <Link to={ROUTES.HOME} aria-label="Home">
              <img className="block h-8 w-auto object-contain sm:h-9 md:h-10 lg:h-11" src="/assets/images/logo/logo.png" alt="Kumo logo" />
            </Link>
          </div>

          <nav className="ml-6 hidden items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-6 md:flex">
            {navLinks.map(({ label, to }) => {
              const isActive = location.pathname === to;
              return (<Link key={label} to={to} className={`relative whitespace-nowrap text-[0.92rem] font-medium transition duration-200 xl:text-[0.96rem] ${isActive ? "text-black after:w-full" : "text-[#444] hover:text-black after:w-0 hover:after:w-full"}after:absolute after:left-0 after:-bottom-[7px] after:h-[2px] after:bg-black after:transition-all after:duration-300`}>{label}</Link>);
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button type="button" aria-label="Search" className="hidden h-9 w-9 place-items-center rounded-full text-[#111] transition hover:bg-[#f3f4f6] sm:grid md:h-10 md:w-10"><SearchOutlined className="text-[1rem]" /></button>
            {isAuthenticated ? (
              <Dropdown trigger={["click"]} placement="bottomRight" open={accountOpen} onOpenChange={setAccountOpen} destroyOnHidden popupRender={() => accountDropdown}>
                <button type="button" aria-label="Account" className="grid h-9 w-9 place-items-center rounded-full text-[#111] transition hover:bg-[#f3f4f6] lg:h-10 lg:w-10"><UserOutlined className="text-[1rem]" /></button>
              </Dropdown>
            ) : (
              <Link to={ROUTES.AUTH.LOGIN} aria-label="Login" className="grid h-9 w-9 place-items-center rounded-full text-[#111] transition hover:bg-[#f3f4f6] lg:h-10 lg:w-10"><UserOutlined className="text-[1rem]" /></Link>
            )}
            <button type="button" aria-label="Wishlist" className="relative hidden h-9 w-9 place-items-center rounded-full text-[#111] transition hover:bg-[#f3f4f6] sm:grid lg:h-10 lg:w-10">
              <HeartOutlined className="text-[1rem]" />
              <span className="absolute -right-1 -top-1 rounded-full bg-black px-1.5 py-[1px] text-[10px] font-medium text-white">2</span>
            </button>
            <button type="button" aria-label="Cart" className="relative hidden h-9 w-9 place-items-center rounded-full text-[#111] transition hover:bg-[#f3f4f6] sm:grid lg:h-10 lg:w-10">
              <ShoppingCartOutlined className="text-[1rem]" />
              <span className="absolute -right-1 -top-1 rounded-full bg-black px-1.5 py-[1px] text-[10px] font-medium text-white">3</span>
            </button>
            <button type="button" aria-label={mobileMenuOpen ? "Close menu" : "Open menu"} onClick={() => setMobileMenuOpen((prev) => !prev)} className="grid h-9 w-9 place-items-center rounded-full border border-[#e5e7eb] text-[#111] transition hover:bg-[#f3f4f6] md:hidden">
              {mobileMenuOpen ? (<CloseOutlined className="text-[1rem]" />) : (<MenuOutlined className="text-[1rem]" />)}
            </button>
          </div>
        </div>

        <div className={`overflow-hidden transition-all duration-300 md:hidden ${mobileMenuOpen ? "max-h-[500px] pb-4 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="rounded-2xl border border-[#ececec] bg-white p-2 shadow-sm">

            <nav className="flex flex-col">
              {navLinks.map(({ label, to }) => {
                const isActive = location.pathname === to;
                return (<Link key={label} to={to} className={`rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? "bg-black text-white" : "text-[#111] hover:bg-[#f5f5f5]"}`}>{label}</Link>);
              })}
            </nav>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <button type="button" className="rounded-xl border border-[#e5e7eb] px-3 py-2.5 text-sm font-medium text-[#111] transition hover:bg-[#f5f5f5]">Search</button>
              <button type="button" className="rounded-xl border border-[#e5e7eb] px-3 py-2.5 text-sm font-medium text-[#111] transition hover:bg-[#f5f5f5]">Wishlist</button>
              <button type="button" className="rounded-xl border border-[#e5e7eb] px-3 py-2.5 text-sm font-medium text-[#111] transition hover:bg-[#f5f5f5]"> Cart</button>

              {isAuthenticated ? (
                <button type="button" onClick={handleProfileOpen} className="rounded-xl bg-black px-3 py-2.5 text-sm font-medium text-white transition hover:bg-[#222]">Profile</button>
              ) : (
                <Link to={ROUTES.AUTH.LOGIN} className="rounded-xl bg-black px-3 py-2.5 text-center text-sm font-medium text-white transition hover:bg-[#222]">Login</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
