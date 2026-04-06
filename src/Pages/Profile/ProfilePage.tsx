import { useMemo } from "react";
import { Mutations } from "../../Api/Mutations";
import { Queries } from "../../Api/Queries";
import { useAppSelector } from "../../Store/Hooks";
import type { AuthSessionUser, ProfileProps } from "../../Types";
import ProfileAddressesSection from "./Addresses";
import ProfileChangePasswordSection from "./ChangePassword";
import ProfileInfoSection from "./Info";
import ProfileOrdersSection from "./Orders";
import {
  GuestProfileState,
  ProfilePlaceholderSection,
  ProfileSectionLayout,
  getPhoneNumber,
} from "./Shared";
import ProfileWishlistSection from "./Wishlist";

const ProfilePage = ({ section = "info" }: ProfileProps) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const userId = user?._id;
  const profileQuery = Queries.useGetSingleUser(userId);
  const editUserMutation = Mutations.useEditUser();
  const uploadImageMutation = Mutations.useUploadImage();
  const deleteUploadedImageMutation = Mutations.useDeleteUploadedImage();

  const profile = useMemo<AuthSessionUser | null>(() => {
    return (profileQuery.data?.data as AuthSessionUser | undefined) ?? user ?? null;
  }, [profileQuery.data?.data, user]);

  const phoneNumber = useMemo(() => {
    const phone = getPhoneNumber(profile);
    return phone === "Not available" ? "" : phone;
  }, [profile]);

  if (!isAuthenticated) {
    return <GuestProfileState />;
  }

  const actions = {
    editUser: editUserMutation.mutateAsync,
    uploadImage: uploadImageMutation.mutateAsync,
    deleteUploadedImage: deleteUploadedImageMutation.mutateAsync,
  };

  const loading = {
    isRefreshing: profileQuery.isLoading,
    isSaving: editUserMutation.isPending,
    isUploadingImage: uploadImageMutation.isPending,
    isDeletingImage: deleteUploadedImageMutation.isPending,
  };

  const sections = {
    orders: <ProfileOrdersSection />,
    wishlist: <ProfileWishlistSection />,
    addresses: <ProfileAddressesSection />,
    payment: (
      <ProfilePlaceholderSection
        eyebrow="Payment Method"
        title="Payment Preferences"
        description="Saved cards, preferred payment options, and billing settings will appear here."
        emptyMessage="No payment method has been added yet."
      />
    ),
    "change-password": <ProfileChangePasswordSection />,
    info: (
      <ProfileInfoSection
        {...actions}
        {...loading}
        profile={profile ? { ...profile, phoneNumber } : null}
        userId={userId}
      />
    ),
  };

  return <ProfileSectionLayout>{sections[section] || sections.info}</ProfileSectionLayout>;
};

export default ProfilePage;
