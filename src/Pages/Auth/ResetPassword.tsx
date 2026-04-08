import { Form, Formik } from "formik";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mutations } from "../../Api/Mutations";
import { ErrorMessage } from "../../Attribute/Notification";
import { AuthShell, CommonInput } from "../../Components";
import { ResetPasswordSchema } from "../../Utils/ValidationSchemas";
import { ROUTES } from "../../Constants";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const emailParam = params.get("email") ?? "";
  const resetPasswordMutation = Mutations.useResetPassword();
  const verifyOtpMutation = Mutations.useVerifyOtp();

  return (
    <AuthShell title="Reset Password" subtitle="Enter the OTP and set a new password." footer={<span> Back to{" "}<Link className="font-semibold text-black" to={ROUTES.AUTH.LOGIN}>Sign in</Link></span>}>
      <Formik enableReinitialize initialValues={{ email: emailParam, otp: "", password: "", confirmPassword: "" }} validationSchema={ResetPasswordSchema} onSubmit={async (values, { setSubmitting, setStatus }) => {
        setStatus(undefined);
          try {
            const payload = {email: values.email,otp: values.otp,password: values.password,};
             let data;
            try {
              data = await resetPasswordMutation.mutateAsync(payload);
            } catch (error) {
              const message = ErrorMessage(error, "Reset failed");
              if (message !== "Error in reset password!") throw error;

              await verifyOtpMutation.mutateAsync({email: values.email,otp: values.otp,});
              data = await resetPasswordMutation.mutateAsync(payload);
            }
            setStatus({ success: data?.message ?? "Password reset successful" });
            navigate(ROUTES.AUTH.LOGIN);
          } catch (error) {
            setStatus({ error: ErrorMessage(error, "Reset failed") });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form className="grid gap-4">
            <CommonInput label="Email" name="email" type="email" placeholder="you@example.com" />
            <CommonInput label="OTP" name="otp" placeholder="Enter OTP" />
            <CommonInput label="New password" name="password" type="password" placeholder="Create a new password" />
            <CommonInput label="Confirm password" name="confirmPassword" type="password" placeholder="Re-enter password" />

            {status?.error && <p className="rounded-[10px] bg-[#ffecec] px-3 py-2 text-sm text-[#e53935]">{status.error}</p>}
            {status?.success && <p className="rounded-[10px] bg-[#ecfff0] px-3 py-2 text-sm text-[#1b7f3a]">{status.success}</p>}
            <button type="submit"disabled={isSubmitting || resetPasswordMutation.isPending}className="mt-2 rounded-full bg-black py-3 text-sm font-semibold text-white transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting || resetPasswordMutation.isPending ? "Resetting..." : "Reset Password"}</button>
          </Form>
        )}
      </Formik>
    </AuthShell>
  );
};

export default ResetPassword;
