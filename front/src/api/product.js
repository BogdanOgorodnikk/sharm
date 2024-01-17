import ApiService from "@/services/api.service";

export const PRODUCT_TYPE = {
  sofa: "sofa",
  cornerSofa: "cornerSofa",
  bed: "bed",
  modularSystem: "modularSystem",
};

export async function getProducts(clientId) {
  const route = clientId ? `/products?userId=${clientId}` : "/products";

  const response = await ApiService.get(route, null);

  return response.data;
}

export async function getRetailProducts() {
  const response = await ApiService.get("/retail/products", null);

  return response.data;
}

export async function getProduct(id) {
  const response = await ApiService.get(`/product/${id}`, null);

  return response.data;
}

export async function addProduct(data) {
  const response = await ApiService.post("/products", data, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function updateProduct(productId, data) {
  const response = await ApiService.put(`/products/${productId}`, data, {
    withNotify: true,
    delaySuccessNotify: true,
  });

  return response.data.data;
}

export async function deleteProduct(id, delaySuccessNotify) {
  await ApiService.delete(`/product/${id}`, null, {
    withNotify: true,
    delaySuccessNotify,
  });
}

export default {
  PRODUCT_TYPE,
  getProducts,
  getRetailProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
};
