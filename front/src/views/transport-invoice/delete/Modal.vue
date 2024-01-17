<template>
  <OurConfirmModal
    v-model="isShownModal"
    :title="$t('title.transportInvoiceDelete')"
    :action-button-text="$t('button.delete')"
    @actionConfirmed="onConfirmDeleteTransportInvoice"
  >
    <div v-html="$t('page.transport.transportInvoice.deleteModalText', { title: item.orderId })" />
  </OurConfirmModal>
</template>

<script>
import OurConfirmModal from "@/components/OurConfirmModal";
import { deleteTransportInvoice } from "@/api/transportInvoice";

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
    async onConfirmDeleteTransportInvoice() {
      await deleteTransportInvoice(this.item.id, this.delaySuccessNotify);

      this.$emit("deletedTransportInvoice");

      if (this.$route.name !== "TransportInvoiceList") {
        await this.$router.go(-1);
      }
    },
  },
};
</script>
