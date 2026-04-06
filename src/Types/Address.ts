import type { ApiResponse } from "./Api";

export type AddressRecord = {
  _id?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  company?: string;
  mobileNumber?: string;
  address1?: string;
  address2?: string;
  city?: string;
  zipCode?: string;
  country?: string;
  isDefault?: boolean;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type AddressApiResponse = ApiResponse<AddressRecord | AddressRecord[] | { address_data?: AddressRecord[]; address?: AddressRecord }>;

export type AddressFormValues = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  mobileNumber: string;
  address1: string;
  address2: string;
  city: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
};

export type AddressMutationPayload = {
  addressId?: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  address1: string;
  address2?: string;
  country: string;
  city: string;
  zipCode: string;
  mobileNumber: string;
  isDefault: boolean;
};

export type NormalizedAddress = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  company: string;
  mobileNumber: string;
  address1: string;
  address2: string;
  city: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  raw: AddressRecord;
};
