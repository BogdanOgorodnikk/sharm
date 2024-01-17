import ApiService from "@/services/api.service";

export async function getToggleMechanisms() {
  const response = await ApiService.get("/toggle-mechanisms", null);

  return response.data;
}

export async function getToggleMechanism(id) {
  const response = await ApiService.get(`/toggle-mechanism/${id}`, null);

  return response.data;
}

export async function addToggleMechanism(data) {
  const response = await ApiService.post("/toggle-mechanisms", data, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function updateToggleMechanism(data) {
  const response = await ApiService.put(`/toggle-mechanisms/${data.id}`, data, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function deleteToggleMechanism(id, delaySuccessNotify) {
  await ApiService.delete(`/toggle-mechanisms/${id}`, null, {
    withNotify: true,
    delaySuccessNotify,
  });
}

export default {
  getToggleMechanisms,
  getToggleMechanism,
  addToggleMechanism,
  updateToggleMechanism,
  deleteToggleMechanism,
};
