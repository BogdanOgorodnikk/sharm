import i18n from "@/plugins/vue-i18n";
import { ROLES_CODE } from "@/api/user";

const PaymentsList = () => import(/* webpackChunkName: "payments" */ "@/views/payments/index");
const PaymentsAdd = () => import(/* webpackChunkName: "payments" */ "@/views/payments/add");
const PaymentsEdit = () => import(/* webpackChunkName: "payments" */ "@/views/payments/edit");

const payments = [
  {
    path: "/payments",
    name: "PaymentsList",
    component: PaymentsList,
    meta: {
      title: i18n.t("title.payments"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "/payments/0",
    name: "PaymentsAdd",
    component: PaymentsAdd,
    meta: {
      title: i18n.t("title.paymentsAdd"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "/payments/:id",
    name: "PaymentsEdit",
    component: PaymentsEdit,
    meta: {
      title: i18n.t("title.paymentsEdit"),
      roles: [ROLES_CODE.admin],
    },
  },
];

export default payments;
