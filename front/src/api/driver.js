import ApiService from "@/services/api.service";

export async function getDrivers() {
  const response = await ApiService.get("/drivers", null);

  return response.data;
}

export async function getDriver(id) {
  const response = await ApiService.get(`/driver/${id}`, null);

  return response.data;
}

export async function addDriver(data) {
  const response = await ApiService.post("/drivers", data, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function updateDriver(data) {
  const response = await ApiService.put(`/drivers/${data.id}`, data, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function deleteDriver(id, delaySuccessNotify) {
  await ApiService.delete(`/drivers/${id}`, null, {
    withNotify: true,
    delaySuccessNotify,
  });
}

export default {
  getDrivers,
  getDriver,
  addDriver,
  updateDriver,
  deleteDriver,
};
