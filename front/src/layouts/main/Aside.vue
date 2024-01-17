<template>
  <div
    class="aside"
    :class="[theme, asideClasses]"
    @mouseenter="onEnterMenu"
    @mouseleave="onLeaveMenu"
  >
    <Brand />

    <OurMenu :items="menuItems" />

    <User />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { getTheme } from "@/services/OurUiService";
import { layout } from "@/configs/ourApp.config";

import Brand from "./Brand";
import OurMenu from "@/components/OurMenu";
import User from "./User";

export default {
  name: "Aside",
  components: {
    Brand,
    OurMenu,
    User,
  },

  computed: {
    ...mapState("layout", ["fixedAsideMenu"]),

    ...mapGetters("layout", ["isOpenAsideMenu"]),

    theme() {
      return getTheme();
    },

    asideClasses() {
      return {
        "aside-minimize": !this.isOpenAsideMenu,
        "shadow-lg": this.isOpenAsideMenu && !this.fixedAsideMenu,
      };
    },

    menuItems() {
      return layout.admin.menu.items;
    },
  },

  methods: {
    ...mapMutations("layout", ["OPEN_DESKTOP_ASIDE", "CLOSE_DESKTOP_ASIDE"]),

    onEnterMenu() {
      if (!this.isOpenAsideMenu && !this.fixedAsideMenu) this.OPEN_DESKTOP_ASIDE();
    },

    onLeaveMenu() {
      if (this.isOpenAsideMenu && !this.fixedAsideMenu) this.CLOSE_DESKTOP_ASIDE();
    },
  },
};
</script>

<style lang="postcss" scoped>
.aside::v-deep {
  @apply bg-base-dark;
  @apply w-full max-w-full md:max-w-[18rem];
  @apply h-max md:fixed md:h-screen;
  @apply z-40;
  @apply flex flex-col justify-start md:justify-between;
  @apply transition-all duration-300;
  @apply border-t border-solid border-violet-200 border-opacity-20 md:border-none;

  .ps__rail-y {
    &:hover {
      @apply bg-transparent;
    }

    &:active {
      @apply bg-transparent;
    }

    .ps__thumb-y {
      @apply bg-violet-200 opacity-25;
    }
  }
}

.aside-minimize::v-deep {
  @apply hidden pr-0 md:flex md:w-14;
  @apply transition-colors duration-300;
}
</style>

<!-- sweet theme -->
<style scoped lang="postcss">
.sweet-theme {
  &.aside {
    @apply border-blue-50 bg-transparent;
  }
}
</style>
