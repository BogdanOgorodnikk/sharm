import i18n from "@/plugins/vue-i18n";
import { ROLES_CODE } from "@/api/user";

const TransportInvoiceList = () =>
  import(/* webpackChunkName: "transportInvoice" */ "@/views/transport-invoice/index");
const TransportInvoiceAdd = () =>
  import(/* webpackChunkName: "transportInvoice" */ "@/views/transport-invoice/add");
const TransportInvoiceEdit = () =>
  import(/* webpackChunkName: "transportInvoice" */ "@/views/transport-invoice/edit");

const transportInvoice = [
  {
    path: "invoice-transport",
    name: "TransportInvoiceList",
    component: TransportInvoiceList,
    meta: {
      title: i18n.t("title.transportInvoice"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "invoice-transport/add/:orderId",
    name: "TransportInvoiceAdd",
    component: TransportInvoiceAdd,
    meta: {
      title: i18n.t("title.transportInvoiceAdd"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "invoice-transport/:id/:orderId",
    name: "TransportInvoiceEdit",
    component: TransportInvoiceEdit,
    meta: {
      title: i18n.t("title.transportInvoiceEdit"),
      roles: [ROLES_CODE.admin],
    },
  },
];

export default transportInvoice;
