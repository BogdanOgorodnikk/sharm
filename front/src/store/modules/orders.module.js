import { addOrders, getOrders, updateOrder } from "@/api/orders";
import { updateArray } from "@/services/data.service";

export default {
  namespaced: true,
  state: {
    order: null,
    orders: [],
  },

  mutations: {
    SET_ORDERS(state, orders) {
      if (orders.length) {
        state.orders = [...orders];
      } else if (!Array.isArray(orders)) {
        state.orders.push(orders);
      }
    },

    UPDATE_ORDER(state, order) {
      state.orders = updateArray(state.orders, [order]);
    },
  },

  actions: {
    async getOrders(context) {
      const response = await getOrders();

      context.commit("SET_ORDERS", response);
    },

    async addOrders(context, order) {
      const response = await addOrders(order);

      context.commit("SET_ORDERS", response);
    },

    async updateOrder(context, { orderId, data }) {
      const response = await updateOrder(orderId, data);

      context.commit("UPDATE_ORDER", response);
    },
  },
};
