import { useAppSelector } from "../../../Store/Hooks";
import ProfileAddressForm from "./ProfileAddressForm";
import { GuestProfileState, ProfileSectionLayout } from "../Shared";

const ProfileAddAddressPage = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <GuestProfileState />;
  }

  return (
    <ProfileSectionLayout><ProfileAddressForm mode="add" /></ProfileSectionLayout>
  );
};

export default ProfileAddAddressPage;
