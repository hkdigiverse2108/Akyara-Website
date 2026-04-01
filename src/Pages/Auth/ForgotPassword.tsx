import { Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { Mutations } from "../../Api/Mutations";
import { ErrorMessage } from "../../Attribute";
import AuthShell from "../../Components/AuthShell";
import CommonInput from "../../Components/CommonInput";
import { ForgotPasswordSchema } from "../../Utils/ValidationSchemas";
import { ROUTES } from "../../Constants";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const forgotPasswordMutation = Mutations.useForgotPassword();

  return (
    <AuthShell title="Forgot Password" subtitle="We’ll send an OTP to reset your password." footer={<span>Remembered your password?{" "}<Link className="font-semibold text-black" to={ROUTES.AUTH.LOGIN}>Sign in</Link></span>}>
      <Formik initialValues={{ email: "" }} validationSchema={ForgotPasswordSchema} onSubmit={async (values, { setSubmitting, setStatus }) => {setStatus(undefined);
          try {
            const data = await forgotPasswordMutation.mutateAsync({ email: values.email });
            setStatus({ success: data?.message ?? "OTP sent to your email." });
            navigate(`${ROUTES.AUTH.RESET_PASSWORD}?email=${encodeURIComponent(values.email)}`);
          } catch (error) {
            setStatus({ error: ErrorMessage(error, "Request failed") });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form className="grid gap-4">
            <CommonInput label="Email" name="email" type="email" placeholder="you@example.com" />

            {status?.error && <p className="rounded-[10px] bg-[#ffecec] px-3 py-2 text-sm text-[#e53935]">{status.error}</p>}
            {status?.success && <p className="rounded-[10px] bg-[#ecfff0] px-3 py-2 text-sm text-[#1b7f3a]">{status.success}</p>}
            <button type="submit" disabled={isSubmitting || forgotPasswordMutation.isPending} className="mt-2 rounded-full bg-black py-3 text-sm font-semibold text-white transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting || forgotPasswordMutation.isPending ? "Sending..." : "Send OTP"}</button>
          </Form>
        )}
      </Formik>
    </AuthShell>
  );
};

export default ForgotPassword;
