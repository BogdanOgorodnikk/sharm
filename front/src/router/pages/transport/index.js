import i18n from "@/plugins/vue-i18n";
import { ROLES_CODE } from "@/api/user";

import car from "@/router/pages/transport/car";
import trailer from "@/router/pages/transport/trailer";
import driver from "@/router/pages/transport/driver";

const TransportList = () => import(/* webpackChunkName: "transports" */ "@/views/transport/index");

const transport = [
  {
    path: "transport",
    name: "TransportList",
    component: TransportList,
    meta: {
      title: i18n.t("title.transport"),
      roles: [ROLES_CODE.admin],
    },
  },
  ...car,
  ...trailer,
  ...driver,
];

export default transport;
