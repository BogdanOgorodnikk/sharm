import store from "@/store";

const loader = {
  on: (apiEndpoint) => store.commit("loader/SET_LOADING_ON", apiEndpoint),
  off: (apiEndpoint) => store.commit("loader/SET_LOADING_OFF", apiEndpoint),
};

export default loader;
