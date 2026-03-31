import { Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { Mutations } from "../../Api/Mutations";
import { ErrorMessage } from "../../Attribute";
import AuthShell from "../../Components/AuthShell";
import CommonInput from "../../Components/CommonInput";
import { SignupSchema } from "../../Utils/ValidationSchemas";
const Signup = () => {
  const navigate = useNavigate();
  const signupMutation = Mutations.useSignup();

  return (
    <AuthShell title="Create Account" subtitle="Sign up to unlock deals and track your orders." footer={<span>  Already have an account?{" "}  <Link className="font-semibold text-black" to="/login">    Sign in  </Link></span>}>
      <Formik
        initialValues={{firstName: "",lastName: "",email: "",phoneNumber: "",password: "",confirmPassword: "",}}
        validationSchema={SignupSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          setStatus(undefined);
          try {
            const payload = {firstName: values.firstName || undefined,lastName: values.lastName || undefined,email: values.email,phoneNumber: values.phoneNumber,password: values.password,};
            const data = await signupMutation.mutateAsync(payload);
            setStatus({ success: data?.message ?? "Signup successful. Check your email for OTP." });
            navigate(`/verify-otp?email=${encodeURIComponent(values.email)}`);
          } catch (error) {
            setStatus({ error: ErrorMessage(error, "Signup failed") });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <CommonInput label="First name" name="firstName" placeholder="Optional" />
              <CommonInput label="Last name" name="lastName" placeholder="Optional" />
            </div>
            <CommonInput label="Email" name="email" type="email" placeholder="you@example.com" />
            <CommonInput label="Phone number" name="phoneNumber" placeholder="Enter phone number" />
            <CommonInput label="Password" name="password" type="password" placeholder="Create a password" />
            <CommonInput label="Confirm password" name="confirmPassword" type="password" placeholder="Re-enter password" />

            {status?.error && <p className="rounded-[10px] bg-[#ffecec] px-3 py-2 text-sm text-[#e53935]">{status.error}</p>}
            {status?.success && <p className="rounded-[10px] bg-[#ecfff0] px-3 py-2 text-sm text-[#1b7f3a]">{status.success}</p>}

            <button
              type="submit"
              disabled={isSubmitting || signupMutation.isPending}
              className="mt-2 rounded-full bg-black py-3 text-sm font-semibold text-white transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting || signupMutation.isPending ? "Creating..." : "Create Account"}
            </button>
          </Form>
        )}
      </Formik>
    </AuthShell>
  );
};

export default Signup;
