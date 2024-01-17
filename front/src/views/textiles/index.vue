<template>
  <OurPage :title="$t('title.textiles')">
    <template #header-right>
      <OurButton :text="$t('button.filter')" size="sm" @click="onClickOpenFilterModal">
        <template #icon-left>
          <OurSvgIcon name="Filter" size="sm" />
        </template>
      </OurButton>
    </template>

    <OurTable :headers="tableHeaders" :items="tableItems">
      <template #cell-image="{ value }">
        <img
          v-if="value"
          v-tippy
          :content="$t('label.clickForOpenInNewPage')"
          class="textile-image"
          alt=""
          :src="value"
          @click.stop="onClickOpenImageInNewPage(value)"
        />

        <div v-else class="textile-without-image">
          <OurSvgIcon name="Image-not" color="gray" />
        </div>
      </template>
    </OurTable>

    <FilterModal v-model="isShownFilterModal" :active-filter.sync="filter" />
  </OurPage>
</template>

<script>
import { mapState, mapActions } from "vuex";

import OurPage from "@/components/OurPage";
import OurSvgIcon from "@/components/OurSvgIcon";
import OurTable from "@/components/OurTable";
import OurButton from "@/components/OurButton";
import FilterModal from "./components/FilterModal";

export default {
  components: {
    FilterModal,
    OurButton,
    OurTable,
    OurSvgIcon,
    OurPage,
  },

  data() {
    return {
      tableHeaders: [
        {
          value: "name",
          text: this.$t("label.name"),
          tdClass: "",
          thClass: "",
        },
        {
          value: "image",
          text: this.$t("label.image"),
          tdClass: "!p-0 !align-middle",
          thClass: "w-20",
        },
      ],
      isShownFilterModal: false,
      filter: {
        categoryIds: [],
        textileIds: [],
      },
    };
  },

  computed: {
    ...mapState("textile", ["textiles"]),

    isActiveFilter() {
      return this.filter.categoryIds.length || this.filter.textileIds.length;
    },

    tableItems() {
      let textiles = [...this.textiles];

      if (this.isActiveFilter) {
        textiles = textiles.filter((item) => {
          let isFiltered = true;

          if (this.filter.textileIds.length && isFiltered) {
            isFiltered = !!this.filter.textileIds.find((textile) => textile === item.id);
          }

          if (this.filter.categoryIds.length && isFiltered) {
            isFiltered = !!this.filter.categoryIds.find((category) => category === item.category);
          }

          if (isFiltered) {
            return item;
          }
        });
      }

      return textiles.map((item) => {
        const imageLink = `${process.env.VUE_APP_DOMAIN}/textile/${item.name}/${item.textile_image}`;

        return {
          id: item.id,
          name: item.name,
          image: item.textile_image ? imageLink : false,
        };
      });
    },
  },

  async created() {
    await this.getTextiles();
  },

  methods: {
    ...mapActions("textile", ["getTextiles"]),

    onClickOpenImageInNewPage(href) {
      window.open(href, "_blank");
    },

    onClickOpenFilterModal() {
      this.isShownFilterModal = true;
    },
  },
};
</script>

<style lang="postcss" scoped>
.textile-image {
  @apply cursor-pointer;
  @apply h-12 w-12;
  @apply mx-auto rounded-lg;
}

.textile-without-image {
  @apply bg-gray-300;
  @apply h-12 w-12;
  @apply mx-auto rounded-lg;
  @apply flex items-center justify-center;
}
</style>
