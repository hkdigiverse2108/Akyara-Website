import * as Yup from "yup";

export interface Params {
  [key: string]: any;
}

export type Primitive = string | number | boolean | null | undefined;

export type DepValue = Primitive | Primitive[];

export interface FieldOptions<T> {
  required?: boolean;
  extraRules?: (schema: T) => T;
  minItems?: number;
}

export type FieldSchemaArgs<K extends keyof FieldTypeMap> = [type: K, options?: FieldOptions<FieldTypeMap[K]>] | [type: K, label: string, options?: FieldOptions<FieldTypeMap[K]>];
export type FieldTypeMap = {
  string: Yup.StringSchema<string | null | undefined>;
  number: Yup.NumberSchema<number | null | undefined>;
  boolean: Yup.BooleanSchema<boolean | null | undefined>;
  array: Yup.ArraySchema<any[], Yup.AnyObject>;
};
