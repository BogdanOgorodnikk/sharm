import i18n from "@/plugins/vue-i18n";
import { ROLES_CODE } from "@/api/user";

const ToggleMechanismList = () =>
  import(/* webpackChunkName: "toggleMechanism" */ "@/views/accessories/toggleMechanism/index");
const ToggleMechanismAdd = () =>
  import(/* webpackChunkName: "toggleMechanism" */ "@/views/accessories/toggleMechanism/add");
const ToggleMechanismEdit = () =>
  import(/* webpackChunkName: "toggleMechanism" */ "@/views/accessories/toggleMechanism/edit");

const toggleMechanism = [
  {
    path: "accessories/toggle-mechanism",
    name: "ToggleMechanismList",
    component: ToggleMechanismList,
    meta: {
      title: i18n.t("title.toggleMechanism"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "accessories/toggle-mechanism/0",
    name: "ToggleMechanismAdd",
    component: ToggleMechanismAdd,
    meta: {
      title: i18n.t("title.toggleMechanismAdd"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "accessories/toggle-mechanism/:id",
    name: "ToggleMechanismEdit",
    component: ToggleMechanismEdit,
    meta: {
      title: i18n.t("title.toggleMechanismEdit"),
      roles: [ROLES_CODE.admin],
    },
  },
];

export default toggleMechanism;
