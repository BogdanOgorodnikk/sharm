import i18n from "@/plugins/vue-i18n";
import { ROLES_CODE } from "@/api/user";

const ClientsList = () => import(/* webpackChunkName: "clients" */ "@/views/clients/index");
const ClientsOrders = () => import(/* webpackChunkName: "clients" */ "@/views/clients/orders");
const ClientOrderInfo = () => import(/* webpackChunkName: "clients" */ "@/views/clients/info");
const ClientAddProduct = () => import(/* webpackChunkName: "clients" */ "@/views/clients/add");
const ClientEditProduct = () => import(/* webpackChunkName: "clients" */ "@/views/clients/edit");

const clients = [
  {
    path: "/clients",
    name: "ClientsList",
    component: ClientsList,
    meta: {
      title: i18n.t("title.clients"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "/clients/:id",
    name: "ClientsOrders",
    component: ClientsOrders,
    meta: {
      title: i18n.t("title.clientsOrders"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "/clients/product/add/:orderId",
    name: "ClientAddProduct",
    component: ClientAddProduct,
    meta: {
      title: i18n.t("title.ordersAddProduct"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "/clients/product/:id",
    name: "ClientEditProduct",
    component: ClientEditProduct,
    meta: {
      title: i18n.t("title.ordersEdit"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "/clients/order/:id",
    name: "ClientOrderInfo",
    component: ClientOrderInfo,
    meta: {
      title: i18n.t("title.ordersInfo"),
      roles: [ROLES_CODE.admin],
    },
  },
];

export default clients;
