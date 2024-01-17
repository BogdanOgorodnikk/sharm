import i18n from "@/plugins/vue-i18n";
import { ROLES_CODE } from "@/api/user";

const FrameList = () => import(/* webpackChunkName: "frame" */ "@/views/accessories/frame/index");
const FrameAdd = () => import(/* webpackChunkName: "frame" */ "@/views/accessories/frame/add");
const FrameEdit = () => import(/* webpackChunkName: "frame" */ "@/views/accessories/frame/edit");

const frame = [
  {
    path: "accessories/frame",
    name: "FrameList",
    component: FrameList,
    meta: {
      title: i18n.t("title.frame"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "accessories/frame/0",
    name: "FrameAdd",
    component: FrameAdd,
    meta: {
      title: i18n.t("title.frameAdd"),
      roles: [ROLES_CODE.admin],
    },
  },
  {
    path: "accessories/frame/:id",
    name: "FrameEdit",
    component: FrameEdit,
    meta: {
      title: i18n.t("title.frameEdit"),
      roles: [ROLES_CODE.admin],
    },
  },
];

export default frame;
