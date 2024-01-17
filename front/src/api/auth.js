import ApiService from "@/services/api.service";

export async function login(userData) {
  const response = await ApiService.post("/login", userData);

  return response.data;
}

export async function signUp(userData) {
  await ApiService.post("/register", userData, {
    withNotify: true,
  });
}

export async function resetPassword(userData) {
  ApiService.put("/reset-password", userData, {
    withNotify: true,
  });
}

export async function changeUserPassword(userData) {
  await ApiService.put("/users/change-password", userData, {
    withNotify: true,
  });
}

export async function logout() {
  await ApiService.post("/logout", null, { isMainBaseUrl: true });
}

export default {
  login,
  resetPassword,
  changeUserPassword,
  logout,
  signUp,
};
