import {
  CreditCardOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router-dom";
import { ROUTES } from "../../Constants";
import { useAppDispatch } from "../../Store/Hooks";
import { setSignOut } from "../../Store/Slices/AuthSlice";
import { profileSections } from "./constants";

const ProfileSidebar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const iconMap = {
    [ROUTES.ACCOUNT.ORDERS]: <ShoppingOutlined />,
    [ROUTES.ACCOUNT.WISHLIST]: <HeartOutlined />,
    [ROUTES.ACCOUNT.INFO]: <UserOutlined />,
    [ROUTES.ACCOUNT.ADDRESSES]: <EnvironmentOutlined />,
    [ROUTES.ACCOUNT.PAYMENT]: <CreditCardOutlined />,
    [ROUTES.ACCOUNT.CHANGE_PASSWORD]: <UserOutlined />,
  } as const;

  const handleLogout = () => {
    dispatch(setSignOut());
    navigate(ROUTES.HOME);
  };

  return (
    <aside className="hide-scrollbar border-b border-[#e5e9f0] bg-white lg:sticky lg:top-[78px] lg:h-[calc(100vh-78px)] lg:border-b-0 lg:border-r lg:overflow-y-auto">
      <div className="border-b border-[#e5e9f0] px-4 py-3 lg:hidden">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-[#ef6b4a]">Account Menu</p>
      </div>

      <div className="hidden border-b border-[#e5e9f0] px-5 py-6 lg:block">
        <div className="rounded-[14px] border border-[#e4e9f1] bg-white p-4">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#ef6b4a]">My Account</p>
          <h2 className="mt-2 text-xl font-semibold text-[#0f172a]">Shopper Dashboard</h2>
        </div>
      </div>

      <nav className="px-3 py-3 lg:px-4 lg:py-5">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:flex lg:flex-col lg:gap-2">
          {profileSections.map(({ label, to }) => (
            <NavLink
              key={label}
              to={to}
              end={to === ROUTES.ACCOUNT.INFO}
              className={({ isActive }) =>
                `group flex min-w-0 items-center justify-start gap-2.5 rounded-[12px] border px-2.5 py-2.5 text-xs font-semibold transition sm:px-3 sm:text-sm lg:justify-between lg:gap-3 lg:px-4 lg:py-3 ${
                  isActive
                    ? "border-[#d8e0ec] bg-white text-[#0f172a] shadow-[0_8px_20px_rgba(15,23,42,0.06)] lg:border-l-[3px] lg:border-l-[#ef6b4a]"
                    : "border-[#dfe5ee] bg-white text-[#4b5563] hover:border-[#d0d8e4] hover:bg-[#fafbfd]"
                }`
              }
            >
              {({ isActive }) => (
                <span className="flex min-w-0 items-center gap-2.5">
                  <span
                    className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm transition ${
                      isActive ? "bg-white text-[#ef6b4a]" : "bg-white text-[#7b8797] group-hover:text-[#ef6b4a]"
                    }`}
                  >
                    {iconMap[to]}
                  </span>
                  <span className="truncate whitespace-nowrap">{label}</span>
                </span>
              )}
            </NavLink>
          ))}
        </div>

        <div className="mt-3 lg:mt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#ffdada] bg-[#fff5f5] px-3 py-2.5 text-sm font-semibold text-[#c62828] transition hover:bg-[#ffecec] lg:justify-start lg:px-4 lg:py-3"
          >
            <LogoutOutlined />
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default ProfileSidebar;
