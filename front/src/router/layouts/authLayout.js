import auth from "@/router/pages/auth";

const AuthLayout = () => import(/* webpackChunkName: "auth" */ "@/layouts/auth");

const authLayout = [
  {
    path: "/",
    name: "AuthLayout",
    redirect: { name: "Login" },
    component: AuthLayout,
    children: [...auth],
  },
];

export default authLayout;
