import i18n from "@/plugins/vue-i18n";
import { ROLES_CODE } from "@/api/user";

const Products = () => import(/* webpackChunkName: "products" */ "@/views/products/index");
const ProductsAdd = () => import(/* webpackChunkName: "products" */ "@/views/products/add");
const ProductsEdit = () => import(/* webpackChunkName: "products" */ "@/views/products/edit");
const OrdersAdd = () => import(/* webpackChunkName: "products" */ "@/views/products/orders");

const products = [
  {
    path: "/products",
    name: "Products",
    component: Products,
    meta: {
      title: i18n.t("title.products"),
    },
  },
  {
    path: "/products/0",
    name: "ProductsAdd",
    component: ProductsAdd,
    meta: {
      title: i18n.t("title.productsAdd"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "/products/:id",
    name: "ProductsEdit",
    component: ProductsEdit,
    meta: {
      title: i18n.t("title.productsEdit"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "/products-orders/0",
    name: "ProductOrdersAdd",
    component: OrdersAdd,
    meta: {
      title: i18n.t("title.ordersAdd"),
      roles: [ROLES_CODE.client, ROLES_CODE.admin],
    },
  },
];

export default products;
