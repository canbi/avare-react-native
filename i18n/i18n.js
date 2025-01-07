import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import tr from "./tr.json";

const resources = {
  en: en,
  tr: tr,
};

i18n
  .use(initReactI18next)
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    compatibilityJSON: "v3",
    resources,
    lng: "tr",
  });

export default { i18n };
