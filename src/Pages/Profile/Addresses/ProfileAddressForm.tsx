import { ArrowLeftOutlined } from "@ant-design/icons";
import { ErrorMessage as FormikErrorMessage, Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import CommonInput from "../../../Components/CommonInput";
import { ROUTES } from "../../../Constants";
import { useAppSelector } from "../../../Store/Hooks";
import type { AddressFormValues } from "../../../Types";
import { useAddressApi } from "../../../Utils/Hooks";
import { AddressSchema } from "../../../Utils/ValidationSchemas";
import { createAddressFormValues, getAddressFormValues } from "./addressUtils";
import AddressLocationFields from "./AddressLocationFields";

type ProfileAddressFormProps = {
  mode: "add" | "edit";
  addressId?: string;
};

const ProfileAddressForm = ({ mode, addressId }: ProfileAddressFormProps) => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const addressOwnerId = typeof user?._id === "string" ? user._id : "";
  const isEditing = mode === "edit";
  const { selectedAddress, saveAddress, isLoading, isSaving } = useAddressApi({ addressId, enabled: isEditing && !!addressOwnerId, userId: addressOwnerId });

  const goBack = () => navigate(ROUTES.ACCOUNT.ADDRESSES);

  if (isEditing && !addressId) {
    return (
      <div className="overflow-hidden rounded-[14px] border border-[#e6ebf1] bg-white shadow-[0_24px_56px_rgba(15,23,42,0.08)] sm:rounded-[16px]">
        <div className="grid gap-4 px-4 py-6 sm:px-5 lg:px-7 lg:py-8">
          <button type="button" onClick={goBack} className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d9e0eb] bg-white px-4 py-2 text-sm font-semibold text-[#111827] transition hover:border-[#111827]"><ArrowLeftOutlined /> Back to Address Book</button>
          <div className="rounded-[12px] border border-dashed border-[#d9e0eb] bg-[#fafbfd] px-5 py-8 text-center text-sm text-[#5b6472]">Address ID missing che. Please try again from the address list.</div>
        </div>
      </div>
    );
  }

  if (isEditing && isLoading) {
    return (
      <div className="overflow-hidden rounded-[14px] border border-[#e6ebf1] bg-white shadow-[0_24px_56px_rgba(15,23,42,0.08)] sm:rounded-[16px]">
        <div className="grid gap-4 px-4 py-6 sm:px-5 lg:px-7 lg:py-8">
          <button type="button" onClick={goBack} className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d9e0eb] bg-white px-4 py-2 text-sm font-semibold text-[#111827] transition hover:border-[#111827]"><ArrowLeftOutlined /> Back to Address Book</button>
          <div className="rounded-[12px] border border-dashed border-[#d9e0eb] bg-[#fafbfd] px-5 py-8 text-center text-sm text-[#5b6472]"> Loading address details...</div>
        </div>
      </div>
    );
  }

  if (isEditing && !selectedAddress) {
    return (
      <div className="overflow-hidden rounded-[14px] border border-[#e6ebf1] bg-white shadow-[0_24px_56px_rgba(15,23,42,0.08)] sm:rounded-[16px]">
        <div className="grid gap-4 px-4 py-6 sm:px-5 lg:px-7 lg:py-8">
          <button type="button" onClick={goBack} className="inline-flex w-fit items-center gap-2 rounded-full border border-[#d9e0eb] bg-white px-4 py-2 text-sm font-semibold text-[#111827] transition hover:border-[#111827]">
            <ArrowLeftOutlined /> Back to Address Book
          </button>
          <div className="rounded-[12px] border border-dashed border-[#d9e0eb] bg-[#fafbfd] px-5 py-8 text-center text-sm text-[#5b6472]">
            Selected address mali nathi. Please open edit from the saved address list again.
          </div>
        </div>
      </div>
    );
  }

  const initialValues = isEditing ? getAddressFormValues(selectedAddress) : createAddressFormValues();
  const formTitle = isEditing ? "Edit Address" : "Add New Address";
  const formDescription = isEditing ? "Update the selected address details from this page." : "Save a new shipping address to your account.";

  return (
    <div className="overflow-hidden rounded-[14px] border border-[#e6ebf1] bg-white shadow-[0_24px_56px_rgba(15,23,42,0.08)] sm:rounded-[16px]">
      <div className="border-b border-[#e6ebf1] bg-white px-4 py-4 sm:px-5 sm:py-5 lg:px-7 lg:py-6">
        <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#ef6b4a]">Addresses</p>
            <h2 className="mt-2 text-lg font-semibold text-[#0f172a] sm:mt-2.5 sm:text-2xl lg:text-[2rem]">{formTitle}</h2>
            <p className="mt-2 max-w-[640px] text-sm leading-7 text-[#5b6472]">{formDescription}</p>
          </div>
          <button type="button" onClick={goBack} className="inline-flex items-center gap-2 rounded-full border border-[#d9e0eb] bg-white px-4 py-2 text-sm font-semibold text-[#111827] transition hover:border-[#111827]"><ArrowLeftOutlined /> Back</button>
        </div>
      </div>

      <Formik<AddressFormValues> key={addressId ?? "add-address"} enableReinitialize initialValues={initialValues} validationSchema={AddressSchema} onSubmit={async (values, { setStatus, setSubmitting }) => {
        setStatus(undefined);
        if (isEditing && !values.id) {
          setStatus({ error: "Address ID is missing. Please try again." });
          setSubmitting(false);
          return;
        }
        try {
          await saveAddress(values);
          navigate(ROUTES.ACCOUNT.ADDRESSES);
        } catch (error) {
          setStatus({ error: error instanceof Error ? error.message : isEditing ? "Unable to update address." : "Unable to add address.", });
        } finally {
          setSubmitting(false);
        }
      }}
      >
        {({ isSubmitting, status }) => (
          <Form className="grid gap-5 bg-[#fcfcfd] px-4 py-5 sm:gap-6 sm:px-5 sm:py-6 lg:px-7 lg:py-7">
            <section className="rounded-[18px] border border-[#e7ecf3] bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.04)] sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-[#0f172a]">Location Details</h3>
                </div>
                <span className="rounded-full bg-[#fff4ed] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#ef6b4a]">Step 1</span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2"><AddressLocationFields /><CommonInput label=" PIN Code" name="zipCode" placeholder="Enter PIN code" /></div>
            </section>

            <section className="rounded-[18px] border border-[#e7ecf3] bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.04)] sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><h3 className="text-base font-semibold text-[#0f172a]">Street Details</h3></div>
                <span className="rounded-full bg-[#eef6ff] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#2563eb]">Step 2</span>
              </div>

              <div className="mt-5 grid gap-4">
                <CommonInput label="Address" name="address1" placeholder="House no, street, apartment" />

                <label className="grid gap-2 text-sm font-medium text-[#111111]">Address Line 2
                  <Field as="textarea" name="address2" rows={4} placeholder="Area, locality, landmark, or additional address details" className="profile-form-textarea w-full" />
                  <FormikErrorMessage name="address2" component="span" className="text-xs text-[#e53935]" />
                </label>
              </div>
            </section>

            <section className="rounded-[18px] border border-[#e7ecf3] bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.04)] sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-semibold text-[#0f172a]">Preferences</h3>
                </div>
                <span className="rounded-full bg-[#eef8f1] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#0f9d58]">Step 3</span>
              </div>

              <div className="mt-5 grid gap-4">
                <label className="inline-flex items-center gap-3 rounded-[14px] border border-[#e8edf4] bg-[#fbfcfe] px-4 py-3 text-sm font-medium text-[#111111]">
                  <Field type="checkbox" name="isDefault" className="h-4 w-4 rounded border-[#cbd5e1] text-[#ef6b4a]" /> Set as default address</label>

              </div>
            </section>

            {status?.error ? (<p className="rounded-[14px] border border-[#ffd6d6] bg-[#fff1f1] px-4 py-3 text-sm text-[#e53935]">{status.error}</p>) : null}

            <div className="flex flex-col-reverse gap-3 border-t border-[#e6ebf1] pt-5 sm:flex-row sm:justify-end">
              <button type="submit" disabled={isSubmitting || isSaving} className="w-full rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#111111] disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-[170px] sm:w-auto">
                {isSubmitting || isSaving ? isEditing ? "Updating..." : "Saving..." : isEditing ? "Update Address" : "Save Address"}
              </button>
              <button type="button" onClick={goBack} className="w-full rounded-full border border-[#d9d9d9] bg-white px-6 py-3 text-sm font-semibold text-[#111111] transition hover:border-black sm:min-w-[128px] sm:w-auto"> Cancel</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ProfileAddressForm;
