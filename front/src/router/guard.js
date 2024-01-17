import store from "@/store";
import Meta from "@/router/meta";
import storage from "@/services/storage.service";
import notify from "@/services/notify.service";
import ApiService from "@/services/api.service";

function setDelayNotify() {
  const notifyData = storage.getObj("notify");

  notify.clearAll();

  if (notifyData) {
    const { type, message } = notifyData;

    notify[type](message);

    storage.removeObj("notify");
  }
}

export default async (to, from, next) => {
  const authPages = ["Login", "SignUp", "ForgotPassword"];
  const isAuthPage = authPages.includes(to.name);
  const { isAuthenticatedUser } = store.getters;
  const { user } = store.state.user;
  const isWideContent = store.state.layout.wideContent;

  // Meta data service
  Meta.setDocumentMeta(" / ", "ШАРМ", to, from);

  ApiService.setHeader();

  // Scroll up when all page is loaded
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 100);

  setDelayNotify();

  if (isWideContent) {
    store.state.layout.wideContent = false;
  }

  if (isAuthPage) {
    isAuthenticatedUser ? next({ name: "MainLayout" }) : next();
  } else {
    await store.dispatch("verifyAuth");

    if (isAuthenticatedUser && !user) {
      await store.dispatch("user/getUserProfile");
    }

    if (to.meta?.roles?.length) {
      const pageAccessRoles = to.meta.roles;
      const userRole = store.getters["user/userRole"];
      const isNeededRole = pageAccessRoles.find((item) => item === userRole);

      if (!isNeededRole) {
        return next({ name: "Products" });
      }
    }

    next();
  }
};
