<template>
  <router-link :to="{ name: item.route }">
    <OurCard class="section-card">
      <div class="section-card-header">
        <h3 class="section-card-header-title">{{ item.title }}</h3>

        <ArrowButton class="section-card-arrow" />
      </div>

      <p class="section-card-description">{{ item.description }}</p>
    </OurCard>
  </router-link>
</template>

<script>
import ArrowButton from "./components/ArrowButton";
import OurCard from "@/components/OurCard";

export default {
  components: {
    OurCard,
    ArrowButton,
  },

  props: {
    item: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style lang="postcss" scoped>
.section-card {
  @apply flex h-36 flex-col justify-between;
  @apply cursor-pointer;

  &:hover {
    .settings-card-arrow {
      @apply bg-opacity-10;

      &::v-deep {
        .icon g [fill] {
          @apply text-gray-700;
        }
      }
    }
  }

  &-header {
    @apply flex items-center justify-between;

    &-title {
      @apply text-lg font-medium text-gray-900 sm:text-2xl;
    }
  }

  &-description {
    @apply mt-0 text-sm font-normal text-gray-500/[85] !important;
  }

  &-arrow {
    @apply rotate-180 transform;
  }
}
</style>
