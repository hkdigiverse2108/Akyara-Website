import { Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { Mutations } from "../../Api/Mutations";
import { ErrorMessage } from "../../Attribute";
import AuthShell from "../../Components/AuthShell";
import CommonInput from "../../Components/CommonInput";
import PhoneInputWithCountryCode from "../../Components/PhoneInputWithCountryCode";
import { ROUTES } from "../../Constants";
import { useAppDispatch } from "../../Store/Hooks";
import { setSignin } from "../../Store/Slices/AuthSlice";
import { SignupSchema } from "../../Utils/ValidationSchemas";
const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const signupMutation = Mutations.useSignup();

  return (
    <AuthShell title="Create Account" subtitle="Sign up to unlock deals and track your orders." footer={<span>  Already have an account?{" "}  <Link className="font-semibold text-black" to={ROUTES.AUTH.LOGIN}>    Sign in  </Link></span>}>
      <Formik initialValues={{firstName: "",lastName: "",email: "",countryCode: "+91",phoneNumber: "",password: "",confirmPassword: "",}} validationSchema={SignupSchema} onSubmit={async (values, { setSubmitting, setStatus }) => {
          setStatus(undefined);
          try {
            const payload = {firstName: values.firstName.trim(),lastName: values.lastName.trim(),email: values.email,contact: {countryCode: values.countryCode,phoneNo: values.phoneNumber.replace(/\D/g, ""),},password: values.password,role: "user",};
            const data = await signupMutation.mutateAsync(payload);
            const token = data?.data?.token ?? (typeof data?.token === "string" ? data.token : undefined);
            if (token) {
              dispatch(setSignin({...(data?.data ?? {}),firstName: data?.data?.firstName ?? payload.firstName,lastName: data?.data?.lastName ?? payload.lastName,email: data?.data?.email ?? payload.email,token,}));
            }
            setStatus({ success: data?.message ?? "Signup successful" });
            navigate(ROUTES.HOME);
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
              <CommonInput label="First name" name="firstName" placeholder="Enter first name" />
              <CommonInput label="Last name" name="lastName" placeholder="Enter last name" />
            </div>
            <CommonInput label="Email" name="email" type="email" placeholder="you@example.com" />
            <PhoneInputWithCountryCode label="Phone number" countryCodeName="countryCode" phoneNumberName="phoneNumber" placeholder="Enter phone number"/>
            <CommonInput label="Password" name="password" type="password" placeholder="Create a password" />
            <CommonInput label="Confirm password" name="confirmPassword" type="password" placeholder="Re-enter password" />

            {status?.error && <p className="rounded-[10px] bg-[#ffecec] px-3 py-2 text-sm text-[#e53935]">{status.error}</p>}
            {status?.success && <p className="rounded-[10px] bg-[#ecfff0] px-3 py-2 text-sm text-[#1b7f3a]">{status.success}</p>}
            <button type="submit" disabled={isSubmitting || signupMutation.isPending} className="mt-2 rounded-full bg-black py-3 text-sm font-semibold text-white transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting || signupMutation.isPending ? "Creating..." : "Create Account"}</button>
          </Form>
        )}
      </Formik>
    </AuthShell>
  );
};

export default Signup;
