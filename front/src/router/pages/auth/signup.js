import i18n from "@/plugins/vue-i18n";

const SignUp = () => import(/* webpackChunkName: "auth" */ "@/views/auth/signUp");

const signup = [
  {
    path: "/signup",
    name: "SignUp",
    component: SignUp,
    meta: {
      title: i18n.t("title.signUp"),
    },
  },
];

export default signup;
