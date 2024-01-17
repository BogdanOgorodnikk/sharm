export default {
  namespaced: true,

  state: {
    isLoading: false,
    showLoader: false,
    loaderTimeout: "",
    requestsTimeout: "",
    requestQuare: [],
  },

  mutations: {
    SET_LOADING_ON: (state, apiEndpoint) => {
      state.requestQuare.push(apiEndpoint);
      state.isLoading = true;
      state.showLoader = true;

      clearTimeout(state.requestsTimeout);
      clearTimeout(state.loaderTimeout);
    },

    SET_LOADING_OFF: (state, apiEndpoint) => {
      state.requestQuare.forEach((item, index) => {
        if (item === apiEndpoint) {
          state.requestQuare.splice(index, 1);
        }
      });

      state.requestsTimeout = setTimeout(() => {
        if (!state.requestQuare.length) {
          // state.loaderTimeout = setTimeout(() => {
          state.isLoading = false;
          // }, 500);
        }

        if (!state.isLoading) {
          state.loaderTimeout = setTimeout(() => {
            state.showLoader = false;
          }, 600);
        }
      }, 50);
    },
  },
};
