import {
  CreditCardOutlined,
  EnvironmentOutlined,
  HeartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { ROUTES } from "../../Constants";
import { profileSections } from "./constants";

const ProfileSidebar = () => {
  const iconMap = {
    [ROUTES.ACCOUNT.ORDERS]: <ShoppingOutlined />,
    [ROUTES.ACCOUNT.WISHLIST]: <HeartOutlined />,
    [ROUTES.ACCOUNT.INFO]: <UserOutlined />,
    [ROUTES.ACCOUNT.ADDRESSES]: <EnvironmentOutlined />,
    [ROUTES.ACCOUNT.PAYMENT]: <CreditCardOutlined />,
  } as const;

  return (
    <aside className="self-start overflow-hidden rounded-[10px] bg-[linear-gradient(180deg,#1e1a20_0%,#141216_100%)] shadow-[0_28px_70px_rgba(18,12,20,0.26)]">
      <div className="border-b border-white/10 px-6 py-6">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.34em] text-[#f1b56a]">
          Account Center
        </p>
        <h2 className="mt-3 text-xl font-semibold text-white">Manage Your Profile</h2>
        <p className="mt-2 text-sm leading-6 text-white/64">
          Keep your personal details, wishlist, orders, and saved preferences in one place.
        </p>
      </div>

      {profileSections.map(({ label, to }) => (
        <NavLink
          key={label}
          to={to}
          end={to === ROUTES.ACCOUNT.INFO}
          className={({ isActive }) =>
            `flex w-full items-center justify-between border-b border-white/10 px-6 py-5 text-left text-[1.02rem] font-medium transition last:border-b-0 ${
              isActive
                ? "bg-[#2c252e] text-white"
                : "bg-transparent text-white/72 hover:bg-[#241f26] hover:text-white"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className="inline-flex items-center gap-3">
                <span
                  className={`inline-grid h-9 w-9 place-items-center rounded-full text-sm ${
                    isActive ? "bg-[#f1b56a]/18 text-[#f7c88f]" : "bg-white/8 text-white/72"
                  }`}
                >
                  {iconMap[to]}
                </span>
                <span>{label}</span>
              </span>
              {isActive && <span className="text-sm text-[#f1b56a]">Current</span>}
            </>
          )}
        </NavLink>
      ))}
    </aside>
  );
};

export default ProfileSidebar;
