import ApiService from "@/services/api.service";

export async function getFillings() {
  const response = await ApiService.get("/fillings", null);

  return response.data;
}

export async function getFilling(id) {
  const response = await ApiService.get(`/filling/${id}`, null);

  return response.data;
}

export async function addFilling(data) {
  const response = await ApiService.post("/fillings", data, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function updateFilling(data) {
  const response = await ApiService.put(`/fillings/${data.id}`, data, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function deleteFilling(id, delaySuccessNotify) {
  await ApiService.delete(`/fillings/${id}`, null, {
    withNotify: true,
    delaySuccessNotify,
  });
}

export default {
  getFillings,
  getFilling,
  addFilling,
  updateFilling,
  deleteFilling,
};
