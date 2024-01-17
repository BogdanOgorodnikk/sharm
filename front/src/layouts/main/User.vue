<template>
  <div class="user-wrap">
    <div :class="userClass">
      <div class="user-block" @click="onClickUserInfo">
        <div class="user-info">
          <div class="user-info-name">
            {{ userName }}
          </div>

          <div class="user-info-email">
            {{ userEmail }}
          </div>
        </div>
      </div>

      <OurSvgIcon name="Sign-out" class="logout-icon" @click="onClickLogout" />
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from "vuex";
import { layout } from "@/configs/ourApp.config";

import OurSvgIcon from "@/components/OurSvgIcon";

export default {
  name: "User",

  components: {
    OurSvgIcon,
  },

  computed: {
    ...mapState("layout", ["fixedAsideMenu"]),

    ...mapGetters("layout", ["isOpenAsideMenu"]),
    ...mapGetters("breakpoint", ["isPortableDevice"]),
    ...mapGetters("user", ["userName", "userEmail"]),

    userClass() {
      return this.isOpenAsideMenu ? "user" : "user-minimize";
    },
  },

  methods: {
    ...mapMutations("layout", ["CLOSE_PORTABLE_ASIDE", "CLOSE_DESKTOP_ASIDE"]),

    ...mapActions(["logout"]),

    onClickUserInfo() {
      const routeName = layout.admin.profileRouteName || "Profile";

      if (!this.isPortableDevice && !this.fixedAsideMenu) {
        this.CLOSE_DESKTOP_ASIDE();
      } else if (this.isPortableDevice && this.isOpenAsideMenu) {
        this.CLOSE_PORTABLE_ASIDE();
      }

      if (this.$route.name !== routeName) this.$router.push({ name: routeName });
    },

    async onClickLogout() {
      this.CLOSE_PORTABLE_ASIDE();

      await this.logout();
    },
  },
};
</script>

<style lang="postcss" scoped>
.user-wrap {
  @apply py-6 px-4 md:pt-0 md:pr-6 md:pl-0 md:pb-8;

  .user {
    @apply flex w-full justify-between;
    @apply border border-solid border-violet-200/20 md:border-l-0;
    @apply rounded-r-2xl rounded-l-2xl md:rounded-l-none;
    @apply py-4 px-5;
    @apply transition-all duration-300;
  }

  .user-minimize {
    @apply py-4 pl-3 pr-[2.625rem];

    @apply flex;
    @apply border border-l-0 border-solid border-violet-200/20;
    @apply rounded-r-2xl;
    @apply transition-all duration-300;

    .logout-icon {
      @apply ml-1;
    }
  }

  .user-block {
    @apply flex w-10/12 cursor-pointer space-x-4;

    .user-info {
      @apply cursor-pointer;
      @apply text-base font-normal text-gray-450;
      @apply w-3/4 whitespace-nowrap;

      &:hover {
        @apply text-gray-100;
        @apply transition duration-100 ease-in-out;
      }

      &-name {
        @apply truncate;
      }

      &-email {
        @apply truncate;
        @apply text-xs;
      }
    }
  }

  .logout-icon::v-deep {
    @apply ml-3 flex cursor-pointer items-center;

    g [fill] {
      @apply fill-current text-violet-200/20;
    }

    &:hover {
      g [fill] {
        @apply text-violet-200/100;
        @apply transition duration-100 ease-in-out;
      }
    }
  }
}
</style>
