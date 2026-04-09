import { ErrorMessage, Field, useField } from "formik";
import { Select } from "antd";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";

const regionNames =
  typeof Intl !== "undefined" && typeof Intl.DisplayNames !== "undefined"
    ? new Intl.DisplayNames(["en"], { type: "region" })
    : null;

const countryCodeOptions = getCountries()
  .map((country) => {
    const dialCode = `+${getCountryCallingCode(country)}`; const countryName = regionNames?.of(country) ?? country;

    return { value: dialCode, label: `${countryName} (${dialCode})`, };
  })
  .sort((left, right) => left.label.localeCompare(right.label));

const fieldClassName =
  "w-full rounded-[12px] border border-[#e1e1e1] bg-white px-4 py-2 text-sm text-[#2b2b2b] placeholder:text-[#b7b7b7] outline-none transition focus:border-black disabled:cursor-not-allowed disabled:bg-[#f6f6f6]";

const PhoneInputWithCountryCode = ({ label, countryCodeName, phoneNumberName, placeholder, className }: { label: string; countryCodeName: string; phoneNumberName: string; placeholder?: string; className?: string; }) => {
  const [countryCodeField, countryCodeMeta, countryCodeHelpers] = useField<string>(countryCodeName);

  return (
    <div className={`grid gap-2 text-sm font-medium text-[#111111] ${className ?? ""}`}>
      <span>{label}</span>
      <div className="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)]">
        <div className="grid gap-2">
          <Select showSearch value={countryCodeField.value} options={countryCodeOptions} optionFilterProp="label" popupMatchSelectWidth={320} popupClassName="country-code-dropdown" className={`country-code-select ${countryCodeMeta.touched && countryCodeMeta.error ? "country-code-select--error" : ""}`} placeholder="Select code" onChange={(value) => countryCodeHelpers.setValue(value)} onBlur={() => countryCodeHelpers.setTouched(true)} filterOption={(inputValue, option) => String(option?.label ?? "").toLowerCase().includes(inputValue.toLowerCase())} getPopupContainer={(triggerNode) => triggerNode.parentElement ?? document.body} />
          <ErrorMessage name={countryCodeName} component="span" className="text-xs text-[#e53935]" />
        </div>

        <div className="grid gap-2">
          <Field name={phoneNumberName} type="tel" inputMode="numeric" placeholder={placeholder} className={fieldClassName}
          />
          <ErrorMessage name={phoneNumberName} component="span" className="text-xs text-[#e53935]" />
        </div>
      </div>
    </div>
  );
};

export default PhoneInputWithCountryCode;
