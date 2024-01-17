import ApiService from "@/services/api.service";

export const ORDER_CODES = {
  cancel: "cancel",
  expected: "expected",
  inProgress: "inProgress",
  finished: "finished",
};

export async function getOrders() {
  const response = await ApiService.get("/orders", null);

  return response.data;
}

export async function getOrder(id) {
  const response = await ApiService.get(`/order/${id}`, null);

  return response.data;
}

export async function getClientOrders(clientId) {
  const response = await ApiService.get(`/orders/${clientId}`, null);

  return response.data;
}

export async function getOrderInfo(orderId) {
  const response = await ApiService.get(`/orders/info/${orderId}`, null);

  return response.data;
}

export async function getOrderProduct(orderProductId) {
  const response = await ApiService.get(`/orders/product/${orderProductId}`, null);

  return response.data;
}

export async function addOrders(data, delaySuccessNotify = false) {
  const response = await ApiService.post("/orders", data, {
    withNotify: true,
    delaySuccessNotify,
  });

  return response.data.data;
}

export async function updateOrder(orderId, data) {
  const response = await ApiService.put(`/orders/${orderId}`, data, {
    withNotify: true,
  });

  return response.data.data;
}

export async function addOrderProduct(orderId, data) {
  const response = await ApiService.post(`/orders/product/${orderId}`, data, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function updateOrderProduct(orderProductId, data) {
  const response = await ApiService.put(`/orders/product/${orderProductId}`, data, {
    withNotify: true,
  });

  return response.data.data;
}

export async function deleteOrder(id) {
  await ApiService.delete(`/order/${id}`, null, {
    withNotify: true,
  });
}

export async function deleteOrderProduct(id, delaySuccessNotify = false) {
  await ApiService.delete(`/order/product/${id}`, null, {
    withNotify: true,
    delaySuccessNotify,
  });
}

export default {
  ORDER_CODES,
  getOrders,
  getClientOrders,
  getOrderInfo,
  getOrderProduct,
  addOrders,
  updateOrder,
  updateOrderProduct,
  deleteOrder,
  deleteOrderProduct,
};
