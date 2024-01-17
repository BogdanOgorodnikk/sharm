import Vue from "vue";
import VueI18n from "vue-i18n";

import en from "@/i18n/en.yaml";
import ua from "@/i18n/ua.yaml";

Vue.use(VueI18n);

let messages = {};

messages = { ...messages, en, ua };

const lang = localStorage.getItem("language") || "ua";

const i18n = new VueI18n({
  locale: lang,
  fallbackLocale: "ua",
  messages,
});

export default i18n;
