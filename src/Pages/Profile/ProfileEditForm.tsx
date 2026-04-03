import { UploadOutlined } from "@ant-design/icons";
import { Form, Formik } from "formik";
import { type ChangeEvent } from "react";
import { ErrorMessage as AppErrorMessage } from "../../Attribute";
import CommonInput from "../../Components/CommonInput";
import { useAppDispatch } from "../../Store/Hooks";
import { setUser } from "../../Store/Slices/AuthSlice";
import type { AuthSessionUser } from "../../Types";
import { ProfileSchema } from "../../Utils/ValidationSchemas";
import { getInitials, getPhoneNumber } from "./helpers";
import { buildProfilePhotoCandidates, extractUploadedImageValue, getImageIdentifier, isAbsoluteImageUrl, ProfileImage,} from "./profileImageUtils";
import type { ProfileEditFormProps, ProfileFormValues } from "../../Types";

const ProfileEditForm = ({ profile, userId, profilePhoto, isSaving, isUploadingImage, isDeletingImage, editUser, uploadImage, deleteUploadedImage, onClose,}: ProfileEditFormProps) => {
  const dispatch = useAppDispatch();

  return (
    <Formik<ProfileFormValues> enableReinitialize initialValues={{   firstName: profile?.firstName ?? "",   lastName: profile?.lastName ?? "",   email: profile?.email ?? "",   phoneNumber: getPhoneNumber(profile) === "Not available" ? "" : getPhoneNumber(profile),   profilePhoto, }} validationSchema={ProfileSchema} onSubmit={async (values, { setSubmitting, setStatus, resetForm }) => { setStatus(undefined);
        if (!userId) {
          setStatus({ error: "User ID is missing. Please sign in again." });
          setSubmitting(false);
          return;
        }

        try {
          const trimmedPhone = values.phoneNumber.trim();
          const trimmedPhoto = values.profilePhoto.trim();
          const payload = {userId,firstName: values.firstName.trim(),lastName: values.lastName.trim(),email: values.email.trim(),contact: trimmedPhone ? { phoneNo: trimmedPhone } : {},profilePhoto: trimmedPhoto,};
          const data = await editUser(payload);
          const responseUser = data?.data && typeof data.data === "object" ? (data.data as Partial<AuthSessionUser>) : {};
          const nextUser = {...(profile ?? {}),...responseUser,firstName: payload.firstName,lastName: payload.lastName,email: payload.email,contact: {  ...(profile?.contact ?? {}),  ...(payload.contact ?? {}),},profilePhoto: trimmedPhoto || responseUser.profilePhoto || "",_id: userId,} as AuthSessionUser;

          dispatch(setUser(nextUser));
          setStatus({ success: data?.message ?? "Profile updated successfully" });
          resetForm({ values });
          onClose();
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
          if (!file) { return;}
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
          if (!currentPhoto) {return;}

          try {
            const resolvedUrl = buildProfilePhotoCandidates(currentPhoto)[0] || "";
            const imageIdentifier = getImageIdentifier(currentPhoto);
            const imagePathValue = currentPhoto || imageIdentifier;
            const imageUrlValue = isAbsoluteImageUrl(currentPhoto) ? currentPhoto : resolvedUrl;

            await deleteUploadedImage({imagePath: imagePathValue,imageUrl: imageUrlValue,path: imagePathValue,url: imageUrlValue,image: imagePathValue,key: imageIdentifier || imagePathValue,fileName: imageIdentifier || imagePathValue,filename: imageIdentifier || imagePathValue,profilePhoto: imagePathValue,});
            setFieldValue("profilePhoto", "");
            setStatus({ success: "Profile image removed. Click Save Changes to update profile." });
          } catch (error) {
            setStatus({ error: AppErrorMessage(error, "Unable to remove image.") });
          }
        };

        return (
          <Form className="grid gap-4 px-4 py-5 sm:gap-5 sm:px-5 sm:py-6 lg:grid-cols-2 lg:px-7 lg:py-7">
            <div className="lg:col-span-2 rounded-[10px] border border-[#e8edf4] bg-white p-4 sm:p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[#8c8c8c]">Profile Photo</p>
              <div className="flex flex-wrap items-center gap-4">
                <ProfileImage value={values.profilePhoto} alt="Profile preview" className="h-20 w-20 rounded-full border border-[#dbe1eb] object-cover sm:h-24 sm:w-24" fallback={<div className="inline-grid h-20 w-20 place-items-center rounded-full border border-[#dbe1eb] bg-white text-lg font-semibold text-[#777777] sm:h-24 sm:w-24 sm:text-xl"> {getInitials(profile)}</div>}/>
                <div className="flex flex-wrap gap-2">
                  <label className={`inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#d9d9d9] px-4 py-2 text-sm font-semibold text-[#111111] transition hover:border-black ${isUploadingImage ? "pointer-events-none opacity-70" : ""}`}>
                    <UploadOutlined />
                    {isUploadingImage ? "Uploading..." : "Upload Photo"}
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                  {values.profilePhoto ? (
                    <button type="button" onClick={handlePhotoRemove} disabled={isDeletingImage} className="rounded-full border border-[#d9d9d9] px-4 py-2 text-sm font-semibold text-[#111111] transition hover:border-black">{isDeletingImage ? "Removing..." : "Remove"}</button>
                  ) : null}
                </div>
              </div>
            </div>

            <CommonInput label="First Name" name="firstName" placeholder="Enter first name" />
            <CommonInput label="Last Name" name="lastName" placeholder="Enter last name" />
            <CommonInput label="Email Address" name="email" type="email" placeholder="you@example.com" />
            <CommonInput label="Phone Number" name="phoneNumber" placeholder="Enter phone number" />

            {status?.error ? (<p className="rounded-[10px] bg-[#ffecec] px-4 py-3 text-sm text-[#e53935] lg:col-span-2">{status.error}</p>) : null}
            {status?.success ? (<p className="rounded-[10px] bg-[#ecfff0] px-4 py-3 text-sm text-[#1b7f3a] lg:col-span-2">{status.success}</p>) : null}

            <div className="flex flex-col gap-3 sm:flex-row lg:col-span-2">
              <button type="submit" disabled={isSubmitting || isSaving || isUploadingImage || isDeletingImage || !dirty} className="w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto">{isSubmitting || isSaving ? "Saving..." : "Save Changes"}</button>
              <button type="button" onClick={() => {   resetForm();   onClose(); }} className="w-full rounded-full border border-[#d9d9d9] px-6 py-3 text-sm font-semibold text-[#111111] transition hover:border-black sm:w-auto">Cancel</button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default ProfileEditForm;
