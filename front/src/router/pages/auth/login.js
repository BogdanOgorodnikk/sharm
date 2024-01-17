import i18n from "@/plugins/vue-i18n";

const Login = () => import(/* webpackChunkName: "auth" */ "@/views/auth/login");

const login = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: i18n.t("title.login"),
    },
  },
];

export default login;
