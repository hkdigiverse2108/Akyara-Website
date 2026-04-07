import { Mutations, Queries } from "../../Api";
import type { AddressFormValues } from "../../Types";
import { buildAddressPayload, normalizeAddressList } from "../../Pages/Profile/Addresses/addressUtils";

type UseAddressApiOptions = {
  addressId?: string;
  enabled?: boolean;
  userId?: string;
};

export const useAddressApi = ({
  addressId,
  enabled = true,
  userId,
}: UseAddressApiOptions = {}) => {
  const addressesQuery = Queries.useGetAllAddresses(enabled);
  const addAddressMutation = Mutations.useAddAddress();
  const editAddressMutation = Mutations.useEditAddress();
  const deleteAddressMutation = Mutations.useDeleteAddress();

  const addresses = normalizeAddressList(addressesQuery.data).filter(
    (address) => !userId || !address.userId || address.userId === userId
  );
  const selectedAddress = addressId
    ? addresses.find((address) => address.id === addressId) ?? null
    : null;

  const saveAddress = async (values: AddressFormValues) => {
    const payload = buildAddressPayload(values);

    return values.id
      ? editAddressMutation.mutateAsync(payload)
      : addAddressMutation.mutateAsync(payload);
  };

  const deleteAddress = async (id: string) => deleteAddressMutation.mutateAsync(id);

  return {
    addresses,
    selectedAddress,
    saveAddress,
    deleteAddress,
    isLoading: addressesQuery.isLoading,
    isFetching: addressesQuery.isFetching,
    isSaving: addAddressMutation.isPending || editAddressMutation.isPending,
    isDeleting: deleteAddressMutation.isPending,
  };
};
