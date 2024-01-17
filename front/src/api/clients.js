import ApiService from "@/services/api.service";

export async function getClients() {
  const response = await ApiService.get("/clients", null);

  return response.data;
}

export async function getClientDebt(clientId) {
  const response = await ApiService.get(`/client-debt/${clientId}`, null);

  return response.data;
}

export default {
  getClients,
  getClientDebt,
};
