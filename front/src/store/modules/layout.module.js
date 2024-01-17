export default {
  namespaced: true,

  state: {
    isOpenPortableAside: false,
    isOpenDesktopAside: true,
    fixedAsideMenu: true,
    wideContent: false,
    isOpenMenu: false,
    isShownDesktopHeader: true,
  },

  getters: {
    isOpenMobileMenu(state, getters, rootState, rootGetters) {
      const { isOpenMenu, isShownDesktopHeader } = state;
      const isMobileDevice = rootGetters["breakpoint/isMobileDevice"];

      return isMobileDevice ? isOpenMenu : isShownDesktopHeader;
    },

    isOpenAsideMenu(state, getters, rootState, rootGetters) {
      const { isOpenPortableAside, isOpenDesktopAside } = state;
      const isPortableDevice = rootGetters["breakpoint/isPortableDevice"];

      return isPortableDevice ? isOpenPortableAside : isOpenDesktopAside;
    },
  },

  mutations: {
    SET_WIDE_CONTENT(state) {
      state.wideContent = true;
    },

    OPEN_PORTABLE_ASIDE(state) {
      state.isOpenPortableAside = true;
    },

    CLOSE_PORTABLE_ASIDE(state) {
      state.isOpenPortableAside = false;
    },

    TOGGLE_PORTABLE_ASIDE(state) {
      state.isOpenPortableAside = !state.isOpenPortableAside;
    },

    OPEN_DESKTOP_ASIDE(state) {
      state.isOpenDesktopAside = true;
    },

    CLOSE_DESKTOP_ASIDE(state) {
      state.isOpenDesktopAside = false;
    },

    TOGGLE_FIXED_MENU(state) {
      state.fixedAsideMenu = !state.fixedAsideMenu;
    },

    CLOSE_MENU(state) {
      state.isOpenMenu = false;
    },

    TOGGLE_MENU(state) {
      state.isOpenMenu = !state.isOpenMenu;
    },
  },
};
