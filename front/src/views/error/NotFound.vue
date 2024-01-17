<template>
  <div class="error-page">
    <OurCard class="error-page-card">
      <div class="error-page-card-title">
        {{ $t("title.pageNotFound") }}
      </div>

      <router-link class="error-page-card-link" to="/">
        {{ $t("title.backToHome") }}
      </router-link>
    </OurCard>
  </div>
</template>

<script>
import OurCard from "@/components/OurCard";
export default {
  name: "NotFound",
  components: { OurCard },
};
</script>

<style lang="postcss" scoped>
.error {
  &-page {
    @apply flex flex-col items-center justify-center;
    @apply min-h-screen;
    @apply px-4;

    &-card {
      @apply max-w-[32rem];

      &-title {
        @apply text-center text-sm font-medium text-base-dark sm:text-2xl;
      }

      &-link {
        @apply block;
        @apply text-center text-sm font-normal text-blue-500 underline sm:text-lg;
        @apply mt-4;
      }
    }
  }
}
</style>
