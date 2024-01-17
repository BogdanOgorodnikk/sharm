<template>
  <OurConfirmModal
    v-model="isShownModal"
    :title="$t('title.ordersProductDelete')"
    :action-button-text="$t('button.delete')"
    @actionConfirmed="onConfirmDeleteOrderProduct"
  >
    <div v-html="$t('page.order.info.deleteModalText', { title: item.name })" />
  </OurConfirmModal>
</template>

<script>
import OurConfirmModal from "@/components/OurConfirmModal";
import { deleteOrderProduct } from "@/api/orders";

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

    delaySuccessNotify: {
      type: Boolean,
      default: false,
    },

    orderInfoId: {
      type: [Number, String],
      default: null,
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
    async onConfirmDeleteOrderProduct() {
      await deleteOrderProduct(this.item.id, this.delaySuccessNotify);

      if (this.$route.name !== "OrdersInfo") {
        await this.$router.push({ name: "OrdersInfo", params: { id: this.orderInfoId } });
      }

      this.$emit("orderProductDeleted");
    },
  },
};
</script>
