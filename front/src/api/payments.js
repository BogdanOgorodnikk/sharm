import ApiService from "@/services/api.service";

export async function getPayments(clientId) {
  let params = clientId ? `?clientId= ${clientId}` : "";

  const response = await ApiService.get(`/payments${params}`, null);

  return response.data;
}

export async function getPayment(id) {
  const response = await ApiService.get(`/payment/${id}`, null);

  return response.data;
}

export async function addPayment(data) {
  const response = await ApiService.post(`/payments`, data, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function updatePayment(id, data) {
  const response = await ApiService.put(`/payments/${id}`, data, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function deletePayment(id, delaySuccessNotify = false) {
  await ApiService.delete(`/payment/${id}`, null, {
    withNotify: true,
    delaySuccessNotify,
  });
}

export default {
  getPayments,
  getPayment,
  addPayment,
  updatePayment,
  deletePayment,
};
