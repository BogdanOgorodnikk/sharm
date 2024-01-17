import Vue from "vue";

Vue.mixin({
  computed: {
    $isPWA() {
      return !!navigator.standalone;
    },
  },
});
