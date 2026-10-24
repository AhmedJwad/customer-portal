import { getCountries, getCountryCallingCode } from "libphonenumber-js";

export interface Country {
  iso: string;   // IQ
  name: string;  // Iraq
  code: string;  // +964
  flag: string;  // 🇮🇶
}

export const DEFAULT_ISO = "IQ";
export const DEFAULT_COUNTRY_CODE = "+964"; // العراق

const names = new Intl.DisplayNames(["en"], { type: "region" });
const toFlag = (iso: string) => iso.replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));

export const countries: Country[] = getCountries()
  .map((iso) => ({
    iso,
    name: names.of(iso) ?? iso,
    code: `+${getCountryCallingCode(iso)}`,
    flag: toFlag(iso),
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const findByCode = (code?: string | null) =>
  countries.find((c) => c.code === code) ?? countries.find((c) => c.iso === DEFAULT_ISO)!;