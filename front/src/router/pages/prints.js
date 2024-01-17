import i18n from "@/plugins/vue-i18n";
import { ROLES_CODE } from "@/api/user";

const PrintInvoice = () => import(/* webpackChunkName: "prints" */ "@/views/prints/invoice");
const PrintGoodsTransportInvoice = () =>
  import(/* webpackChunkName: "prints" */ "@/views/prints/goodsTransportInvoice");

const print = [
  {
    path: "/prints/invoice/:id",
    name: "PrintInvoice",
    component: PrintInvoice,
    meta: {
      title: i18n.t("title.print"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "/prints/transport-invoice/:id",
    name: "PrintGoodsTransportInvoice",
    component: PrintGoodsTransportInvoice,
    meta: {
      title: i18n.t("title.print"),
      roles: [ROLES_CODE.admin],
    },
  },
];

export default print;
