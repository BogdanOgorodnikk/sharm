import {
  getPrices,
  getPrice,
  addPrice,
  updatePrice,
  setRetailPrice,
  massDeletePrices,
  deletePrice,
} from "@/api/prices";
import { updateArray } from "@/services/data.service";

export default {
  namespaced: true,
  state: {
    price: null,
    prices: [],
  },

  getters: {
    pricesForSelect(state) {
      const prices = state.prices.filter((item) => !item.isRetail);

      return prices.map((item) => ({
        id: item.id,
        label: item.name,
      }));
    },
  },

  mutations: {
    SET_PRICE(state, price = null) {
      state.price = price;
    },

    SET_PRICES(state, prices) {
      if (prices.length) {
        state.prices = [...prices];
      } else if (!Array.isArray(prices)) {
        state.prices.push(prices);
      }
    },

    UPDATE_PRICE(state, price) {
      state.prices = updateArray(state.prices, [price]);
    },

    DELETE_PRICES(state, priceIds) {
      priceIds.forEach((id) => {
        state.prices.forEach((price, index) => {
          if (price.id === id) {
            state.prices.splice(index, 1);
          }
        });
      });
    },

    DELETE_PRICE(state, priceId) {
      state.prices = state.prices.filter((price) => price.id !== priceId);
    },
  },

  actions: {
    async getPrice(context, priceId) {
      if (!priceId) return;

      const response = await getPrice(priceId);

      context.commit("SET_PRICE", response);
    },

    async getPrices(context) {
      if (context.state.prices.length && context.state.prices.length !== 1) return;

      const response = await getPrices();

      context.commit("SET_PRICES", response);
    },

    async addPrice(context, price) {
      const response = await addPrice(price);

      context.commit("SET_PRICES", response);
    },

    async updatePrice(context, price) {
      const response = await updatePrice(price.id, price);

      context.commit("UPDATE_PRICE", response);
    },

    async setRetailPrice(context, priceId) {
      const response = await setRetailPrice(priceId);

      context.commit("UPDATE_PRICE", response);
    },

    async massDeletePrices(context, params) {
      await massDeletePrices(params);

      context.commit("DELETE_PRICES", params.ids);
    },

    async deletePrice(context, priceId) {
      await deletePrice(priceId);

      context.commit("DELETE_PRICE", priceId);
    },
  },
};
