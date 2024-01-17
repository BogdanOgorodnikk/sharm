import {
  getTextile,
  getTextiles,
  addTextile,
  updateTextile,
  massDeleteTextiles,
  deleteTextile,
} from "@/api/textile";
import { updateArray } from "@/services/data.service";
import i18n from "@/plugins/vue-i18n";

export default {
  namespaced: true,
  state: {
    textile: null,
    textiles: [],
  },

  getters: {
    textilesForSelect(state, getters, rootState) {
      const textiles = state.textiles;

      return (productId) => {
        const { products } = rootState.product;
        const selectedProduct = products.find((item) => item.id === productId);
        let allowedCategories = [];

        if (selectedProduct?.specialPrice) allowedCategories.push(0);
        if (selectedProduct?.firstCategory) allowedCategories.push(1);
        if (selectedProduct?.secondCategory) allowedCategories.push(2);
        if (selectedProduct?.thirdaryCategory) allowedCategories.push(3);
        if (selectedProduct?.fourthCategory) allowedCategories.push(4);
        if (selectedProduct?.fivesCategory) allowedCategories.push(5);

        return allowedCategories.map((item) => {
          const allowedTextiles = textiles.filter((textile) => textile.category === item);

          return {
            category: i18n.t("label.categoryNumber", { title: item }),
            textiles: allowedTextiles.map((textile) => ({
              id: textile.id,
              label: textile.name,
            })),
          };
        });
      };
    },
  },

  mutations: {
    SET_TEXTILE(state, textile = null) {
      state.textile = textile;
    },

    SET_TEXTILES(state, textiles) {
      if (textiles.length) {
        state.textiles = [...textiles];
      } else if (!Array.isArray(textiles)) {
        state.textiles.push(textiles);
      }
    },

    UPDATE_TEXTILE(state, textile) {
      state.textiles = updateArray(state.textiles, [textile]);
    },

    DELETE_TEXTILE(state, textileId) {
      state.textiles = state.textiles.filter((textile) => textile.id !== textileId);
    },

    DELETE_TEXTILES(state, textileIds) {
      textileIds.forEach((id) => {
        state.textiles.forEach((textile, index) => {
          if (textile.id === id) {
            state.textiles.splice(index, 1);
          }
        });
      });
    },
  },

  actions: {
    async getTextile(context, textileId) {
      if (!textileId) return;

      const response = await getTextile(textileId);

      context.commit("SET_TEXTILE", response);
    },

    async getTextiles(context) {
      if (context.state.textiles.length && context.state.textiles.length !== 1) return;

      const response = await getTextiles();

      context.commit("SET_TEXTILES", response);
    },

    async addTextile(context, textile) {
      const response = await addTextile(textile);

      context.commit("SET_TEXTILES", response);
    },

    async updateTextile(context, { textileId, data }) {
      const response = await updateTextile(textileId, data);

      context.commit("UPDATE_TEXTILE", response);
    },

    async massDeleteTextiles(context, params) {
      await massDeleteTextiles(params);

      context.commit("DELETE_TEXTILES", params.ids);
    },

    async deleteTextile(context, textileId) {
      await deleteTextile(textileId);

      context.commit("DELETE_TEXTILE", textileId);
    },
  },
};
