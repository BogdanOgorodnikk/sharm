<template>
  <OurPage :title="$t('title.transportInvoiceAdd')" width="md">
    <TransportInvoiceForm ref="transportInvoiceForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.create')" @click="onSubmitForm" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToOrder" />
    </template>
  </OurPage>
</template>

<script>
import TransportInvoiceForm from "../_components/TransportInvoiceForm";
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";
import { addTransportInvoice } from "@/api/transportInvoice";

export default {
  name: "TransportInvoiceAdd",

  components: {
    OurButton,
    OurPage,
    TransportInvoiceForm,
  },

  data() {
    return {
      form: {},
    };
  },

  methods: {
    onClickBackToOrder() {
      this.$router.go(-1);
    },

    async onSubmitForm() {
      this.$refs.transportInvoiceForm.validate();

      if (this.form.isValid) {
        await addTransportInvoice({ ...this.form, orderId: this.$route.params.orderId });

        await this.$router.go(-1);
      }
    },
  },
};
</script>
