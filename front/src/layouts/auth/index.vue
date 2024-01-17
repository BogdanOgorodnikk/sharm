<template>
  <OurViewport class="auth-layout-wrap">
    <main class="main" :class="mainClass" :style="contentsTheme">
      <div class="view-wrap">
        <router-view />
      </div>
    </main>
  </OurViewport>
</template>

<script>
import OurViewport from "@/components/OurViewport";

export default {
  name: "AuthLayout",

  components: {
    OurViewport,
  },

  computed: {
    contentsTheme() {
      const theme = process.env.BASE_URL + "media/background/theme-bg.jpg";

      return `background-image: url(${theme});`;
    },

    mainClass() {
      return {
        "pwa-main": this.$isPWA,
      };
    },
  },
};
</script>

<style lang="postcss" scoped>
.auth-layout-wrap {
  @apply flex h-full min-h-screen;
  @apply p-1.5;

  .main {
    @apply rounded-lg bg-base-light bg-cover bg-center bg-no-repeat;
    @apply flex w-full flex-col items-center justify-center;
    @apply p-6;

    .view-wrap::v-deep {
      @apply flex items-center justify-center;
      @apply w-full md:py-8;

      .auth-wrapper {
        @apply w-full max-w-md;
        @apply m-auto p-4;
      }

      .card {
        @apply shadow;
      }

      .button {
        @apply mt-6 flex w-full justify-center md:mt-8;
      }
    }
  }
}
</style>
