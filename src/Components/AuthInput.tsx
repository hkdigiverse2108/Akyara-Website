import { ErrorMessage, Field } from "formik";
import type { AuthInputProps } from "../Types";


const AuthInput = ({ label, name, type = "text", placeholder }: AuthInputProps) => {
  return (
    <label className="grid gap-2 text-sm font-medium text-[#111111]">{label}
      <Field name={name}type={type}placeholder={placeholder}className="w-full rounded-[12px] border border-[#e1e1e1] px-4 py-3 text-sm text-[#2b2b2b] placeholder:text-[#b7b7b7] outline-none transition focus:border-black"/>
      <ErrorMessage name={name} component="span" className="text-xs text-[#e53935]" />
    </label>
  );
};

export default AuthInput;
