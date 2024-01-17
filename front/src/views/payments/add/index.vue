<template>
  <OurPage :title="$t('title.paymentsAdd')" :back-route="backRouteParams" width="md">
    <PaymentForm ref="paymentForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.create')" @click="onSubmitForm" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToPayments" />
    </template>
  </OurPage>
</template>

<script>
import OurPage from "@/components/OurPage";
import PaymentForm from "../_components/PaymentForm";
import OurButton from "@/components/OurButton";
import { mapActions } from "vuex";

export default {
  components: {
    OurButton,
    PaymentForm,
    OurPage,
  },

  data() {
    return {
      form: {},
    };
  },

  computed: {
    backRouteParams() {
      return {
        title: this.$t("title.payments"),
        name: "PaymentsList",
      };
    },
  },

  methods: {
    ...mapActions("payments", ["addPayment"]),

    async onSubmitForm() {
      this.$refs.paymentForm.validate();

      if (this.form.isValid) {
        await this.addPayment(this.form);

        await this.$router.push({ name: "PaymentsList" });
      }
    },

    onClickBackToPayments() {
      this.$router.push({ name: "PaymentsList" });
    },
  },
};
</script>
