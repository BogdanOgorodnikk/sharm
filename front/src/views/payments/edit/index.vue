<template>
  <OurPage :title="$t('title.paymentsEdit')" :back-route="backRouteParams" width="md">
    <PaymentForm ref="paymentForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.save')" @click="onSubmitForm" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToPayments" />
    </template>

    <template #footer-right>
      <OurButton :text="$t('button.delete')" variant="thirdary" @click="onClickDeletePayment" />
    </template>

    <DeleteModal v-model="isShownModal" delay-success-notify :item-id="$route.params.id" />
  </OurPage>
</template>

<script>
import OurPage from "@/components/OurPage";
import PaymentForm from "../_components/PaymentForm";
import OurButton from "@/components/OurButton";
import DeleteModal from "../delete/Modal";
import { mapActions, mapState } from "vuex";

export default {
  components: {
    OurButton,
    PaymentForm,
    OurPage,
    DeleteModal,
  },

  data() {
    return {
      form: {},
      isShownModal: false,
    };
  },

  computed: {
    ...mapState("payments", ["payment"]),

    backRouteParams() {
      return {
        title: this.$t("title.payments"),
        name: "PaymentsList",
      };
    },
  },

  watch: {
    payment: {
      handler: "onChangePayment",
      deep: true,
    },
  },

  async created() {
    const paymentId = this.$route.params.id;

    await this.getPayment(paymentId);
  },

  methods: {
    ...mapActions("payments", ["updatePayment", "getPayment"]),

    onClickDeletePayment() {
      this.isShownModal = true;
    },

    onChangePayment() {
      this.form.amount = this.payment.amount;
      this.form.currency = this.payment.currency;
      this.form.note = this.payment.note;
      this.form.clientId = this.payment.clientId;
    },

    async onSubmitForm() {
      this.$refs.paymentForm.validate();

      if (this.form.isValid) {
        const paymentId = this.$route.params.id;

        await this.updatePayment({ id: paymentId, ...this.form });

        await this.$router.push({ name: "PaymentsList" });
      }
    },

    onClickBackToPayments() {
      this.$router.push({ name: "PaymentsList" });
    },
  },
};
</script>
