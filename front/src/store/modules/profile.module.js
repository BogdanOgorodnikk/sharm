import { getUserProfile } from "@/api/profile";

export default {
  namespaced: true,
  state: {
    profile: null,
  },

  mutations: {
    SET_USER_PROFILE(state, profile) {
      state.profile = profile;
    },
  },

  actions: {
    async getUserProfile(context, userId) {
      if (context.state.profile) return;

      const response = await getUserProfile(userId);

      context.commit("SET_USER_PROFILE", response);
    },
  },
};
