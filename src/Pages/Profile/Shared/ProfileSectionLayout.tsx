import type { ReactNode } from "react";
import ProfileSidebar from "./ProfileSidebar";

type ProfileSectionLayoutProps = {
  children: ReactNode;
};

const ProfileSectionLayout = ({ children }: ProfileSectionLayoutProps) => {
  return (
    <section className="min-h-screen bg-white">
      <div className="site-container grid min-h-screen lg:grid-cols-[290px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
        <ProfileSidebar />
        <div className="grid content-start gap-3 p-2.5 sm:gap-4 sm:p-4 md:gap-5 md:p-5 lg:gap-6 lg:p-7 xl:p-8">{children}</div>
      </div>
    </section>
  );
};

export default ProfileSectionLayout;
