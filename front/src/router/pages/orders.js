import i18n from "@/plugins/vue-i18n";
import { ROLES_CODE } from "@/api/user";

const OrdersList = () => import(/* webpackChunkName: "orders" */ "@/views/orders/index");
const OrdersInfo = () => import(/* webpackChunkName: "orders" */ "@/views/orders/info");
const OrdersAddProduct = () => import(/* webpackChunkName: "orders" */ "@/views/orders/add");
const OrdersEditProduct = () => import(/* webpackChunkName: "orders" */ "@/views/orders/edit");

const orders = [
  {
    path: "/orders",
    name: "OrdersList",
    component: OrdersList,
    meta: {
      title: i18n.t("title.allOrders"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "/orders/product/add/:orderId",
    name: "OrdersAddProduct",
    component: OrdersAddProduct,
    meta: {
      title: i18n.t("title.ordersAddProduct"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "/orders/product/:id",
    name: "OrdersEditProduct",
    component: OrdersEditProduct,
    meta: {
      title: i18n.t("title.ordersEdit"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "/orders/:id",
    name: "OrdersInfo",
    component: OrdersInfo,
    meta: {
      title: i18n.t("title.ordersInfo"),
      roles: [ROLES_CODE.admin],
    },
  },
];

export default orders;
