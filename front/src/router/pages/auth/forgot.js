import i18n from "@/plugins/vue-i18n";

const ForgotPassword = () => import(/* webpackChunkName: "auth" */ "@/views/auth/forgotPassword");

const forgot = [
  {
    path: "/forgot",
    name: "ForgotPassword",
    component: ForgotPassword,
    meta: {
      title: i18n.t("title.forgotPassword"),
    },
  },
];

export default forgot;
