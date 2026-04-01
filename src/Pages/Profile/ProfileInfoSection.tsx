import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import { Form, Formik } from "formik";
import { useState } from "react";
import { ErrorMessage } from "../../Attribute";
import CommonInput from "../../Components/CommonInput";
import { useAppDispatch } from "../../Store/Hooks";
import { setUser } from "../../Store/Slices/AuthSlice";
import type { ApiResponse, AuthSessionUser } from "../../Types";
import { ProfileSchema } from "../../Utils/ValidationSchemas";
import { getDisplayName, getInitials, getPhoneNumber } from "./helpers";

type ProfileInfoSectionProps = {
  editUser: (input: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    contact: { phoneNo?: string };
  }) => Promise<ApiResponse>;
  isSaving: boolean;
  isRefreshing: boolean;
  profile: AuthSessionUser | null;
  userId?: string;
};

const ProfileInfoSection = ({
  editUser,
  isRefreshing,
  isSaving,
  profile,
  userId,
}: ProfileInfoSectionProps) => {
  const dispatch = useAppDispatch();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  return (
    <div className="overflow-hidden rounded-[10px] border border-[#ece6db] bg-white shadow-[0_24px_60px_rgba(17,17,17,0.08)]">
      <div className="border-b border-[#efe7dd] bg-[radial-gradient(circle_at_top_left,#fff7ee_0%,#ffffff_48%,#fffaf5_100%)] px-7 py-8 sm:px-9">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.34em] text-[#f6821f]">Overview</p>
          <h2 className="mt-3 text-2xl font-semibold text-[#111111] sm:text-[2rem]">Personal Information</h2>
          <p className="mt-3 max-w-[620px] text-sm leading-7 text-[#6d6d6d]">
            Review your profile details and update your account information whenever you need.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isRefreshing && (
            <span className="rounded-full bg-[#f7f7f7] px-4 py-2 text-sm font-medium text-[#666666]">
              Refreshing...
            </span>
          )}
          <button
            type="button"
            onClick={() => setIsEditingProfile((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#e3e3e3] bg-white text-[#111111] transition hover:border-black hover:bg-[#fafafa]"
            aria-label={isEditingProfile ? "Close edit mode" : "Edit profile"}
          >
            {isEditingProfile ? <CloseOutlined /> : <EditOutlined />}
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="rounded-[10px] border border-[#2b2530] bg-[linear-gradient(180deg,#1e1a20_0%,#141216_100%)] p-6 text-white shadow-[0_20px_50px_rgba(18,12,20,0.24)]">
          <div className="flex items-center gap-4">
            <div className="inline-grid h-16 w-16 place-items-center rounded-full bg-white/10 text-xl font-semibold text-white">
              {getInitials(profile)}
            </div>
            <div>
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.3em] text-[#f1b56a]">
                Account Holder
              </p>
              <h3 className="mt-2 text-2xl font-semibold">{getDisplayName(profile)}</h3>
            </div>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[10px] bg-white/8 px-4 py-4">
              <p className="text-[0.72rem] uppercase tracking-[0.24em] text-white/45">Email</p>
              <p className="mt-2 break-all text-sm font-medium text-white">{profile?.email || "Not available"}</p>
            </div>
            <div className="rounded-[10px] bg-white/8 px-4 py-4">
              <p className="text-[0.72rem] uppercase tracking-[0.24em] text-white/45">Phone</p>
              <p className="mt-2 text-sm font-medium text-white">{getPhoneNumber(profile)}</p>
            </div>
          </div>
        </div>
      </div>
      </div>

      {isEditingProfile ? (
        <Formik
          enableReinitialize
          initialValues={{
            firstName: profile?.firstName ?? "",
            lastName: profile?.lastName ?? "",
            email: profile?.email ?? "",
            phoneNumber: getPhoneNumber(profile) === "Not available" ? "" : getPhoneNumber(profile),
          }}
          validationSchema={ProfileSchema}
          onSubmit={async (values, { setSubmitting, setStatus, resetForm }) => {
            setStatus(undefined);

            if (!userId) {
              setStatus({ error: "User ID is missing. Please sign in again." });
              setSubmitting(false);
              return;
            }

            try {
              const trimmedPhone = values.phoneNumber.trim();
              const payload = {
                userId,
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
                email: values.email.trim(),
                contact: trimmedPhone ? { phoneNo: trimmedPhone } : {},
              };
              const data = await editUser(payload);
              const nextUser = {
                ...(profile ?? {}),
                ...(typeof data?.data === "object" && data?.data ? data.data : {}),
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                contact: {
                  ...(profile?.contact ?? {}),
                  ...(payload.contact ?? {}),
                },
                _id: userId,
              } as AuthSessionUser;

              dispatch(setUser(nextUser));
              setStatus({ success: data?.message ?? "Profile updated successfully" });
              resetForm({ values });
              setIsEditingProfile(false);
            } catch (error) {
              setStatus({ error: ErrorMessage(error, "Profile update failed") });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, status, dirty, resetForm }) => (
            <Form className="grid gap-5 px-7 py-8 sm:px-9 sm:py-9 md:grid-cols-2">
              <CommonInput label="First Name" name="firstName" placeholder="Enter first name" />
              <CommonInput label="Last Name" name="lastName" placeholder="Enter last name" />
              <CommonInput label="Email Address" name="email" type="email" placeholder="you@example.com" />
              <CommonInput label="Phone Number" name="phoneNumber" placeholder="Enter phone number" />

              {status?.error && (
                <p className="rounded-[10px] bg-[#ffecec] px-4 py-3 text-sm text-[#e53935] md:col-span-2">
                  {status.error}
                </p>
              )}
              {status?.success && (
                <p className="rounded-[10px] bg-[#ecfff0] px-4 py-3 text-sm text-[#1b7f3a] md:col-span-2">
                  {status.success}
                </p>
              )}

              <div className="flex flex-wrap gap-3 md:col-span-2">
                <button
                  type="submit"
                  disabled={isSubmitting || isSaving || !dirty}
                  className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting || isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setIsEditingProfile(false);
                  }}
                  className="rounded-full border border-[#d9d9d9] px-6 py-3 text-sm font-semibold text-[#111111] transition hover:border-black"
                >
                  Cancel
                </button>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <div className="grid gap-5 px-7 py-8 sm:px-9 sm:py-9 md:grid-cols-2">
          <div className="rounded-[10px] border border-[#efe7dd] bg-[#faf7f2] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8c8c8c]">First Name</p>
            <p className="mt-3 text-lg font-semibold text-[#111111]">{profile?.firstName || "Not available"}</p>
          </div>
          <div className="rounded-[10px] border border-[#efe7dd] bg-[#faf7f2] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8c8c8c]">Last Name</p>
            <p className="mt-3 text-lg font-semibold text-[#111111]">{profile?.lastName || "Not available"}</p>
          </div>
          <div className="rounded-[10px] border border-[#efe7dd] bg-[#faf7f2] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8c8c8c]">Email Address</p>
            <p className="mt-3 text-lg font-semibold break-all text-[#111111]">
              {profile?.email || "Not available"}
            </p>
          </div>
          <div className="rounded-[10px] border border-[#efe7dd] bg-[#faf7f2] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8c8c8c]">Phone Number</p>
            <p className="mt-3 text-lg font-semibold text-[#111111]">{getPhoneNumber(profile)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileInfoSection;
