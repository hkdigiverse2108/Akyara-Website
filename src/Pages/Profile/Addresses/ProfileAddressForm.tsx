import { ArrowLeftOutlined } from "@ant-design/icons";
import { ErrorMessage as FormikErrorMessage, Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import CommonInput from "../../../Components/CommonInput";
import { ROUTES } from "../../../Constants";
import { useAppSelector } from "../../../Store/Hooks";
import type { AddressFormValues } from "../../../Types";
import { AddressSchema } from "../../../Utils/ValidationSchemas";
import { createAddressFormValues, getAddressFormValues, getLocalAddressById, saveLocalAddress } from "./addressUtils";
import { getPhoneNumber } from "../Shared";

type ProfileAddressFormProps = {
  mode: "add" | "edit";
  addressId?: string;
};

const ProfileAddressForm = ({ mode, addressId }: ProfileAddressFormProps) => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const addressOwnerId = typeof user?._id === "string" ? user._id : user?.email ?? "";
  const isEditing = mode === "edit";
  const selectedAddress = isEditing ? getLocalAddressById(addressId, addressOwnerId) : null;
  const savedPhoneNumber = getPhoneNumber(user);
  const defaultFormValues = createAddressFormValues({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    mobileNumber: savedPhoneNumber === "Not available" ? "" : savedPhoneNumber,
  });

  const goBack = () => navigate(ROUTES.ACCOUNT.ADDRESSES);

  if (isEditing && !addressId) {
    return (
      <div className="overflow-hidden rounded-[14px] border border-[#e6ebf1] bg-white shadow-[0_24px_56px_rgba(15,23,42,0.08)] sm:rounded-[16px]">
        <div className="grid gap-4 px-4 py-6 sm:px-5 lg:px-7 lg:py-8">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d9e0eb] bg-white px-4 py-2 text-sm font-semibold text-[#111827] transition hover:border-[#111827]"
          >
            <ArrowLeftOutlined /> Back to Address Book
          </button>
          <div className="rounded-[12px] border border-dashed border-[#d9e0eb] bg-[#fafbfd] px-5 py-8 text-center text-sm text-[#5b6472]">
            Address ID missing che. Please try again from the address list.
          </div>
        </div>
      </div>
    );
  }

  if (isEditing && !selectedAddress) {
    return (
      <div className="overflow-hidden rounded-[14px] border border-[#e6ebf1] bg-white shadow-[0_24px_56px_rgba(15,23,42,0.08)] sm:rounded-[16px]">
        <div className="grid gap-4 px-4 py-6 sm:px-5 lg:px-7 lg:py-8">
          <button
            type="button"
            onClick={goBack}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d9e0eb] bg-white px-4 py-2 text-sm font-semibold text-[#111827] transition hover:border-[#111827]"
          >
            <ArrowLeftOutlined /> Back to Address Book
          </button>
          <div className="rounded-[12px] border border-dashed border-[#d9e0eb] bg-[#fafbfd] px-5 py-8 text-center text-sm text-[#5b6472]">
            Selected address mali nathi. Please open edit from the saved address list again.
          </div>
        </div>
      </div>
    );
  }

  const initialValues = isEditing
    ? getAddressFormValues(selectedAddress, defaultFormValues)
    : createAddressFormValues(defaultFormValues);

  return (
    <div className="overflow-hidden rounded-[14px] border border-[#e6ebf1] bg-white shadow-[0_24px_56px_rgba(15,23,42,0.08)] sm:rounded-[16px]">
      <div className="border-b border-[#e6ebf1] bg-white px-4 py-4 sm:px-5 sm:py-5 lg:px-7 lg:py-6">
        <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#ef6b4a]">Addresses</p>
            <h2 className="mt-2 text-lg font-semibold text-[#0f172a] sm:mt-2.5 sm:text-2xl lg:text-[2rem]">
              {isEditing ? "Edit Address" : "Add New Address"}
            </h2>
            <p className="mt-2 text-sm text-[#5b6472]">
              {isEditing
                ? "Update the selected address details from this page."
                : "Save a new shipping address from this page."}
            </p>
          </div>

          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-2 rounded-full border border-[#d9e0eb] bg-white px-4 py-2 text-sm font-semibold text-[#111827] transition hover:border-[#111827]"
          >
            <ArrowLeftOutlined /> Back
          </button>
        </div>
      </div>

      <Formik<AddressFormValues>
        key={addressId ?? "add-address"}
        enableReinitialize
        initialValues={initialValues}
        validationSchema={AddressSchema}
        onSubmit={async (values, { setStatus, setSubmitting }) => {
          setStatus(undefined);

          if (isEditing && !values.id) {
            setStatus({ error: "Address ID is missing. Please try again." });
            setSubmitting(false);
            return;
          }

          try {
            saveLocalAddress(values, addressOwnerId);
            navigate(ROUTES.ACCOUNT.ADDRESSES);
          } catch {
            setStatus({
              error: isEditing ? "Unable to update address." : "Unable to add address.",
            });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status }) => {
          return (
            <Form className="grid gap-4 px-4 py-5 sm:gap-5 sm:px-5 sm:py-6 lg:px-7 lg:py-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <CommonInput label="First Name" name="firstName" placeholder="Enter first name" />
                <CommonInput label="Last Name" name="lastName" placeholder="Enter last name" />
                <CommonInput label="Email Address" name="email" type="email" placeholder="you@example.com" />
                <CommonInput label="Mobile Number" name="mobileNumber" placeholder="Enter mobile number" />
                <CommonInput label="Company" name="company" placeholder="Optional company name" />
                <CommonInput label="Country" name="country" placeholder="Enter country" />

                <div className="sm:col-span-2">
                  <CommonInput label="Address Line 1" name="address1" placeholder="House no, street, apartment" />
                </div>

                <label className="sm:col-span-2 grid gap-2 text-sm font-medium text-[#111111]">
                  Address Line 2
                  <Field
                    as="textarea"
                    name="address2"
                    rows={3}
                    placeholder="Area, locality, or additional address details"
                    className="w-full rounded-[12px] border border-[#e1e1e1] px-4 py-3 text-sm text-[#2b2b2b] placeholder:text-[#b7b7b7] outline-none transition focus:border-black"
                  />
                  <FormikErrorMessage name="address2" component="span" className="text-xs text-[#e53935]" />
                </label>

                <CommonInput label="City" name="city" placeholder="Enter city" />
                <CommonInput label="ZIP Code" name="zipCode" placeholder="Enter ZIP code" />
              </div>

              <label className="inline-flex items-center gap-3 rounded-[12px] border border-[#e8edf4] bg-white px-4 py-3 text-sm font-medium text-[#111111]">
                <Field type="checkbox" name="isDefault" className="h-4 w-4 rounded border-[#cbd5e1] text-[#ef6b4a]" />
                Set as default address
              </label>

              <p className="rounded-[10px] bg-[#f4f6f8] px-4 py-3 text-sm text-[#5b6472]">
                Address pages are running without API. Saved addresses stay in this browser only.
              </p>

              {status?.error ? (
                <p className="rounded-[10px] bg-[#ffecec] px-4 py-3 text-sm text-[#e53935]">{status.error}</p>
              ) : null}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                  {isSubmitting
                    ? isEditing
                      ? "Updating..."
                      : "Saving..."
                    : isEditing
                      ? "Update Address"
                      : "Save Address"}
                </button>
                <button
                  type="button"
                  onClick={goBack}
                  className="w-full rounded-full border border-[#d9d9d9] px-6 py-3 text-sm font-semibold text-[#111111] transition hover:border-black sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default ProfileAddressForm;
