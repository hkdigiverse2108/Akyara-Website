import { Form, Formik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { Mutations } from "../../Api/Mutations";
import { ErrorMessage } from "../../Attribute";
import CommonInput from "../../Components/CommonInput";
import AuthShell from "../../Components/AuthShell";
import { useAppDispatch } from "../../Store/Hooks";
import { setSignin } from "../../Store/Slices/AuthSlice";
import { SigninSchema } from "../../Utils/ValidationSchemas";
import { ROUTES } from "../../Constants";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const signinMutation = Mutations.useSignin();

  return (
    <AuthShell title="Welcome Back" subtitle="Log in to continue your shopping experience." footer={<span>Don&apos;t have an account?{" "}<Link className="font-semibold text-black" to={ROUTES.AUTH.SIGNUP}>Create one</Link></span>}>
      <Formik initialValues={{ email: "", password: "" }} validationSchema={SigninSchema} onSubmit={async (values, { setSubmitting, setStatus }) => {setStatus(undefined);
        try {
          const data = await signinMutation.mutateAsync(values);
          const token = data?.data?.token ?? (typeof data?.token === "string" ? data.token : undefined);
          if (token) {
            dispatch(setSignin({  ...(data?.data ?? {}),  email: data?.data?.email ?? values.email,  token,}));
          }
          setStatus({ success: data?.message ?? "Login successful" });
          navigate(ROUTES.HOME);
        } catch (error) {
          setStatus({ error: ErrorMessage(error, "Login failed") });
        } finally {
          setSubmitting(false);
        }
      }}
      >
        {({ isSubmitting, status }) => (
          <Form className="grid gap-4">
            <CommonInput label="Email" name="email" type="email" placeholder="you@example.com" />
            <CommonInput label="Password" name="password" type="password" placeholder="Enter password" />

            <div className="text-right">
              <Link className="text-sm font-semibold text-black" to="/forgot-password">Forgot password?</Link>
            </div>

            {status?.error && <p className="rounded-[10px] bg-[#ffecec] px-3 py-2 text-sm text-[#e53935]">{status.error}</p>}
            {status?.success && <p className="rounded-[10px] bg-[#ecfff0] px-3 py-2 text-sm text-[#1b7f3a]">{status.success}</p>}
            <button type="submit" disabled={isSubmitting || signinMutation.isPending} className="mt-2 rounded-full bg-black py-3 text-sm font-semibold text-white transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-70">{isSubmitting || signinMutation.isPending ? "Signing in..." : "Sign In"}</button>
          </Form>
        )}
      </Formik>
    </AuthShell>
  );
};

export default Login;
