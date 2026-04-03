import type { ApiResponse } from "./Api";

export type SettingsItem = {
  _id?: string;
  address?: string;
  contact?: string;
  email?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  twitter?: string;
  isOutOfStockProductShow?: boolean;
  freeDeliveryAbove?: number;
  isCODAvailable?: boolean;
  isRazorpay?: boolean;
  isPhonePe?: boolean;
  isShipRocket?: boolean;
  isCashFree?: boolean;
  razorpayApiKey?: string;
  razorpayApiSecret?: string;
  phonePeApiKey?: string;
  phonePeApiSecret?: string;
  phonePeApiVersion?: string;
  securePaymentImages?: string[];
  securePaymentTitle?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SettingsCollection = {
  docs?: SettingsItem[];
  items?: SettingsItem[];
  rows?: SettingsItem[];
  results?: SettingsItem[];
  records?: SettingsItem[];
  settings?: SettingsItem[];
  data?: SettingsValue;
};

export type SettingsValue = SettingsItem | SettingsItem[] | SettingsCollection | undefined;

export type SettingsApiResponse = ApiResponse<
  | SettingsItem
  | SettingsItem[]
  | {
      docs?: SettingsItem[];
      items?: SettingsItem[];
      rows?: SettingsItem[];
      results?: SettingsItem[];
      records?: SettingsItem[];
      settings?: SettingsItem[];
      data?: SettingsItem | SettingsItem[];
    }
>;
