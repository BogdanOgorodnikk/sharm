import { getPayments, getPayment, addPayment, updatePayment, deletePayment } from "@/api/payments";
import { updateArray } from "@/services/data.service";

export default {
  namespaced: true,
  state: {
    payment: null,
    payments: [],
  },

  mutations: {
    SET_PAYMENT(state, payment = null) {
      state.payment = payment;
    },

    SET_PAYMENTS(state, payments) {
      if (payments === null) {
        return (state.payments = []);
      }

      if (payments.length) {
        state.payments = [...payments];
      } else if (!Array.isArray(payments)) {
        state.payments.unshift(payments);
      }
    },

    UPDATE_PAYMENT(state, payment) {
      state.payments = updateArray(state.payments, [payment]);
    },

    DELETE_PAYMENT(state, paymentId) {
      state.payments = state.payments.filter((payment) => payment.id !== paymentId);
    },
  },

  actions: {
    async getPayment(context, paymentId) {
      if (!paymentId) return;

      const response = await getPayment(paymentId);

      context.commit("SET_PAYMENT", response);
    },

    async getPayments(context, clientId) {
      if (context.state.payments.length && context.state.payments.length !== 1) return;

      const response = await getPayments(clientId);

      context.commit("SET_PAYMENTS", response);
    },

    async addPayment(context, payment) {
      const response = await addPayment(payment);

      context.commit("SET_PAYMENTS", response);
    },

    async updatePayment(context, payment) {
      const response = await updatePayment(payment.id, payment);

      context.commit("UPDATE_PAYMENT", response);
    },

    async deletePayment(context, { paymentId, delaySuccessNotify }) {
      await deletePayment(paymentId, delaySuccessNotify);

      context.commit("DELETE_PAYMENT", paymentId);
    },
  },
};
