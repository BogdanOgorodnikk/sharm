import i18n from "@/plugins/vue-i18n";
import { ROLES_CODE } from "@/api/user";

const UsersList = () => import(/* webpackChunkName: "profile" */ "@/views/users/index");

const users = [
  {
    path: "/users",
    name: "UsersList",
    component: UsersList,
    meta: {
      title: i18n.t("title.users"),
      roles: [ROLES_CODE.admin],
    },
  },
];

export default users;
