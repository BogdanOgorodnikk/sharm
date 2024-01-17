import i18n from "@/plugins/vue-i18n";
import { ROLES_CODE } from "@/api/user";

const DriverList = () => import(/* webpackChunkName: "driver" */ "@/views/transport/driver/index");
const DriverAdd = () => import(/* webpackChunkName: "driver" */ "@/views/transport/driver/add");
const DriverEdit = () => import(/* webpackChunkName: "driver" */ "@/views/transport/driver/edit");

const driver = [
  {
    path: "transport/driver",
    name: "DriverList",
    component: DriverList,
    meta: {
      title: i18n.t("title.driver"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "transport/driver/0",
    name: "DriverAdd",
    component: DriverAdd,
    meta: {
      title: i18n.t("title.driverAdd"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "transport/driver/:id",
    name: "DriverEdit",
    component: DriverEdit,
    meta: {
      title: i18n.t("title.driverEdit"),
      roles: [ROLES_CODE.admin],
    },
  },
];

export default driver;
