import type {AddressApiResponse,AddressFormValues,AddressMutationPayload,AddressRecord,NormalizedAddress,} from "../../../Types";

const EMPTY_ADDRESS_FORM_VALUES: AddressFormValues = {id: "",address1: "",address2: "",city: "",state: "",zipCode: "",country: "",isDefault: false,};

const isObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const getString = (value: unknown): string =>
  typeof value === "string"? value.trim(): typeof value === "number"  ? String(value)  : "";

const getBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "yes";
  }

  return false;
};

const getArray = (value: unknown): unknown[] => (Array.isArray(value) ? value : []);

export const createAddressFormValues = (
  defaults?: Partial<AddressFormValues>
): AddressFormValues => ({...EMPTY_ADDRESS_FORM_VALUES,...defaults,isDefault: defaults?.isDefault ?? EMPTY_ADDRESS_FORM_VALUES.isDefault,});

export const normalizeAddress = (
  value: unknown
): NormalizedAddress | null => {
  if (!isObject(value)) return null;

  const raw = value as AddressRecord;
  const userId = isObject(raw.userId) ? getString(raw.userId._id) : getString(raw.userId);
   return {id: getString(raw._id),userId,address1: getString(raw.address1),address2: getString(raw.address2),city: getString(raw.city),state: getString(raw.state),zipCode: getString(raw.pinCode ?? raw.zipCode),country: getString(raw.country),isDefault: getBoolean(raw.isDefault),raw,};
};

export const normalizeAddressList = (
  response?: AddressApiResponse
): NormalizedAddress[] => {
  if (!isObject(response)) return [];

  const data = response.data;
  const dataObject = isObject(data) ? (data as Record<string, unknown>) : null;
  const list = getArray(dataObject?.address_data ?? data);

  return list
    .map((item) => normalizeAddress(item))
    .filter((item): item is NormalizedAddress => Boolean(item));
};

export const getAddressFormValues = (
  address: NormalizedAddress | null,
  defaults?: Partial<AddressFormValues>
): AddressFormValues => {
  const fallback = createAddressFormValues(defaults);
  if (!address) return fallback;

  return {id: address.id,address1: address.address1 || fallback.address1,address2: address.address2 || fallback.address2,city: address.city || fallback.city,state: address.state || fallback.state,zipCode: address.zipCode || fallback.zipCode,country: address.country || fallback.country,isDefault: address.isDefault,};
};

export const buildAddressPayload = (values: AddressFormValues): AddressMutationPayload => {const payload: AddressMutationPayload = {address1: values.address1.trim(),city: values.city.trim(),state: values.state.trim(),pinCode: values.zipCode.trim(),country: values.country.trim(),isDefault: values.isDefault,isActive: true,  };

  if (values.id) {
    payload.addressId = values.id;
  }

  const address2 = values.address2.trim();
  if (address2) {
    payload.address2 = address2;
  }

  return payload;
};

export const formatAddressLines = (
  address: NormalizedAddress
): string[] => {
  const cityState = [address.city, address.state].filter(Boolean).join(", ");
  const countryZip = [address.country, address.zipCode].filter(Boolean).join(" - ");

  return [address.address1, address.address2, cityState, countryZip].filter(Boolean);
};
