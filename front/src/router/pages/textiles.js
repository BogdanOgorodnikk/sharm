import i18n from "@/plugins/vue-i18n";

const ClientTextileList = () => import(/* webpackChunkName: "textiles" */ "@/views/textiles/index");

const textiles = [
  {
    path: "/textiles",
    name: "ClientTextileList",
    component: ClientTextileList,
    meta: {
      title: i18n.t("title.textiles"),
    },
  },
];

export default textiles;
