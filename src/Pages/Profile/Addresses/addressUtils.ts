import type {
  AddressApiResponse,
  AddressFormValues,
  AddressMutationPayload,
  AddressRecord,
  NormalizedAddress,
} from "../../../Types";
import { Storage, Stringify } from "../../../Utils";

const ADDRESS_STORAGE_KEY = "Profile-Addresses";

const EMPTY_ADDRESS_FORM_VALUES: AddressFormValues = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  mobileNumber: "",
  address1: "",
  address2: "",
  city: "",
  zipCode: "",
  country: "",
  isDefault: false,
};

const isObject = (value: unknown): value is Record<string, unknown> =>
  !!value && typeof value === "object" && !Array.isArray(value);

const getString = (value: unknown): string =>
  typeof value === "string"
    ? value.trim()
    : typeof value === "number"
      ? String(value)
      : "";

const getBoolean = (value: unknown): boolean => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value === 1;

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "yes";
  }

  return false;
};

const getArray = (value: unknown): unknown[] | null =>
  Array.isArray(value) ? value : null;

const getStoredAddressRecords = (): AddressRecord[] => {
  try {
    const stored = Storage.getItem(ADDRESS_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is AddressRecord => isObject(item))
      : [];
  } catch {
    return [];
  }
};

const setStoredAddressRecords = (records: AddressRecord[]) => {
  Storage.setItem(ADDRESS_STORAGE_KEY, Stringify(records));
};

const createAddressId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `address-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const createAddressFormValues = (
  defaults?: Partial<AddressFormValues>
): AddressFormValues => ({
  ...EMPTY_ADDRESS_FORM_VALUES,
  ...defaults,
  isDefault: defaults?.isDefault ?? EMPTY_ADDRESS_FORM_VALUES.isDefault,
});

export const normalizeAddress = (
  value: unknown
): NormalizedAddress | null => {
  if (!isObject(value)) return null;

  const raw = value as AddressRecord;
  const firstName = getString(raw.firstName);
  const lastName = getString(raw.lastName);
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  return {
    id: getString(raw._id),
    userId: getString(raw.userId),
    firstName,
    lastName,
    fullName,
    email: getString(raw.email),
    company: getString(raw.company),
    mobileNumber: getString(raw.mobileNumber),
    address1: getString(raw.address1),
    address2: getString(raw.address2),
    city: getString(raw.city),
    zipCode: getString(raw.zipCode),
    country: getString(raw.country),
    isDefault: getBoolean(raw.isDefault),
    raw,
  };
};

export const normalizeAddressList = (
  response?: AddressApiResponse
): NormalizedAddress[] => {
  if (!isObject(response)) return [];

  const data = response.data;
  const dataObject = isObject(data) ? (data as Record<string, unknown>) : null;
  const candidates = [getArray(dataObject?.address_data), getArray(data)];
  const list = candidates.find((candidate) => Array.isArray(candidate)) ?? [];

  return list
    .map((item) => normalizeAddress(item))
    .filter((item): item is NormalizedAddress => Boolean(item));
};

export const normalizeAddressDetail = (
  response?: AddressApiResponse,
  fallback?: NormalizedAddress | null
): NormalizedAddress | null => {
  if (!isObject(response)) return fallback ?? null;

  const data = response.data;
  const dataObject = isObject(data) ? (data as Record<string, unknown>) : null;
  const candidates = [dataObject?.address, data];

  for (const candidate of candidates) {
    const normalized = normalizeAddress(candidate);
    if (normalized) {
      return normalized;
    }
  }

  return fallback ?? null;
};

export const getAddressFormValues = (
  address: NormalizedAddress | null,
  defaults?: Partial<AddressFormValues>
): AddressFormValues => {
  const fallback = createAddressFormValues(defaults);

  if (!address) return fallback;

  return {
    id: address.id,
    firstName: address.firstName || fallback.firstName,
    lastName: address.lastName || fallback.lastName,
    email: address.email || fallback.email,
    company: address.company,
    mobileNumber: address.mobileNumber || fallback.mobileNumber,
    address1: address.address1,
    address2: address.address2,
    city: address.city,
    zipCode: address.zipCode,
    country: address.country || fallback.country,
    isDefault: address.isDefault,
  };
};

export const buildAddressPayload = (
  values: AddressFormValues
): AddressMutationPayload => {
  const firstName = values.firstName.trim();
  const lastName = values.lastName.trim();
  const email = values.email.trim();
  const company = values.company.trim();
  const mobileNumber = values.mobileNumber.trim();
  const address1 = values.address1.trim();
  const address2 = values.address2.trim();
  const city = values.city.trim();
  const zipCode = values.zipCode.trim();
  const country = values.country.trim();

  const payload: AddressMutationPayload = {
    firstName,
    lastName,
    email,
    address1,
    address2: undefined,
    country,
    city,
    zipCode,
    mobileNumber,
    isDefault: values.isDefault,
  };

  if (values.id) {
    payload.addressId = values.id;
  }

  if (company) {
    payload.company = company;
  }

  if (address2) {
    payload.address2 = address2;
  } else {
    delete payload.address2;
  }

  return payload;
};

export const formatAddressLines = (
  address: NormalizedAddress
): string[] => {
  return [
    address.address1,
    address.address2,
    [address.city, address.zipCode].filter(Boolean).join(", "),
    address.country,
  ].filter(Boolean);
};

export const getLocalAddresses = (ownerId?: string): NormalizedAddress[] => {
  return getStoredAddressRecords()
    .filter((record) => !ownerId || getString(record.userId) === ownerId)
    .map((record) => normalizeAddress(record))
    .filter((record): record is NormalizedAddress => Boolean(record));
};

export const getLocalAddressById = (
  addressId?: string,
  ownerId?: string
): NormalizedAddress | null => {
  if (!addressId) return null;

  const record = getStoredAddressRecords().find(
    (item) =>
      getString(item._id) === addressId &&
      (!ownerId || getString(item.userId) === ownerId)
  );

  return normalizeAddress(record);
};

export const saveLocalAddress = (
  values: AddressFormValues,
  ownerId?: string
): NormalizedAddress => {
  const payload = buildAddressPayload(values);
  const records = getStoredAddressRecords();
  const now = new Date().toISOString();
  const nextId = payload.addressId || createAddressId();
  const existingRecord = records.find((item) => getString(item._id) === nextId);

  const nextRecord: AddressRecord = {
    _id: nextId,
    userId: ownerId || existingRecord?.userId || "",
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    company: payload.company,
    mobileNumber: payload.mobileNumber,
    address1: payload.address1,
    address2: payload.address2,
    city: payload.city,
    zipCode: payload.zipCode,
    country: payload.country,
    isDefault: payload.isDefault,
    isDeleted: false,
    createdAt: existingRecord?.createdAt || now,
    updatedAt: now,
  };

  const nextRecords = records
    .filter((item) => getString(item._id) !== nextId)
    .map((item) =>
      payload.isDefault && getString(item.userId) === getString(nextRecord.userId)
        ? { ...item, isDefault: false }
        : item
    );

  nextRecords.unshift(nextRecord);
  setStoredAddressRecords(nextRecords);

  return normalizeAddress(nextRecord) as NormalizedAddress;
};

export const deleteLocalAddress = (addressId: string, ownerId?: string) => {
  const nextRecords = getStoredAddressRecords().filter((item) => {
    const isSameAddress = getString(item._id) === addressId;
    const isSameOwner = !ownerId || getString(item.userId) === ownerId;
    return !(isSameAddress && isSameOwner);
  });

  setStoredAddressRecords(nextRecords);
};
