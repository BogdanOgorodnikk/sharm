import { getUserProfile, getUsers, ROLES_CODE, updateUser, updateUserProfile } from "@/api/user";
import { updateArray } from "@/services/data.service";

export default {
  namespaced: true,
  state: {
    user: null,
    users: [],
    languages: [
      {
        code: "ua",
        label: "Українська",
        slug: "Укр",
      },
      {
        code: "en",
        label: "English",
        slug: "Eng",
      },
    ],
  },

  getters: {
    user(state) {
      return state.user;
    },

    userRole(state) {
      return state.user.roleCode;
    },

    userName(state) {
      return state.user?.name;
    },

    userEmail(state) {
      return state.user?.email;
    },

    languages(state) {
      return state.languages;
    },

    isAdmin(state) {
      return state.user.roleCode === ROLES_CODE.admin;
    },

    usersForSelect(state) {
      const clients = state.users.filter((item) => item.roleCode === ROLES_CODE.client);

      return clients.map((item) => ({
        id: item.id,
        label: item.name,
      }));
    },

    usersForSelectWithPrice(state) {
      const clients = state.users.filter(
        (item) => item.roleCode === ROLES_CODE.client && item.priceId && item.priceName
      );

      return clients.map((item) => ({
        id: item.id,
        label: item.name,
      }));
    },
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },

    SET_USERS(state, users) {
      state.users = users;
    },

    UPDATE_USER(state, user) {
      state.users = updateArray(state.users, [user]);
    },
  },

  actions: {
    async getUserProfile(context) {
      if (context.state.user) return;

      const response = await getUserProfile();

      context.commit("SET_USER", response);
    },

    async getUsers(context) {
      if (context.state.users.length) return;

      const response = await getUsers();

      context.commit("SET_USERS", response);
    },

    async updateUser(context, userData) {
      const response = await updateUser(userData.id, userData);

      context.commit("UPDATE_USER", response);
    },

    async updateUserProfile(context, userData) {
      const response = await updateUserProfile(userData);

      context.commit("SET_USER", response);
    },
  },
};
