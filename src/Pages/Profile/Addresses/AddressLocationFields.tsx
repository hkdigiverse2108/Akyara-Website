import { useEffect, useRef, useState } from "react";
import { useField } from "formik";
import type { ICity, ICountry, IState } from "country-state-city";
import AddressSelectField from "./AddressSelectField";
import AddressTextField from "./AddressTextField";
import type { SelectOption } from "../../../Types";


type LocationLibrary = typeof import("country-state-city");

const toOptions = (items: Array<ICountry | IState | ICity>): SelectOption[] =>
  items.map((item) => ({  value: item.name,  label: item.name,})).sort((left, right) => left.label.localeCompare(right.label));
const withCurrentValue = (options: SelectOption[], currentValue: string) => {
  const trimmedValue = currentValue.trim();

  if (!trimmedValue || options.some((option) => option.value === trimmedValue)) {
    return options;
  }
  return [{ value: trimmedValue, label: trimmedValue }, ...options];
};

const AddressLocationFields = () => {
  const [countryField] = useField<string>("country");
  const [stateField, , stateHelpers] = useField<string>("state");
  const [cityField, , cityHelpers] = useField<string>("city");
  const [locationLibrary, setLocationLibrary] = useState<LocationLibrary | null>(null);
  const previousCountry = useRef(countryField.value);
  const previousState = useRef(stateField.value);

  useEffect(() => {
    let isMounted = true;

    void import("country-state-city").then((module) => {
      if (isMounted) {
        setLocationLibrary(module);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (previousCountry.current === countryField.value) {
      return;
    }

    stateHelpers.setValue("");
    cityHelpers.setValue("");
    previousCountry.current = countryField.value;
    previousState.current = "";
  }, [cityHelpers, countryField.value, stateHelpers]);

  useEffect(() => {
    if (previousState.current === stateField.value) {
      return;
    }

    cityHelpers.setValue("");
    previousState.current = stateField.value;
  }, [cityHelpers, stateField.value]);

  const countries = locationLibrary? (locationLibrary.Country.getAllCountries() ?? []).sort((left, right) => left.name.localeCompare(right.name)): [];
  const selectedCountry = countries.find((country) => country.name === countryField.value) ?? null;
  const states = selectedCountry? locationLibrary?.State.getStatesOfCountry(selectedCountry.isoCode) ?? []: [];
  const selectedState = states.find((state) => state.name === stateField.value) ?? null;
  const cities = selectedCountry? selectedState  ? locationLibrary?.City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode) ?? []  : states.length === 0    ? locationLibrary?.City.getCitiesOfCountry(selectedCountry.isoCode) ?? []    : []: [];
  const countryOptions = withCurrentValue(toOptions(countries), countryField.value);
  const stateOptions = withCurrentValue(toOptions(states), stateField.value);
  const cityOptions = withCurrentValue(toOptions(cities), cityField.value);
  const isLocationLoading = !locationLibrary;
  const hasCountryValue = Boolean(countryField.value.trim());
  const hasStateOptions = stateOptions.length > 0;
  const hasCityOptions = cityOptions.length > 0;
  const canEditCity = hasCountryValue && (states.length === 0 || Boolean(stateField.value.trim()));

  if (isLocationLoading) {
    return (
      <>
        <AddressSelectField label="Country" name="country" options={withCurrentValue([], countryField.value)} placeholder="Enter country" disabled loading/>
        <AddressSelectField label="State" name="state" options={withCurrentValue([], stateField.value)} placeholder="Enter state" disabled loading/>
        <AddressSelectField label="City" name="city" options={withCurrentValue([], cityField.value)} placeholder="Enter city" disabled loading/>
      </>
    );
  }
  return (
    <>
      <AddressSelectField label="Country" name="country" options={countryOptions} placeholder="Enter country"/>
      {hasStateOptions ? (<AddressSelectField label="State" name="state" options={stateOptions} placeholder="Enter state" disabled={!selectedCountry}/>) : (<AddressTextField label="State" name="state" placeholder="Enter state" disabled={!hasCountryValue}/>)}
      {hasCityOptions ? (<AddressSelectField label="City" name="city" options={cityOptions} placeholder="Enter city" disabled={!canEditCity}/>) : ( <AddressTextField label="City" name="city" placeholder="Enter city" disabled={!canEditCity}/>)}
    </>
  );
};

export default AddressLocationFields;
