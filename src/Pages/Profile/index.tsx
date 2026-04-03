import { useMemo } from "react";
import { Mutations } from "../../Api/Mutations";
import { Queries } from "../../Api/Queries";
import { useAppSelector } from "../../Store/Hooks";
import type { AuthSessionUser } from "../../Types";
import { getPhoneNumber } from "./helpers";
import GuestProfileState from "./GuestProfileState";
import ProfileChangePasswordSection from "./ProfileChangePasswordSection";
import ProfileInfoSection from "./ProfileInfoSection";
import ProfileOrdersSection from "./ProfileOrdersSection";
import ProfilePlaceholderSection from "./ProfilePlaceholderSection";
import ProfileSidebar from "./ProfileSidebar";
import ProfileWishlistSection from "./ProfileWishlistSection";
import type { ProfileProps } from "../../Types";

const Profile = ({ section = "info" }: ProfileProps) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const userId = user?._id;
  const profileQuery = Queries.useGetSingleUser(userId);
  const editUserMutation = Mutations.useEditUser();
  const uploadImageMutation = Mutations.useUploadImage();
  const deleteUploadedImageMutation = Mutations.useDeleteUploadedImage();
  const profile = useMemo<AuthSessionUser | null>(() => {return (profileQuery.data?.data as AuthSessionUser | undefined) ?? user ?? null;}, [profileQuery.data?.data, user]);
  const phoneNumber = useMemo(() => {
    const phone = getPhoneNumber(profile);
    return phone === "Not available" ? "" : phone;
  }, [profile]);


  if (!isAuthenticated) return <GuestProfileState />;
  const actions = {editUser: editUserMutation.mutateAsync,uploadImage: uploadImageMutation.mutateAsync,deleteUploadedImage: deleteUploadedImageMutation.mutateAsync,};
  const loading = {isRefreshing: profileQuery.isLoading,isSaving: editUserMutation.isPending,isUploadingImage: uploadImageMutation.isPending,isDeletingImage: deleteUploadedImageMutation.isPending,};

  /* -------------------- Section Mapping (better than switch) -------------------- */
  const sections = {
    orders: (<ProfileOrdersSection />),
    wishlist: (<ProfileWishlistSection />),
    addresses: (<ProfilePlaceholderSection eyebrow="Addresses" title="Saved Address Book" description="Shipping and billing addresses can be managed from this section." emptyMessage="No saved addresses available right now."/>),
    payment: (<ProfilePlaceholderSection eyebrow="Payment Method" title="Payment Preferences" description="Saved cards, preferred payment options, and billing settings will appear here." emptyMessage="No payment method has been added yet."/>),
    "change-password": (<ProfileChangePasswordSection />),
    info: (<ProfileInfoSection {...actions} {...loading} profile={   profile     ? {...profile,phoneNumber,       }     : null } userId={userId}/>),
  };

  return (
    <section className="min-h-screen w-full bg-white">
      <div className="grid min-h-screen w-full lg:grid-cols-[290px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
        <ProfileSidebar />
        <div className="grid content-start gap-3 p-2.5 sm:gap-4 sm:p-4 md:gap-5 md:p-5 lg:gap-6 lg:p-7 xl:p-8">
          {sections[section] || sections.info}
        </div>
      </div>
    </section>
  );
};

export default Profile;
