<template>
  <OurModal v-model="isShownModal" width="md" :title="$t('title.setDeliveryDate')">
    <OurCard>
      <OurDatePicker v-model="form.date" :label="$t('label.deliveryDate')" />
    </OurCard>

    <template #footer-left>
      <OurButton :text="$t('button.save')" @click="onSubmitForm" />

      <OurButton :text="$t('button.close')" variant="secondary" @click="onClickCloseModal" />
    </template>
  </OurModal>
</template>

<script>
import OurModal from "@/components/OurModal";
import OurButton from "@/components/OurButton";
import OurCard from "@/components/OurCard";
import { mapActions } from "vuex";
import OurDatePicker from "@/components/OurDatepicker";

export default {
  components: {
    OurDatePicker,
    OurCard,
    OurButton,
    OurModal,
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    delivery: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      form: {
        date: "",
      },
    };
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

  watch: {
    delivery: "onChangeDelivery",
  },

  methods: {
    ...mapActions("orders", ["updateOrder"]),

    onChangeDelivery() {
      this.form.date = this.delivery.date;
    },

    onClickCloseModal() {
      this.isShownModal = false;
    },

    async onSubmitForm() {
      const data = {
        delivery_date: this.form.date,
      };

      await this.updateOrder({ orderId: this.delivery.id, data });

      this.isShownModal = false;
    },
  },
};
</script>
