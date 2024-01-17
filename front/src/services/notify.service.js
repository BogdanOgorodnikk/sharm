import Vue from "vue";
import i18n from "@/plugins/vue-i18n";
import { notifyConfig } from "@/configs/ourApp.config";

export default {
  notify(settings) {
    Vue.notify({
      group: "notify",
      type: settings.type,
      title: settings.title || "",
      text: this.prepareMessage(settings.code, settings.type),
      duration: settings.duration || notifyConfig.duration.short,
      ignoreDuplicates: settings.ignoreDuplicates || false,
      closeOnClick: false,
    });
  },

  prepareMessage(code, type) {
    const message = i18n.te(`component.notify.${type}.${code}`)
      ? `component.notify.${type}.${code}`
      : `component.notify.${type}.default`;

    return i18n.t(message);
  },

  success(code, duration = notifyConfig.duration.short) {
    this.notify({
      type: "success",
      code: code,
      duration: duration,
    });
  },

  warning(code, duration = notifyConfig.duration.medium) {
    this.notify({
      type: "warning",
      code: code,
      duration: duration,
    });
  },

  error(code, duration = notifyConfig.duration.long) {
    this.notify({
      type: "error",
      code: code,
      duration: duration,
      ignoreDuplicates: true,
    });
  },

  clearAll() {
    Vue.notify({
      group: "notify",
      clean: true,
    });
  },
};
