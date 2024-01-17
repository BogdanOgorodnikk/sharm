import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/services/jwt.service";
import notify from "@/services/notify.service";
import loader from "@/services/loader.service";
import i18n from "@/services/i18n.service";
import storage from "@/services/storage.service";
import store from "@/store";
import router from "@/router";

/**
 * Set axios interceptors
 * @param { Object } $axios
 */

function setInterceptors($axios) {
  $axios.interceptors.response.use(
    (response) => {
      loader.off(response.config.url);

      const token = response.headers["refresh-token"];

      if (token) {
        store.commit("SET_AUTH", { token });
      }

      return response;
    },
    (error) => {
      const message = error.response?.data?.message;
      const status = error.response?.status;
      const routeName = router.history.current.name;
      const isLoginPage = routeName === "Login";

      loader.off(error.config.url);

      if (status === 401 && !isLoginPage) {
        store.dispatch("clearAuth");
      } else if (Array.isArray(message) && message.length) {
        message.forEach((code) => notify.error(code));
      } else {
        notify.error(message);
      }

      return Promise.reject(error);
    }
  );
}

/**
 * Show success notify or set type and message in local storage for display with delay
 * @param { String } message
 * @param { Boolean } withDelay
 */

function showSuccessNotify(message, withDelay) {
  const type = "success";

  if (withDelay) {
    storage.setObj("notify", { type, message });
  } else {
    notify.success(message);
  }
}

/**
 * Service to call HTTP request via Axios
 */
const ApiService = {
  init() {
    const restApiPrefix = process.env.VUE_APP_REST_API_PREFIX;
    const appDomain = process.env.VUE_APP_DOMAIN;

    Vue.use(VueAxios, axios);

    Vue.axios.defaults.baseURL = `${appDomain}${restApiPrefix}`;

    setInterceptors(Vue.axios);
  },

  /**
   * Set the default HTTP request headers
   */
  setHeader() {
    Vue.axios.defaults.headers = {
      Authorization: `Bearer ${JwtService.getAuthToken()}`,
      Language: i18n.getActiveLanguage(),
    };
  },

  /**
   * Send the GET HTTP request
   * @param { String } resource
   * @param config
   * @param { Object } settings
   @returns {}
   */
  get(resource, config = null, settings = {}) {
    const { withLoader = true, withNotify = false, delaySuccessNotify = false } = settings;

    if (withLoader) {
      loader.on(resource);
    }

    return Vue.axios.get(resource, config).then((response) => {
      const message = response?.data?.message;

      if (withNotify) showSuccessNotify(message, delaySuccessNotify);

      return response;
    });
  },

  /**
   * Set the POST HTTP request
   * @param { String } resource
   * @param params
   * @param { Object } settings
   @returns {}
   */
  post(resource, params = null, settings = {}) {
    const { withLoader = true, withNotify = false, delaySuccessNotify = false } = settings;

    if (withLoader) {
      loader.on(resource);
    }

    return Vue.axios.post(resource, params).then((response) => {
      const message = response?.data?.message;

      if (withNotify) showSuccessNotify(message, delaySuccessNotify);

      return response;
    });
  },

  /**
   * Send the PUT HTTP request
   * @param { String } resource
   * @param params
   * @param { Object } settings
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  put(resource, params = null, settings = {}) {
    const { withLoader = true, withNotify = false, delaySuccessNotify = false } = settings;

    if (withLoader) {
      loader.on(resource);
    }

    return Vue.axios.put(resource, params).then((response) => {
      const message = response?.data?.message;

      if (withNotify) showSuccessNotify(message, delaySuccessNotify);

      return response;
    });
  },

  /**
   * Send the PATCH HTTP request
   * @param { String } resource
   * @param params
   * @param { Object } settings
   * @returns {IDBRequest<IDBValidKey> | Promise<void>}
   */
  patch(resource, params = null, settings = {}) {
    const { withLoader = true, withNotify = false, delaySuccessNotify = false } = settings;

    if (withLoader) {
      loader.on(resource);
    }

    return Vue.axios.patch(resource, params).then((response) => {
      const message = response?.data?.message;

      if (withNotify) showSuccessNotify(message, delaySuccessNotify);

      return response;
    });
  },

  /**
   * Send the DELETE HTTP request
   * @param { String } resource
   * @param params
   * @param { Object } settings
   @returns {}
   */
  delete(resource, params = null, settings = {}) {
    const { withLoader = true, withNotify = false, delaySuccessNotify = false } = settings;

    if (withLoader) {
      loader.on(resource);
    }

    return Vue.axios.delete(resource, { data: params }).then((response) => {
      const message = response?.data?.message;

      if (withNotify) showSuccessNotify(message, delaySuccessNotify);

      return response;
    });
  },
};

export default ApiService;
