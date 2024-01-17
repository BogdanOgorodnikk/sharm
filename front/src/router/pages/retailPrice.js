import i18n from "@/plugins/vue-i18n";

const RetailPriceList = () => import(/* webpackChunkName: "retailPrice" */ "@/views/retailPrice");

const retailPrice = [
  {
    path: "/retail-price",
    name: "RetailPriceList",
    component: RetailPriceList,
    meta: {
      title: i18n.t("title.retailPrice"),
    },
  },
];

export default retailPrice;
