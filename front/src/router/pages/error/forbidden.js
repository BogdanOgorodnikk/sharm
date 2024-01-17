import i18n from "@/plugins/vue-i18n";

const Forbidden = () => import(/* webpackChunkName: "error" */ "@/views/error/Forbidden");

const error = [
  {
    path: "/403",
    name: "Forbidden",
    component: Forbidden,
    meta: {
      title: i18n.t("title.error.forbidden"),
    },
  },
];

export default error;
