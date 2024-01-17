import ApiService from "@/services/api.service";
import QS from "qs";

export async function getPrices() {
  const response = await ApiService.get("/prices", null);

  return response.data;
}

export async function getPrice(id) {
  const response = await ApiService.get(`/price/${id}`, null);

  return response.data;
}

export async function addPrice(data) {
  const response = await ApiService.post("/prices", data, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function updatePrice(priceId, data) {
  const response = await ApiService.put(`/prices/${priceId}`, data, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function setRetailPrice(priceId) {
  const response = await ApiService.put(`/prices/retail/${priceId}`, null, {
    withNotify: true,
  });

  return response.data.data;
}

export async function massDeletePrices(params) {
  const QS_OPTIONS = {
    arrayFormat: "brackets",
    encode: false,
  };

  const paramsQueryString = QS.stringify(params, QS_OPTIONS);

  await ApiService.delete(`/prices?${paramsQueryString}`, {
    withNotify: true,
  });
}

export async function deletePrice(id) {
  await ApiService.delete(`/price/${id}`, null, {
    withNotify: true,
    delaySuccessNotify: true,
  });
}

export default {
  getPrices,
  getPrice,
  addPrice,
  updatePrice,
  setRetailPrice,
  massDeletePrices,
  deletePrice,
};
