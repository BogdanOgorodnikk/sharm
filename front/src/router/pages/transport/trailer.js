import i18n from "@/plugins/vue-i18n";
import { ROLES_CODE } from "@/api/user";

const TrailerList = () =>
  import(/* webpackChunkName: "trailer" */ "@/views/transport/trailer/index");
const TrailerAdd = () => import(/* webpackChunkName: "trailer" */ "@/views/transport/trailer/add");
const TrailerEdit = () =>
  import(/* webpackChunkName: "trailer" */ "@/views/transport/trailer/edit");

const trailer = [
  {
    path: "transport/trailer",
    name: "TrailerList",
    component: TrailerList,
    meta: {
      title: i18n.t("title.trailer"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "transport/trailer/0",
    name: "TrailerAdd",
    component: TrailerAdd,
    meta: {
      title: i18n.t("title.trailerAdd"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "transport/trailer/:id",
    name: "TrailerEdit",
    component: TrailerEdit,
    meta: {
      title: i18n.t("title.trailerEdit"),
      roles: [ROLES_CODE.admin],
    },
  },
];

export default trailer;
