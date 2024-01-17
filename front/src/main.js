import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/vuelidate";
import "./plugins/vue-tailwind";
import i18n from "./plugins/vue-i18n";
import ApiService from "./services/api.service";
import "./mixins/global.mixin";

Vue.config.productionTip = false;

ApiService.init();

window.instanciaVue = new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
