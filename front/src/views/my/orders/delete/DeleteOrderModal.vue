<template>
  <OurConfirmModal
    v-model="isShownModal"
    :title="$t('title.orderDelete')"
    :action-button-text="$t('button.delete')"
    @actionConfirmed="onConfirmDeleteOrder"
  >
    <div v-html="$t('page.order.deleteModalText', { number: orderId })" />
  </OurConfirmModal>
</template>

<script>
import OurConfirmModal from "@/components/OurConfirmModal";
import { deleteOrder } from "@/api/orders";

export default {
  components: { OurConfirmModal },
  props: {
    value: {
      type: Boolean,
      default: false,
    },

    orderId: {
      type: [String, Number],
      default: "",
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
    async onConfirmDeleteOrder() {
      await deleteOrder(this.orderId);

      this.$emit("orderDeleted");
    },
  },
};
</script>
