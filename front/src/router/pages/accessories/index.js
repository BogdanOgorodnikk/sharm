import filling from "@/router/pages/accessories/filling";
import toggleMechanism from "@/router/pages/accessories/toggleMechanism";
import frame from "@/router/pages/accessories/frame";
import textile from "@/router/pages/accessories/textile";

import i18n from "@/plugins/vue-i18n";
import { ROLES_CODE } from "@/api/user";

const AccessoriesList = () =>
  import(/* webpackChunkName: "settings" */ "@/views/accessories/index");

const accessories = [
  {
    path: "accessories",
    name: "AccessoriesList",
    component: AccessoriesList,
    meta: {
      title: i18n.t("title.accessories"),
      roles: [ROLES_CODE.admin],
    },
  },
  ...filling,
  ...toggleMechanism,
  ...frame,
  ...textile,
];

export default accessories;
