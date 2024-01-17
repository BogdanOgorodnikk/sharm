import ApiService from "@/services/api.service";
import QS from "qs";

export async function getTextiles() {
  const response = await ApiService.get("/textiles", null);

  return response.data;
}

export async function getTextile(id) {
  const response = await ApiService.get(`/textile/${id}`, null);

  return response.data;
}

export async function addTextile(data) {
  const response = await ApiService.post("/textiles", data, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function updateTextile(textileId, data) {
  const response = await ApiService.put(`/textiles/${textileId}`, data, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function massDeleteTextiles(params) {
  const QS_OPTIONS = {
    arrayFormat: "brackets",
    encode: false,
  };

  const paramsQueryString = QS.stringify(params, QS_OPTIONS);

  await ApiService.delete(`/textiles?${paramsQueryString}`, {
    withNotify: true,
  });
}

export async function deleteTextile(id) {
  await ApiService.delete(`/textile/${id}`, null, {
    withNotify: true,
    delaySuccessNotify: true,
  });
}

export default {
  getTextile,
  getTextiles,
  addTextile,
  updateTextile,
  massDeleteTextiles,
  deleteTextile,
};
