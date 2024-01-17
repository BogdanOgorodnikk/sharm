<template>
  <OurViewport class="admin-layout" :class="layoutClasses">
    <MobileHeader />

    <div class="layout-body">
      <Aside :class="asideClasses" />

      <div class="overlay-on-tablet" :class="overlayClasses" @click="onClickOverlay" />

      <main class="main" :class="mainClasses">
        <div class="main-content">
          <router-view />
        </div>
      </main>
    </div>
  </OurViewport>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { getThemeName, getTheme } from "@/services/OurUiService";

import OurViewport from "@/components/OurViewport";
import MobileHeader from "./MobileHeader";
import Aside from "./Aside";

export default {
  name: "AdminLayout",
  components: {
    OurViewport,
    MobileHeader,
    Aside,
  },

  computed: {
    ...mapState("layout", ["fixedAsideMenu"]),

    ...mapGetters("layout", ["isOpenAsideMenu"]),
    ...mapGetters("breakpoint", ["isTabletDevice"]),

    layoutClasses() {
      const theme = getTheme();
      const classes = {
        "pwa-layout": this.$isPWA,
      };

      return [theme, classes];
    },

    overlayClasses() {
      return this.isOpenAsideMenu ? "hidden md:block lg:hidden" : "hidden";
    },

    asideClasses() {
      return {
        "aside-menu-opened": this.isTabletDevice
          ? this.isOpenAsideMenu
          : this.isOpenAsideMenu && !this.fixedAsideMenu,
      };
    },

    mainClasses() {
      return {
        "menu-opened": this.isOpenAsideMenu,
        "menu-closed": !this.isOpenAsideMenu,
        "menu-fixed": this.fixedAsideMenu && this.isOpenAsideMenu,
      };
    },
  },

  created() {
    this.OPEN_DESKTOP_ASIDE();

    this.setBodyBg();
  },

  methods: {
    ...mapMutations("layout", ["CLOSE_PORTABLE_ASIDE", "OPEN_DESKTOP_ASIDE"]),

    setBodyBg() {
      const body = document.querySelector("body");
      const theme = getThemeName();
      const bodyClass = theme ? `theme-bg-${theme}` : "theme-bg-default";

      if (this.$isPWA) {
        const bodyPWAClass = `${bodyClass}-pwa`;

        body.classList.add(bodyPWAClass);
      }

      body.classList.add(bodyClass);
    },

    onClickOverlay() {
      this.CLOSE_PORTABLE_ASIDE();
    },
  },
};
</script>

<style lang="postcss">
.theme-bg {
  &-default {
    @apply bg-base-dark;
  }

  &-sweet {
    @apply bg-gradient-to-bl from-violet-50 via-blue-100 to-violet-50;

    &-pwa {
      @apply bg-base-dark;
    }
  }
}
</style>

<style lang="postcss" scoped>
.admin-layout {
  @apply h-full min-h-screen;
  @apply bg-base-dark;

  .layout-body {
    @apply flex;

    .overlay-on-tablet {
      @apply h-full w-full;
      @apply fixed top-0 left-0 z-30;
      @apply bg-base-dark opacity-90;
    }

    .main {
      @apply w-full md:z-auto md:min-h-screen;
      @apply md:pb-2 md:pt-2 md:pr-2;
      @apply transition-all duration-300;

      .main-content {
        @apply w-full md:max-w-screen-2xl;
        @apply rounded-t-2xl bg-cover bg-center bg-no-repeat md:rounded-2xl;
      }
    }

    .menu-opened {
      @apply hidden md:inline-flex;
      @apply md:pl-14;
    }

    .menu-closed {
      @apply inline-flex;
      @apply md:pl-14;
    }

    .menu-fixed {
      @apply md:pl-14 lg:pl-72;
    }
  }
}

.pwa-layout::v-deep {
  @apply fixed inset-0;
  @apply rounded-t-2xl;

  .mobile-header {
    @apply fixed inset-0 z-50 h-14 w-full;
  }

  .aside {
    @apply fixed inset-x-0 top-14;
  }

  .main {
    @apply fixed inset-x-0 top-14 overflow-y-auto;
    height: calc(100vh - 3.5rem);
  }
}
</style>

<!-- sweet theme -->
<style scoped lang="postcss">
.sweet-theme {
  &.admin-layout {
    @apply bg-gradient-to-bl from-violet-50 via-blue-100 to-violet-50;

    .overlay-on-tablet {
      @apply opacity-70;
    }

    .aside-menu-opened {
      @apply bg-gradient-to-bl from-violet-50 via-blue-100 to-violet-50;
    }
  }
}
</style>
