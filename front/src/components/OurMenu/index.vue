<template>
  <perfect-scrollbar class="perfect-scrollbar" :class="theme">
    <div class="menu-wrap">
      <ul class="menu" :class="menuClasses">
        <template v-for="(item, index) in accessMenuItems">
          <li
            :key="index"
            :data-cy="`menu-link-${item.page}`"
            class="menu-item"
            :class="getMenuItemClasses(item)"
            @click="onClickMenuItem"
          >
            <router-link class="menu-item-link" :to="{ name: item.page }">
              <OurSvgIcon :name="item.svgIconName" class="menu-item-link-icon" />

              <h5 class="menu-item-link-text">
                {{ $t(item.translate) }}
              </h5>
            </router-link>
          </li>
        </template>
      </ul>
    </div>
  </perfect-scrollbar>
</template>

<script>
import "@/plugins/vue-perfect-scrollbar";
import { mapGetters, mapMutations } from "vuex";
import { getTheme } from "@/services/OurUiService";

import OurSvgIcon from "@/components/OurSvgIcon";

export default {
  name: "OurMenu",

  components: {
    OurSvgIcon,
  },

  props: {
    items: {
      type: Array,
      required: true,
    },
  },

  computed: {
    ...mapGetters("layout", ["isOpenAsideMenu"]),
    ...mapGetters("breakpoint", ["isPortableDevice"]),
    ...mapGetters("user", ["userRole"]),

    accessMenuItems() {
      return this.items.filter((item) => {
        if (item.roles?.length) {
          const isUserRole = item.roles.find((role) => role === this.userRole);

          if (isUserRole) {
            return item;
          }
        } else {
          return item;
        }
      });
    },

    theme() {
      return getTheme();
    },

    menuClasses() {
      return {
        "menu-minimize": !this.isOpenAsideMenu,
      };
    },

    sectionClasses() {
      return {
        "menu-section-minimize": !this.isOpenAsideMenu,
      };
    },
  },

  methods: {
    ...mapMutations("layout", ["CLOSE_PORTABLE_ASIDE"]),

    getMenuItemClasses({ page }) {
      const parentRoute = page ? this.$router.resolve({ name: page }).href : page;

      return {
        "menu-item-active": this.$route.name === page || this.$route.path.includes(parentRoute),
      };
    },

    onClickMenuItem() {
      if (this.isPortableDevice) {
        this.CLOSE_PORTABLE_ASIDE();
      }
    },
  },
};
</script>

<style lang="postcss" scoped>
.perfect-scrollbar {
  @apply h-full;

  .menu-wrap {
    @apply overflow-y-auto;

    .menu {
      @apply pt-6 md:pt-2.5 md:pr-6 md:pb-6;

      &-item {
        &:hover {
          @apply bg-white bg-opacity-[0.025] md:rounded-r-3xl;

          .menu-item-link-icon::v-deep {
            svg g [fill] {
              @apply text-violet-200/100;
              @apply transition-all duration-200;
            }
          }

          .menu-item-link-text {
            @apply text-gray-100;
          }
        }

        .menu-item-link {
          @apply flex px-4 py-3;

          &-icon::v-deep {
            @apply pr-4;

            svg g [fill] {
              @apply fill-current text-violet-200/20;
            }
          }

          &-text {
            @apply flex items-center;
            @apply text-base font-normal text-gray-450;
            @apply overflow-hidden text-ellipsis whitespace-nowrap;
          }
        }
      }

      &-item-active {
        @apply bg-white/5 md:rounded-r-3xl;

        &:hover {
          .menu-item-link-icon::v-deep {
            svg g [fill] {
              @apply text-blue-500/100;
            }
          }
        }

        .menu-item-link-icon::v-deep {
          svg g [fill] {
            @apply text-blue-500/100;
          }
        }

        .menu-item-link-text {
          @apply text-gray-100;
        }
      }

      .menu-section {
        @apply pt-6 pl-5 pr-6 pb-2.5;

        &-text {
          @apply text-xs font-normal uppercase text-violet-200/20;
          @apply overflow-hidden text-ellipsis whitespace-nowrap;
        }
      }

      .menu-section-minimize {
        @apply invisible;
      }
    }

    .menu-minimize {
      @apply pr-0;

      .menu-item-active {
        @apply bg-transparent;
      }
    }
  }
}
</style>

<!-- sweet theme -->
<style scoped lang="postcss">
.sweet-theme {
  .menu-item {
    &:hover {
      @apply !bg-opacity-25;
    }

    &-link {
      &-icon::v-deep {
        svg g [fill] {
          @apply !text-gray-450;
        }
      }

      &-text {
        @apply !text-gray-700;
      }
    }

    &-active {
      @apply !bg-white/50;

      .menu-item-link-icon::v-deep {
        svg g [fill] {
          @apply !text-violet-300/100;
        }
      }

      .menu-item-link-text {
        @apply !text-base-dark;
      }
    }
  }

  .menu-section-text {
    @apply !text-gray-400/100;
  }

  .menu-minimize {
    .menu-item-active {
      @apply !bg-transparent;
    }
  }
}
</style>
