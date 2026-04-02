import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import { getInitials, getPhoneNumber } from "./helpers";
import ProfileEditForm from "./ProfileEditForm";
import { ProfileImage } from "./profileImageUtils";
import type { ProfileInfoSectionProps } from "./types/index";

const ProfileInfoSection = ({editUser,uploadImage,deleteUploadedImage,isRefreshing,isSaving,isUploadingImage,isDeletingImage,profile,userId,}: ProfileInfoSectionProps) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const profilePhoto = typeof profile?.profilePhoto === "string" ? profile.profilePhoto.trim() : "";

  return (
    <div className="overflow-hidden rounded-[12px] border border-[#ece6db] bg-white shadow-[0_20px_50px_rgba(17,17,17,0.08)]">
      <div className="border-b border-[#efe7dd] bg-[radial-gradient(circle_at_top_left,#fff7ee_0%,#ffffff_48%,#fffaf5_100%)] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
        <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
          <div><p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#f6821f]">Overview</p>
          <h2 className="mt-2 text-xl font-semibold text-[#111111] sm:mt-3 sm:text-2xl lg:text-[2rem]">Personal Information</h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isRefreshing ? (
              <span className="rounded-full bg-[#f7f7f7] px-3 py-1.5 text-xs font-medium text-[#666666] sm:px-4 sm:py-2 sm:text-sm">Refreshing...</span>
            ) : null}
            <button type="button" onClick={() => setIsEditingProfile((prev) => !prev)} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e3e3e3] bg-white text-[#111111] transition hover:border-black hover:bg-[#fafafa] sm:h-11 sm:w-11" aria-label={isEditingProfile ? "Close edit mode" : "Edit profile"}>{isEditingProfile ? <CloseOutlined /> : <EditOutlined />}</button>
          </div>
        </div>
      </div>

      {isEditingProfile ? (
        <ProfileEditForm profile={profile} userId={userId} profilePhoto={profilePhoto} isSaving={isSaving} isUploadingImage={isUploadingImage} isDeletingImage={isDeletingImage} editUser={editUser} uploadImage={uploadImage} deleteUploadedImage={deleteUploadedImage} onClose={() => setIsEditingProfile(false)}/>
      ) : (
        <div className="grid gap-4 px-4 py-5 sm:gap-5 sm:px-6 sm:py-6 md:grid-cols-2 lg:px-8 lg:py-7">
          <div className="md:col-span-2 rounded-[10px] border border-[#efe7dd] bg-[#faf7f2] p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8c8c8c]">Profile Photo</p>
            <div className="mt-3 flex items-center gap-4">
              <ProfileImage value={profilePhoto} alt="Profile" className="h-20 w-20 rounded-full border border-[#e6ded2] object-cover sm:h-24 sm:w-24" fallback={   <div className="inline-grid h-20 w-20 place-items-center rounded-full border border-[#e6ded2] bg-white text-lg font-semibold text-[#777777] sm:h-24 sm:w-24 sm:text-xl">     {getInitials(profile)}   </div> }/>
              <p className="text-sm font-medium text-[#555555]">
                {profilePhoto ? "Profile photo uploaded" : "No profile photo uploaded"}
              </p>
            </div>
          </div>

          <div className="rounded-[10px] border border-[#efe7dd] bg-[#faf7f2] p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8c8c8c]">First Name</p>
            <p className="mt-2 text-base font-semibold text-[#111111] sm:mt-3 sm:text-lg">{profile?.firstName || "Not available"}</p>
          </div>
          <div className="rounded-[10px] border border-[#efe7dd] bg-[#faf7f2] p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8c8c8c]">Last Name</p>
            <p className="mt-2 text-base font-semibold text-[#111111] sm:mt-3 sm:text-lg">{profile?.lastName || "Not available"}</p>
          </div>
          <div className="rounded-[10px] border border-[#efe7dd] bg-[#faf7f2] p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8c8c8c]">Email Address</p>
            <p className="mt-2 break-all text-base font-semibold text-[#111111] sm:mt-3 sm:text-lg">{profile?.email || "Not available"}</p>
          </div>
          <div className="rounded-[10px] border border-[#efe7dd] bg-[#faf7f2] p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8c8c8c]">Phone Number</p>
            <p className="mt-2 text-base font-semibold text-[#111111] sm:mt-3 sm:text-lg">{getPhoneNumber(profile)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfoSection;
