<template>
  <OurConfirmModal
    v-model="isShownModal"
    :title="$t('title.priceDelete')"
    :action-button-text="$t('button.delete')"
    @actionConfirmed="onConfirmDeletePrice"
  >
    <div v-html="$tc('page.prices.massDeleteModalText', selectedRows.length)" />
  </OurConfirmModal>
</template>

<script>
import { mapActions } from "vuex";
import OurConfirmModal from "@/components/OurConfirmModal";

export default {
  components: { OurConfirmModal },
  props: {
    value: {
      type: Boolean,
      default: false,
    },

    selectedRows: {
      type: Array,
      default: () => [],
    },

    items: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    isShownModal: {
      get() {
        return this.value;
      },

      set(value) {
        this.$emit("input", value);
      },
    },
  },

  methods: {
    ...mapActions("prices", ["massDeletePrices"]),

    async onConfirmDeletePrice() {
      let ids = [];

      this.items.forEach((item, index) => {
        this.selectedRows.forEach((row) => {
          if (row === index) {
            ids.push(item.id);
          }
        });
      });

      await this.massDeletePrices({ ids });
    },
  },
};
</script>
