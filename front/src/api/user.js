import ApiService from "@/services/api.service";

export const ROLES_CODE = {
  admin: "admin",
  client: "client",
};

export async function getUserProfile() {
  const response = await ApiService.get("/users/info", null);

  return response.data;
}

export async function getUser(id) {
  const response = await ApiService.get(`/user/${id}`, null);

  return response.data;
}

export async function getUsers() {
  const response = await ApiService.get(`/users`, null);

  return response.data;
}

export async function updateUser(userId, userData) {
  const response = await ApiService.put(`/user/${userId}`, userData, {
    withNotify: true,
  });

  return response.data.data;
}

export async function updateUserProfile(userData) {
  const response = await ApiService.put("/users/profile", userData, {
    withNotify: true,
  });

  return response.data.data;
}

export default {
  ROLES_CODE,
  getUserProfile,
  getUser,
  getUsers,
  updateUser,
  updateUserProfile,
};
