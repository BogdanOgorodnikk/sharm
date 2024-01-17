<template>
  <OurPage :title="$t('title.pricesAdd')" :back-route="backRouteParams" width="3xl">
    <PriceForm ref="priceForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.create')" @click="onSubmitForm" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToPrices" />
    </template>
  </OurPage>
</template>

<script>
import OurPage from "@/components/OurPage";
import PriceForm from "../_components/PriceForm";
import OurButton from "@/components/OurButton";
import { mapActions } from "vuex";

export default {
  components: {
    OurButton,
    PriceForm,
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
        title: this.$t("title.prices"),
        name: "PricesList",
      };
    },
  },

  methods: {
    ...mapActions("prices", ["addPrice"]),

    async onSubmitForm() {
      this.$refs.priceForm.validate();

      if (this.form.isValid) {
        const filledTableItems = this.form.tableItems.filter((item) => item.productId);

        const data = {
          name: this.form.name,
          from_date: this.form.fromDate,
          currency: this.form.currency,
          products: filledTableItems,
        };

        await this.addPrice(data);

        await this.$router.push({ name: "PricesList" });
      }
    },

    onClickBackToPrices() {
      this.$router.push({ name: "PricesList" });
    },
  },
};
</script>
