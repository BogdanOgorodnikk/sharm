<template>
  <OurPage :back-route="backRouteParams" :title="$t('title.textile')">
    <template #header-right>
      <OurButton v-if="isMobileDevice" size="sm" @click="onClickAddTextile">
        <template #icon-left>
          <OurSvgIcon size="sm" class="add-button-icon" name="Plus2" color="white" />
        </template>
      </OurButton>

      <OurButton v-else size="sm" :text="$t('button.add')" @click="onClickAddTextile" />
    </template>

    <OurTable selectable :headers="tableHeaders" :items.sync="tableItems" @clickRow="onClickRow">
      <template #thead-actions="{ selectedRows }">
        <OurButton
          size="sm"
          variant="thirdary"
          :text="$t('button.delete')"
          @click="onClickDeleteTextile(selectedRows)"
        />
      </template>

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

    <DeleteModal v-model="isShownModal" :selected-rows="selectedRows" :items="tableItems" />
  </OurPage>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";

import DeleteModal from "../delete/MassModal";
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";
import OurSvgIcon from "@/components/OurSvgIcon";
import OurTable from "@/components/OurTable";

export default {
  components: {
    OurTable,
    OurSvgIcon,
    OurButton,
    OurPage,
    DeleteModal,
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
          value: "category",
          text: this.$t("label.category"),
          tdClass: "text-center",
          thClass: "w-20",
        },
        {
          value: "image",
          text: this.$t("label.image"),
          tdClass: "!p-0 !align-middle",
          thClass: "w-20",
        },
      ],
      tableItems: [],
      isShownModal: false,
      selectedRows: [],
    };
  },

  computed: {
    ...mapState("textile", ["textiles"]),

    ...mapGetters("breakpoint", ["isMobileDevice"]),

    backRouteParams() {
      return {
        title: this.$t("title.accessories"),
        name: "AccessoriesList",
      };
    },
  },

  watch: {
    textiles: {
      handler: "onChangeTextiles",
      deep: true,
      immediate: true,
    },
  },

  async created() {
    await this.getTextiles();
  },

  methods: {
    ...mapActions("textile", ["getTextiles"]),

    onChangeTextiles() {
      this.tableItems = this.textiles.map((item) => {
        const imageLink = `${process.env.VUE_APP_DOMAIN}/textile/${item.name}/${item.textile_image}`;

        return {
          isChecked: false,
          id: item.id,
          name: item.name,
          category: item.category,
          image: item.textile_image ? imageLink : false,
        };
      });
    },

    onClickOpenImageInNewPage(href) {
      window.open(href, "_blank");
    },

    onClickDeleteTextile(selectedRows) {
      this.selectedRows = [...selectedRows];
      this.isShownModal = true;
    },

    onClickAddTextile() {
      this.$router.push({ name: "TextileAdd" });
    },

    onClickRow(row) {
      this.$router.push({ name: "TextileEdit", params: { id: row.id } });
    },
  },
};
</script>

<style lang="postcss" scoped>
.add-button-icon {
  &:deep(g [fill]) {
    @apply opacity-100;
  }
}

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
