import {CreditCardOutlined,EnvironmentOutlined,HeartOutlined,ShoppingOutlined,UserOutlined,} from "@ant-design/icons";
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
    [ROUTES.ACCOUNT.CHANGE_PASSWORD]: <UserOutlined />,
  } as const;

  return (
    <aside className="border-b border-[#d9dee5] bg-[#f5f7fa] lg:min-h-screen lg:border-b-0 lg:border-r">
      <div className="hidden border-b border-[#e2e7ee] bg-white px-6 py-6 lg:block">
        <p className="text-xs uppercase tracking-widest text-[#ef6b4a]">Account Center</p>
        <h2 className="mt-2 text-xl font-semibold text-[#0f172a]">Manage Your Profile</h2>
      </div>

      <nav className="hide-scrollbar overflow-x-auto px-3 py-4 lg:overflow-visible lg:px-0 lg:py-0">
        <div className="flex gap-2 lg:block lg:space-y-0">
          {profileSections.map(({ label, to }) => (
            <NavLink key={label} to={to} end={to === ROUTES.ACCOUNT.INFO} className={({ isActive }) => `   flex min-w-max items-center justify-between gap-3 rounded-[12px] border px-4 py-2.5 text-sm font-semibold transition lg:min-w-0 lg:rounded-none lg:border-0 lg:px-6 lg:py-4 ${     isActive       ? "border-[#111827] bg-[#111827] text-white lg:border-b lg:border-[#1f2937]"       : "border-[#dfe3e9] bg-white text-[#4b5563] hover:bg-[#eceff4] lg:border-b lg:border-[#e2e7ee]"   }` }>
              {({ isActive }) => (
                <>
                  <span className="flex items-center gap-2.5"> {iconMap[to]}{label}</span>
                  {isActive ? <span className="hidden text-xs uppercase tracking-wide text-white lg:inline">Current</span> : null}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default ProfileSidebar;
