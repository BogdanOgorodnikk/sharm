import i18n from "@/plugins/vue-i18n";
import { ROLES_CODE } from "@/api/user";

const PricesList = () => import(/* webpackChunkName: "prices" */ "@/views/prices/index");
const PricesAdd = () => import(/* webpackChunkName: "prices" */ "@/views/prices/add");
const PricesEdit = () => import(/* webpackChunkName: "prices" */ "@/views/prices/edit");

const prices = [
  {
    path: "/prices",
    name: "PricesList",
    component: PricesList,
    meta: {
      title: i18n.t("title.prices"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "/prices/0",
    name: "PricesAdd",
    component: PricesAdd,
    meta: {
      title: i18n.t("title.pricesAdd"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "/prices/:id",
    name: "PricesEdit",
    component: PricesEdit,
    meta: {
      title: i18n.t("title.pricesEdit"),
      roles: [ROLES_CODE.admin],
    },
  },
];

export default prices;
