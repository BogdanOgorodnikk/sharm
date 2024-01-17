import profile from "@/router/pages/profile";
import products from "@/router/pages/products";
import orders from "@/router/pages/orders";
import clients from "@/router/pages/clients";
import prices from "@/router/pages/prices";
import users from "@/router/pages/users";
import payments from "@/router/pages/payments";
import accessories from "@/router/pages/accessories";
import textiles from "@/router/pages/textiles";
import my from "@/router/pages/my";
import retailPrice from "@/router/pages/retailPrice";
import transport from "@/router/pages/transport";
import transportInvoice from "@/router/pages/transportInvoice";

const MainLayout = () => import(/* webpackChunkName: "main" */ "@/layouts/main");

const mainLayout = [
  {
    path: "/",
    name: "MainLayout",
    redirect: { name: "Products" },
    component: MainLayout,
    children: [
      ...profile,
      ...products,
      ...orders,
      ...clients,
      ...prices,
      ...users,
      ...payments,
      ...accessories,
      ...textiles,
      ...my,
      ...retailPrice,
      ...transport,
      ...transportInvoice,
    ],
  },
];

export default mainLayout;
