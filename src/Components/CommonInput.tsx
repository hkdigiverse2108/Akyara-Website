import { ErrorMessage, Field } from "formik";

type CommonInputProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

const CommonInput = ({ label, name, type = "text", placeholder, disabled, className }: CommonInputProps) => {
  return (
    <label className={`grid gap-2 text-sm font-medium text-[#111111] ${className ?? ""}`}>
      {label}
      <Field
        name={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-[12px] border border-[#e1e1e1] px-4 py-3 text-sm text-[#2b2b2b] placeholder:text-[#b7b7b7] outline-none transition focus:border-black disabled:cursor-not-allowed disabled:bg-[#f6f6f6]"
      />
      <ErrorMessage name={name} component="span" className="text-xs text-[#e53935]" />
    </label>
  );
};

export default CommonInput;
