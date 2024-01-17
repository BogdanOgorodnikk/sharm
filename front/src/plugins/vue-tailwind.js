import Vue from "vue";
import VueTailwind from "vue-tailwind";

import {
  TInput,
  TTextarea,
  TButton,
  TCard,
  TDropdown,
  TCheckbox,
  TRadio,
  TModal,
  TDatepicker,
  TTable,
} from "vue-tailwind/dist/components";

const components = {
  TInput,
  TTextarea,
  TButton,
  TCard,
  TDropdown,
  TCheckbox,
  TRadio,
  TModal,
  TDatepicker,
  TTable,
};

Vue.use(VueTailwind, components);
