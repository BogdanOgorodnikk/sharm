<template>
  <OurPage :title="pageTitle" :back-route="backRouteParams" width="3xl">
    <PriceForm v-if="isPrefilledForm" ref="priceForm" v-model="form" edited-page />

    <template #footer-left>
      <OurButton :text="acceptButtonTitle" @click="onSubmitForm" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToPrices" />
    </template>

    <template #footer-right>
      <OurDropdown :text="$t('button.more')" variant="thirdary">
        <div v-if="!isActiveCopy" @click="onClickToggleActivateCopy">
          {{ $t("button.copy") }}
        </div>

        <div v-else @click="onClickToggleActivateCopy">
          {{ $t("button.cancelCopy") }}
        </div>

        <div @click="onClickDeleteTextile">
          {{ $t("button.delete") }}
        </div>
      </OurDropdown>
    </template>

    <DeleteModal v-model="isShownModal" :item="form" />
  </OurPage>
</template>

<script>
import OurPage from "@/components/OurPage";
import PriceForm from "../_components/PriceForm";
import OurButton from "@/components/OurButton";
import { mapActions, mapState } from "vuex";
import OurDropdown from "@/components/OurDropdown";
import DeleteModal from "../delete/Modal";

export default {
  components: {
    OurDropdown,
    OurButton,
    PriceForm,
    OurPage,
    DeleteModal,
  },

  data() {
    return {
      form: {},
      isActiveCopy: false,
      isShownModal: false,
      isPrefilledForm: false,
    };
  },

  computed: {
    ...mapState("prices", ["price"]),

    backRouteParams() {
      return {
        title: this.$t("title.prices"),
        name: "PricesList",
      };
    },

    acceptButtonTitle() {
      return this.isActiveCopy ? this.$t("button.add") : this.$t("button.save");
    },

    pageTitle() {
      return this.isActiveCopy ? this.$t("title.pricesAdd") : this.$t("title.pricesEdit");
    },
  },

  watch: {
    price: {
      handler: "onChangePrice",
      deep: true,
    },
  },

  async created() {
    const priceId = this.$route.params.id;

    await this.getPrice(priceId);
  },

  methods: {
    ...mapActions("prices", ["updatePrice", "addPrice", "getPrice"]),

    onClickDeleteTextile() {
      this.isShownModal = true;
    },

    onClickToggleActivateCopy() {
      this.isActiveCopy = !this.isActiveCopy;
    },

    onChangePrice() {
      this.form.id = this.price.id;
      this.form.productName = this.price.name;
      this.form.date = this.price.from_date;
      this.form.currencySymbol = this.price.currency;
      this.form.products = [...this.price.products];

      this.isPrefilledForm = true;
    },

    async onSubmitForm() {
      this.$refs.priceForm.validate();

      if (this.form.isValid) {
        const filledTableItems = this.form.tableItems.filter((item) => item.productId);

        const data = {
          id: this.price.id,
          name: this.form.name,
          currency: this.form.currency,
          from_date: this.form.fromDate,
          products: filledTableItems,
        };

        if (!this.isActiveCopy) {
          await this.updatePrice(data);
        } else {
          await this.addPrice(data);
        }

        await this.$router.push({ name: "PricesList" });
      }
    },

    onClickBackToPrices() {
      this.$router.push({ name: "PricesList" });
    },
  },
};
</script>
