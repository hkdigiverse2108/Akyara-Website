import { CloseOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons";
import { Form, Formik } from "formik";
import { type ChangeEvent, type ReactNode, useEffect, useMemo, useState } from "react";
import { ErrorMessage as AppErrorMessage } from "../../Attribute";
import CommonInput from "../../Components/CommonInput";
import { URL_KEYS } from "../../Constants";
import { useAppDispatch } from "../../Store/Hooks";
import { setUser } from "../../Store/Slices/AuthSlice";
import type { AuthSessionUser } from "../../Types";
import { ProfileSchema } from "../../Utils/ValidationSchemas";
import { getInitials, getPhoneNumber } from "./helpers";
import type { ProfileFormValues, ProfileInfoSectionProps } from "./types/index";

const getApiBaseUrl = () => (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

const isAbsoluteImageUrl = (value: string) => /^(https?:\/\/|data:image\/|blob:)/i.test(value);

const buildProfilePhotoCandidates = (value?: string) => {
  const trimmed = typeof value === "string" ? value.trim() : "";
  if (!trimmed) {
    return [] as string[];
  }

  if (isAbsoluteImageUrl(trimmed)) {
    return [trimmed];
  }

  const baseUrl = getApiBaseUrl();
  const normalized = trimmed.replace(/^\/+/, "");
  const candidates: string[] = [];

  if (baseUrl && trimmed.startsWith("/")) {
    candidates.push(`${baseUrl}${trimmed}`);
  }

  if (baseUrl) {
    const queryKeys = ["image", "fileName", "filename", "path", "key", "profilePhoto", "name"];
    for (const key of queryKeys) {
      candidates.push(`${baseUrl}${URL_KEYS.UPLOAD.IMAGE}?${key}=${encodeURIComponent(normalized)}`);
    }

    if (normalized.includes("/")) {
      candidates.push(`${baseUrl}/${normalized}`);
    }
  }

  if (!candidates.length) {
    candidates.push(trimmed);
  }

  return candidates.filter((item, index, arr) => arr.indexOf(item) === index);
};

const getImageIdentifier = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  const queryKeys = ["image", "fileName", "filename", "path", "key", "profilePhoto", "name"];

  try {
    if (isAbsoluteImageUrl(trimmed)) {
      const parsed = new URL(trimmed);
      for (const key of queryKeys) {
        const current = parsed.searchParams.get(key);
        if (current?.trim()) {
          return current.trim();
        }
      }

      const pathPart = parsed.pathname.split("/").filter(Boolean).pop();
      if (pathPart) {
        return pathPart;
      }
    }
  } catch {
    // ignore URL parse errors
  }

  if (trimmed.includes("?")) {
    const query = trimmed.split("?")[1] || "";
    const params = new URLSearchParams(query);
    for (const key of queryKeys) {
      const current = params.get(key);
      if (current?.trim()) {
        return current.trim();
      }
    }
  }

  return trimmed.replace(/^\/+/, "");
};

type ProfileImageProps = {
  value?: string;
  alt: string;
  className: string;
  fallback: ReactNode;
};

const ProfileImage = ({ value, alt, className, fallback }: ProfileImageProps) => {
  const candidates = useMemo(() => buildProfilePhotoCandidates(value), [value]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [value]);

  const currentUrl = candidates[index];

  if (!currentUrl) {
    return <>{fallback}</>;
  }

  return (
    <img
      src={currentUrl}
      alt={alt}
      className={className}
      onError={() => {
        setIndex((prev) => (prev + 1 < candidates.length ? prev + 1 : candidates.length));
      }}
    />
  );
};

const extractUploadedImageValue = (response: unknown) => {
  const pickString = (value: unknown) => (typeof value === "string" && value.trim() ? value.trim() : undefined);

  if (!response || typeof response !== "object") {
    return undefined;
  }

  const root = response as Record<string, unknown>;
  const directRoot =
    pickString(root.image) ??
    pickString(root.url) ??
    pickString(root.path) ??
    pickString(root.location) ??
    pickString(root.key) ??
    pickString(root.fileName) ??
    pickString(root.filename);

  if (directRoot) {
    return directRoot;
  }

  if (typeof root.data === "string") {
    return pickString(root.data);
  }

  if (!root.data || typeof root.data !== "object") {
    return undefined;
  }

  const data = root.data as Record<string, unknown>;
  return (
    pickString(data.image) ??
    pickString(data.url) ??
    pickString(data.path) ??
    pickString(data.location) ??
    pickString(data.key) ??
    pickString(data.fileName) ??
    pickString(data.filename)
  );
};

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
  const dispatch = useAppDispatch();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const profilePhoto = typeof profile?.profilePhoto === "string" ? profile.profilePhoto.trim() : "";

  return (
    <div className="overflow-hidden rounded-[10px] border border-[#ece6db] bg-white shadow-[0_24px_60px_rgba(17,17,17,0.08)]">
      <div className="border-b border-[#efe7dd] bg-[radial-gradient(circle_at_top_left,#fff7ee_0%,#ffffff_48%,#fffaf5_100%)] px-7 py-8 sm:px-9">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.34em] text-[#f6821f]">Overview</p>
            <h2 className="mt-3 text-2xl font-semibold text-[#111111] sm:text-[2rem]">Personal Information</h2>
          </div>
          <div className="flex items-center gap-3">
            {isRefreshing ? (
              <span className="rounded-full bg-[#f7f7f7] px-4 py-2 text-sm font-medium text-[#666666]">
                Refreshing...
              </span>
            ) : null}
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
      </div>

      {isEditingProfile ? (
        <Formik<ProfileFormValues>
          enableReinitialize
          initialValues={{
            firstName: profile?.firstName ?? "",
            lastName: profile?.lastName ?? "",
            email: profile?.email ?? "",
            phoneNumber: getPhoneNumber(profile) === "Not available" ? "" : getPhoneNumber(profile),
            profilePhoto,
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
              const trimmedPhoto = values.profilePhoto.trim();
              const payload = {
                userId,
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
                email: values.email.trim(),
                contact: trimmedPhone ? { phoneNo: trimmedPhone } : {},
                profilePhoto: trimmedPhoto,
              };
              const data = await editUser(payload);
              const responseUser =
                data?.data && typeof data.data === "object" ? (data.data as Partial<AuthSessionUser>) : {};

              const nextUser = {
                ...(profile ?? {}),
                ...responseUser,
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                contact: {
                  ...(profile?.contact ?? {}),
                  ...(payload.contact ?? {}),
                },
                profilePhoto: trimmedPhoto || responseUser.profilePhoto || "",
                _id: userId,
              } as AuthSessionUser;

              dispatch(setUser(nextUser));
              setStatus({ success: data?.message ?? "Profile updated successfully" });
              resetForm({ values });
              setIsEditingProfile(false);
            } catch (error) {
              setStatus({ error: AppErrorMessage(error, "Profile update failed") });
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, status, dirty, resetForm, setFieldValue, setStatus, values }) => {
            const handlePhotoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
              const file = event.currentTarget.files?.[0];
              if (!file) {
                return;
              }

              if (!file.type.startsWith("image/")) {
                setStatus({ error: "Please select a valid image file." });
                event.currentTarget.value = "";
                return;
              }

              try {
                const formData = new FormData();
                formData.append("image", file);
                const uploadResponse = await uploadImage(formData);
                const uploadedImageValue = extractUploadedImageValue(uploadResponse);

                if (!uploadedImageValue) {
                  setStatus({ error: "Image upload response is invalid." });
                  return;
                }

                setFieldValue("profilePhoto", uploadedImageValue);
                setStatus(undefined);
              } catch (error) {
                setStatus({ error: AppErrorMessage(error, "Unable to upload image.") });
              } finally {
                event.currentTarget.value = "";
              }
            };

            const handlePhotoRemove = async () => {
              const currentPhoto = values.profilePhoto.trim();
              if (!currentPhoto) {
                return;
              }

              try {
                const imageIdentifier = getImageIdentifier(currentPhoto);
                await deleteUploadedImage({
                  image: imageIdentifier || currentPhoto,
                  path: imageIdentifier || currentPhoto,
                  key: imageIdentifier || currentPhoto,
                  fileName: imageIdentifier || currentPhoto,
                  filename: imageIdentifier || currentPhoto,
                  profilePhoto: imageIdentifier || currentPhoto,
                });
                setFieldValue("profilePhoto", "");
                setStatus({ success: "Profile image removed. Click Save Changes to update profile." });
              } catch (error) {
                setStatus({ error: AppErrorMessage(error, "Unable to remove image.") });
              }
            };

            return (
              <Form className="grid gap-5 px-7 py-8 sm:px-9 sm:py-9 md:grid-cols-2">
                <div className="md:col-span-2 rounded-[10px] border border-[#efe7dd] bg-[#faf7f2] p-5">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#8c8c8c]">
                    Profile Photo
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <ProfileImage
                      value={values.profilePhoto}
                      alt="Profile preview"
                      className="h-24 w-24 rounded-full border border-[#e6ded2] object-cover"
                      fallback={
                        <div className="inline-grid h-24 w-24 place-items-center rounded-full border border-[#e6ded2] bg-white text-xl font-semibold text-[#777777]">
                          {getInitials(profile)}
                        </div>
                      }
                    />

                    <div className="flex flex-wrap gap-2">
                      <label
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#d9d9d9] px-4 py-2 text-sm font-semibold text-[#111111] transition hover:border-black ${
                          isUploadingImage ? "pointer-events-none opacity-70" : ""
                        }`}
                      >
                        <UploadOutlined />
                        {isUploadingImage ? "Uploading..." : "Upload Photo"}
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                      </label>
                      {values.profilePhoto ? (
                        <button
                          type="button"
                          onClick={handlePhotoRemove}
                          disabled={isDeletingImage}
                          className="rounded-full border border-[#d9d9d9] px-4 py-2 text-sm font-semibold text-[#111111] transition hover:border-black"
                        >
                          {isDeletingImage ? "Removing..." : "Remove"}
                        </button>
                      ) : null}
                    </div>
                  </div>
                </div>

                <CommonInput label="First Name" name="firstName" placeholder="Enter first name" />
                <CommonInput label="Last Name" name="lastName" placeholder="Enter last name" />
                <CommonInput label="Email Address" name="email" type="email" placeholder="you@example.com" />
                <CommonInput label="Phone Number" name="phoneNumber" placeholder="Enter phone number" />

                {status?.error ? (
                  <p className="rounded-[10px] bg-[#ffecec] px-4 py-3 text-sm text-[#e53935] md:col-span-2">
                    {status.error}
                  </p>
                ) : null}
                {status?.success ? (
                  <p className="rounded-[10px] bg-[#ecfff0] px-4 py-3 text-sm text-[#1b7f3a] md:col-span-2">
                    {status.success}
                  </p>
                ) : null}

                <div className="flex flex-wrap gap-3 md:col-span-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || isSaving || isUploadingImage || isDeletingImage || !dirty}
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
            );
          }}
        </Formik>
      ) : (
        <div className="grid gap-5 px-7 py-8 sm:px-9 sm:py-9 md:grid-cols-2">
          <div className="md:col-span-2 rounded-[10px] border border-[#efe7dd] bg-[#faf7f2] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8c8c8c]">Profile Photo</p>
            <div className="mt-3 flex items-center gap-4">
              <ProfileImage
                value={profilePhoto}
                alt="Profile"
                className="h-24 w-24 rounded-full border border-[#e6ded2] object-cover"
                fallback={
                  <div className="inline-grid h-24 w-24 place-items-center rounded-full border border-[#e6ded2] bg-white text-xl font-semibold text-[#777777]">
                    {getInitials(profile)}
                  </div>
                }
              />
              <p className="text-sm font-medium text-[#555555]">
                {profilePhoto ? "Profile photo uploaded" : "No profile photo uploaded"}
              </p>
            </div>
          </div>

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
            <p className="mt-3 break-all text-lg font-semibold text-[#111111]">
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
