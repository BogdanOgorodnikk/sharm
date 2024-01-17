<template>
  <div class="brand" :class="theme">
    <OurSvgIcon
      v-if="isTabletDevice && !isOpenAsideMenu"
      class="brand-icon menu-icon"
      name="Menu"
      @click="onClickMenuIcon"
    />

    <OurLogo
      v-else
      :path="logoPath"
      :title="brandName"
      :route="mainLayoutRoute"
      size="3xl"
      class="brand-logo"
      @click="onClickLogo"
    />

    <OurSvgIcon
      v-if="isTabletDevice"
      name="Angle-double-left"
      class="brand-icon arrow-icon"
      @click="onClickArrowIcon"
    />

    <OurSvgIcon
      v-else
      name="Thumbtack"
      class="brand-icon thumbtack-icon"
      :class="thumbtackIconClasses"
      @click="onClickThumbtackIcon"
    />
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations } from "vuex";
import { getTheme } from "@/services/OurUiService";
import { layout } from "@/configs/ourApp.config";

import OurSvgIcon from "@/components/OurSvgIcon";
import OurLogo from "@/layouts/_components/Logo";

export default {
  name: "Brand",

  components: {
    OurLogo,
    OurSvgIcon,
  },

  computed: {
    ...mapState("layout", ["fixedAsideMenu"]),

    ...mapGetters("layout", ["isOpenAsideMenu"]),
    ...mapGetters("breakpoint", ["isTabletDevice"]),
    ...mapGetters("settings", ["brandName"]),

    theme() {
      return getTheme();
    },

    logoPath() {
      return layout.admin.logoPath;
    },

    thumbtackIconClasses() {
      return {
        "thumbtack-pinned": this.fixedAsideMenu,
        "thumbtack-unpinned": !this.fixedAsideMenu,
      };
    },

    mainLayoutRoute() {
      return { name: "MainLayout" };
    },
  },

  methods: {
    ...mapMutations("layout", ["TOGGLE_FIXED_MENU", "OPEN_PORTABLE_ASIDE", "CLOSE_PORTABLE_ASIDE"]),

    onClickLogo() {
      if (this.isTabletDevice) this.CLOSE_PORTABLE_ASIDE();
    },

    onClickMenuIcon() {
      this.OPEN_PORTABLE_ASIDE();
    },

    onClickArrowIcon() {
      this.CLOSE_PORTABLE_ASIDE();
    },

    onClickThumbtackIcon() {
      this.TOGGLE_FIXED_MENU();
    },
  },
};
</script>

<style lang="postcss" scoped>
.brand {
  @apply hidden items-center justify-between overflow-hidden md:flex;
  @apply p-4 pt-9 lg:pl-3;

  &-logo {
    &::v-deep {
      .logo {
        @apply h-8 w-10;

        &-image {
          @apply h-16 w-16;
          @apply -mt-2.5 -ml-[1.0625rem];
        }
      }
    }
  }

  .brand-icon::v-deep {
    svg g [fill] {
      @apply fill-current text-violet-200;
    }
  }

  .menu-icon::v-deep {
    @apply mr-3.5;

    g path {
      @apply opacity-100;
    }
  }

  .arrow-icon::v-deep svg {
    g path {
      @apply text-opacity-20;
    }
  }

  .thumbtack-icon::v-deep {
    @apply cursor-pointer;
    @apply hidden md:inline-table;

    svg g [fill] {
      @apply text-opacity-20;
    }
  }

  .thumbtack-pinned::v-deep {
    &:hover {
      svg g [fill] {
        @apply text-blue-400;
      }
    }
  }

  .thumbtack-unpinned::v-deep {
    &:hover {
      svg g [fill] {
        @apply text-opacity-100;
      }
    }
  }
}
</style>

<!-- sweet theme -->
<style scoped lang="postcss">
.sweet-theme {
  .menu-icon::v-deep {
    svg g [fill] {
      @apply text-base-dark;
    }
  }

  .thumbtack-icon::v-deep {
    svg g [fill] {
      @apply text-violet-300 text-opacity-100;
    }
  }

  .thumbtack-pinned::v-deep {
    &:hover {
      svg g [fill] {
        @apply text-violet-400;
      }
    }
  }

  .thumbtack-unpinned::v-deep {
    &:hover {
      svg g [fill] {
        @apply text-opacity-50;
      }
    }
  }
}
</style>
