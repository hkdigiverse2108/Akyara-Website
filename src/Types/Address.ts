import type { ApiResponse } from "./Api";

export type AddressRecord = {
  _id?: string;
  userId?: string | { _id?: string };
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  pinCode?: string;
  zipCode?: string;
  country?: string;
  isDefault?: boolean;
  isActive?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AddressApiResponse = ApiResponse<AddressRecord | AddressRecord[] | { address_data?: AddressRecord[]; address?: AddressRecord }>;

export type AddressFormValues = {
  id: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
};

export type AddressMutationPayload = {
  addressId?: string;
  address1: string;
  address2?: string;
  country: string;
  city: string;
  state: string;
  pinCode: string;
  isActive?: boolean;
  isDefault: boolean;
};

export type NormalizedAddress = {
  id: string;
  userId: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  raw: AddressRecord;
};

export type SelectOption = {
  value: string;
  label: string;
};

export type AddressSelectFieldProps = {
  label: string;
  name: string;
  options: SelectOption[];
  placeholder: string;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
};

