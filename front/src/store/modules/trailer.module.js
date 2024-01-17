import { getTrailers, getTrailer, addTrailer, updateTrailer, deleteTrailer } from "@/api/trailer";
import { updateArray } from "@/services/data.service";

export default {
  namespaced: true,
  state: {
    trailer: null,
    trailers: [],
  },

  getters: {
    trailersForSelect(state) {
      const trailers = state.trailers;

      return trailers.map((item) => ({
        id: item.id,
        label: `${item.brand} ${item.model} ${item.license_plate}`,
      }));
    },
  },

  mutations: {
    SET_TRAILER(state, trailer = null) {
      state.trailer = trailer;
    },

    SET_TRAILERS(state, trailers) {
      if (Array.isArray(trailers) && trailers.length) {
        state.trailers = [...trailers];
      } else if (!Array.isArray(trailers)) {
        state.trailers.push(trailers);
      }
    },

    UPDATE_TRAILER(state, trailer) {
      state.trailers = updateArray(state.trailers, [trailer]);
    },

    DELETE_TRAILER(state, trailerId) {
      state.trailers = state.trailers.filter((trailer) => trailer.id !== trailerId);
    },
  },

  actions: {
    async getTrailer(context, trailerId) {
      if (!trailerId) return;

      const response = await getTrailer(trailerId);

      context.commit("SET_TRAILER", response);
    },

    async getTrailers(context) {
      if (context.state.trailers.length && context.state.trailers.length !== 1) return;

      const response = await getTrailers();

      context.commit("SET_TRAILERS", response);
    },

    async addTrailer(context, trailer) {
      const response = await addTrailer(trailer);

      context.commit("SET_TRAILERS", response);
    },

    async updateTrailer(context, trailer) {
      const response = await updateTrailer(trailer);

      context.commit("UPDATE_TRAILER", response);
    },

    async deleteTrailer(context, { trailerId, delaySuccessNotify = false }) {
      await deleteTrailer(trailerId, delaySuccessNotify);

      context.commit("DELETE_TRAILER", trailerId);
    },
  },
};
