import ApiService from "@/services/api.service";

export async function getTrailers() {
  const response = await ApiService.get("/trailers", null);

  return response.data;
}

export async function getTrailer(id) {
  const response = await ApiService.get(`/trailer/${id}`, null);

  return response.data;
}

export async function addTrailer(data) {
  const response = await ApiService.post("/trailers", data, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function updateTrailer(data) {
  const response = await ApiService.put(`/trailers/${data.id}`, data, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function deleteTrailer(id, delaySuccessNotify) {
  await ApiService.delete(`/trailers/${id}`, null, {
    withNotify: true,
    delaySuccessNotify,
  });
}

export default {
  getTrailers,
  getTrailer,
  addTrailer,
  updateTrailer,
  deleteTrailer,
};
