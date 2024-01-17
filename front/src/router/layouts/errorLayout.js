import error from "@/router/pages/error";

const ErrorLayout = () => import(/* webpackChunkName: "error" */ "@/layouts/error");

const errorLayout = [
  {
    path: "/",
    name: "ErrorLayout",
    component: ErrorLayout,
    children: [...error],
  },
];

export default errorLayout;
