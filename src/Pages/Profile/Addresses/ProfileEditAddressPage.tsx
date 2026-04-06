import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../Store/Hooks";
import ProfileAddressForm from "./ProfileAddressForm";
import { GuestProfileState, ProfileSectionLayout } from "../Shared";

const ProfileEditAddressPage = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { id } = useParams();

  if (!isAuthenticated) {
    return <GuestProfileState />;
  }

  return (
    <ProfileSectionLayout>
      <ProfileAddressForm mode="edit" addressId={id} />
    </ProfileSectionLayout>
  );
};

export default ProfileEditAddressPage;
