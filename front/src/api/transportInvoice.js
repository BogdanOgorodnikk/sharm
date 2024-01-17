import ApiService from "@/services/api.service";

export async function getTransportInvoices() {
  const response = await ApiService.get("/transport-invoices", null);

  return response.data;
}

export async function getTransportInvoice(id) {
  const response = await ApiService.get(`/transport-invoice/${id}`, null);

  return response.data;
}

export async function addTransportInvoice(data) {
  const response = await ApiService.post("/transport-invoices", data, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function updateTransportInvoice(data) {
  const response = await ApiService.put(`/transport-invoices/${data.id}`, data, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function deleteTransportInvoice(id, delaySuccessNotify) {
  await ApiService.delete(`/transport-invoices/${id}`, null, {
    withNotify: true,
    delaySuccessNotify,
  });
}

export default {
  getTransportInvoices,
  getTransportInvoice,
  addTransportInvoice,
  updateTransportInvoice,
  deleteTransportInvoice,
};
