import {
  getProduct,
  getProducts,
  getRetailProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/api/product";
import { updateArray } from "@/services/data.service";

export default {
  namespaced: true,
  state: {
    product: null,
    products: [],
    retailProducts: [],
  },

  getters: {
    productsForSelect(state) {
      const products = state.products;

      return products.map((item) => ({
        id: item.id,
        label: item.name,
      }));
    },
  },

  mutations: {
    SET_PRODUCT(state, product = null) {
      state.product = product;
    },

    SET_RETAIL_PRODUCTS(state, products) {
      state.retailProducts = [...products];
    },

    SET_PRODUCTS(state, products) {
      if (products.length) {
        state.products = [...products];
      } else if (!Array.isArray(products)) {
        state.products.push(products);
      }
    },

    UPDATE_PRODUCT(state, product) {
      state.products = updateArray(state.products, [product]);
    },

    DELETE_PRODUCT(state, productId) {
      state.products = state.products.filter((product) => product.id !== productId);
    },
  },

  actions: {
    async getProduct(context, productId) {
      if (!productId) return;

      const response = await getProduct(productId);

      context.commit("SET_PRODUCT", response);
    },

    async getProducts(context, clientId) {
      const response = await getProducts(clientId);

      context.commit("SET_PRODUCTS", response);
    },

    async getRetailProducts(context) {
      if (context.state.retailProducts.length && context.state.retailProducts.length !== 1) return;

      const response = await getRetailProducts();

      context.commit("SET_RETAIL_PRODUCTS", response);
    },

    async addProduct(context, product) {
      const response = await addProduct(product);

      context.commit("SET_PRODUCTS", response);
    },

    async updateProduct(context, { productId, data }) {
      const response = await updateProduct(productId, data);

      context.commit("UPDATE_PRODUCT", response);
    },

    async deleteProduct(context, { productId, delaySuccessNotify = false }) {
      await deleteProduct(productId, delaySuccessNotify);

      context.commit("DELETE_PRODUCT", productId);
    },
  },
};
