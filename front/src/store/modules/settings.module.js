import i18n from "@/plugins/vue-i18n";

export default {
  namespaced: true,
  state: {},

  getters: {
    brandName() {
      return i18n.t("title.brandName");
    },
  },

  mutations: {},

  actions: {},
};
