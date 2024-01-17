<template>
  <div :class="appClasses">
    <AppLoader v-if="showLoader" />

    <OurNotify />

    <router-view />
  </div>
</template>

<script>
import { mapState } from "vuex";
import AppLoader from "@/components/OurLoader";
import OurNotify from "@/components/OurNotify";

export default {
  name: "App",
  components: {
    AppLoader,
    OurNotify,
  },

  computed: {
    ...mapState("loader", ["showLoader"]),

    appClasses() {
      return {
        "pwa-app": navigator.standalone,
      };
    },
  },

  created() {
    this.removeOutlineFocus();
  },

  methods: {
    removeOutlineFocus() {
      const styleTag = document.createElement("style");
      let focusRing = true;

      document.head.appendChild(styleTag).innerHTML = `
      "body.hide-focus-ring *:focus {
        outline: none !important;
      }`;

      document.addEventListener("mousedown", () => {
        if (focusRing) document.body.classList.add("hide-focus-ring");

        focusRing = false;
      });

      document.addEventListener("keydown", () => {
        if (!focusRing) document.body.classList.remove("hide-focus-ring");

        focusRing = true;
      });
    },
  },
};
</script>

<style lang="postcss">
@import "assets/css/index.pcss";

html,
body {
  @apply bg-base-dark text-base !important;
  @apply font-roboto;
}

.pwa-app {
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}
</style>
