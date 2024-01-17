import Vue from "vue";
import Router from "vue-router";
import mainLayout from "@/router/layouts/mainLayout";
import errorLayout from "@/router/layouts/errorLayout";
import authLayout from "@/router/layouts/authLayout";
import emptyLayout from "@/router/layouts/emptyLayout";
import guard from "@/router/guard";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.VUE_APP_BASE_PATH,
  routes: [
    ...authLayout,
    ...errorLayout,
    ...mainLayout,
    ...emptyLayout,
    {
      path: "*",
      redirect: "/404",
    },
  ],
});

router.beforeEach(guard);

export default router;
