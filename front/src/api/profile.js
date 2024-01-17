import ApiService from "@/services/api.service";

export async function getUserProfile(userId) {
  const response = await ApiService.get(`/customer-management/customer/${userId}`);

  return response.data;
}

export default {
  getUserProfile,
};
