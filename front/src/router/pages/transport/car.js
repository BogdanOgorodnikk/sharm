import i18n from "@/plugins/vue-i18n";
import { ROLES_CODE } from "@/api/user";

const CarList = () => import(/* webpackChunkName: "car" */ "@/views/transport/car/index");
const CarAdd = () => import(/* webpackChunkName: "car" */ "@/views/transport/car/add");
const CarEdit = () => import(/* webpackChunkName: "car" */ "@/views/transport/car/edit");

const car = [
  {
    path: "transport/car",
    name: "CarList",
    component: CarList,
    meta: {
      title: i18n.t("title.car"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "transport/car/0",
    name: "CarAdd",
    component: CarAdd,
    meta: {
      title: i18n.t("title.carAdd"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "transport/car/:id",
    name: "CarEdit",
    component: CarEdit,
    meta: {
      title: i18n.t("title.carEdit"),
      roles: [ROLES_CODE.admin],
    },
  },
];

export default car;
