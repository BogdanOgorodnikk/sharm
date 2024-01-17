<template>
  <OurPage :title="$t('title.transportInvoiceEdit')" width="md">
    <TransportInvoiceForm ref="transportInvoiceForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.save')" @click="onSubmitForm" />

      <OurButton
        :text="$t('button.back')"
        variant="secondary"
        @click="onClickBackToTransportInvoiceList"
      />
    </template>

    <template #footer-right>
      <OurButton
        :text="$t('button.delete')"
        variant="thirdary"
        @click="onClickDeleteTransportInvoice"
      />
    </template>

    <DeleteModal v-model="isShownModal" :item="form" delay-success-notify />
  </OurPage>
</template>

<script>
import TransportInvoiceForm from "../_components/TransportInvoiceForm";
import DeleteModal from "../delete/Modal";
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";
import { getTransportInvoice, updateTransportInvoice } from "@/api/transportInvoice";

export default {
  name: "TransportInvoiceEdit",

  components: {
    OurButton,
    OurPage,
    TransportInvoiceForm,
    DeleteModal,
  },

  data() {
    return {
      form: {
        orderId: "",
        carId: "",
        trailerId: "",
        driverId: "",
        customerId: "",
        unloadingPlace: "",
      },
      isShownModal: false,
    };
  },

  async created() {
    const transportInvoiceId = this.$route.params.id;

    const response = await getTransportInvoice(transportInvoiceId);

    this.form.id = response.id;
    this.form.orderId = response.order_id;
    this.form.carId = response.car_id;
    this.form.trailerId = response.trailer_id;
    this.form.driverId = response.driver_id;
    this.form.customerId = response.customer_id;
    this.form.unloadingPlace = response.unloading_place;
  },

  methods: {
    onClickBackToTransportInvoiceList() {
      this.$router.go(-1);
    },

    async onSubmitForm() {
      this.$refs.transportInvoiceForm.validate();

      if (this.form.isValid) {
        await updateTransportInvoice(this.form);

        await this.$router.go(-1);
      }
    },

    onClickDeleteTransportInvoice() {
      this.isShownModal = true;
    },
  },
};
</script>
