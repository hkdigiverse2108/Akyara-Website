import { LockOutlined, SafetyOutlined } from "@ant-design/icons";
import { Form, Formik } from "formik";
import { ErrorMessage as AppErrorMessage } from "../../Attribute";
import { Mutations } from "../../Api/Mutations";
import CommonInput from "../../Components/CommonInput";
import { ChangePasswordSchema } from "../../Utils/ValidationSchemas";
import type { ChangePasswordFormValues } from "../../Types";

const ProfileChangePasswordSection = () => {
  const changePasswordMutation = Mutations.useChangePassword();

  return (
    <div className="overflow-hidden rounded-[14px] border border-[#e6ebf1] bg-white shadow-[0_24px_56px_rgba(15,23,42,0.08)] sm:rounded-[16px]">
      <div className="border-b border-[#e6ebf1] bg-white px-4 py-4 sm:px-5 sm:py-5 lg:px-7 lg:py-6">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#ef6b4a]">Security</p>
        <h2 className="mt-2 text-lg font-semibold text-[#0f172a] sm:mt-2.5 sm:text-2xl lg:text-[2rem]">Change Password</h2>
        <p className="mt-2 text-sm text-[#5b6472]"> Update your account password to keep your account secure.</p>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <div className="inline-flex items-center gap-2 rounded-[10px] border border-[#e8edf4] bg-white px-3 py-2 text-xs font-medium text-[#4b5563]">
            <LockOutlined className="text-[#ef6b4a]" />Use at least 6 characters
          </div>
          <div className="inline-flex items-center gap-2 rounded-[10px] border border-[#e8edf4] bg-white px-3 py-2 text-xs font-medium text-[#4b5563]">
            <SafetyOutlined className="text-[#ef6b4a]" />Keep a unique password
          </div>
        </div>
      </div>

      <Formik<ChangePasswordFormValues> initialValues={{ currentPassword: "", newPassword: "", confirmNewPassword: "" }} validationSchema={ChangePasswordSchema} onSubmit={async (values, { setSubmitting, setStatus, resetForm }) => {
          setStatus(undefined);
          try {
            const data = await changePasswordMutation.mutateAsync({currentPassword: values.currentPassword,newPassword: values.newPassword,confirmNewPassword: values.confirmNewPassword,});
            setStatus({ success: data?.message ?? "Password changed successfully." });
            resetForm();
          } catch (error) {
            setStatus({ error: AppErrorMessage(error, "Unable to change password.") });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status, dirty, resetForm }) => (
          <Form className="grid gap-4 px-4 py-5 sm:gap-5 sm:px-5 sm:py-6 lg:px-7 lg:py-7">
            <CommonInput label="Current Password" name="currentPassword" type="password" placeholder="Enter current password"/>
            <CommonInput label="New Password" name="newPassword" type="password" placeholder="Enter new password"/>
            <CommonInput label="Confirm New Password" name="confirmNewPassword" type="password" placeholder="Re-enter new password"/>

            {status?.error ? (<p className="rounded-[10px] bg-[#ffecec] px-4 py-3 text-sm text-[#e53935]">{status.error}</p>) : null}
            {status?.success ? (<p className="rounded-[10px] bg-[#ecfff0] px-4 py-3 text-sm text-[#1b7f3a]">{status.success}</p>) : null}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button type="submit" disabled={isSubmitting || changePasswordMutation.isPending || !dirty} className="w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto">{isSubmitting || changePasswordMutation.isPending ? "Updating..." : "Update Password"}</button>
              <button type="button" onClick={() => {   resetForm(); }} className="w-full rounded-full border border-[#d9d9d9] px-6 py-3 text-sm font-semibold text-[#111111] transition hover:border-black sm:w-auto">Reset</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProfileChangePasswordSection;
