import { Select } from "antd";
import { ErrorMessage, useField } from "formik";
import type { AddressSelectFieldProps } from "../../../Types";


const AddressSelectField = ({
  label,
  name,
  options,
  placeholder,
  disabled,
  loading,
  className,
}: AddressSelectFieldProps) => {
  const [field, meta, helpers] = useField<string>(name);

  return (
    <div className={`grid gap-2 text-sm font-medium text-[#111111] ${className ?? ""}`}>
      <span className="leading-6 text-[#111111]">{label}</span>
      <Select showSearch allowClear value={field.value || undefined} options={options} disabled={disabled} loading={loading} placeholder={placeholder} optionFilterProp="label" popupClassName="profile-form-dropdown" className={`profile-form-select ${meta.touched && meta.error ? "profile-form-select--error" : ""}`} onChange={(value) => helpers.setValue(value ?? "")} onBlur={() => helpers.setTouched(true)} filterOption={(inputValue, option) =>   String(option?.label ?? "")     .toLowerCase()     .includes(inputValue.toLowerCase()) } getPopupContainer={(triggerNode) => triggerNode.parentElement ?? document.body}/>
      <ErrorMessage name={name} component="span" className="text-xs text-[#e53935]" />
    </div>
  );
};

export default AddressSelectField;
