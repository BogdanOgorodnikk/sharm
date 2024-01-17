<template>
  <OurConfirmModal
    v-model="isShownModal"
    :title="$t('title.textileDelete')"
    :action-button-text="$t('button.delete')"
    @actionConfirmed="onConfirmDeleteTextile"
  >
    <div v-html="$tc('page.accessories.textile.massDeleteModalText', selectedRows.length)" />
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
    ...mapActions("textile", ["massDeleteTextiles"]),

    async onConfirmDeleteTextile() {
      let ids = [];

      this.items.forEach((item, index) => {
        this.selectedRows.forEach((row) => {
          if (row === index) {
            ids.push(item.id);
          }
        });
      });

      await this.massDeleteTextiles({ ids });
    },
  },
};
</script>
