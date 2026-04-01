import { useMemo } from "react";
import { Mutations } from "../../Api/Mutations";
import { Queries } from "../../Api/Queries";
import { useAppSelector } from "../../Store/Hooks";
import type { AuthSessionUser } from "../../Types";
import { getPhoneNumber } from "./helpers";
import GuestProfileState from "./GuestProfileState";
import ProfileInfoSection from "./ProfileInfoSection";
import ProfilePlaceholderSection from "./ProfilePlaceholderSection";
import ProfileSidebar from "./ProfileSidebar";
import type { ProfileProps } from "./types";

const Profile = ({ section = "info" }: ProfileProps) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const userId = user?._id;
  const profileQuery = Queries.useGetSingleUser(userId);
  const editUserMutation = Mutations.useEditUser();

  const profile = useMemo<AuthSessionUser | null>(() => {
    return (profileQuery.data?.data as AuthSessionUser | undefined) ?? user ?? null;
  }, [profileQuery.data?.data, user]);

  if (!isAuthenticated) {
    return <GuestProfileState />;
  }

  const renderContent = () => {
    switch (section) {
      case "orders":
        return (
          <ProfilePlaceholderSection eyebrow="My Order" title="Order Summary" description="Your recent orders, delivery progress, and purchase history will appear here." emptyMessage="No order data connected yet."/>);
      case "wishlist":
        return (
          <ProfilePlaceholderSection eyebrow="Wishlist" title="Saved Products" description="Products you save for later will be listed here for quick access." emptyMessage="Your wishlist is currently empty."/>
        );
      case "addresses":
        return (
          <ProfilePlaceholderSection eyebrow="Addresses" title="Saved Address Book" description="Shipping and billing addresses can be managed from this section." emptyMessage="No saved addresses available right now."/>
        );
      case "payment":
        return (
          <ProfilePlaceholderSection eyebrow="Payment Methode" title="Payment Preferences" description="Saved cards, preferred payment options, and billing settings will appear here." emptyMessage="No payment method has been added yet."/>
        );
      case "info":
      default:
        return (
          <ProfileInfoSection editUser={editUserMutation.mutateAsync} isRefreshing={profileQuery.isLoading} isSaving={editUserMutation.isPending} profile={profile? {...profile,phoneNumber:getPhoneNumber(profile) === "Not available" ? "" : getPhoneNumber(profile),}: null}userId={userId}/>
        );
    }
  };

  return (
    <section className="bg-[radial-gradient(circle_at_top,#fff6ea_0%,#faf8f5_32%,#f7f3ed_100%)] py-12 sm:py-16">
      <div className="mx-auto grid w-[92%] max-w-[1180px] gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
        <ProfileSidebar />
        <div className="grid gap-6">{renderContent()}</div>
      </div>
    </section>
  );
};

export default Profile;
