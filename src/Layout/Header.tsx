import {
  HeartOutlined,
  LogoutOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Dropdown } from "antd";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Queries } from "../Api/Queries";
import { ROUTES } from "../Constants";
import { useAppDispatch, useAppSelector } from "../Store/Hooks";
import { setSignOut, setUser } from "../Store/Slices/AuthSlice";
import type { AuthSessionUser } from "../Types";

const navLinks = [
  { label: "Home", to: ROUTES.HOME },
  { label: "Products", to: ROUTES.PRODUCTS },
  { label: "Shirts", to: ROUTES.SHIRTS },
  { label: "Tshirts", to: ROUTES.TSHIRTS },
  { label: "Jeans", to: ROUTES.JEANS },
];

const formatDisplayName = (user: AuthSessionUser | null) => {
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
  if (fullName) return fullName;

  if (user?.email) {
    return user.email
      .split("@")[0]
      .replace(/[._-]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }
  return "Account";
};

const getInitials = (user: AuthSessionUser | null) => {
  const displayName = formatDisplayName(user);
  return displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
};

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [accountOpen, setAccountOpen] = useState(false);
  const userId = user?._id;
  const singleUserQuery = Queries.useGetSingleUser(userId);

  useEffect(() => {
    if (!singleUserQuery.data?.data) return;
    dispatch(setUser(singleUserQuery.data.data));
  }, [dispatch, singleUserQuery.data?.data]);

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
          <span className="inline-flex items-center gap-2">
            <UserOutlined />
            My Profile
          </span>
          <span className="text-xs font-medium text-[#8a8a8a]">Open page</span>
        </button>

        <button type="button" onClick={handleLogout} className="flex w-full items-center justify-between rounded-[14px] px-3 py-3 text-left text-sm font-semibold text-[#c62828] transition hover:bg-[#fff2f2]">
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
      <div className="mx-auto flex w-[92%] max-w-[1200px] items-center gap-6 py-[18px]">
        <div className="shrink-0 flex items-center gap-2.5">
          <Link to={ROUTES.HOME} aria-label="Home">
            <img
              className="block h-10 w-auto object-contain"
              src="/assets/images/logo/logo.png"
              alt="Kumo logo"
            />
          </Link>
        </div>

        <nav className="flex shrink-0 items-center gap-8 whitespace-nowrap font-medium">
          {navLinks.map(({ label, to }) => (
            <Link key={label} to={to} className="relative after:absolute after:left-0 after:-bottom-1.5 after:h-[2px] after:w-0 after:bg-[#f6821f] after:transition-[width] after:duration-200 hover:after:w-full">{label}</Link>
          ))}
        </nav>

        <div className="ml-auto inline-flex shrink-0 flex-nowrap items-center gap-4 whitespace-nowrap">
          <button
            className="relative inline-grid h-10 w-10 place-items-center rounded-full bg-white text-black transition duration-200 hover:-translate-y-0.5 hover:bg-[#ececec]"
            type="button"
            aria-label="Search"
          >
            <SearchOutlined />
          </button>

          {isAuthenticated ? (
            <Dropdown
              trigger={["hover", "click"]}
              placement="bottomRight"
              arrow={{ pointAtCenter: true }}
              open={accountOpen}
              onOpenChange={setAccountOpen}
              destroyOnHidden
              popupRender={() => accountDropdown}
            >
              <button
                type="button"
                aria-label="Account menu"
                className="relative inline-grid h-10 w-10 place-items-center rounded-full bg-white text-black transition duration-200 hover:-translate-y-0.5 hover:bg-[#ececec]"
              >
                <UserOutlined />
              </button>
            </Dropdown>
          ) : (
            <Link
              className="relative inline-grid h-10 w-10 place-items-center rounded-full bg-white text-black transition duration-200 hover:-translate-y-0.5 hover:bg-[#ececec]"
              to={ROUTES.AUTH.LOGIN}
              aria-label="Account"
            >
              <UserOutlined />
            </Link>
          )}

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
