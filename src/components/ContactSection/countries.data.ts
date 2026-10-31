import { type CountryCode, getCountryCallingCode } from "libphonenumber-js";

type Country = {
  code: CountryCode;
  name: string;
};

// Policy: European sovereign states, transcontinental states (including Kazakhstan),
// plus Cyprus and the South Caucasus; not EU membership. Dependencies are excluded.
// Kosovo is excluded because XK is not an officially assigned ISO 3166-1 code.
// Library metadata supplies calling codes, including Vatican's shared +39.
const europeanCountries: readonly Country[] = [
  { code: "AT", name: "Австрия" },
  { code: "AZ", name: "Азербайджан" },
  { code: "AL", name: "Албания" },
  { code: "AD", name: "Андорра" },
  { code: "AM", name: "Армения" },
  { code: "BY", name: "Беларусь" },
  { code: "BE", name: "Бельгия" },
  { code: "BG", name: "Болгария" },
  { code: "BA", name: "Босния и Герцеговина" },
  { code: "VA", name: "Ватикан" },
  { code: "GB", name: "Великобритания" },
  { code: "HU", name: "Венгрия" },
  { code: "DE", name: "Германия" },
  { code: "GR", name: "Греция" },
  { code: "GE", name: "Грузия" },
  { code: "DK", name: "Дания" },
  { code: "IE", name: "Ирландия" },
  { code: "IS", name: "Исландия" },
  { code: "ES", name: "Испания" },
  { code: "IT", name: "Италия" },
  { code: "KZ", name: "Казахстан" },
  { code: "CY", name: "Кипр" },
  { code: "LV", name: "Латвия" },
  { code: "LT", name: "Литва" },
  { code: "LI", name: "Лихтенштейн" },
  { code: "LU", name: "Люксембург" },
  { code: "MT", name: "Мальта" },
  { code: "MD", name: "Молдова" },
  { code: "MC", name: "Монако" },
  { code: "NL", name: "Нидерланды" },
  { code: "NO", name: "Норвегия" },
  { code: "PL", name: "Польша" },
  { code: "PT", name: "Португалия" },
  { code: "RU", name: "Россия" },
  { code: "RO", name: "Румыния" },
  { code: "SM", name: "Сан-Марино" },
  { code: "MK", name: "Северная Македония" },
  { code: "RS", name: "Сербия" },
  { code: "SK", name: "Словакия" },
  { code: "SI", name: "Словения" },
  { code: "TR", name: "Турция" },
  { code: "UA", name: "Украина" },
  { code: "FI", name: "Финляндия" },
  { code: "FR", name: "Франция" },
  { code: "HR", name: "Хорватия" },
  { code: "ME", name: "Черногория" },
  { code: "CZ", name: "Чехия" },
  { code: "CH", name: "Швейцария" },
  { code: "SE", name: "Швеция" },
  { code: "EE", name: "Эстония" },
];

export const countries = europeanCountries.map((country) => ({
  ...country,
  callingCode: `+${getCountryCallingCode(country.code)}`,
}));
