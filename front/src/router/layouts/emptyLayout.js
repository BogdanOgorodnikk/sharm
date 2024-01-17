import print from "@/router/pages/prints";

const EmptyLayout = () => import(/* webpackChunkName: "empty" */ "@/layouts/empty");

const emptyLayout = [
  {
    path: "/",
    name: "EmptyLayout",
    component: EmptyLayout,
    children: [...print],
  },
];

export default emptyLayout;
