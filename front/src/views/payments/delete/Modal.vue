<template>
  <OurConfirmModal
    v-model="isShownModal"
    :title="$t('title.paymentsDelete')"
    :action-button-text="$t('button.delete')"
    @actionConfirmed="onConfirmDeletePayment"
  >
    <div v-html="$t('page.payments.deleteModalText', { number: itemId })" />
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

    itemId: {
      type: [String, Number],
      default: "",
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
    ...mapActions("payments", ["deletePayment"]),

    async onConfirmDeletePayment() {
      await this.deletePayment({
        paymentId: this.itemId,
        delaySuccessNotify: this.delaySuccessNotify,
      });

      if (this.$route.name !== "PaymentsList") {
        await this.$router.push({ name: "PaymentsList" });
      }
    },
  },
};
</script>
