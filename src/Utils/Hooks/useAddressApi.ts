import { Mutations, Queries } from "../../Api";
import type { AddressFormValues } from "../../Types";
import {buildAddressPayload,normalizeAddressList,
} from "../../Pages/Profile/Addresses/addressUtils";

type UseAddressApiOptions = {
  addressId?: string;
  enabled?: boolean;
  userId?: string;
};

export const useAddressApi = ({addressId,enabled = true,userId,}: UseAddressApiOptions = {}) => {
  const { data, isLoading, isFetching } = Queries.useGetAllAddresses(enabled);

  const add = Mutations.useAddAddress();
  const edit = Mutations.useEditAddress();
  const remove = Mutations.useDeleteAddress();
  const addresses = normalizeAddressList(data).filter((a) => !userId || !a.userId || a.userId === userId);

  const selectedAddress =addressId ? addresses.find((a) => a.id === addressId) ?? null : null;

  const saveAddress = (values: AddressFormValues) => {const payload = buildAddressPayload(values);return values.id ? edit.mutateAsync(payload) : add.mutateAsync(payload);};
  const deleteAddress = (id: string) => remove.mutateAsync(id);

  return {
    addresses,
    selectedAddress,
    saveAddress,
    deleteAddress,
    isLoading,
    isFetching,
    isSaving: add.isPending || edit.isPending,
    isDeleting: remove.isPending,
  };
};