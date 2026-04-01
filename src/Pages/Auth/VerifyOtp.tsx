import { Form, Formik } from "formik";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mutations } from "../../Api/Mutations";
import { ErrorMessage } from "../../Attribute";
import AuthShell from "../../Components/AuthShell";
import CommonInput from "../../Components/CommonInput";
import { VerifyOtpSchema } from "../../Utils/ValidationSchemas";
import { ROUTES } from "../../Constants";
import { useAppDispatch } from "../../Store/Hooks";
import { setSignin } from "../../Store/Slices/AuthSlice";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [params] = useSearchParams();
  const emailParam = params.get("email") ?? "";
  const verifyOtpMutation = Mutations.useVerifyOtp();

  return (
    <AuthShell title="Verify OTP" subtitle="Enter the OTP sent to your email." footer={<span>  Already verified?{" "}  <Link className="font-semibold text-black" to={ROUTES.AUTH.LOGIN}>    Sign in  </Link></span>}>
      <Formik enableReinitialize initialValues={{ email: emailParam, otp: "" }} validationSchema={VerifyOtpSchema} onSubmit={async (values, { setSubmitting, setStatus }) => {
          setStatus(undefined);
          try {
            const data = await verifyOtpMutation.mutateAsync({ email: values.email, otp: values.otp });
            const token = data?.data?.token ?? (typeof data?.token === "string" ? data.token : undefined);
            if (token) {
              dispatch(setSignin({...(data?.data ?? {}),email: data?.data?.email ?? values.email,token,}));
            }
            setStatus({ success: data?.message ?? "OTP verified successfully" });
            navigate(ROUTES.HOME);
          } catch (error) {
            setStatus({ error: ErrorMessage(error, "OTP verification failed") });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form className="grid gap-4">
            <CommonInput label="Email" name="email" type="email" placeholder="you@example.com" />
            <CommonInput label="OTP" name="otp" placeholder="Enter 6-digit OTP" />

            {status?.error && <p className="rounded-[10px] bg-[#ffecec] px-3 py-2 text-sm text-[#e53935]">{status.error}</p>}
            {status?.success && <p className="rounded-[10px] bg-[#ecfff0] px-3 py-2 text-sm text-[#1b7f3a]">{status.success}</p>}
            <button type="submit" disabled={isSubmitting || verifyOtpMutation.isPending}className="mt-2 rounded-full bg-black py-3 text-sm font-semibold text-white transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting || verifyOtpMutation.isPending ? "Verifying..." : "Verify OTP"}</button>
          </Form>
        )}
      </Formik>
    </AuthShell>
  );
};

export default VerifyOtp;
