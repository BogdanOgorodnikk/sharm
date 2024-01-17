import { enGB, ru, uk } from "date-fns/locale";
import { format, isToday, isTomorrow, isYesterday } from "date-fns";
import i18nService from "@/services/i18n.service";
import i18n from "@/plugins/vue-i18n";

export function dateFormat(date) {
  const language = {
    en: enGB,
    ru: ru,
    ua: uk,
  };

  const yearFormat = "y";
  const monthFormat = "MMM";
  const dayFormat = "EEEE";
  const dateNumberFormat = "dd";

  let month = format(date, monthFormat, {
    locale: language[i18nService.getActiveLanguage()],
  });

  //Remove dot from Ukr and Rus localization
  month = month.split(".").join("");

  const day = format(date, dayFormat, {
    locale: language[i18nService.getActiveLanguage()],
  });

  const year = format(date, yearFormat);
  const dateNumber = format(date, dateNumberFormat);

  let prepareDate = `${day}, ${dateNumber} ${month} ${year}`;

  if (isYesterday(date)) {
    prepareDate = `${i18n.t("component.ourDatePicker.yesterday")}, ${dateNumber} ${month} ${year}`;
  } else if (isToday(date)) {
    prepareDate = `${i18n.t("component.ourDatePicker.today")}, ${dateNumber} ${month} ${year}`;
  } else if (isTomorrow(date)) {
    prepareDate = `${i18n.t("component.ourDatePicker.tomorrow")}, ${dateNumber} ${month} ${year}`;
  }

  return prepareDate;
}

export function dateConverter(timestamp, type = "date") {
  const language = {
    en: enGB,
    ua: uk,
  };

  const locale = language[i18nService.getActiveLanguage()];
  const date = new Date(timestamp * 1000);
  let options = "";

  if (type.includes("date")) {
    options = "dd.MM.yyyy";
  }

  if (type.includes("time")) {
    options = "HH:mm:ss";
  }

  if (type.includes("datetime")) {
    options = "HH:mm dd.MM.yyyy";
  }

  if (type.includes("dateWithFullMonth")) {
    options = "dd MMMM yyyy";
  }

  return format(date, options, { locale });
}

export function parsedDate(date) {
  const [day, month, year] = date.split(".");

  return format(new Date(year, month - 1, day), "yyyy-MM-dd");
}

export default {
  dateFormat,
  dateConverter,
  parsedDate,
};
