<template>
  <OurPage width="2xl" class="settings">
    <div v-for="(link, index) in links" :key="index" class="settings-wrapper">
      <h2 class="settings-title">{{ link.headline }}</h2>

      <div class="settings-cards">
        <SectionCard v-for="(item, id) in link.items" :key="id" :item="item" />
      </div>
    </div>
  </OurPage>
</template>

<script>
import SectionCard from "./components/SectionCard";
import i18n from "@/plugins/vue-i18n";
import OurPage from "@/components/OurPage";

const LINKS = [
  {
    headline: i18n.t("title.transport"),
    items: [
      {
        title: i18n.t("title.car"),
        route: "CarList",
        description: i18n.t("description.car"),
      },
      {
        title: i18n.t("title.trailer"),
        route: "TrailerList",
        description: i18n.t("description.trailer"),
      },
      {
        title: i18n.t("title.driver"),
        route: "DriverList",
        description: i18n.t("description.driver"),
      },
    ],
  },
];

export default {
  components: {
    OurPage,
    SectionCard,
  },

  data: () => ({
    links: LINKS,
  }),
};
</script>

<style lang="postcss" scoped>
.settings {
  &-wrapper {
    @apply mt-12;

    &:first-child {
      @apply mt-0;
    }
  }

  &-title {
    @apply mb-6 text-4xl font-medium text-gray-900;
  }

  &-cards {
    @apply grid grid-cols-1 grid-rows-1 gap-4 sm:grid-cols-2 md:gap-6;
  }
}
</style>
