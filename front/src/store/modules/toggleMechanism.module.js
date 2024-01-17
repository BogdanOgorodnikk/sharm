import {
  getToggleMechanisms,
  getToggleMechanism,
  addToggleMechanism,
  updateToggleMechanism,
  deleteToggleMechanism,
} from "@/api/toggleMechanism";
import { updateArray } from "@/services/data.service";

export default {
  namespaced: true,
  state: {
    toggleMechanism: null,
    toggleMechanisms: [],
  },

  getters: {
    toggleMechanismsForSelect(state) {
      const toggleMechanisms = state.toggleMechanisms;

      return toggleMechanisms.map((item) => ({
        id: item.id,
        label: item.name,
      }));
    },
  },

  mutations: {
    SET_TOGGLE_MECHANISM(state, toggleMechanism = null) {
      state.toggleMechanism = toggleMechanism;
    },

    SET_TOGGLE_MECHANISMS(state, toggleMechanisms) {
      if (toggleMechanisms.length) {
        state.toggleMechanisms = [...toggleMechanisms];
      } else if (!Array.isArray(toggleMechanisms)) {
        state.toggleMechanisms.push(toggleMechanisms);
      }
    },

    UPDATE_TOGGLE_MECHANISM(state, toggleMechanism) {
      state.toggleMechanisms = updateArray(state.toggleMechanisms, [toggleMechanism]);
    },

    DELETE_TOGGLE_MECHANISM(state, toggleMechanismId) {
      state.toggleMechanisms = state.toggleMechanisms.filter(
        (toggleMechanism) => toggleMechanism.id !== toggleMechanismId
      );
    },
  },

  actions: {
    async getToggleMechanism(context, toggleMechanismId) {
      if (!toggleMechanismId) return;

      const response = await getToggleMechanism(toggleMechanismId);

      context.commit("SET_TOGGLE_MECHANISM", response);
    },

    async getToggleMechanisms(context) {
      if (context.state.toggleMechanisms.length && context.state.toggleMechanisms.length !== 1) {
        return;
      }

      const response = await getToggleMechanisms();

      context.commit("SET_TOGGLE_MECHANISMS", response);
    },

    async addToggleMechanism(context, toggleMechanism) {
      const response = await addToggleMechanism(toggleMechanism);

      context.commit("SET_TOGGLE_MECHANISMS", response);
    },

    async updateToggleMechanism(context, toggleMechanism) {
      const response = await updateToggleMechanism(toggleMechanism);

      context.commit("UPDATE_TOGGLE_MECHANISM", response);
    },

    async deleteToggleMechanism(context, { toggleMechanismId, delaySuccessNotify = false }) {
      await deleteToggleMechanism(toggleMechanismId, delaySuccessNotify);

      context.commit("DELETE_TOGGLE_MECHANISM", toggleMechanismId);
    },
  },
};
