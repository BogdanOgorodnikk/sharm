import ApiService from "@/services/api.service";

export async function getCars() {
  const response = await ApiService.get("/cars", null);

  return response.data;
}

export async function getCar(id) {
  const response = await ApiService.get(`/car/${id}`, null);

  return response.data;
}

export async function addCar(data) {
  const response = await ApiService.post("/cars", data, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function updateCar(data) {
  const response = await ApiService.put(`/cars/${data.id}`, data, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function deleteCar(id, delaySuccessNotify) {
  await ApiService.delete(`/cars/${id}`, null, {
    withNotify: true,
    delaySuccessNotify,
  });
}

export default {
  getCars,
  getCar,
  addCar,
  updateCar,
  deleteCar,
};
