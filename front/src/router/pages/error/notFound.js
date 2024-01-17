import i18n from "@/plugins/vue-i18n";

const NotFound = () => import(/* webpackChunkName: "error" */ "@/views/error/NotFound");

const error = [
  {
    path: "/404",
    name: "NotFound",
    component: NotFound,
    meta: {
      title: i18n.t("title.error.notFound"),
    },
  },
];

export default error;
