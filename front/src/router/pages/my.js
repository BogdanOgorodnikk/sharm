import i18n from "@/plugins/vue-i18n";
import { ROLES_CODE } from "@/api/user";

const MyOrders = () => import(/* webpackChunkName: "my" */ "@/views/my/orders/index");
const MyOrdersInfo = () => import(/* webpackChunkName: "my" */ "@/views/my/orders/info");
const MyOrdersAddProduct = () => import(/* webpackChunkName: "my" */ "@/views/my/orders/add");
const MyOrdersEditProduct = () => import(/* webpackChunkName: "my" */ "@/views/my/orders/edit");
const MyPayments = () => import(/* webpackChunkName: "my" */ "@/views/my/payments");

const my = [
  {
    path: "/my/orders",
    name: "MyOrders",
    component: MyOrders,
    meta: {
      title: i18n.t("title.myOrders"),
      roles: [ROLES_CODE.client],
    },
  },
  {
    path: "/my/orders/product/add/:orderId",
    name: "MyOrdersAddProduct",
    component: MyOrdersAddProduct,
    meta: {
      title: i18n.t("title.ordersAddProduct"),
      roles: [ROLES_CODE.client],
    },
  },
  {
    path: "/my/orders/product/:id",
    name: "MyOrdersEditProduct",
    component: MyOrdersEditProduct,
    meta: {
      title: i18n.t("title.ordersEdit"),
      roles: [ROLES_CODE.client],
    },
  },
  {
    path: "/my/orders/:id",
    name: "MyOrdersInfo",
    component: MyOrdersInfo,
    meta: {
      title: i18n.t("title.ordersInfo"),
      roles: [ROLES_CODE.client],
    },
  },
  {
    path: "/my/payments",
    name: "MyPayments",
    component: MyPayments,
    meta: {
      title: i18n.t("title.myPayments"),
      roles: [ROLES_CODE.client],
    },
  },
];

export default my;
