import { ErrorMessage, Field } from "formik";

type AddressTextFieldProps = {label: string;name: string;placeholder?: string;disabled?: boolean;className?: string;};

const AddressTextField = ({label,name,placeholder,disabled,className,}: AddressTextFieldProps) => {
  return (
    <label className={`grid gap-2 text-sm font-medium text-[#111111] ${className ?? ""}`}>
      {label}
      <Field
        name={name}
        type="text"
        placeholder={placeholder}
        disabled={disabled}
        className="address-location-input w-full"
      />
      <ErrorMessage name={name} component="span" className="text-xs text-[#e53935]" />
    </label>
  );
};

export default AddressTextField;
