import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useFormikContext } from "formik";
import { ROUTES } from "../../Constants";
import type { CheckoutFormValues, NormalizedAddress } from "../../Types";
import { useAddressApi } from "../../Utils/Hooks/useAddressApi";
import { formatAddressLines } from "../Profile/Addresses/addressUtils";

type SavedAddressSectionProps = {
  enabled: boolean;
  userId?: string;
};

const sortSavedAddresses = (addresses: NormalizedAddress[]) =>
  addresses.slice().sort((a, b) => Number(Boolean(b.isDefault)) - Number(Boolean(a.isDefault)));

const resolveDefaultAddressId = (addresses: NormalizedAddress[]) =>
  addresses.find((address) => address.isDefault)?.id ?? addresses[0]?.id ?? "";

const SavedAddressSection = ({ enabled, userId }: SavedAddressSectionProps) => {
  const { values, setFieldValue } = useFormikContext<CheckoutFormValues>();
  const { addresses, isLoading, isFetching } = useAddressApi({
    enabled,
    userId: userId || undefined,
  });

  const isAddressesLoading = isLoading || isFetching;
  const sortedAddresses = useMemo(() => sortSavedAddresses(addresses), [addresses]);
  const defaultAddressId = useMemo(
    () => resolveDefaultAddressId(sortedAddresses),
    [sortedAddresses],
  );

  if (!enabled) return null;

  const handleSelectAddress = (addressId: string) => {
    if (!addressId) return;
    void setFieldValue("addressId", addressId);
  };

  const handleUseNewAddress = () => {
    void setFieldValue("addressId", "");
  };

  const handleUseSavedAddress = () => {
    if (!defaultAddressId) return;
    void setFieldValue("addressId", defaultAddressId);
  };

  if (!values.addressId) {
    if (isAddressesLoading || sortedAddresses.length === 0) return null;

    return (
      <div className="mt-5 rounded-[18px] border border-[#e0e8f4] bg-gradient-to-r from-[#f8fbff] to-[#f7f8fc] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)] sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-[#7b8797]">
              Saved Address
            </p>
            <p className="m-0 mt-1 text-sm text-[#4b5563]">
              Use your default address for quick checkout.
            </p>
          </div>
          <span className="rounded-full border border-[#d9e3f3] bg-white px-3 py-1 text-xs font-semibold text-[#334155]">
            {sortedAddresses.length} saved
          </span>
        </div>
        <div>
          <button type="button" onClick={handleUseSavedAddress} className="mt-4 rounded-full bg-[#111827] px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-black">
            Use saved address
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-[20px] border border-[#e0e8f4] bg-gradient-to-b from-[#f8fbff] to-[#f8fafc] p-4 shadow-[0_10px_26px_rgba(15,23,42,0.05)] sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="m-0 text-lg font-semibold text-[#0f172a]">Saved address</h3>
          <p className="m-0 mt-1 text-sm text-[#5b6472]">
            Select one of your saved addresses for delivery.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-[#d9e3f3] bg-white px-3 py-1 text-xs font-semibold text-[#334155]">
            {sortedAddresses.length} saved
          </span>
          <button
            type="button"
            onClick={handleUseNewAddress}
            className="rounded-full border border-[#d9e0eb] bg-white px-4 py-2 text-sm font-semibold text-[#111827] transition hover:border-[#111827] hover:bg-[#f8fafc]"
          >
            Use new address
          </button>
        </div>
      </div>

      {isAddressesLoading ? (
        <div className="mt-4 rounded-[16px] border border-dashed border-[#d9e0eb] bg-white px-4 py-3 text-sm text-[#5b6472]">
          Loading saved addresses...
        </div>
      ) : sortedAddresses.length === 0 ? (
        <div className="mt-4 rounded-[16px] border border-dashed border-[#d9e0eb] bg-white px-4 py-3 text-sm text-[#5b6472]">
          <p className="m-0">No saved addresses found.</p>
          <Link
            to={ROUTES.ACCOUNT.ADD_ADDRESS}
            className="mt-3 inline-flex rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition hover:bg-[#111111]"
          >
            Add Address
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid gap-3">
          {sortedAddresses.map((address, index) => {
            const key = address.id || `address-${index}`;
            const isSelected = Boolean(address.id) && values.addressId === address.id;
            const lines = formatAddressLines(address);

            return (
              <article
                key={key}
                role={address.id ? "button" : undefined}
                tabIndex={address.id ? 0 : -1}
                onClick={() => address.id && handleSelectAddress(address.id)}
                onKeyDown={(event) => {
                  if (!address.id) return;
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleSelectAddress(address.id);
                  }
                }}
                className={`rounded-[18px] border bg-white p-5 shadow-[0_12px_28px_rgba(15,23,42,0.04)] transition ${
                  isSelected
                    ? "border-[#0f172a] ring-2 ring-[#0f172a]/5"
                    : "border-[#e5e9f0] hover:border-[#64748b]"
                } ${address.id ? "cursor-pointer" : "cursor-not-allowed opacity-70"}`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`mt-0.5 inline-flex h-7 w-7 flex-none items-center justify-center rounded-full border ${
                      isSelected ? "border-[#0f172a]" : "border-[#cbd5e1]"
                    } bg-white`}
                    aria-hidden="true"
                  >
                    {isSelected ? <span className="h-3 w-3 rounded-full bg-[#0f172a]" /> : null}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {address.isDefault ? (
                        <span className="inline-flex items-center rounded-full bg-[#eef8f1] px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-[#0f9d58]">
                          Default
                        </span>
                      ) : null}
                      {isSelected ? (
                        <span className="inline-flex items-center rounded-full bg-[#eff4ff] px-3 py-1 text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-[#334155]">
                          Selected
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3 space-y-1 text-sm font-medium text-[#0f172a]">
                      {lines.map((line, idx) => (
                        <p key={`${key}-${idx}`} className="m-0">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SavedAddressSection;
