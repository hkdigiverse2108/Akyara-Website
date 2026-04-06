import {DeleteOutlined,EditOutlined,EnvironmentOutlined,PlusOutlined,StarFilled,} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../../Constants";
import { useAppSelector } from "../../../Store/Hooks";
import type { NormalizedAddress } from "../../../Types";
import { deleteLocalAddress, formatAddressLines, getLocalAddresses } from "./addressUtils";

const ProfileAddressesSection = () => {
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const addressOwnerId = typeof user?._id === "string" ? user._id : user?.email ?? "";
  const [deletingAddressId, setDeletingAddressId] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<NormalizedAddress[]>([]);

  useEffect(() => {
    setAddresses(getLocalAddresses(addressOwnerId));
  }, [addressOwnerId]);

  const handleDelete = async (address: NormalizedAddress) => {
    if (!address.id) {
      return;
    }

    const confirmed = window.confirm(
      `Delete this saved address for ${address.fullName || address.email || "this profile"}?`,
    );
    if (!confirmed) {
      return;
    }

    setDeletingAddressId(address.id);

    try {
      deleteLocalAddress(address.id, addressOwnerId);
      setAddresses(getLocalAddresses(addressOwnerId));
    } finally {
      setDeletingAddressId(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-[14px] border border-[#e6ebf1] bg-white shadow-[0_24px_56px_rgba(15,23,42,0.08)] sm:rounded-[16px]">
      <div className="border-b border-[#e6ebf1] bg-white px-4 py-4 sm:px-5 sm:py-5 lg:px-7 lg:py-6">
        <div className="flex flex-wrap items-start justify-between gap-3 sm:gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-[#ef6b4a]">Addresses</p>
            <h2 className="mt-2 text-lg font-semibold text-[#0f172a] sm:mt-2.5 sm:text-2xl lg:text-[2rem]">
              Saved Address Book
            </h2>
            <p className="mt-2 text-sm text-[#5b6472]">
              Add and update addresses from separate pages for a cleaner flow.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[#e4e9f1] bg-white px-3 py-1.5 text-xs font-medium text-[#4b5563] sm:px-4 sm:py-2 sm:text-sm">
              {addresses.length} saved
            </span>
            <button
              type="button"
              onClick={() => navigate(ROUTES.ACCOUNT.ADD_ADDRESS)}
              className="inline-flex items-center gap-2 rounded-full border border-[#d9e0eb] bg-white px-4 py-2 text-sm font-semibold text-[#111827] transition hover:border-[#111827]"
            >
              <PlusOutlined /> Add Address
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-4 sm:p-5 lg:gap-5 lg:p-6 xl:p-8">
        {addresses.length === 0 ? (
          <div className="grid min-h-[260px] place-items-center rounded-[14px] border border-dashed border-[#d9e0eb] bg-[#fafbfd] p-6 text-center">
            <div className="max-w-[360px]">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#e4e9f1] bg-white text-lg text-[#ef6b4a]">
                <EnvironmentOutlined />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-[#0f172a]">No saved addresses yet</h3>
              <p className="mt-2 text-sm leading-7 text-[#5b6472]">
                Add your first address from this page. It will stay available locally inside this browser.
              </p>
              <button
                type="button"
                onClick={() => navigate(ROUTES.ACCOUNT.ADD_ADDRESS)}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#111111]"
              >
                <PlusOutlined /> Add First Address
              </button>
            </div>
          </div>
        ) : null}

        {addresses.length > 0 ? (
          <div className="grid gap-3">
            {addresses.map((address, index) => {
              const key = address.id || `${address.fullName || address.email || "address"}-${index}`;
              const isDeleting = deletingAddressId === address.id;
              const addressLines = formatAddressLines(address);

              return (
                <article key={key}className="rounded-[14px] border border-[#e5e9f0] bg-white p-4 shadow-[0_12px_28px_rgba(15,23,42,0.05)] transition sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {address.company ? (<span className="rounded-full bg-[#fff4ed] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#ef6b4a]">{address.company}</span>) : null}
                        {address.isDefault ? (<span className="inline-flex items-center gap-1 rounded-full bg-[#eef8f1] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#0f9d58]">  <StarFilled /> Default</span>) : null}
                      </div>
                      <h4 className="mt-3 truncate text-base font-semibold text-[#0f172a] sm:text-lg">{address.fullName || address.email || "Saved Address"}</h4>
                      <p className="mt-1 text-sm font-medium text-[#4b5563]">{address.mobileNumber || "Mobile number not available"}</p>
                      {address.email ? <p className="mt-1 text-xs text-[#7b8797]">{address.email}</p> : null}
                    </div>

                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e9f0] bg-white text-[#ef6b4a]">
                      <EnvironmentOutlined />
                    </span>
                  </div>
                  <div className="mt-4 space-y-2 text-sm leading-6 text-[#5b6472]">{addressLines.map((line) => (<p key={`${key}-${line}`}>{line}</p>))}</div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <button type="button" onClick={() => address.id && navigate(ROUTES.ACCOUNT.EDIT_ADDRESS.replace(":id", address.id))} disabled={!address.id} className="inline-flex items-center gap-2 rounded-full border border-[#d9e0eb] bg-white px-4 py-2 text-sm font-semibold text-[#111827] transition hover:border-[#111827] disabled:cursor-not-allowed disabled:opacity-60">
                      <EditOutlined /> Edit
                    </button>
                    <button type="button" onClick={() => void handleDelete(address)} disabled={!address.id || isDeleting} className="inline-flex items-center gap-2 rounded-full border border-[#ffdada] bg-[#fff5f5] px-4 py-2 text-sm font-semibold text-[#c62828] transition hover:bg-[#ffecec] disabled:cursor-not-allowed disabled:opacity-60">
                      <DeleteOutlined /> {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProfileAddressesSection;
