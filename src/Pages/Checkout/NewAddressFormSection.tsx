import { Field, useFormikContext } from "formik";
import { CommonInput } from "../../Components";
import type { CheckoutFormValues } from "../../Types";

type NewAddressFormSectionProps = {
  isAuthenticated: boolean;
};

const NewAddressFormSection = ({ isAuthenticated }: NewAddressFormSectionProps) => {
  const { values } = useFormikContext<CheckoutFormValues>();

  if (isAuthenticated && values.addressId) return null;

  return (
    <>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <CommonInput label="Country" name="country" placeholder="Enter country" />
        <CommonInput label="State" name="state" placeholder="Enter state" />
        <CommonInput label="City" name="city" placeholder="Enter city" />
        <CommonInput label="PIN Code" name="zipCode" placeholder="Enter PIN code" />
      </div>

      <div className="mt-4 grid gap-4">
        <CommonInput
          label="Address"
          name="address1"
          placeholder="House no, street, apartment"
        />
        <CommonInput
          label="Address Line 2 (optional)"
          name="address2"
          placeholder="Area, locality, landmark"
        />

        <label className="inline-flex items-center gap-3 rounded-[14px] border border-[#e8edf4] bg-[#fbfcfe] px-4 py-3 text-sm font-medium text-[#111111]">
          <Field
            type="checkbox"
            name="isDefault"
            className="h-4 w-4 rounded border-[#cbd5e1] text-[#ef6b4a]"
          />
          Set as default address
        </label>
      </div>
    </>
  );
};

export default NewAddressFormSection;
