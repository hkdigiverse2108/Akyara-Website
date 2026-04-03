import {
  CheckCircleFilled,
  CloseOutlined,
  EditOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { getDisplayName, getInitials, getPhoneNumber } from "./helpers";
import ProfileEditForm from "./ProfileEditForm";
import { ProfileImage } from "./profileImageUtils";
import type { ProfileInfoSectionProps } from "./types/index";

const ProfileInfoSection = ({
  editUser,
  uploadImage,
  deleteUploadedImage,
  isRefreshing,
  isSaving,
  isUploadingImage,
  isDeletingImage,
  profile,
  userId,
}: ProfileInfoSectionProps) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const profilePhoto = typeof profile?.profilePhoto === "string" ? profile.profilePhoto.trim() : "";
  const phoneNumber = getPhoneNumber(profile);
  const displayName = getDisplayName(profile);

  const profileChecks = [
    Boolean(profile?.firstName?.trim()),
    Boolean(profile?.lastName?.trim()),
    Boolean(profile?.email?.trim()),
    phoneNumber !== "Not available",
    Boolean(profilePhoto),
  ];
  const completedChecks = profileChecks.filter(Boolean).length;
  const profileCompleteness = Math.round((completedChecks / profileChecks.length) * 100);

  const detailItems = [
    { label: "First Name", value: profile?.firstName || "Not available" },
    { label: "Last Name", value: profile?.lastName || "Not available" },
    { label: "Phone Number", value: phoneNumber },
  ] as const;

  return (
    <div className="overflow-hidden rounded-[14px] border border-[#e6ebf1] bg-white shadow-[0_24px_56px_rgba(15,23,42,0.08)] sm:rounded-[16px]">
      <div className="border-b border-[#e6ebf1] bg-white px-4 py-4 sm:px-5 sm:py-5 lg:px-7 lg:py-6">
        <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#ef6b4a]">My Account</p>
            <h2 className="mt-2 text-lg font-semibold text-[#0f172a] sm:mt-2.5 sm:text-2xl lg:text-[2rem]">Profile Information</h2>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {isRefreshing ? (
              <span className="rounded-full border border-[#dfe4ec] bg-white px-3 py-1.5 text-xs font-medium text-[#4b5563] sm:px-4 sm:py-2 sm:text-sm">
                Refreshing...
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => setIsEditingProfile((prev) => !prev)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#d7dde7] bg-white text-[#111827] transition hover:border-[#111827] hover:bg-[#f9fafb] sm:h-10 sm:w-10"
              aria-label={isEditingProfile ? "Close edit mode" : "Edit profile"}
            >
              {isEditingProfile ? <CloseOutlined /> : <EditOutlined />}
            </button>
          </div>
        </div>
      </div>

      {isEditingProfile ? (
        <ProfileEditForm
          profile={profile}
          userId={userId}
          profilePhoto={profilePhoto}
          isSaving={isSaving}
          isUploadingImage={isUploadingImage}
          isDeletingImage={isDeletingImage}
          editUser={editUser}
          uploadImage={uploadImage}
          deleteUploadedImage={deleteUploadedImage}
          onClose={() => setIsEditingProfile(false)}
        />
      ) : (
        <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)] lg:p-6 xl:grid-cols-[minmax(0,300px)_minmax(0,1fr)] xl:p-8">
          <div className="rounded-[12px] border border-[#e5e9f0] bg-white p-4 sm:rounded-[14px] sm:p-5">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-[#8b96a8]">Shopper Card</p>
            <div className="mt-4 flex flex-col items-start gap-3 min-[420px]:flex-row min-[420px]:items-center min-[420px]:gap-4">
              <ProfileImage
                value={profilePhoto}
                alt="Profile"
                className="h-20 w-20 shrink-0 aspect-square rounded-full border border-[#dbe1eb] object-cover sm:h-24 sm:w-24"
                fallback={
                  <div className="inline-grid h-20 w-20 shrink-0 aspect-square place-items-center rounded-full border border-[#dbe1eb] bg-white text-lg font-semibold text-[#6b7280] sm:h-24 sm:w-24 sm:text-xl">
                    {getInitials(profile)}
                  </div>
                }
              />
              <div className="min-w-0 w-full">
                <h3 className="truncate text-base font-semibold text-[#0f172a] sm:text-lg">{displayName}</h3>
                <span
                  className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    profile?.isEmailVerified
                      ? "bg-[#e9f8ef] text-[#0f9d58]"
                      : "bg-[#fff4de] text-[#c77800]"
                  }`}
                >
                  {profile?.isEmailVerified ? "Verified Shopper" : "Email Verification Pending"}
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm text-[#4b5563]">
              <div className="flex items-start gap-2.5">
                <PhoneOutlined className="mt-0.5 shrink-0 text-[#ef6b4a]" />
                <span>{phoneNumber}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <EnvironmentOutlined className="mt-0.5 shrink-0 text-[#ef6b4a]" />
                <span>Default address section in sidebar</span>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[12px] border border-[#e5e9f0] bg-white p-4 sm:rounded-[14px] sm:p-5">
              <h3 className="text-base font-semibold text-[#0f172a] sm:text-lg">Contact Details</h3>
              <p className="mt-1 text-sm text-[#5b6472]">
                Core profile information used for orders and account communication.
              </p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {detailItems.map((item) => (
                  <div key={item.label} className="rounded-[12px] border border-[#e8edf4] bg-white p-4">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8b96a8]">
                      {item.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#111827]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[12px] border border-[#e5e9f0] bg-white p-4 sm:rounded-[14px] sm:p-5">
              <h3 className="text-base font-semibold text-[#0f172a] sm:text-lg">Account Status</h3>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-[12px] border border-[#e8edf4] bg-white p-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8b96a8]">
                    Verification
                  </p>
                  <p
                    className={`mt-2 inline-flex items-center gap-2 text-sm font-semibold ${
                      profile?.isEmailVerified ? "text-[#0f9d58]" : "text-[#c77800]"
                    }`}
                  >
                    <CheckCircleFilled />
                    {profile?.isEmailVerified ? "Email verified successfully" : "Complete email verification"}
                  </p>
                </div>

                <div className="rounded-[12px] border border-[#e8edf4] bg-white p-4">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8b96a8]">
                    Profile Completeness
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[#111827]">
                    {profileCompleteness}% profile completed
                  </p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e7edf6]">
                    <div className="h-full rounded-full bg-[#ef6b4a]" style={{ width: `${profileCompleteness}%` }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfoSection;
