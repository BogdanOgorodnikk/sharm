<template>
  <OurPage :title="$t('title.ordersAddProduct')" :back-route="backRouteParams" width="md">
    <OrderForm ref="orderForm" v-model="form" />

    <template #footer-left>
      <OurButton :text="$t('button.save')" @click="onSubmitForm" />

      <OurButton :text="$t('button.back')" variant="secondary" @click="onClickBackToOrder" />
    </template>
  </OurPage>
</template>

<script>
import OurPage from "@/components/OurPage";
import OurButton from "@/components/OurButton";
import { addOrderProduct } from "@/api/orders";
import { mapState } from "vuex";
import OrderForm from "@/views/my/orders/_components/OrderForm";

export default {
  components: {
    OrderForm,
    OurButton,
    OurPage,
  },

  data: () => ({
    form: {
      productId: "",
      number: "",
      note: "",
      textileMainCategory: "",
      textileMain: "",
      textileACategory: "",
      textileA: "",
      textileBCategory: "",
      textileB: "",
      textileCCategory: "",
      textileC: "",
      amount: "",
      currencySymbol: "",
    },
  }),

  computed: {
    ...mapState("product", ["products"]),
    ...mapState("textile", ["textiles"]),

    backRouteParams() {
      return {
        title: this.$t("title.ordersInfo"),
        name: "MyOrdersInfo",
        params: { id: this.$route.params.orderId },
      };
    },
  },

  methods: {
    async onSubmitForm() {
      this.$refs.orderForm.validate();

      if (this.form.isValid) {
        const orderId = this.$route.params.orderId;

        let textile = `${this.form.textileMain}`;
        let textileCategories = `${this.form.textileMainCategory}`;

        if (this.form.textileA) {
          textile = `${textile}, ${this.form.textileA}`;
          textileCategories = `${textileCategories}, ${this.form.textileACategory}`;
        }

        if (this.form.textileB) {
          textile = `${textile}, ${this.form.textileB}`;
          textileCategories = `${textileCategories}, ${this.form.textileBCategory}`;
        }

        if (this.form.textileC) {
          textile = `${textile}, ${this.form.textileC}`;
          textileCategories = `${textileCategories}, ${this.form.textileCCategory}`;
        }

        const data = {
          product_id: this.form.productId,
          number: this.form.number,
          note: this.form.note,
          amount: this.form.amount,
          textile,
          textile_categories: textileCategories,
        };

        await addOrderProduct(orderId, data);

        await this.$router.push({
          name: "MyOrdersInfo",
          params: { id: this.$route.params.orderId },
        });
      }
    },

    onClickBackToOrder() {
      this.$router.push({ name: "MyOrdersInfo", params: { id: this.$route.params.orderId } });
    },
  },
};
</script>
