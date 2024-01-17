import { getFillings, getFilling, addFilling, updateFilling, deleteFilling } from "@/api/filling";
import { updateArray } from "@/services/data.service";

export default {
  namespaced: true,
  state: {
    filling: null,
    fillings: [],
  },

  getters: {
    fillingsForSelect(state) {
      const fillings = state.fillings;

      return fillings.map((item) => ({
        id: item.id,
        label: item.name,
      }));
    },
  },

  mutations: {
    SET_FILLING(state, filling = null) {
      state.filling = filling;
    },

    SET_FILLINGS(state, fillings) {
      if (fillings.length) {
        state.fillings = [...fillings];
      } else if (!Array.isArray(fillings)) {
        state.fillings.push(fillings);
      }
    },

    UPDATE_FILLING(state, filling) {
      state.fillings = updateArray(state.fillings, [filling]);
    },

    DELETE_FILLING(state, fillingId) {
      state.fillings = state.fillings.filter((filling) => filling.id !== fillingId);
    },
  },

  actions: {
    async getFilling(context, fillingId) {
      if (!fillingId) return;

      const response = await getFilling(fillingId);

      context.commit("SET_FILLING", response);
    },

    async getFillings(context) {
      if (context.state.fillings.length && context.state.fillings.length !== 1) return;

      const response = await getFillings();

      context.commit("SET_FILLINGS", response);
    },

    async addFilling(context, filling) {
      const response = await addFilling(filling);

      context.commit("SET_FILLINGS", response);
    },

    async updateFilling(context, filling) {
      const response = await updateFilling(filling);

      context.commit("UPDATE_FILLING", response);
    },

    async deleteFilling(context, { fillingId, delaySuccessNotify = false }) {
      await deleteFilling(fillingId, delaySuccessNotify);

      context.commit("DELETE_FILLING", fillingId);
    },
  },
};
