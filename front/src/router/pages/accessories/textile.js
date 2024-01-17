import i18n from "@/plugins/vue-i18n";
import { ROLES_CODE } from "@/api/user";

const TextileList = () =>
  import(/* webpackChunkName: "textile" */ "@/views/accessories/textile/index");
const TextileAdd = () =>
  import(/* webpackChunkName: "textile" */ "@/views/accessories/textile/add");
const TextileEdit = () =>
  import(/* webpackChunkName: "textile" */ "@/views/accessories/textile/edit");

const textile = [
  {
    path: "accessories/textile",
    name: "TextileList",
    component: TextileList,
    meta: {
      title: i18n.t("title.textile"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "accessories/textile/0",
    name: "TextileAdd",
    component: TextileAdd,
    meta: {
      title: i18n.t("title.textileAdd"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "accessories/textile/:id",
    name: "TextileEdit",
    component: TextileEdit,
    meta: {
      title: i18n.t("title.textileEdit"),
      roles: [ROLES_CODE.admin],
    },
  },
];

export default textile;
