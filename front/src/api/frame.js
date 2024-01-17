import ApiService from "@/services/api.service";

export async function getFrames() {
  const response = await ApiService.get("/frames", null);

  return response.data;
}

export async function getFrame(id) {
  const response = await ApiService.get(`/frame/${id}`, null);

  return response.data;
}

export async function addFrame(data) {
  const response = await ApiService.post("/frames", data, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function updateFrame(data) {
  const response = await ApiService.put(`/frames/${data.id}`, data, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function deleteFrame(id, delaySuccessNotify) {
  await ApiService.delete(`/frames/${id}`, null, {
    withNotify: true,
    delaySuccessNotify,
  });
}

export default {
  getFrames,
  getFrame,
  addFrame,
  updateFrame,
  deleteFrame,
};
