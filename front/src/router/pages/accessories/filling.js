import i18n from "@/plugins/vue-i18n";
import { ROLES_CODE } from "@/api/user";

const FillingList = () =>
  import(/* webpackChunkName: "filling" */ "@/views/accessories/filling/index");
const FillingAdd = () =>
  import(/* webpackChunkName: "filling" */ "@/views/accessories/filling/add");
const FillingEdit = () =>
  import(/* webpackChunkName: "filling" */ "@/views/accessories/filling/edit");

const filling = [
  {
    path: "accessories/filling",
    name: "FillingList",
    component: FillingList,
    meta: {
      title: i18n.t("title.filling"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "accessories/filling/0",
    name: "FillingAdd",
    component: FillingAdd,
    meta: {
      title: i18n.t("title.fillingAdd"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "accessories/filling/:id",
    name: "FillingEdit",
    component: FillingEdit,
    meta: {
      title: i18n.t("title.fillingEdit"),
      roles: [ROLES_CODE.admin],
    },
  },
];

export default filling;
