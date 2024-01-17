<template>
  <div class="mobile-header" :class="theme">
    <OurLogo
      class="mobile-header-logo"
      :path="logoPath"
      :route="mainLayoutRoute"
      @click="onClickLogo"
    />

    <h4 class="mobile-header-title">{{ brandName }}</h4>

    <OurSvgIcon class="menu-icon" name="Menu" @click="onClickMenuIcon" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import { getTheme } from "@/services/OurUiService";
import { layout } from "@/configs/ourApp.config";

import OurSvgIcon from "@/components/OurSvgIcon";
import OurLogo from "@/layouts/_components/Logo";

export default {
  name: "MobileHeader",
  components: {
    OurSvgIcon,
    OurLogo,
  },

  computed: {
    ...mapGetters("settings", ["brandName"]),

    theme() {
      return getTheme();
    },

    logoPath() {
      return layout.admin.mobileLogoPath;
    },

    mainLayoutRoute() {
      return { name: "MainLayout" };
    },
  },

  methods: {
    ...mapMutations("layout", ["CLOSE_PORTABLE_ASIDE", "TOGGLE_PORTABLE_ASIDE"]),

    onClickLogo() {
      this.CLOSE_PORTABLE_ASIDE();
    },

    onClickMenuIcon() {
      this.TOGGLE_PORTABLE_ASIDE();
    },
  },
};
</script>

<style lang="postcss" scoped>
.mobile-header {
  @apply flex w-full items-center justify-between md:hidden;
  @apply p-4;

  &-logo {
    &::v-deep {
      .logo-image {
        @apply h-12 w-12;
        @apply -mt-1.5 -ml-1.5;
      }
    }
  }

  &-title {
    @apply whitespace-nowrap text-base font-medium text-white;
  }

  .menu-icon::v-deep svg {
    g [fill] {
      @apply fill-current text-white;
      @apply opacity-100;
    }
  }
}
</style>

<!-- sweet theme -->
<style scoped lang="postcss">
.sweet-theme {
  .mobile-header-title {
    @apply text-base-dark;
  }

  .menu-icon::v-deep svg {
    g [fill] {
      @apply text-base-dark;
    }
  }
}
</style>
