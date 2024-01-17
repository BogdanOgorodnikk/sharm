<template>
  <div class="page" :class="[pageWidthClass, pageClasses]">
    <div class="page-wrapper" :class="contentWidthClass">
      <div v-if="isShownHeader" class="page-header">
        <div class="page-header-left">
          <div>
            <slot name="header-left">
              <ArrowLink
                v-if="isShownArrowButton"
                :back-route="backRoute"
                data-cy="arrow-back-button"
              />

              <h1 :class="classes.header" class="page-header-title">
                {{ title }}
              </h1>
            </slot>
          </div>

          <slot name="header-left-after" />
        </div>

        <div class="page-header-right">
          <slot name="header-right" />
        </div>
      </div>

      <div :class="classes.content" class="page-content">
        <slot />
      </div>

      <div
        v-if="isShownFooterSlot"
        :class="[classes.footer, reverseFooterClass]"
        class="page-footer"
      >
        <div class="page-footer-left">
          <slot name="footer-left" />
        </div>

        <div class="page-footer-right">
          <slot name="footer-right" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getTheme } from "@/services/OurUiService";

import OurSvgIcon from "@/components/OurSvgIcon";
import ArrowLink from "./components/ArrowLink";

export default {
  name: "OurPage",

  components: {
    ArrowLink,
    OurSvgIcon,
  },

  props: {
    title: {
      type: String,
      default: "",
    },

    backRoute: {
      type: Object,
      default: () => ({}),
    },

    width: {
      type: String,
      default: "xl",
    },

    responsiveController: {
      type: String,
      default: "md",
    },

    classes: {
      type: Object,
      default: () => ({
        header: "",
        content: "",
        footer: "",
      }),
    },

    darkMode: {
      type: Boolean,
      default: false,
    },

    bgImage: {
      type: Boolean,
      default: true,
    },

    mobileFooterReverse: {
      type: Boolean,
      default: false,
    },

    widePage: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapGetters("breakpoint", ["isMobileDevice"]),

    reverseFooterClass() {
      return {
        "reverse-footer": this.mobileFooterReverse && this.isMobileDevice,
      };
    },

    isShownFooterSlot() {
      return !!this.$slots["footer-left"] || !!this.$slots["footer-right"];
    },

    isShownHeader() {
      return this.title || !!this.$slots["header-left"] || !!this.$slots["header-right"];
    },

    isShownArrowButton() {
      return !!Object.keys(this.backRoute).length;
    },

    pageClasses() {
      const theme = getTheme();
      let bgClass = "bg-base-light";

      if (this.darkMode) {
        bgClass = "bg-base-dark";
      }

      return [theme, bgClass];
    },

    widthClass() {
      return {
        "size-2xs": this.width === "2xs", // 400px
        "size-xs": this.width === "xs", //   500px
        "size-md": this.width === "md", //   600px
        "size-lg": this.width === "lg", //   700px
        "size-xl": this.width === "xl", //   800px
        "size-2xl": this.width === "2xl", // 900px
        "size-3xl": this.width === "3xl", // 1000px
        "size-4xl": this.width === "4xl", // 1100px
        "size-5xl": this.width === "5xl", // 1200px
        "size-wide": this.width === "wide", // 100%
      };
    },

    pageWidthClass() {
      return !this.widePage ? this.widthClass : "size-wide";
    },

    contentWidthClass() {
      return this.widePage ? this.widthClass : "";
    },
  },
};
</script>

<style lang="postcss" scoped>
.page {
  @apply p-4 md:p-6;
  @apply overflow-auto md:!min-h-full;
  @apply rounded-t-2xl md:rounded-2xl;
  @apply bg-cover !important;

  min-height: calc(100vh - 3.5rem);

  &-wrapper {
    @apply mx-auto;
  }

  &-header {
    @apply items-end justify-between sm:flex;
    @apply mb-4 md:mb-6;

    &-left {
      @apply flex items-center;
      @apply space-x-4 sm:ml-4 md:ml-6;
    }

    &-right {
      @apply mt-2 sm:mr-4 sm:mt-0 md:mr-6;
    }

    &-title {
      @apply flex items-center text-2xl font-medium md:text-3xl;
      @apply mt-0.5;
    }
  }

  &-footer {
    @apply mt-6 mb-0 justify-between px-4 md:flex md:px-6;
    @apply space-y-4 md:space-y-0;

    &-right,
    &-left {
      @apply md:flex;
      @apply space-y-4 md:space-x-4 md:space-y-0;

      &::v-deep .button {
        @apply w-full md:w-auto;
      }

      &::v-deep .dropdown {
        @apply w-full md:w-auto;

        .dropdown-list-right {
          @apply w-full text-center;
        }

        .dropdown-wrapper {
          @apply block w-full;

          .svg-icon {
            @apply right-auto;
          }
        }
      }
    }
  }
}

.reverse-footer {
  @apply flex flex-col-reverse space-y-reverse;

  .page-footer-right {
    @apply flex flex-col-reverse space-y-reverse;
  }
}

.size-2xs {
  @apply md:w-100;
}

.size-xs {
  @apply md:w-125;
}

.size-md {
  @apply md:w-150;
}

.size-lg {
  @apply md:w-175;
}

.size-xl {
  @apply md:w-200;
}

.size-2xl {
  @apply md:w-225;
}

.size-3xl {
  @apply md:w-250;
}

.size-4xl {
  @apply md:w-275;
}

.size-5xl {
  @apply md:w-300;
}

.size-wide {
  @apply md:w-full;
}
</style>

<!-- Sweet theme -->
<style lang="postcss" scoped>
.sweet-theme {
  &.page {
    @apply bg-white bg-opacity-25;
  }
}
</style>
