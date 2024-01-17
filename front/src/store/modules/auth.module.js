import ApiService from "@/services/api.service";
import JwtService from "@/services/jwt.service";
import { login, changeUserPassword /*logout*/ } from "@/api/auth";

export default {
  state: {
    token: JwtService.getAuthToken(),
    languages: {
      en: "Eng",
    },
    signUpData: {},
  },

  getters: {
    isAuthenticatedUser(state) {
      return !!state.token;
    },
  },

  mutations: {
    SET_AUTH(state, { token }) {
      state.token = token;

      JwtService.saveAuthToken(state.token);

      ApiService.setHeader();
    },

    PURGE_AUTH(state) {
      state.token = null;
    },

    SET_SIGN_UP_DATA(state, signUpData) {
      state.signUpData = signUpData;
    },
  },

  actions: {
    async login(context, userData) {
      const response = await login(userData);

      context.commit("SET_AUTH", response);
    },

    async changeUserPassword(context, userData) {
      await changeUserPassword(userData);
    },

    async verifyAuth(context) {
      const { isAuthenticatedUser } = context.getters;

      if (isAuthenticatedUser) {
        ApiService.setHeader();
      } else {
        await context.dispatch("clearAuth");
      }
    },

    clearAuth(context) {
      context.commit("PURGE_AUTH");

      JwtService.destroyAuthToken();

      window.location = "/login";
    },

    async logout(context) {
      // await logout();

      context.dispatch("clearAuth");
    },
  },
};
