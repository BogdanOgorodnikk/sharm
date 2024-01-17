<template>
  <OurConfirmModal
    v-model="isShownModal"
    :title="$t('title.priceDelete')"
    :action-button-text="$t('button.delete')"
    @actionConfirmed="onConfirmDeletePrice"
  >
    <div v-html="$t('page.prices.deleteModalText', { title: item.name })" />
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

    item: {
      type: Object,
      default: () => {},
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
    ...mapActions("prices", ["deletePrice"]),

    async onConfirmDeletePrice() {
      await this.deletePrice(this.$route.params.id);

      await this.$router.push({ name: "PricesList" });
    },
  },
};
</script>
